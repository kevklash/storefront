import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getStripe } from "@/lib/stripe"
import { connectDB } from "@/lib/mongoose"
import Product from "@/models/Product"
import type { CartItem } from "@/types"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await auth()
    const { items, successUrl, cancelUrl } = await req.json() as {
      items: CartItem[]
      successUrl: string
      cancelUrl: string
    }

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // validate stock before creating session
    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productName}` }, { status: 400 })
      }
      const variant = product.variants.find(
        (v: { size: string; color?: string; stock: number }) =>
          v.size === item.size && (item.color ? v.color === item.color : true)
      )
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.productName} (${item.size})` },
          { status: 400 }
        )
      }
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.productName} — ${item.size}${item.color ? ` / ${item.color}` : ""}`,
          images: item.productImage ? [item.productImage] : [],
          metadata: {
            productId: item.productId,
            size: item.size,
            color: item.color ?? "",
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: session?.user?.email ?? undefined,
      shipping_address_collection: { allowed_countries: ["US", "CA", "MX"] },
      metadata: {
        userId: session?.user?.id ?? "",
        items: JSON.stringify(
          items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            productImage: i.productImage,
            size: i.size,
            color: i.color,
            price: i.price,
            quantity: i.quantity,
          }))
        ),
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
