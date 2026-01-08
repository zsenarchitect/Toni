// API route for responses
import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from(TABLES.responses)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      responses: data,
    });
  } catch (error: any) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch responses' },
      { status: 500 }
    );
  }
}

