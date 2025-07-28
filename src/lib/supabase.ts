import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Video {
  id: string
  title: string
  description: string
  file_url: string
  thumbnail_url?: string
  duration?: number
  genre?: string
  year?: number
  created_at: string
  admin_id: string
}

export interface UserProfile {
  id: string
  email: string
  subscription_status: 'inactive' | 'active' | 'expired'
  subscription_expires_at?: string
  created_at: string
}