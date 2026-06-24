"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export default function BannerOnHome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return pathname === "/" ? <>{children}</> : null
}
