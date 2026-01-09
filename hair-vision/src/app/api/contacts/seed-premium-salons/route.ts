// API route to seed 10 premium NYC salons for outreach
import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

interface ContactInput {
  business_name: string;
  business_type: 'salon' | 'barbershop';
  business_url?: string;
  email?: string;
  phone?: string;
  address?: string;
  name?: string;
  role?: 'owner' | 'stylist' | 'barber' | 'manager';
  notes?: string;
  tags?: string[];
}

const PREMIUM_SALONS: ContactInput[] = [
  {
    business_name: 'Federico Salon & Spa',
    business_type: 'salon',
    business_url: 'https://www.federicosalon.com',
    email: 'info@federicosalon.com',
    phone: '212-262-3027',
    address: '57 W 58th St, New York, NY 10019',
    name: 'Federico',
    role: 'owner',
    notes: 'Premium salon in Midtown Manhattan. High-end services. Contact person name may need verification.',
    tags: ['premium', 'midtown', 'spa'],
  },
  {
    business_name: 'Marie Robinson Salon',
    business_type: 'salon',
    business_url: 'https://www.marierobinsonsalon.com',
    email: 'info@marierobinsonsalon.com',
    phone: '212-358-7780',
    address: '40 W 25th St, 10th floor, New York, NY 10010',
    name: 'Marie Robinson',
    role: 'owner',
    notes: 'Well-established premium salon in Flatiron. Owner likely Marie Robinson - verify contact person.',
    tags: ['premium', 'flatiron', 'established'],
  },
  {
    business_name: 'Yukie Natori New York Salon & Spa',
    business_type: 'salon',
    business_url: 'https://www.yukiebeauty.com',
    email: 'info@yukiebeauty.com',
    phone: '212-702-9660',
    address: '39 W 56th St, New York, NY 10019',
    name: 'Yukie Natori',
    role: 'owner',
    notes: 'Japanese-inspired premium salon in Midtown. Owner likely Yukie Natori - verify contact person.',
    tags: ['premium', 'midtown', 'japanese', 'spa'],
  },
  {
    business_name: 'Dejavous Salon Inc',
    business_type: 'salon',
    business_url: 'https://www.dejavoussalon.com',
    email: 'marketing@dejavoussalon.com',
    phone: '212-581-6560',
    address: '38 W 56th St, New York, NY 10019',
    name: undefined,
    role: 'manager',
    notes: 'Marketing email provided. Contact person name to be determined. Midtown location.',
    tags: ['premium', 'midtown'],
  },
  {
    business_name: 'Dazzle Beauty Salon',
    business_type: 'salon',
    business_url: 'https://www.dazzlebeautysalon.com',
    email: 'info@dazzlebeautysalon.com',
    phone: '212-922-3625',
    address: '590 3rd Ave, New York, NY 10016',
    name: undefined,
    role: 'manager',
    notes: 'Murray Hill location. Contact person name to be determined.',
    tags: ['premium', 'murray-hill'],
  },
  {
    business_name: 'Aate Beauty Salon',
    business_type: 'salon',
    business_url: 'https://www.aatebeauty.com',
    email: 'aatebeautynyc@gmail.com',
    phone: '212-685-5700',
    address: '21 E 32nd St, New York, NY 10016',
    name: undefined,
    role: 'manager',
    notes: 'Koreatown location. Contact person name to be determined.',
    tags: ['premium', 'koreatown'],
  },
  {
    business_name: 'Shear Bliss NYC Salon',
    business_type: 'salon',
    business_url: 'https://www.shearblissnyc.com',
    email: 'shearblissnyc@yahoo.com',
    phone: '212-213-6050',
    address: '397 3rd Ave, New York, NY 10016',
    name: undefined,
    role: 'manager',
    notes: 'Murray Hill location. Contact person name to be determined.',
    tags: ['premium', 'murray-hill'],
  },
  {
    business_name: 'Poiz Beauty Salon',
    business_type: 'salon',
    business_url: 'https://www.poizbeautysalon.com',
    email: 'poizbeautysalon@gmail.com',
    phone: '212-779-7775',
    address: '520 3rd Ave, New York, NY 10016',
    name: undefined,
    role: 'manager',
    notes: 'Murray Hill location. Contact person name to be determined.',
    tags: ['premium', 'murray-hill'],
  },
  {
    business_name: 'Omni Beauty Salon',
    business_type: 'salon',
    business_url: 'https://www.myomnibeauty.com',
    email: 'myomnibeauty@gmail.com',
    phone: '718-789-8887',
    address: '152 5th Ave, Brooklyn, NY 11217',
    name: undefined,
    role: 'manager',
    notes: 'Brooklyn location (Park Slope area). Contact person name to be determined.',
    tags: ['premium', 'brooklyn', 'park-slope'],
  },
  {
    business_name: "Yany's Beauty Salon Inc",
    business_type: 'salon',
    business_url: 'https://www.yanysbeautysalon.com',
    email: 'yanysbeautysalon@gmail.com',
    phone: '212-353-9364',
    address: '169 Rivington St #2, New York, NY 10002',
    name: 'Yany',
    role: 'owner',
    notes: 'Lower East Side location. Owner likely Yany - verify contact person.',
    tags: ['premium', 'lower-east-side'],
  },
];

/**
 * POST /api/contacts/seed-premium-salons
 * 添加10个高端NYC沙龙到联系人数据库
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { overwrite = false } = body;

    // 如果需要覆盖，先检查并删除已存在的记录
    if (overwrite) {
      const { error: deleteError } = await supabase
        .from(TABLES.contacts)
        .delete()
        .in('business_name', PREMIUM_SALONS.map(s => s.business_name));

      if (deleteError) {
        console.error('删除现有数据失败:', deleteError);
      }
    }

    // 检查已存在的联系人，避免重复
    const { data: existingContacts } = await supabase
      .from(TABLES.contacts)
      .select('business_name');

    const existingNames = new Set(
      (existingContacts || []).map(c => c.business_name.toLowerCase())
    );

    // 过滤已存在的联系人
    const newContacts = PREMIUM_SALONS.filter(
      c => !existingNames.has(c.business_name.toLowerCase())
    );

    if (newContacts.length === 0) {
      return NextResponse.json({
        success: true,
        message: '所有联系人已存在，无需添加',
        stats: {
          total: PREMIUM_SALONS.length,
          skipped: PREMIUM_SALONS.length - newContacts.length,
          inserted: 0,
        },
      });
    }

    // 准备插入数据
    const contactsToInsert = newContacts.map(contact => ({
      business_name: contact.business_name,
      business_type: contact.business_type,
      business_url: contact.business_url || null,
      email: contact.email || null,
      phone: contact.phone || null,
      address: contact.address || null,
      name: contact.name || null,
      role: contact.role || null,
      status: 'new' as const,
      tags: contact.tags || [],
      notes: contact.notes || null,
    }));

    // 批量插入
    const { data, error } = await supabase
      .from(TABLES.contacts)
      .insert(contactsToInsert)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `成功添加 ${data?.length || 0} 个高端沙龙联系人`,
      stats: {
        total: PREMIUM_SALONS.length,
        skipped: PREMIUM_SALONS.length - newContacts.length,
        inserted: data?.length || 0,
      },
      contacts: data,
    });
  } catch (error: any) {
    console.error('Error seeding premium salons:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to seed premium salons',
        details: error.details || null,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contacts/seed-premium-salons
 * 获取将要添加的沙龙列表预览（不实际添加）
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: '预览10个高端NYC沙龙数据',
    count: PREMIUM_SALONS.length,
    salons: PREMIUM_SALONS.map(s => ({
      business_name: s.business_name,
      business_type: s.business_type,
      location: s.address,
      email: s.email,
      phone: s.phone,
      website: s.business_url,
      contact_person: s.name || '待确定',
      role: s.role || '待确定',
    })),
    instructions: {
      method: 'POST',
      endpoint: '/api/contacts/seed-premium-salons',
      body: '{ "overwrite": false }',
      description: '使用 POST 请求添加这些联系人到数据库',
    },
  });
}

