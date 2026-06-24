import { Schema, model, models } from "mongoose"

const siteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    imageUrl: { type: String, default: "" },
    headline: { type: String, default: "New Arrivals" },
    subtitle: { type: String, default: "Discover the latest styles" },
    ctaText: { type: String, default: "Shop Now" },
    ctaHref: { type: String, default: "/" },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default models.SiteSettings || model("SiteSettings", siteSettingsSchema)
