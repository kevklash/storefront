import Link from "next/link"
import Image from "next/image"
import { connectDB } from "@/lib/mongoose"
import SiteSettings from "@/models/SiteSettings"
import MobileSearchToggle from "./MobileSearchToggle"

type BannerConfig = {
  bgType: "image" | "color"
  imageUrl: string
  bgColor: string
  textColor: string
  headline: string
  subtitle: string
  ctaText: string
  ctaHref: string
  enabled: boolean
}

const DEFAULT_CONFIG: BannerConfig = {
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

async function getBannerConfig(): Promise<BannerConfig> {
  await connectDB()
  const doc = await SiteSettings.findOne({ key: "banner" }).lean<BannerConfig & { _id: unknown }>()
  if (!doc) return DEFAULT_CONFIG
  const { _id, ...rest } = doc
  void _id
  const clean = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<BannerConfig>
  return { ...DEFAULT_CONFIG, ...clean }
}

export default async function HeroBanner() {
  const config = await getBannerConfig()
  if (!config.enabled) return null

  const isImageMode = config.bgType === "image"

  return (
    <div
      className="relative w-full h-[65vh] min-h-[400px] overflow-hidden flex items-center justify-center"
      style={isImageMode ? undefined : { backgroundColor: config.bgColor }}
    >
      {isImageMode && (
        config.imageUrl ? (
          <Image src={config.imageUrl} alt="Hero banner" fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-stone-900" />
        )
      )}
      {isImageMode && <div className="absolute inset-0 bg-black/40" />}

      <div className="relative z-10 text-center px-6 max-w-2xl" style={{ color: config.textColor }}>
        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ opacity: 0.5 }}>
          Collection
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-none mb-4">
          {config.headline}
        </h1>
        <p className="text-base sm:text-lg mb-8" style={{ opacity: 0.7 }}>
          {config.subtitle}
        </p>
        <Link
          href={config.ctaHref}
          className="inline-block px-10 py-3 text-xs font-bold tracking-[0.2em] uppercase border hover:opacity-70 transition"
          style={{ borderColor: config.textColor, color: config.textColor }}
        >
          {config.ctaText}
        </Link>
      </div>
      <MobileSearchToggle />
    </div>
  )
}
