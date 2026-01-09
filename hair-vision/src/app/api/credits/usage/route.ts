import { NextRequest, NextResponse } from 'next/server';
import { getCreditUsageHistory } from '@/lib/credit-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salonId');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    if (!salonId) {
      return NextResponse.json(
        { error: 'salonId is required' },
        { status: 400 }
      );
    }

    const history = await getCreditUsageHistory(salonId, limit);

    return NextResponse.json({
      success: true,
      history: history.map(usage => ({
        id: usage.id,
        creditsUsed: usage.creditsUsed,
        model: usage.model,
        resolution: usage.resolution,
        cost: usage.cost,
        timestamp: usage.timestamp.toISOString(),
      })),
      total: history.length,
    });
  } catch (error) {
    console.error('Error fetching credit usage history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credit usage history' },
      { status: 500 }
    );
  }
}



