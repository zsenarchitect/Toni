import { NextRequest, NextResponse } from 'next/server';
import { purchaseCredits } from '@/lib/credit-storage';
import { calculatePayAsYouGoCost, getCreditStats } from '@/lib/credits';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salonId, credits } = body;

    if (!salonId || !credits || credits <= 0) {
      return NextResponse.json(
        { error: 'salonId and positive credits amount are required' },
        { status: 400 }
      );
    }

    // 获取当前余额以确定套餐
    const balance = await purchaseCredits(salonId, credits);
    const cost = calculatePayAsYouGoCost(balance.subscriptionTier, credits);
    const stats = getCreditStats(balance);

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${credits} credits`,
      balance: {
        salonId: balance.salonId,
        subscriptionTier: balance.subscriptionTier,
        baseCredits: balance.baseCredits,
        usedCredits: balance.usedCredits,
        purchasedCredits: balance.purchasedCredits,
        resetDate: balance.resetDate.toISOString(),
      },
      stats: {
        total: stats.total,
        used: stats.used,
        available: stats.available,
        usagePercent: stats.usagePercent,
      },
      purchase: {
        credits,
        cost: `$${cost.toFixed(2)}`,
      },
    });
  } catch (error) {
    console.error('Error purchasing credits:', error);
    return NextResponse.json(
      { error: 'Failed to purchase credits' },
      { status: 500 }
    );
  }
}



