// Supabase client setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Outreach features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  contacts: 'contacts',
  campaigns: 'campaigns',
  email_drafts: 'email_drafts',
  email_events: 'email_events',
  responses: 'responses',
  interviews: 'interviews',
} as const;

