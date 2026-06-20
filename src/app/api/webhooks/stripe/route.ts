import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { connectDB } from "@/lib/mongoose"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { sendOrderConfirmation, sendNewOrderAlert } from "@/lib/resend"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    await connectDB()
    const session = event.data.object as Stripe.Checkout.Session

    const items = JSON.parse(session.metadata?.items ?? "[]")
    // collected_information holds shipping in newer Stripe API versions
    const collectedShipping = (session as unknown as {
      collected_information?: { shipping_details?: { name?: string; address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } }
    }).collected_information?.shipping_details
    const addr = collectedShipping?.address ?? session.customer_details?.address

    if (!addr) {
      console.error("No shipping address on session", session.id)
      return NextResponse.json({ received: true })
    }

    const subtotal = items.reduce(
      (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
      0
    )
    const shippingCost = (session.shipping_cost?.amount_total ?? 0) / 100

    const order = await Order.create({
      userId: session.metadata?.userId || undefined,
      customerEmail: session.customer_details?.email ?? "",
      customerName: session.customer_details?.name ?? collectedShipping?.name ?? "",
      items,
      shippingAddress: {
        name: collectedShipping?.name ?? session.customer_details?.name ?? "",
        line1: addr.line1 ?? "",
        line2: (addr as { line2?: string }).line2 ?? "",
        city: addr.city ?? "",
        state: addr.state ?? "",
        postalCode: addr.postal_code ?? "",
        country: addr.country ?? "US",
      },
      status: "processing",
      subtotal,
      shipping: shippingCost,
      total: subtotal + shippingCost,
      stripeSessionId: session.id,
    })

    // decrement stock
    await Promise.allSettled(
      items.map((item: { productId: string; size: string; color?: string; quantity: number }) =>
        Product.updateOne(
          { _id: item.productId, "variants.size": item.size },
          { $inc: { "variants.$.stock": -item.quantity } }
        )
      )
    )

    // send emails
    const orderObj = order.toObject()
    orderObj._id = orderObj._id.toString()
    await Promise.allSettled([sendOrderConfirmation(orderObj), sendNewOrderAlert(orderObj)])
  }

  return NextResponse.json({ received: true })
}
