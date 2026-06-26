import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import SiteSettings from "@/models/SiteSettings"

export const dynamic = "force-dynamic"

const ALLOWED_FIELDS = ["storeName", "bgType", "imageUrl", "bgColor", "textColor", "headline", "subtitle", "ctaText", "ctaHref", "enabled"]

export async function GET() {
  try {
    await connectDB()
    const settings = await SiteSettings.findOne({ key: "banner" }).lean()
    return NextResponse.json(
      settings ?? {
        storeName: "Storefront",
        bgType: "image",
        imageUrl: "",
        bgColor: "#171717",
        textColor: "#ffffff",
        headline: "New Arrivals",
        subtitle: "Discover the latest styles",
        ctaText: "Shop Now",
        ctaHref: "/",
        enabled: true,
      }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch banner settings" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const update = Object.fromEntries(
      Object.entries(body as Record<string, unknown>).filter(([k]) => ALLOWED_FIELDS.includes(k))
    )
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "banner" },
      { $set: update },
      { upsert: true, new: true }
    )
    return NextResponse.json(settings)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update banner settings" }, { status: 500 })
  }
}
