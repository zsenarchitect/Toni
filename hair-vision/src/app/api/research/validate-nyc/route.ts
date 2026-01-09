// API 路由：验证 NYC 沙龙数量
import { NextRequest, NextResponse } from 'next/server';
import { validateNYCSalonCount } from '@/lib/market-research';

export async function GET(request: NextRequest) {
  try {
    const data = await validateNYCSalonCount();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error validating NYC salon count:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to validate NYC salon count',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



