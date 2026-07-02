/**
 * Creates the first admin user in a fresh database.
 * Usage:
 *   node scripts/seed-admin.mjs --email=you@example.com --password=yourpassword --name="Your Name"
 *
 * Safe to run multiple times — skips creation if an admin already exists.
 */

import mongoose from "mongoose"
import bcrypt from "bcryptjs"

// Parse CLI args  --key=value
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [key, ...rest] = a.slice(2).split("=")
      return [key, rest.join("=")]
    })
)

const email    = args.email
const password = args.password
const name     = args.name ?? "Admin"

if (!email || !password) {
  console.error("Usage: node scripts/seed-admin.mjs --email=you@example.com --password=yourpassword [--name=\"Your Name\"]")
  process.exit(1)
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.")
  process.exit(1)
}

// Load MONGODB_URI from .env.local
import { readFileSync } from "fs"
import { resolve } from "path"

const envPath = resolve(process.cwd(), ".env.local")
try {
  const lines = readFileSync(envPath, "utf-8").split("\n")
  for (const line of lines) {
    const [k, ...v] = line.split("=")
    if (k && v.length) process.env[k.trim()] = v.join("=").trim()
  }
} catch {
  // .env.local not found — MONGODB_URI must already be in the environment
}

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error("MONGODB_URI not found. Set it in .env.local or as an environment variable.")
  process.exit(1)
}

const userSchema = new mongoose.Schema({
  name:          String,
  email:         { type: String, required: true, unique: true, lowercase: true },
  emailVerified: Date,
  image:         String,
  password:      { type: String, select: false },
  role:          { type: String, default: "customer" },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", userSchema)

await mongoose.connect(uri)

const existingAdmin = await User.findOne({ role: "admin" })
if (existingAdmin) {
  console.log(`✓ An admin already exists (${existingAdmin.email}). No changes made.`)
  await mongoose.disconnect()
  process.exit(0)
}

const existing = await User.findOne({ email: email.toLowerCase() })
if (existing) {
  console.log(`Updating existing user "${email}" to admin role...`)
  existing.role = "admin"
  if (!existing.password) {
    existing.password = await bcrypt.hash(password, 12)
  }
  await existing.save()
  console.log(`✓ User "${email}" is now an admin.`)
} else {
  const hashed = await bcrypt.hash(password, 12)
  await User.create({ name, email: email.toLowerCase(), password: hashed, role: "admin" })
  console.log(`✓ Admin created: ${name} <${email}>`)
}

await mongoose.disconnect()
