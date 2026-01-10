// API route for generating email drafts using Ollama
// 使用 Ollama AI 生成邮件草稿的 API 路由
import { NextRequest, NextResponse } from 'next/server';
import { generateEmailDraft } from '@/lib/ollama';
import { supabase, TABLES } from '@/lib/supabase';
import { 
  generateEmail, 
  getTemplateById,
  INITIAL_OUTREACH_TEMPLATE 
} from '@/data/email-templates';

// 支持的活动类型
type CampaignType = 'survey_invitation' | 'interview_request' | 'follow_up' | 'initial_outreach' | 'demo_offer';

/**
 * 根据活动类型生成邮件主题行
 */
function generateSubjectLine(
  campaignType: CampaignType,
  businessName: string
): string {
  const subjects: Record<CampaignType, string> = {
    initial_outreach: `Quick question for ${businessName}`,
    interview_request: `15-min chat about ${businessName}?`,
    survey_invitation: `2-min survey: Help shape premium grooming tools`,
    follow_up: `Following up — ${businessName}`,
    demo_offer: `Free preview tool for ${businessName}`,
  };
  
  return subjects[campaignType] || subjects.initial_outreach;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      contactIds, 
      campaignId, 
      campaignType = 'initial_outreach',
      useTemplate = false,       // 是否使用预设模板（不调用 AI）
      templateId = null,         // 指定模板 ID
    } = body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { error: 'Contact IDs array is required' },
        { status: 400 }
      );
    }

    // 获取联系人信息
    const { data: contacts, error: contactsError } = await supabase
      .from(TABLES.contacts)
      .select('*')
      .in('id', contactIds);

    if (contactsError || !contacts) {
      return NextResponse.json(
        { error: 'Failed to fetch contacts' },
        { status: 500 }
      );
    }

    // 为每个联系人生成邮件草稿
    const drafts = [];
    for (const contact of contacts) {
      try {
        let emailBody: string;
        let subject: string;
        
        // 解析联系人备注中的额外信息（如果有）
        const notesData = parseContactNotes(contact.notes);
        
        if (useTemplate && templateId) {
          // 使用指定的预设模板
          const template = getTemplateById(templateId);
          if (template) {
            const email = generateEmail(template, {
              salon_name: contact.business_name,
              location: contact.address || 'NYC',
              neighborhood: extractNeighborhood(contact.address),
              specialties: notesData.specialties,
              price_range: notesData.priceRange,
              owner_name: contact.name || undefined,
            });
            emailBody = email.body;
            subject = email.subject;
          } else {
            // 模板不存在，回退到默认模板
            const email = generateEmail(INITIAL_OUTREACH_TEMPLATE, {
              salon_name: contact.business_name,
              location: contact.address || 'NYC',
            });
            emailBody = email.body;
            subject = email.subject;
          }
        } else {
          // 使用 AI 生成邮件
          emailBody = await generateEmailDraft(
            {
              salon_name: contact.business_name,
              location: contact.address || 'NYC',
              salon_url: contact.business_url,
              specialties: notesData.specialties,
              price_range: notesData.priceRange,
              owner_name: contact.name || undefined,
            },
            campaignType as CampaignType
          );
          subject = generateSubjectLine(campaignType as CampaignType, contact.business_name);
        }

        // 创建草稿记录
        const { data: draft, error: draftError } = await supabase
          .from(TABLES.email_drafts)
          .insert({
            campaign_id: campaignId || null,
            contact_id: contact.id,
            subject,
            body: emailBody,
            status: 'draft',
          })
          .select()
          .single();

        if (!draftError && draft) {
          drafts.push(draft);
        }
      } catch (error) {
        console.error(`Error generating draft for contact ${contact.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      count: drafts.length,
      drafts,
    });
  } catch (error: any) {
    console.error('Email draft generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate email drafts' },
      { status: 500 }
    );
  }
}

/**
 * 解析联系人备注中的结构化数据
 * 备注格式通常包含：价格范围、特色服务等
 */
function parseContactNotes(notes: string | null): {
  specialties: string[];
  priceRange: string;
  clientele: string;
} {
  if (!notes) {
    return { specialties: [], priceRange: '$$$', clientele: '' };
  }
  
  const result = {
    specialties: [] as string[],
    priceRange: '$$$',
    clientele: '',
  };
  
  // 解析价格范围
  const priceMatch = notes.match(/价格范围:\s*(\$+)/);
  if (priceMatch) {
    result.priceRange = priceMatch[1];
  }
  
  // 解析特色服务
  const specialtiesMatch = notes.match(/特色服务:\s*([^\n]+)/);
  if (specialtiesMatch) {
    result.specialties = specialtiesMatch[1].split(',').map(s => s.trim());
  }
  
  // 解析客户群
  const clienteleMatch = notes.match(/客户群:\s*([^\n]+)/);
  if (clienteleMatch) {
    result.clientele = clienteleMatch[1].trim();
  }
  
  return result;
}

/**
 * 从完整地址中提取街区/社区名称
 */
function extractNeighborhood(address: string | null): string {
  if (!address) return 'NYC';
  
  // 常见的 NYC 街区关键词
  const neighborhoods = [
    'East Village', 'West Village', 'Greenwich Village', 'SoHo', 'NoLita',
    'Lower East Side', 'Upper East Side', 'Upper West Side', 'Tribeca',
    'Chelsea', 'Midtown', 'Flatiron', 'Murray Hill', 'Harlem',
    'Williamsburg', 'DUMBO', 'Park Slope', 'Cobble Hill', 'Greenpoint',
    'Brooklyn Heights', 'Financial District', "Hell's Kitchen"
  ];
  
  for (const neighborhood of neighborhoods) {
    if (address.toLowerCase().includes(neighborhood.toLowerCase())) {
      return neighborhood;
    }
  }
  
  // 如果找不到具体街区，返回区域（Manhattan/Brooklyn）
  if (address.includes('Manhattan') || address.includes('NY 100')) {
    return 'Manhattan';
  }
  if (address.includes('Brooklyn') || address.includes('NY 112')) {
    return 'Brooklyn';
  }
  
  return 'NYC';
}



