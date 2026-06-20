import { Resend } from "resend"
import type { Order } from "@/types"

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendOrderConfirmation(order: Order) {
  const itemsList = order.items
    .map((i) => `${i.productName} (${i.size}) x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
    .join("\n")

  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: order.customerEmail,
    subject: `Order confirmed — #${order.orderNumber}`,
    text: `Hi ${order.customerName},\n\nThank you for your order!\n\nOrder #${order.orderNumber}\n\n${itemsList}\n\nTotal: $${order.total.toFixed(2)}\n\nWe'll notify you when your order ships.`,
  })
}

export async function sendNewOrderAlert(order: Order) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return

  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: adminEmail,
    subject: `New order #${order.orderNumber} — $${order.total.toFixed(2)}`,
    text: `New order received from ${order.customerName} (${order.customerEmail}).\n\nOrder #${order.orderNumber}\nTotal: $${order.total.toFixed(2)}`,
  })
}
