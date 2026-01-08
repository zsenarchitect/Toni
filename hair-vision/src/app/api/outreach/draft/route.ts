// API route for generating email drafts using Ollama
import { NextRequest, NextResponse } from 'next/server';
import { generateEmailDraft } from '@/lib/ollama';
import { supabase, TABLES } from '@/lib/supabase';
import { generateTrackingPixelId } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactIds, campaignId, campaignType = 'interview_request' } = body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { error: 'Contact IDs array is required' },
        { status: 400 }
      );
    }

    // Fetch contacts
    const { data: contacts, error: contactsError } = await supabase
      .from(TABLES.contacts)
      .select('*')
      .in('id', contactIds);

    if (contactsError || !contacts) {
      return NextResponse.json(
        { error: 'Failed to fetch contacts' },
        { status: 500 }
      );
    }

    // Generate drafts for all contacts
    const drafts = [];
    for (const contact of contacts) {
      try {
        const emailBody = await generateEmailDraft(
          {
            salon_name: contact.business_name,
            location: contact.address || 'NYC',
            salon_url: contact.business_url,
          },
          campaignType as 'survey_invitation' | 'interview_request' | 'follow_up'
        );

        // Create draft record
        const { data: draft, error: draftError } = await supabase
          .from(TABLES.email_drafts)
          .insert({
            campaign_id: campaignId || null,
            contact_id: contact.id,
            subject: `Market Research Opportunity - ${contact.business_name}`,
            body: emailBody,
            status: 'draft',
          })
          .select()
          .single();

        if (!draftError && draft) {
          drafts.push(draft);
        }
      } catch (error) {
        console.error(`Error generating draft for contact ${contact.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      count: drafts.length,
      drafts,
    });
  } catch (error: any) {
    console.error('Email draft generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate email drafts' },
      { status: 500 }
    );
  }
}

