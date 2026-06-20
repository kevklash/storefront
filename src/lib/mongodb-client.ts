import { MongoClient } from "mongodb"

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

// Returns a lazy promise — the URI check and connection happen only when awaited,
// so importing this module at build time (without env vars) is safe.
function makeClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = Promise.resolve().then(() => {
        const uri = process.env.MONGODB_URI
        if (!uri) throw new Error("MONGODB_URI environment variable is not set")
        return new MongoClient(uri).connect()
      })
    }
    return global._mongoClientPromise
  }

  return Promise.resolve().then(() => {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error("MONGODB_URI environment variable is not set")
    return new MongoClient(uri).connect()
  })
}

const clientPromise = makeClientPromise()
export default clientPromise
