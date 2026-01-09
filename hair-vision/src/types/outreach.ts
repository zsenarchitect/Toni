// Outreach system types

export type BusinessType = 'salon' | 'barbershop';

export type ContactStatus = 
  | 'new' 
  | 'contacted' 
  | 'responded' 
  | 'interview_scheduled' 
  | 'interviewed' 
  | 'converted';

export type ContactRole = 'owner' | 'stylist' | 'barber' | 'manager';

export interface Contact {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  business_name: string;
  business_type: BusinessType;
  business_url: string;
  address: string | null;
  role: ContactRole | null;
  status: ContactStatus;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'completed';

export interface Campaign {
  id: string;
  name: string;
  template: string;
  subject: string;
  status: CampaignStatus;
  sent_count: number;
  open_count: number;
  click_count: number;
  response_count: number;
  created_at: string;
}

export type EmailDraftStatus = 'draft' | 'approved' | 'rejected' | 'sent';

export interface EmailDraft {
  id: string;
  campaign_id: string;
  contact_id: string;
  subject: string;
  body: string;
  edited_body: string | null;
  status: EmailDraftStatus;
  generated_at: string;
  approved_at: string | null;
  sent_at: string | null;
}

export type EmailEventType = 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced';

export interface EmailEvent {
  id: string;
  campaign_id: string | null;
  contact_id: string;
  event_type: EmailEventType;
  timestamp: string;
  metadata: Record<string, any>;
}

export type ResponseType = 
  | 'interested' 
  | 'not_interested' 
  | 'pricing_question' 
  | 'feature_question' 
  | 'interview_request' 
  | 'other';

export interface StructuredResponseData {
  interest_level: 'interested' | 'not_interested' | 'maybe' | 'unclear';
  questions: string[];
  objections: string[];
  next_steps: string[];
  contact_preferences: 'email' | 'phone' | 'in_person' | 'not_specified';
  response_type: ResponseType;
  available_times?: string[];
  summary: string;
}

export interface Response {
  id: string;
  contact_id: string;
  campaign_id: string | null;
  email_id: string | null;
  raw_content: string;
  structured_data: StructuredResponseData;
  response_type: ResponseType;
  parsed_at: string;
  created_at: string;
}

export type InterviewStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

export interface Interview {
  id: string;
  contact_id: string;
  scheduled_time: string;
  location: 'in_person' | 'zoom' | 'phone';
  status: InterviewStatus;
  calendar_event_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessDiscoveryResult {
  name: string;
  url: string | null;
  address: string;
  phone: string | null;
  email: string | null;
  rating: number | null;
  business_type: BusinessType;
  place_id?: string;
  yelp_id?: string;
}

export interface ScrapedContactData {
  email: string | null;
  phone: string | null;
  business_name: string;
  address: string | null;
  business_type: BusinessType;
  social_media?: Record<string, string>;
  business_hours?: string;
  description?: string;
  services?: string[];
}


