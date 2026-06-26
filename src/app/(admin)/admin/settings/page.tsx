"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import Button from "@/components/ui/Button"

type BannerConfig = {
  storeName: string
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

const DEFAULTS: BannerConfig = {
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

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-black">{label}</label>
      <div className="flex items-center gap-3">
        <label
          className="relative w-10 h-10 rounded-lg border border-gray-300 cursor-pointer flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-black focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
    </div>
  )
}

export default function BannerSettingsPage() {
  const [config, setConfig] = useState<BannerConfig>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/admin/settings/banner")
      .then((r) => r.json())
      .then((data: Partial<BannerConfig>) => {
        const clean = Object.fromEntries(
          Object.entries(data).filter(([, v]) => v !== null && v !== undefined)
        ) as Partial<BannerConfig>
        setConfig({ ...DEFAULTS, ...clean })
      })
      .catch(() => setError("Failed to load settings"))
      .finally(() => setLoading(false))
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return
    setUploading(true)
    setError("")
    try {
      const form = new FormData()
      form.append("files", e.target.files[0])
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const { urls } = (await res.json()) as { urls: string[] }
      setConfig((c) => ({ ...c, imageUrl: urls[0] }))
    } catch {
      setError("Image upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    setSaved(false)
    try {
      const res = await fetch("/api/admin/settings/banner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error("Save failed")
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const isImageMode = config.bgType === "image"

  const previewBgStyle =
    isImageMode && config.imageUrl
      ? { backgroundImage: `url(${config.imageUrl})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
      : isImageMode
      ? undefined
      : { backgroundColor: config.bgColor }

  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="h-44 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-6 text-black">Hero Banner</h1>

      {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">{error}</p>}

      {/* Live preview */}
      <div
        className="w-full h-44 rounded-xl overflow-hidden flex items-center justify-center relative mb-8 border border-gray-200"
        style={previewBgStyle}
      >
        {isImageMode && !config.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-stone-900" />
        )}
        {isImageMode && <div className="absolute inset-0 bg-black/40" />}
        {!config.enabled && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="text-xs tracking-[0.2em] uppercase" style={{ color: config.textColor, opacity: 0.5 }}>
              Disabled
            </span>
          </div>
        )}
        <div className="relative z-10 text-center px-4" style={{ color: config.textColor }}>
          <p className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ opacity: 0.5 }}>Collection</p>
          <p className="text-xl font-bold leading-tight">{config.headline || "Headline"}</p>
          <p className="text-xs mt-1 mb-3" style={{ opacity: 0.7 }}>{config.subtitle || "Subtitle"}</p>
          <span
            className="inline-block px-4 py-1 text-[9px] font-bold tracking-[0.15em] uppercase border"
            style={{ borderColor: config.textColor, color: config.textColor }}
          >
            {config.ctaText || "Shop Now"}
          </span>
        </div>
        <span className="absolute bottom-2 right-3 text-[9px] tracking-widest uppercase" style={{ color: config.textColor, opacity: 0.25 }}>
          Preview
        </span>
      </div>

      <div className="space-y-6">
        {/* Store name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black">Store Name</label>
          <input
            value={config.storeName}
            onChange={(e) => setConfig((c) => ({ ...c, storeName: e.target.value }))}
            placeholder="Storefront"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-gray-500 mt-1">Shown in the navbar and footer.</p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-sm font-semibold text-black mb-4">Hero Banner</h2>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-black cursor-pointer select-none">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => setConfig((c) => ({ ...c, enabled: e.target.checked }))}
            className="rounded"
          />
          Show banner on home page
        </label>

        {/* Background type toggle */}
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Background</label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit mb-4">
            <button
              type="button"
              onClick={() => setConfig((c) => ({ ...c, bgType: "image" }))}
              className={`px-4 py-2 text-sm font-medium transition ${
                isImageMode ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Image
            </button>
            <button
              type="button"
              onClick={() => setConfig((c) => ({ ...c, bgType: "color" }))}
              className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition ${
                !isImageMode ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Solid Color
            </button>
          </div>

          {isImageMode ? (
            <div className="flex items-center gap-4">
              {config.imageUrl ? (
                <div
                  className="relative w-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200"
                  style={{ height: "4.5rem" }}
                >
                  <Image src={config.imageUrl} alt="Banner" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, imageUrl: "" }))}
                    className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow hover:bg-red-50 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label
                  className="w-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors flex-shrink-0"
                  style={{ height: "4.5rem" }}
                >
                  {uploading ? (
                    <span className="text-xs text-gray-400">Uploading…</span>
                  ) : (
                    <>
                      <Upload size={16} className="text-gray-400" />
                      <span className="text-[10px] text-gray-400 mt-1">Upload image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              )}
              <p className="text-xs text-gray-500 leading-relaxed">
                Landscape image, at least 1600 × 900 px recommended.
                {!config.imageUrl && " A dark gradient will be shown until an image is set."}
              </p>
            </div>
          ) : (
            <ColorPicker
              label="Background Color"
              value={config.bgColor}
              onChange={(v) => setConfig((c) => ({ ...c, bgColor: v }))}
            />
          )}
        </div>

        {/* Text color */}
        <ColorPicker
          label="Text Color"
          value={config.textColor}
          onChange={(v) => setConfig((c) => ({ ...c, textColor: v }))}
        />

        {/* Text content */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black">Headline</label>
          <input
            value={config.headline}
            onChange={(e) => setConfig((c) => ({ ...c, headline: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Subtitle</label>
          <input
            value={config.subtitle}
            onChange={(e) => setConfig((c) => ({ ...c, subtitle: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Button Text</label>
            <input
              value={config.ctaText}
              onChange={(e) => setConfig((c) => ({ ...c, ctaText: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Button Link</label>
            <input
              value={config.ctaHref}
              onChange={(e) => setConfig((c) => ({ ...c, ctaHref: e.target.value }))}
              placeholder="/"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Button onClick={handleSave} loading={saving} size="lg">
            Save Changes
          </Button>
          {saved && <p className="text-sm text-green-600 font-medium">Saved!</p>}
        </div>
      </div>
    </div>
  )
}
