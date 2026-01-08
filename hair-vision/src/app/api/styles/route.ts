import { NextRequest, NextResponse } from 'next/server';
import { hairstyles, filterHairstyles } from '@/data/hairstyles';
import type { Hairstyle } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') as Hairstyle['category'] | null;
  const gender = searchParams.get('gender') as Hairstyle['gender'] | null;

  let styles = hairstyles;

  if (category || gender) {
    styles = filterHairstyles(
      category || undefined,
      gender || undefined
    );
  }

  return NextResponse.json({
    success: true,
    styles,
    total: styles.length,
  });
}
