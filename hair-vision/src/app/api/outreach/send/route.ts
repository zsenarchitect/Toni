// API route for sending emails
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateTrackingPixelId, generateTrackedLink } from '@/lib/email';
import { supabase, TABLES } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { draftIds } = body;

    if (!draftIds || !Array.isArray(draftIds) || draftIds.length === 0) {
      return NextResponse.json(
        { error: 'Draft IDs array is required' },
        { status: 400 }
      );
    }

    // Fetch drafts with contact info
    const { data: drafts, error: draftsError } = await supabase
      .from(TABLES.email_drafts)
      .select(`
        *,
        contacts:contact_id (
          email,
          name,
          business_name
        )
      `)
      .in('id', draftIds)
      .eq('status', 'approved');

    if (draftsError || !drafts) {
      return NextResponse.json(
        { error: 'Failed to fetch drafts' },
        { status: 500 }
      );
    }

    const results = [];
    for (const draft of drafts) {
      const contact = draft.contacts as any;
      
      if (!contact || !contact.email) {
        console.error(`No email for draft ${draft.id}`);
        continue;
      }

      // Generate tracking pixel ID
      const trackingPixelId = generateTrackingPixelId();

      // Extract links from email body and create tracked versions
      const linkRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
      const links = draft.body.match(linkRegex) || [];
      const trackingLinks = links.map((link: string) => ({
        original: link,
        tracked: generateTrackedLink(link, `click_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`),
      }));

      // Send email
      const emailResult = await sendEmail({
        to: contact.email,
        subject: draft.subject,
        html: draft.edited_body || draft.body,
        trackingPixel: trackingPixelId,
        trackingLinks,
      });

      if (emailResult) {
        // Update draft status
        await supabase
          .from(TABLES.email_drafts)
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', draft.id);

        // Log email event
        await supabase.from(TABLES.email_events).insert({
          campaign_id: draft.campaign_id,
          contact_id: draft.contact_id,
          event_type: 'sent',
          timestamp: new Date().toISOString(),
          metadata: { email_id: emailResult.id, tracking_pixel_id: trackingPixelId },
        });

        // Update contact status
        await supabase
          .from(TABLES.contacts)
          .update({ status: 'contacted' })
          .eq('id', draft.contact_id);

        // Update campaign stats
        if (draft.campaign_id) {
          await supabase.rpc('increment_campaign_sent', {
            campaign_id: draft.campaign_id,
          });
        }

        results.push({ draftId: draft.id, success: true });
      } else {
        results.push({ draftId: draft.id, success: false, error: 'Failed to send email' });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send emails' },
      { status: 500 }
    );
  }
}



