// API route for email events
import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from(TABLES.email_events)
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      events: data,
    });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}


