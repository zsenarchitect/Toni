import { NextRequest, NextResponse } from 'next/server';
import { updateSubscription } from '@/lib/credit-storage';
import { getCreditStats, SUBSCRIPTION_PLANS } from '@/lib/credits';
import type { SubscriptionTier } from '@/types';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { salonId, tier } = body;

    if (!salonId || !tier) {
      return NextResponse.json(
        { error: 'salonId and tier are required' },
        { status: 400 }
      );
    }

    const validTiers: SubscriptionTier[] = ['essential', 'professional', 'enterprise'];
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` },
        { status: 400 }
      );
    }

    const balance = await updateSubscription(salonId, tier as SubscriptionTier);
    const stats = getCreditStats(balance);
    const plan = SUBSCRIPTION_PLANS[tier as SubscriptionTier];

    return NextResponse.json({
      success: true,
      message: `Subscription updated to ${plan.name}`,
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
      plan: {
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        baseCredits: plan.baseCredits,
        payAsYouGoPrice: plan.payAsYouGoPrice,
      },
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

