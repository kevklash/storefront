"use client"

import { useState } from "react"
import { useForm, useFieldArray, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"
import { Plus, X, Upload } from "lucide-react"
import Button from "@/components/ui/Button"
import { slugify } from "@/lib/utils"
import type { Product } from "@/types"

const variantSchema = z.object({
  size: z.string().min(1, "Size required"),
  color: z.string().optional(),
  stock: z.coerce.number().min(0),
})

const productSchema = z.object({
  name: z.string().min(1, "Name required"),
  description: z.string().min(1, "Description required"),
  price: z.coerce.number().min(0.01, "Price must be > 0"),
  category: z.string().min(1, "Category required"),
  slug: z.string().min(1, "Slug required"),
  isActive: z.boolean(),
  variants: z.array(variantSchema).min(1, "Add at least one variant"),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
  onSave: (data: ProductFormData & { images: string[] }) => Promise<void>
}

const CATEGORIES = ["T-Shirts", "Hoodies", "Pants", "Shorts", "Jackets", "Accessories", "Other"]
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]

export default function ProductForm({ product, onSave }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          slug: product.slug,
          isActive: product.isActive,
          variants: product.variants,
        }
      : {
          isActive: true,
          variants: [{ size: "M", stock: 0 }],
        },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "variants" })

  const name = watch("name")

  function handleNameBlur() {
    if (!product && name) setValue("slug", slugify(name))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return
    setUploading(true)
    try {
      const form = new FormData()
      Array.from(e.target.files).forEach((f) => form.append("files", f))
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const { urls } = await res.json()
      setImages((prev) => [...prev, ...urls])
    } catch {
      setError("Image upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  async function onSubmit(data: ProductFormData) {
    setSaving(true)
    setError("")
    try {
      await onSave({ ...data, images })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}

      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-black">Details</h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-black">Name</label>
          <input
            {...register("name")}
            onBlur={handleNameBlur}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Slug (URL)</label>
          <input
            {...register("slug")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black font-mono"
          />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Price ($)</label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Category</label>
            <select
              {...register("category")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-black cursor-pointer">
          <input type="checkbox" {...register("isActive")} className="rounded" />
          <span>Active (visible in store)</span>
        </label>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-lg text-black">Images</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative w-24 h-24 rounded overflow-hidden bg-gray-100">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow hover:bg-red-50"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            {uploading ? (
              <span className="text-xs text-gray-400">Uploading…</span>
            ) : (
              <>
                <Upload size={20} className="text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">Add</span>
              </>
            )}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-black">Variants</h2>
          <Button type="button" variant="secondary" size="sm" onClick={() => append({ size: "", stock: 0 })}>
            <Plus size={14} className="mr-1" /> Add Variant
          </Button>
        </div>
        {errors.variants && <p className="text-red-500 text-xs">{errors.variants.message}</p>}
        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <select
                  {...register(`variants.${i}.size`)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Size…</option>
                  {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="w-28">
                <input
                  {...register(`variants.${i}.color`)}
                  placeholder="Color (opt)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  {...register(`variants.${i}.stock`)}
                  placeholder="Stock"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="p-2 text-gray-400 hover:text-red-500 mt-0.5"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" loading={saving}>
        {product ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  )
}
