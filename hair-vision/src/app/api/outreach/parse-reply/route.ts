// API route for parsing email replies using Ollama
import { NextRequest, NextResponse } from 'next/server';
import { parseEmailReply, extractInterviewScheduling } from '@/lib/ollama';
import { supabase, TABLES } from '@/lib/supabase';
import { scheduleInterview } from '@/lib/interview-scheduler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailId, contactId, campaignId, replyText } = body;

    if (!replyText) {
      return NextResponse.json(
        { error: 'Reply text is required' },
        { status: 400 }
      );
    }

    // Parse reply using Ollama
    const structuredData = await parseEmailReply(replyText);

    // Save response to database
    const { data: response, error: responseError } = await supabase
      .from(TABLES.responses)
      .insert({
        contact_id: contactId || null,
        campaign_id: campaignId || null,
        email_id: emailId || null,
        raw_content: replyText,
        structured_data: structuredData,
        response_type: structuredData.response_type,
      })
      .select()
      .single();

    if (responseError) {
      console.error('Error saving response:', responseError);
    }

    // Update contact status
    if (contactId) {
      const newStatus = structuredData.interest_level === 'interested' 
        ? 'responded' 
        : structuredData.interest_level === 'not_interested'
        ? 'responded'
        : 'responded';

      await supabase
        .from(TABLES.contacts)
        .update({ status: newStatus })
        .eq('id', contactId);
    }

    // Check if interview is requested
    if (structuredData.response_type === 'interview_request' && contactId) {
      const schedulingInfo = await extractInterviewScheduling(replyText);
      
      if (schedulingInfo.wants_interview && schedulingInfo.available_times.length > 0) {
        // Get contact info
        const { data: contact } = await supabase
          .from(TABLES.contacts)
          .select('*')
          .eq('id', contactId)
          .single();

        if (contact && contact.email) {
          // Schedule first available time
          const firstTime = schedulingInfo.available_times[0];
          const scheduledTime = new Date(`${firstTime.date}T${firstTime.time}`).toISOString();

          await scheduleInterview(
            contactId,
            scheduledTime,
            schedulingInfo.preferred_location === 'not_specified' ? 'in_person' : schedulingInfo.preferred_location,
            contact.email,
            contact.name || contact.business_name,
            contact.business_name,
            schedulingInfo.location_details
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      structuredData,
      response,
    });
  } catch (error: any) {
    console.error('Reply parsing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse reply' },
      { status: 500 }
    );
  }
}


