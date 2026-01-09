// API route for campaigns
import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from(TABLES.campaigns)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      campaigns: data,
    });
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, template, subject } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Campaign name is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from(TABLES.campaigns)
      .insert({
        name,
        template: template || 'interview_request',
        subject: subject || 'Market Research Opportunity',
        status: 'draft',
        sent_count: 0,
        open_count: 0,
        click_count: 0,
        response_count: 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      campaign: data,
    });
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create campaign' },
      { status: 500 }
    );
  }
}



