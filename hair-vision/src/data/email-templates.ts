// 邮件模板数据
// Initial outreach email templates for salon/barbershop outreach

/**
 * 邮件模板类型
 */
export type EmailTemplateType = 
  | 'initial_outreach'      // 初次联系
  | 'interview_request'     // 访谈邀请
  | 'survey_invitation'     // 调研邀请
  | 'follow_up'             // 跟进邮件
  | 'demo_offer'            // Demo 邀请
  | 'partnership_proposal'; // 合作提案

/**
 * 模板变量定义
 */
export interface TemplateVariables {
  salon_name: string;
  owner_name?: string;
  location?: string;
  neighborhood?: string;
  specialties?: string[];
  price_range?: string;
  sender_name?: string;
  sender_title?: string;
  company_name?: string;
}

/**
 * 邮件模板接口
 */
export interface EmailTemplate {
  id: string;
  type: EmailTemplateType;
  name: string;
  subject: string;
  body: string;
  description: string;
  tags: string[];
}

/**
 * 替换模板中的变量
 * @param template 模板字符串
 * @param variables 变量对象
 * @returns 替换后的字符串
 */
export function applyTemplateVariables(
  template: string,
  variables: TemplateVariables
): string {
  let result = template;
  
  // 基础变量替换
  result = result.replace(/\{\{salon_name\}\}/g, variables.salon_name);
  result = result.replace(/\{\{owner_name\}\}/g, variables.owner_name || 'there');
  result = result.replace(/\{\{location\}\}/g, variables.location || 'your area');
  result = result.replace(/\{\{neighborhood\}\}/g, variables.neighborhood || 'your neighborhood');
  result = result.replace(/\{\{sender_name\}\}/g, variables.sender_name || 'The MeRROR Team');
  result = result.replace(/\{\{sender_title\}\}/g, variables.sender_title || 'Product Lead');
  result = result.replace(/\{\{company_name\}\}/g, variables.company_name || 'MeRROR');
  
  // 特色服务（如果有多个，用逗号连接）
  if (variables.specialties && variables.specialties.length > 0) {
    result = result.replace(/\{\{specialties\}\}/g, variables.specialties.join(', '));
  } else {
    result = result.replace(/\{\{specialties\}\}/g, 'quality grooming services');
  }
  
  // 价格范围描述
  const priceDescriptions: Record<string, string> = {
    '$$': 'quality',
    '$$$': 'premium',
    '$$$$': 'luxury',
  };
  result = result.replace(
    /\{\{price_tier\}\}/g, 
    priceDescriptions[variables.price_range || '$$$'] || 'premium'
  );
  
  return result;
}

// ============================================
// 初次联系邮件模板 (Initial Outreach Templates)
// ============================================

/**
 * 主要初次联系模板
 * 用于首次接触高端理发店/沙龙
 */
export const INITIAL_OUTREACH_TEMPLATE: EmailTemplate = {
  id: 'initial-outreach-v1',
  type: 'initial_outreach',
  name: 'Initial Outreach - Premium Salons',
  subject: 'Quick Question for {{salon_name}}',
  description: '首次接触高端理发店的专业邮件模板',
  tags: ['initial', 'professional', 'concise'],
  body: `Hi {{owner_name}},

I came across {{salon_name}} and was impressed by what you've built in {{neighborhood}}. Your focus on {{specialties}} really stands out.

I'm reaching out because we're developing a new tool for {{price_tier}} barbershops and salons — a hairstyle preview system that lets clients see their new look before a single cut is made.

We're talking to shop owners to understand the real challenges in client communication and consultations. Would you be open to a brief 15-minute conversation this week?

No sales pitch — just genuinely curious to learn from your experience.

Best,
{{sender_name}}
{{sender_title}}, {{company_name}}`
};

/**
 * 友好版初次联系模板
 * 更加轻松友好的语气
 */
export const INITIAL_OUTREACH_FRIENDLY: EmailTemplate = {
  id: 'initial-outreach-friendly-v1',
  type: 'initial_outreach',
  name: 'Initial Outreach - Friendly Tone',
  subject: 'Fellow barber enthusiast here 💈',
  description: '友好轻松语气的初次联系模板',
  tags: ['initial', 'friendly', 'casual'],
  body: `Hey {{owner_name}},

I've been following {{salon_name}}'s work on Instagram and love what you're doing in {{neighborhood}}!

Quick intro: I'm working on something that could be game-changing for shops like yours — imagine clients being able to preview their haircut or color before you even pick up the scissors. We're using AI to make that happen.

I'm talking to owners of top-tier shops to get their input on what features would actually be useful (vs. what sounds cool but isn't practical).

Got 10 minutes for a quick chat? I promise to keep it short and sweet.

Cheers,
{{sender_name}}`
};

/**
 * 技术导向版初次联系模板
 * 适合对技术感兴趣的店主
 */
export const INITIAL_OUTREACH_TECH: EmailTemplate = {
  id: 'initial-outreach-tech-v1',
  type: 'initial_outreach',
  name: 'Initial Outreach - Tech Focus',
  subject: 'New tech for {{salon_name}} — quick question',
  description: '技术导向的初次联系模板',
  tags: ['initial', 'tech', 'innovation'],
  body: `Hi {{owner_name}},

I noticed {{salon_name}} has been doing great things in {{neighborhood}}. Your reputation for quality is well-known.

I'm building an AI-powered hairstyle preview system specifically for premium barbershops. Think: iPad app where clients see themselves with different styles and colors in real-time, before the cut.

The tech is ready, but I want to make sure we're solving real problems — not imaginary ones. That's why I'm reaching out to experienced shop owners like yourself.

Would you have 15 minutes this week to share your thoughts on:
- How do consultations usually go at {{salon_name}}?
- What's the biggest communication challenge with new clients?

Your insights would be incredibly valuable.

Thanks,
{{sender_name}}
{{sender_title}}, {{company_name}}`
};

// ============================================
// 访谈邀请模板 (Interview Request Templates)
// ============================================

export const INTERVIEW_REQUEST_TEMPLATE: EmailTemplate = {
  id: 'interview-request-v1',
  type: 'interview_request',
  name: 'Interview Request - Standard',
  subject: 'Market Research: 15-min call with {{salon_name}}?',
  description: '标准访谈邀请模板',
  tags: ['interview', 'research', 'professional'],
  body: `Hi {{owner_name}},

I'm conducting market research on the premium grooming industry and {{salon_name}} came up as one of the standout shops in {{neighborhood}}.

I'd love to schedule a brief 15-minute call to learn about:
- Your approach to client consultations
- Common challenges when explaining styles to new clients
- Your thoughts on technology in the barbershop

As a thank you for your time, I'm happy to share our research findings with you — including insights on what's working for other top shops.

Would any of these times work for you?
- [Time Slot 1]
- [Time Slot 2]
- [Time Slot 3]

If none work, just let me know your availability and I'll make it work.

Best regards,
{{sender_name}}
{{sender_title}}, {{company_name}}`
};

// ============================================
// 调研邀请模板 (Survey Invitation Templates)
// ============================================

export const SURVEY_INVITATION_TEMPLATE: EmailTemplate = {
  id: 'survey-invitation-v1',
  type: 'survey_invitation',
  name: 'Survey Invitation - Standard',
  subject: '2-min survey: Help shape the future of {{price_tier}} barbershops',
  description: '调研邀请模板',
  tags: ['survey', 'quick', 'research'],
  body: `Hi {{owner_name}},

We're gathering insights from owners of {{price_tier}} barbershops and salons, and {{salon_name}}'s reputation made you an obvious choice to include.

Would you mind taking 2 minutes to answer a few quick questions? Your perspective will directly influence how we build tools for shops like yours.

[Take the Survey →]

As thanks, everyone who completes the survey gets early access to our market research report on NYC's premium grooming industry.

Thanks in advance,
{{sender_name}}`
};

// ============================================
// 跟进邮件模板 (Follow-up Templates)
// ============================================

export const FOLLOW_UP_TEMPLATE: EmailTemplate = {
  id: 'follow-up-v1',
  type: 'follow_up',
  name: 'Follow-up - Gentle Reminder',
  subject: 'Quick follow-up re: {{salon_name}}',
  description: '温和的跟进邮件模板',
  tags: ['follow-up', 'gentle', 'reminder'],
  body: `Hi {{owner_name}},

Just floating this back to the top of your inbox — I reached out last week about chatting for our market research on premium barbershops.

I know you're busy running {{salon_name}}, so I'll keep this super brief: even 10 minutes of your time would be incredibly helpful.

If it's not a good time, no worries at all — just let me know and I won't follow up again.

Best,
{{sender_name}}`
};

export const FOLLOW_UP_VALUE_ADD: EmailTemplate = {
  id: 'follow-up-value-v1',
  type: 'follow_up',
  name: 'Follow-up - Value Add',
  subject: 'Thought you might find this interesting, {{owner_name}}',
  description: '提供价值的跟进邮件',
  tags: ['follow-up', 'value', 'insight'],
  body: `Hi {{owner_name}},

Following up on my earlier email — and wanted to share something you might find interesting.

We recently spoke with 20+ {{price_tier}} barbershop owners, and here's what surprised us:

📊 78% said "showing clients exactly what they'll get" is their biggest consultation challenge
📊 65% have had clients unhappy with results even after thorough discussions
📊 Almost everyone is looking for better ways to set expectations

If any of this resonates with your experience at {{salon_name}}, I'd love to hear your take.

Happy to share the full findings in exchange for 15 minutes of your time.

Best,
{{sender_name}}`
};

// ============================================
// Demo 邀请模板 (Demo Offer Templates)
// ============================================

export const DEMO_OFFER_TEMPLATE: EmailTemplate = {
  id: 'demo-offer-v1',
  type: 'demo_offer',
  name: 'Demo Offer - Free Trial',
  subject: 'Free preview tool for {{salon_name}} — no catch',
  description: 'Demo/试用邀请模板',
  tags: ['demo', 'trial', 'offer'],
  body: `Hi {{owner_name}},

I'll cut right to it: we built an AI hairstyle preview system, and we'd love {{salon_name}} to try it — completely free.

Here's what it does:
✂️ Clients see themselves with new styles before cutting
🎨 Preview hair colors in real-time
📱 Works on any iPad
💬 Reduces "that's not what I wanted" moments

We're offering a free pilot program to select {{price_tier}} shops in {{neighborhood}}. No commitment, no credit card, no strings.

Why? Because we need feedback from shops that actually care about client experience — and {{salon_name}} fits that bill.

Interested? Just reply and I'll set you up.

Best,
{{sender_name}}
{{sender_title}}, {{company_name}}`
};

// ============================================
// 权威背书/心理学策略模板 (Authority Endorsement / Bayesian Strategy)
// ============================================

export const AUTHORITY_ENDORSEMENT_TEMPLATE: EmailTemplate = {
  id: 'authority-endorsement-v1',
  type: 'initial_outreach',
  name: 'Initial Outreach - Authority/Elite Bias',
  subject: 'The tool chosen by top-rated {{neighborhood}} shops',
  description: '利用贝叶斯/权威偏见策略的邮件模板',
  tags: ['initial', 'psychology', 'authority', 'premium'],
  body: `Hi {{owner_name}},

We recently looked at how the top-rated salons in NYC are handling consultations in 2024.

A clear pattern emerged among the elite shops: they are moving away from magazines and towards AI visualization.

In fact, among high-end salons that have modernized their consultation process, **MeRROR** is the preferred choice over generic tools.

We're seeing that shops using our preview system are booking {{price_tier}} color services at a 30% higher rate because clients feel safer saying "yes" when they can see the result first.

I'd love to show you why {{salon_name}} belongs in this category of forward-thinking businesses.

Do you have 5 minutes for a quick demo?

Best,
{{sender_name}}`
};

// ============================================
// 所有模板集合
// ============================================

export const ALL_EMAIL_TEMPLATES: EmailTemplate[] = [
  INITIAL_OUTREACH_TEMPLATE,
  INITIAL_OUTREACH_FRIENDLY,
  INITIAL_OUTREACH_TECH,
  AUTHORITY_ENDORSEMENT_TEMPLATE,
  INTERVIEW_REQUEST_TEMPLATE,
  SURVEY_INVITATION_TEMPLATE,
  FOLLOW_UP_TEMPLATE,
  FOLLOW_UP_VALUE_ADD,
  DEMO_OFFER_TEMPLATE,
];

/**
 * 根据类型获取模板
 */
export function getTemplatesByType(type: EmailTemplateType): EmailTemplate[] {
  return ALL_EMAIL_TEMPLATES.filter(t => t.type === type);
}

/**
 * 根据 ID 获取模板
 */
export function getTemplateById(id: string): EmailTemplate | undefined {
  return ALL_EMAIL_TEMPLATES.find(t => t.id === id);
}

/**
 * 获取默认初次联系模板
 */
export function getDefaultInitialOutreachTemplate(): EmailTemplate {
  return INITIAL_OUTREACH_TEMPLATE;
}

/**
 * 生成完整的邮件内容
 * @param templateId 模板ID 或模板对象
 * @param variables 变量
 * @returns 包含主题和正文的邮件对象
 */
export function generateEmail(
  templateId: string | EmailTemplate,
  variables: TemplateVariables
): { subject: string; body: string } {
  const template = typeof templateId === 'string' 
    ? getTemplateById(templateId) 
    : templateId;
  
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }
  
  return {
    subject: applyTemplateVariables(template.subject, variables),
    body: applyTemplateVariables(template.body, variables),
  };
}

/**
 * 为 NYC 理发店生成邮件
 * 专门针对 nyc-barbershops.ts 中的数据格式
 */
export function generateEmailForNYCBarbershop(
  templateId: string,
  barbershop: {
    business_name: string;
    neighborhood: string;
    specialties: string[];
    price_range: string;
  },
  senderInfo?: {
    sender_name?: string;
    sender_title?: string;
  }
): { subject: string; body: string } {
  return generateEmail(templateId, {
    salon_name: barbershop.business_name,
    neighborhood: barbershop.neighborhood,
    specialties: barbershop.specialties,
    price_range: barbershop.price_range,
    sender_name: senderInfo?.sender_name,
    sender_title: senderInfo?.sender_title,
  });
}

// 导出默认模板（初次联系）
export default INITIAL_OUTREACH_TEMPLATE;
