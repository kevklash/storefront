import mongoose, { Schema, model, models } from "mongoose"

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  size: { type: String, required: true },
  color: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
})

const shippingAddressSchema = new Schema({
  name: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: "US" },
})

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerEmail: { type: String, required: true },
    customerName: { type: String, required: true },
    items: [orderItemSchema],
    shippingAddress: { type: shippingAddressSchema, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
)

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `ORD-${ts}-${rand}`
}

orderSchema.pre("validate", function () {
  if (!this.orderNumber) {
    this.orderNumber = generateOrderNumber()
  }
})

export default models.Order || model("Order", orderSchema)
