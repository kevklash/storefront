import { Schema, model, models } from "mongoose"

const siteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    storeName: { type: String, default: "Storefront" },
    bgType: { type: String, enum: ["image", "color"], default: "image" },
    imageUrl: { type: String, default: "" },
    bgColor: { type: String, default: "#171717" },
    textColor: { type: String, default: "#ffffff" },
    headline: { type: String, default: "New Arrivals" },
    subtitle: { type: String, default: "Discover the latest styles" },
    ctaText: { type: String, default: "Shop Now" },
    ctaHref: { type: String, default: "/" },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default models.SiteSettings || model("SiteSettings", siteSettingsSchema)
