import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  type: 'DIGITAL' | 'FISICO'
  price: number
  cost_price: number
  status: 'ATIVO' | 'INATIVO' | 'RASCUNHO' | 'INDISPONIVEL'
  category_id: string | null
  subcategory_id: string | null
  is_featured: boolean
  guide_size: string | null
  created_at: string
  updated_at: string
  product_images?: ProductImage[]
  categories?: Category
  subcategories?: Subcategory
  stock_items?: StockItem[]
  // legacy fields for backward compatibility
  image_url?: string
  featured?: boolean
  category?: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Subcategory = {
  id: string
  category_id: string
  name: string
  slug: string
  description: string
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ProductImage = {
  id: string
  product_id: string
  url: string
  sort_order: number
  created_at: string
}

export type StockItem = {
  id: string
  product_id: string
  quantity: number
  min_quantity: number
  updated_at: string
}

export type Order = {
  id: string
  user_id: string | null
  customer_email: string
  customer_name: string
  customer_phone: string
  payment_method: string
  payment_status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED'
  fulfillment_status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  shipping_cost: number
  shipping_method: string
  shipping_address: { address: string; city: string; state: string; zip: string } | null
  delivery_estimate: string
  subtotal: number
  total: number
  tracking_code: string
  tracking_url: string
  notes: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price_at_sale: number
  cost_at_sale: number
  created_at: string
}

export type StoreSettings = {
  id: string
  store_name: string
  store_description: string
  logo_url: string
  home_title: string
  home_subtitle: string
  hero_image_url: string
  hero_cta_text: string
  hero_cta_link: string
  image_fit: string
  theme_primary: string
  theme_secondary: string
  theme_background: string
  theme_text: string
  theme_accent: string
  font_family: string
  base_font_size: string
  border_radius: string
  button_style: string
  card_shadow: string
  announcement_enabled: boolean
  announcement_text: string
  whatsapp: string
  phone: string
  email: string
  horario_atendimento: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  whatsapp_button_enabled: boolean
  whatsapp_number: string
  whatsapp_message: string
  whatsapp_button_position: string
  whatsapp_show_on: string
  delivery_enabled: boolean
  delivery_modalities: any[]
  free_shipping_above: number
  delivery_provider: string
  delivery_integration_active: boolean
  pix_enabled: boolean
  boleto_enabled: boolean
  pix_expiration_minutes: number
  payment_provider: string
  payment_webhook_active: boolean
  storage_bucket_name: string
  search_enabled: boolean
  footer_links: any
  about_text: string
  about_image_url: string
}

export type ContactMessage = {
  id?: string
  name: string
  email: string
  phone: string
  message: string
  created_at?: string
}

export type Testimonial = {
  id: string
  name: string
  text: string
  rating: number
  created_at: string
}

export type ShippingZone = {
  id: string
  name: string
  cep_start: string
  cep_end: string
  price: number
  estimate: string
  is_active: boolean
  created_at: string
  updated_at: string
}
