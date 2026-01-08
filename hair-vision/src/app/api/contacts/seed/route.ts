// API route to seed contacts with NYC high-end barbershop data
import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';
import { nycHighEndBarbershops, convertToContacts } from '@/data/nyc-barbershops';

/**
 * POST /api/contacts/seed
 * 使用研究数据填充初始客户池
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { 
      priceRange = ['$$$', '$$$$'], // 默认只导入高端客户
      minRating = 4.0,
      overwrite = false 
    } = body;

    // 过滤数据
    const barbershops = nycHighEndBarbershops.filter(shop => {
      const priceMatch = priceRange.includes(shop.price_range);
      const ratingMatch = shop.rating === null || shop.rating >= minRating;
      return priceMatch && ratingMatch;
    });

    console.log(`准备导入 ${barbershops.length} 条理发店数据...`);

    // 如果需要覆盖，先删除现有数据
    if (overwrite) {
      console.log('删除现有联系人数据...');
      const { error: deleteError } = await supabase
        .from(TABLES.contacts)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // 删除所有数据
      
      if (deleteError) {
        console.error('删除现有数据失败:', deleteError);
      }
    }

    // 转换为联系人格式
    const contacts = convertToContacts(barbershops);

    // 检查现有联系人，避免重复
    const existingNames = new Set<string>();
    
    if (!overwrite) {
      const { data: existingContacts } = await supabase
        .from(TABLES.contacts)
        .select('business_name');
      
      if (existingContacts) {
        existingContacts.forEach(c => existingNames.add(c.business_name.toLowerCase()));
      }
    }

    // 过滤已存在的联系人
    const newContacts = contacts.filter(c => 
      !existingNames.has(c.business_name!.toLowerCase())
    );

    console.log(`跳过 ${contacts.length - newContacts.length} 条已存在的数据`);
    console.log(`准备插入 ${newContacts.length} 条新数据`);

    if (newContacts.length === 0) {
      return NextResponse.json({
        success: true,
        message: '没有新的联系人需要导入',
        stats: {
          total: barbershops.length,
          skipped: contacts.length,
          inserted: 0,
        }
      });
    }

    // 批量插入
    const { data, error } = await supabase
      .from(TABLES.contacts)
      .insert(newContacts.map(c => ({
        business_name: c.business_name,
        business_type: c.business_type,
        business_url: c.business_url,
        address: c.address,
        phone: c.phone,
        email: c.email,
        status: c.status,
        tags: c.tags,
        notes: c.notes,
      })))
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `成功导入 ${data?.length || 0} 条 NYC 高端理发店数据`,
      stats: {
        total: barbershops.length,
        skipped: contacts.length - newContacts.length,
        inserted: data?.length || 0,
      },
      contacts: data,
    });

  } catch (error) {
    console.error('Error seeding contacts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to seed contacts';
    const errorDetails = error && typeof error === 'object' && 'details' in error ? error.details : null;
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contacts/seed
 * 获取研究数据预览（不导入）
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const priceRange = searchParams.get('priceRange')?.split(',') || ['$$$', '$$$$'];
    const minRating = parseFloat(searchParams.get('minRating') || '4.0');

    // 过滤数据
    const barbershops = nycHighEndBarbershops.filter(shop => {
      const priceMatch = priceRange.includes(shop.price_range);
      const ratingMatch = shop.rating === null || shop.rating >= minRating;
      return priceMatch && ratingMatch;
    });

    // 统计信息
    const stats = {
      total: barbershops.length,
      byBorough: {
        manhattan: barbershops.filter(s => s.neighborhood.includes('Manhattan')).length,
        brooklyn: barbershops.filter(s => s.neighborhood.includes('Brooklyn')).length,
      },
      byPriceRange: {
        '$$': barbershops.filter(s => s.price_range === '$$').length,
        '$$$': barbershops.filter(s => s.price_range === '$$$').length,
        '$$$$': barbershops.filter(s => s.price_range === '$$$$').length,
      },
      avgRating: barbershops.reduce((sum, s) => sum + (s.rating || 0), 0) / barbershops.filter(s => s.rating).length,
      withEmail: barbershops.filter(s => s.email).length,
      withPhone: barbershops.filter(s => s.phone).length,
      withWebsite: barbershops.filter(s => s.website).length,
    };

    return NextResponse.json({
      success: true,
      stats,
      preview: barbershops.slice(0, 10), // 预览前10条
      totalAvailable: nycHighEndBarbershops.length,
    });

  } catch (error) {
    console.error('Error getting seed preview:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get seed preview';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
