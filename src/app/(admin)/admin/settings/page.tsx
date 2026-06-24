"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import Button from "@/components/ui/Button"

type BannerConfig = {
  imageUrl: string
  headline: string
  subtitle: string
  ctaText: string
  ctaHref: string
  enabled: boolean
}

const DEFAULTS: BannerConfig = {
  imageUrl: "",
  headline: "New Arrivals",
  subtitle: "Discover the latest styles",
  ctaText: "Shop Now",
  ctaHref: "/",
  enabled: true,
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
      .then((data: Partial<BannerConfig>) => setConfig({ ...DEFAULTS, ...data }))
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
      const { urls } = await res.json() as { urls: string[] }
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

  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-6 text-black">Hero Banner</h1>

      {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">{error}</p>}

      {/* Live preview */}
      <div
        className="w-full h-44 rounded-xl overflow-hidden bg-neutral-900 flex items-center justify-center relative mb-8 border border-gray-200"
        style={
          config.imageUrl
            ? { backgroundImage: `url(${config.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        {!config.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-stone-900" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        {!config.enabled && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="text-white/50 text-xs tracking-[0.2em] uppercase">Disabled</span>
          </div>
        )}
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-1">Collection</p>
          <p className="text-xl font-bold leading-tight">{config.headline || "Headline"}</p>
          <p className="text-xs text-white/60 mt-1 mb-3">{config.subtitle || "Subtitle"}</p>
          <span className="inline-block bg-white text-black px-4 py-1 text-[9px] font-bold tracking-[0.15em] uppercase">
            {config.ctaText || "Shop Now"}
          </span>
        </div>
        <span className="absolute bottom-2 right-3 text-[9px] text-white/30 tracking-widest uppercase">Preview</span>
      </div>

      <div className="space-y-5">
        <label className="flex items-center gap-2 text-sm font-medium text-black cursor-pointer select-none">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => setConfig((c) => ({ ...c, enabled: e.target.checked }))}
            className="rounded"
          />
          Show banner on home page
        </label>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Banner Image</label>
          <div className="flex items-center gap-4">
            {config.imageUrl ? (
              <div className="relative w-28 h-18 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200" style={{ height: "4.5rem" }}>
                <Image src={config.imageUrl} alt="Banner preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setConfig((c) => ({ ...c, imageUrl: "" }))}
                  className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow hover:bg-red-50 transition"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="w-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors flex-shrink-0" style={{ height: "4.5rem" }}>
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
              {!config.imageUrl && " A dark gradient placeholder will be used until an image is set."}
            </p>
          </div>
        </div>

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
