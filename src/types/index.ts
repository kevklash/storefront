export interface ProductVariant {
  size: string
  color?: string
  stock: number
  _id?: string
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  variants: ProductVariant[]
  isActive: boolean
  slug: string
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  productId: string
  productName: string
  productImage: string
  price: number
  size: string
  color?: string
  quantity: number
  maxStock: number
}

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  size: string
  color?: string
  price: number
  quantity: number
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  _id: string
  orderNumber: string
  userId?: string
  customerEmail: string
  customerName: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  status: OrderStatus
  subtotal: number
  shipping: number
  total: number
  stripeSessionId?: string
  createdAt: string
  updatedAt: string
}
