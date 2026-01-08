// Ollama integration for AI-powered email drafting and reply parsing
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
 * Generate personalized email draft using Ollama
 */
export async function generateEmailDraft(
  contactInfo: {
    salon_name: string;
    location: string;
    salon_url?: string;
  },
  campaignType: 'survey_invitation' | 'interview_request' | 'follow_up'
): Promise<string> {
  const prompt = `You are writing a personalized email to a salon owner for market research.

Contact Information:
- Salon Name: ${contactInfo.salon_name}
- Location: ${contactInfo.location}
- Website: ${contactInfo.salon_url || 'N/A'}

Campaign Type: ${campaignType}

Write a professional, personalized email that:
1. Mentions their salon by name
2. Is concise (3-4 paragraphs max)
3. Clearly states the purpose (market research)
4. Includes a clear call-to-action
5. Is warm but professional

Output only the email body (no subject line).`;

  try {
    return await callOllama(prompt);
  } catch (error) {
    console.error('Error generating email draft:', error);
    // Fallback to template if Ollama fails
    return generateFallbackEmail(contactInfo, campaignType);
  }
}

/**
 * Fallback email template if Ollama is unavailable
 */
function generateFallbackEmail(
  contactInfo: { salon_name: string; location: string },
  campaignType: string
): string {
  return `Dear ${contactInfo.salon_name} Team,

I hope this email finds you well. I'm reaching out as part of a market research initiative focused on understanding the challenges and opportunities in the salon industry.

Your salon in ${contactInfo.location} has caught our attention, and we'd love to learn more about your experience and insights.

Would you be open to a brief conversation or survey? Your input would be incredibly valuable.

Thank you for your time and consideration.

Best regards`;
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

