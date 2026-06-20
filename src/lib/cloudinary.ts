import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: Buffer, folder = "storefront/products"): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (error, result) => {
        if (error || !result) return reject(error)
        resolve(result.secure_url)
      })
      .end(file)
  })
}

export async function deleteImage(url: string) {
  const publicId = url.split("/").slice(-2).join("/").replace(/\.[^.]+$/, "")
  return cloudinary.uploader.destroy(publicId)
}

export default cloudinary
