import { NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const urls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        return uploadImage(buffer)
      })
    )

    return NextResponse.json({ urls })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
