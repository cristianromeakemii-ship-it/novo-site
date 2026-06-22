import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  featured: boolean
  created_at: string
}

export type Testimonial = {
  id: string
  name: string
  text: string
  rating: number
  created_at: string
}

export type ContactMessage = {
  id?: string
  name: string
  email: string
  phone: string
  message: string
  created_at?: string
}
