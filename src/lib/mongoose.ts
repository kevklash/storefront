import mongoose from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null }
}

let cached = global.mongooseCache

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error("MONGODB_URI environment variable is not set")
    cached.promise = mongoose.connect(uri).then((m) => m.connection)
  }

  cached.conn = await cached.promise
  return cached.conn
}
