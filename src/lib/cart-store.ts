import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/types"

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string, color?: string) => void
  updateQuantity: (productId: string, size: string, color: string | undefined, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

function itemKey(productId: string, size: string, color?: string) {
  return `${productId}-${size}-${color ?? ""}`
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        set((state) => {
          const key = itemKey(incoming.productId, incoming.size, incoming.color)
          const existing = state.items.find(
            (i) => itemKey(i.productId, i.size, i.color) === key
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.size, i.color) === key
                  ? { ...i, quantity: Math.min(i.quantity + incoming.quantity, i.maxStock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, incoming] }
        })
      },

      removeItem: (productId, size, color) => {
        const key = itemKey(productId, size, color)
        set((state) => ({
          items: state.items.filter((i) => itemKey(i.productId, i.size, i.color) !== key),
        }))
      },

      updateQuantity: (productId, size, color, quantity) => {
        const key = itemKey(productId, size, color)
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((i) => itemKey(i.productId, i.size, i.color) !== key),
          }))
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.productId, i.size, i.color) === key
              ? { ...i, quantity: Math.min(quantity, i.maxStock) }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "storefront-cart" }
  )
)
