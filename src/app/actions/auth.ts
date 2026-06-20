"use server"

import { signOut, signIn } from "@/auth"

export async function signOutAction() {
  await signOut({ redirectTo: "/login" })
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/auth/redirect" })
}
