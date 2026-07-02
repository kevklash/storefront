import { Schema, model, models } from "mongoose"

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    emailVerified: { type: Date },
    image: { type: String },
    password: { type: String, select: false },
    role: { type: String, default: "customer" },
  },
  { timestamps: true }
)

export default models.User || model("User", userSchema)
