import { NextRequest, NextResponse } from 'next/server';
import { getCreditBalance } from '@/lib/credit-storage';
import { checkAndSendUsageAlert } from '@/lib/credit-alerts';

/**
 * 检查指定沙龙的信用使用情况并发送提醒
 * POST /api/credits/check-alerts
 * Body: { salonId: string, salonEmail: string, salonName: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salonId, salonEmail, salonName } = body;

    if (!salonId || !salonEmail || !salonName) {
      return NextResponse.json(
        { error: 'salonId, salonEmail, and salonName are required' },
        { status: 400 }
      );
    }

    // 获取信用余额
    const balance = await getCreditBalance(salonId);
    
    // 检查并发送提醒
    const result = await checkAndSendUsageAlert(salonId, salonEmail, salonName, balance);

    return NextResponse.json({
      success: true,
      sent: result.sent,
      alertType: result.alertType,
      reason: result.reason,
    });
  } catch (error) {
    console.error('Error checking credit alerts:', error);
    return NextResponse.json(
      { error: 'Failed to check credit alerts' },
      { status: 500 }
    );
  }
}

/**
 * 批量检查所有沙龙的信用使用情况
 * GET /api/credits/check-alerts?all=true
 * 
 * 注意：这个端点需要从数据库获取所有沙龙列表
 * 目前使用内存存储，所以需要传入沙龙列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkAll = searchParams.get('all') === 'true';
    
    if (!checkAll) {
      return NextResponse.json(
        { error: 'Use POST to check specific salon, or GET ?all=true to check all' },
        { status: 400 }
      );
    }

    // TODO: 从数据库获取所有沙龙列表
    // 目前返回提示信息
    return NextResponse.json({
      success: true,
      message: 'Batch check requires database integration. Use POST endpoint for individual salon checks.',
      note: 'In production, this should fetch all salons from database and check each one.',
    });
  } catch (error) {
    console.error('Error in batch credit alert check:', error);
    return NextResponse.json(
      { error: 'Failed to check credit alerts' },
      { status: 500 }
    );
  }
}



