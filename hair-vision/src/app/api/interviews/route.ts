// API route for interviews
import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from(TABLES.interviews)
      .select('*')
      .order('scheduled_time', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      interviews: data,
    });
  } catch (error: any) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}



