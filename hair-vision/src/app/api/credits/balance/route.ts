import { NextRequest, NextResponse } from 'next/server';
import { getCreditBalance } from '@/lib/credit-storage';
import { getCreditStats } from '@/lib/credits';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salonId');

    if (!salonId) {
      return NextResponse.json(
        { error: 'salonId is required' },
        { status: 400 }
      );
    }

    const balance = await getCreditBalance(salonId);
    const stats = getCreditStats(balance);

    return NextResponse.json({
      success: true,
      balance: {
        salonId: balance.salonId,
        subscriptionTier: balance.subscriptionTier,
        baseCredits: balance.baseCredits,
        usedCredits: balance.usedCredits,
        purchasedCredits: balance.purchasedCredits,
        overageCredits: balance.overageCredits,
        resetDate: balance.resetDate.toISOString(),
      },
      stats: {
        total: stats.total,
        used: stats.used,
        available: stats.displayAvailable, // 显示用（负数显示为0）
        overage: stats.overage, // 超支信用数
        overageCost: stats.overageCost, // 超支成本（待支付）
        usagePercent: stats.usagePercent,
        remainingDays: stats.remainingDays,
        isOverage: stats.isOverage, // 是否超支
      },
    });
  } catch (error) {
    console.error('Error fetching credit balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credit balance' },
      { status: 500 }
    );
  }
}

