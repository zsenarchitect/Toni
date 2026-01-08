// API 路由：管理研究数据
import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllResearchData, 
  getResearchDataByCategory, 
  getVerifiedResearchData,
  addResearchData,
  updateResearchVerification 
} from '@/lib/market-research';
import type { MarketResearchData } from '@/lib/market-research';

// GET: 获取研究数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const verifiedOnly = searchParams.get('verified') === 'true';
    
    let data: MarketResearchData[];
    
    if (category) {
      data = getResearchDataByCategory(category as MarketResearchData['category']);
    } else if (verifiedOnly) {
      data = getVerifiedResearchData();
    } else {
      data = getAllResearchData();
    }
    
    return NextResponse.json({ success: true, data, count: data.length });
  } catch (error) {
    console.error('Error fetching research data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch research data' },
      { status: 500 }
    );
  }
}

// POST: 添加研究数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, title, value, source, sourceUrl, verified, notes } = body;
    
    if (!category || !title || value === undefined || !source) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: category, title, value, source' },
        { status: 400 }
      );
    }
    
    const data = addResearchData({
      category: category as MarketResearchData['category'],
      title,
      value,
      source,
      sourceUrl,
      verified: verified ?? false,
      notes,
    });
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error adding research data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add research data' },
      { status: 500 }
    );
  }
}

// PATCH: 更新研究数据验证状态
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, verified, notes } = body;
    
    if (!id || verified === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: id, verified' },
        { status: 400 }
      );
    }
    
    const updated = updateResearchVerification(id, verified, notes);
    
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Research data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating research data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update research data' },
      { status: 500 }
    );
  }
}

