// Supabase client setup
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 使用占位符 URL 防止构建时错误，但实际功能需要配置真实凭据
const placeholderUrl = 'https://placeholder.supabase.co';
const placeholderKey = 'placeholder-key';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || placeholderUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || placeholderKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Outreach features will not work.');
}

// 使用真实凭据或占位符（占位符不会实际工作，但允许构建通过）
export const supabase: SupabaseClient = createClient(
  supabaseUrl || placeholderUrl, 
  supabaseAnonKey || placeholderKey
);

// 检查 Supabase 是否已正确配置
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Database table names
export const TABLES = {
  contacts: 'contacts',
  campaigns: 'campaigns',
  email_drafts: 'email_drafts',
  email_events: 'email_events',
  responses: 'responses',
  interviews: 'interviews',
} as const;



