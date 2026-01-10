// Ollama integration for AI-powered email drafting and reply parsing
import { 
  generateEmail, 
  getTemplatesByType,
  type TemplateVariables,
  type EmailTemplateType 
} from '@/data/email-templates';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

/**
 * Call Ollama API
 * 调用 Ollama 本地 AI 模型
 */
async function callOllama(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response.trim();
  } catch (error) {
    console.error('Ollama API error:', error);
    throw error;
  }
}

/**
 * 邮件生成系统提示词
 * 定义 AI 生成邮件的基本行为准则
 */
const EMAIL_SYSTEM_PROMPT = `You are an expert B2B email copywriter specializing in outreach to premium barbershops and salons.

Your writing style:
- Professional yet warm and approachable
- Concise and respectful of the reader's time
- Personalized with specific details about their business
- Focused on value and genuine curiosity, not hard selling
- Uses natural language, not corporate jargon

Important guidelines:
- Keep emails to 3-4 short paragraphs maximum
- Always mention the salon name naturally in the opening
- Include a clear, low-commitment call-to-action
- Sound like a real person, not a marketing template
- Never use phrases like "I hope this email finds you well"
- Avoid excessive flattery — keep compliments genuine and specific`;

/**
 * 根据活动类型获取详细提示词
 */
function getCampaignTypePrompt(campaignType: string): string {
  const prompts: Record<string, string> = {
    initial_outreach: `
Purpose: First contact to introduce yourself and start a conversation
Goal: Get a response or schedule a brief call
Tone: Curious, professional, low-pressure
CTA: Ask for 10-15 minutes of their time for a conversation`,
    
    interview_request: `
Purpose: Request a market research interview
Goal: Schedule a 15-minute call to learn about their business
Tone: Research-focused, professional, appreciative
CTA: Offer specific time slots and make scheduling easy`,
    
    survey_invitation: `
Purpose: Invite them to complete a brief survey
Goal: Get them to click through to the survey
Tone: Quick, respectful of time, value-focused
CTA: Clear link/button to take the survey`,
    
    follow_up: `
Purpose: Gentle reminder about previous outreach
Goal: Get a response (yes or no)
Tone: Understanding, brief, no guilt-tripping
CTA: Simple ask with easy opt-out option`,
    
    demo_offer: `
Purpose: Offer a free demo/trial of the product
Goal: Get them interested in trying the hairstyle preview system
Tone: Exciting but not pushy, value-focused
CTA: Ask them to reply for setup or schedule a demo`,
  };
  
  return prompts[campaignType] || prompts.initial_outreach;
}

/**
 * Generate personalized email draft using Ollama
 * 使用 Ollama AI 生成个性化邮件草稿
 */
export async function generateEmailDraft(
  contactInfo: {
    salon_name: string;
    location: string;
    salon_url?: string;
    specialties?: string[];
    price_range?: string;
    owner_name?: string;
  },
  campaignType: 'survey_invitation' | 'interview_request' | 'follow_up' | 'initial_outreach' | 'demo_offer' = 'initial_outreach'
): Promise<string> {
  const campaignPrompt = getCampaignTypePrompt(campaignType);
  
  const prompt = `Write a personalized outreach email for the following salon:

SALON INFORMATION:
- Name: ${contactInfo.salon_name}
- Location: ${contactInfo.location}
- Website: ${contactInfo.salon_url || 'Not provided'}
- Specialties: ${contactInfo.specialties?.join(', ') || 'Premium grooming services'}
- Price Range: ${contactInfo.price_range || '$$$'}
- Owner/Contact: ${contactInfo.owner_name || 'Not specified'}

CAMPAIGN TYPE & OBJECTIVES:
${campaignPrompt}

CONTEXT:
We (MeRROR) are building an AI-powered hairstyle preview system for premium barbershops and salons. The tool allows clients to see themselves with different hairstyles and colors before cutting. We're conducting market research to understand the real challenges in client consultations.

OUTPUT INSTRUCTIONS:
- Write ONLY the email body (no subject line)
- Start with a greeting appropriate for the contact
- Be specific to this salon when possible
- Keep it under 200 words
- End with a signature line (name can be placeholder)`;

  try {
    const result = await callOllama(prompt, EMAIL_SYSTEM_PROMPT);
    return result;
  } catch (error) {
    console.error('Error generating email draft:', error);
    // 使用模板系统作为后备
    return generateFallbackEmail(contactInfo, campaignType);
  }
}

/**
 * 映射活动类型到模板类型
 */
function mapCampaignToTemplateType(campaignType: string): EmailTemplateType {
  const mapping: Record<string, EmailTemplateType> = {
    'survey_invitation': 'survey_invitation',
    'interview_request': 'interview_request',
    'follow_up': 'follow_up',
    'initial_outreach': 'initial_outreach',
    'demo_offer': 'demo_offer',
  };
  return mapping[campaignType] || 'initial_outreach';
}

/**
 * Fallback email template if Ollama is unavailable
 * 当 Ollama 不可用时使用预设模板
 */
function generateFallbackEmail(
  contactInfo: { 
    salon_name: string; 
    location: string;
    specialties?: string[];
    price_range?: string;
    owner_name?: string;
  },
  campaignType: string
): string {
  const templateType = mapCampaignToTemplateType(campaignType);
  const templates = getTemplatesByType(templateType);
  
  if (templates.length > 0) {
    // 使用模板系统生成邮件
    const variables: TemplateVariables = {
      salon_name: contactInfo.salon_name,
      owner_name: contactInfo.owner_name,
      location: contactInfo.location,
      neighborhood: contactInfo.location,
      specialties: contactInfo.specialties,
      price_range: contactInfo.price_range,
      sender_name: 'The MeRROR Team',
      sender_title: 'Product Lead',
      company_name: 'MeRROR',
    };
    
    const email = generateEmail(templates[0], variables);
    return email.body;
  }
  
  // 最终后备：简单模板
  return `Hi there,

I came across ${contactInfo.salon_name} and was impressed by what you've built in ${contactInfo.location}.

I'm reaching out because we're developing a hairstyle preview system for premium barbershops — a tool that lets clients see their new look before the cut.

We're talking to shop owners to understand the real challenges in client consultations. Would you be open to a brief 15-minute conversation this week?

Best,
The MeRROR Team`;
}

/**
 * Parse email reply into structured format using Ollama
 */
export async function parseEmailReply(replyText: string): Promise<{
  interest_level: 'interested' | 'not_interested' | 'maybe' | 'unclear';
  questions: string[];
  objections: string[];
  next_steps: string[];
  contact_preferences: 'email' | 'phone' | 'in_person' | 'not_specified';
  response_type: string;
  available_times?: string[];
  summary: string;
}> {
  const prompt = `Parse this email reply into structured JSON format.

Email Reply:
${replyText}

Extract and return JSON with:
{
  "interest_level": "interested" | "not_interested" | "maybe" | "unclear",
  "questions": ["list of questions asked"],
  "objections": ["list of objections raised"],
  "next_steps": ["suggested next steps"],
  "contact_preferences": "email" | "phone" | "in_person" | "not_specified",
  "response_type": "survey_completed" | "interview_request" | "pricing_question" | "feature_question" | "not_interested" | "other",
  "available_times": ["list of available times mentioned, format: YYYY-MM-DD HH:MM"],
  "summary": "brief summary of the reply"
}

Return only valid JSON, no additional text.`;

  try {
    const response = await callOllama(prompt);
    
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('No JSON found in Ollama response');
  } catch (error) {
    console.error('Error parsing email reply:', error);
    // Return default structure if parsing fails
    return {
      interest_level: 'unclear',
      questions: [],
      objections: [],
      next_steps: [],
      contact_preferences: 'not_specified',
      response_type: 'other',
      summary: 'Failed to parse reply',
    };
  }
}

/**
 * Extract interview scheduling information from email reply
 */
export async function extractInterviewScheduling(replyText: string): Promise<{
  wants_interview: boolean;
  available_times: Array<{ date: string; time: string; timezone: string }>;
  preferred_location: 'in_person' | 'zoom' | 'phone' | 'not_specified';
  location_details: string;
  notes: string;
}> {
  const prompt = `Extract interview scheduling information from this email reply.

Email Reply:
${replyText}

Extract and return JSON with:
{
  "wants_interview": true | false,
  "available_times": [
    {
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "timezone": "America/New_York"
    }
  ],
  "preferred_location": "in_person" | "zoom" | "phone" | "not_specified",
  "location_details": "specific address or meeting details if mentioned",
  "notes": "any additional scheduling notes"
}

If no times mentioned, return empty array for available_times.
Return only valid JSON, no additional text.`;

  try {
    const response = await callOllama(prompt);
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('No JSON found in Ollama response');
  } catch (error) {
    console.error('Error extracting interview scheduling:', error);
    return {
      wants_interview: false,
      available_times: [],
      preferred_location: 'not_specified',
      location_details: '',
      notes: '',
    };
  }
}



