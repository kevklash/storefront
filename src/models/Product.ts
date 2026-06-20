import mongoose, { Schema, model, models } from "mongoose"

const variantSchema = new Schema({
  size: { type: String, required: true },
  color: { type: String },
  stock: { type: Number, required: true, min: 0, default: 0 },
})

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: { type: String, required: true, trim: true },
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
)

productSchema.index({ name: "text", description: "text" })

export default models.Product || model("Product", productSchema)
