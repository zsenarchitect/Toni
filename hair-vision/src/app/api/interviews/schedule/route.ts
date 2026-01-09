// API route for automated interview scheduling
import { NextRequest, NextResponse } from 'next/server';
import { scheduleInterview, sendInterviewReminder } from '@/lib/interview-scheduler';
import { extractInterviewScheduling } from '@/lib/ollama';
import { supabase, TABLES } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactId, scheduledTime, location, locationDetails, replyText } = body;

    // If replyText is provided, extract scheduling info from it
    if (replyText && !scheduledTime) {
      const schedulingInfo = await extractInterviewScheduling(replyText);
      
      if (!schedulingInfo.wants_interview || schedulingInfo.available_times.length === 0) {
        return NextResponse.json(
          { error: 'No interview scheduling information found in reply' },
          { status: 400 }
        );
      }

      // Use first available time
      const firstTime = schedulingInfo.available_times[0];
      const time = new Date(`${firstTime.date}T${firstTime.time}`);
      
      // Get contact info
      const { data: contact } = await supabase
        .from(TABLES.contacts)
        .select('*')
        .eq('id', contactId)
        .single();

      if (!contact || !contact.email) {
        return NextResponse.json(
          { error: 'Contact not found or missing email' },
          { status: 404 }
        );
      }

      const interview = await scheduleInterview(
        contactId,
        time.toISOString(),
        schedulingInfo.preferred_location === 'not_specified' ? 'in_person' : schedulingInfo.preferred_location,
        contact.email,
        contact.name || contact.business_name,
        contact.business_name,
        schedulingInfo.location_details || locationDetails
      );

      if (!interview) {
        return NextResponse.json(
          { error: 'Failed to schedule interview' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        interview,
      });
    }

    // Direct scheduling
    if (!contactId || !scheduledTime) {
      return NextResponse.json(
        { error: 'Contact ID and scheduled time are required' },
        { status: 400 }
      );
    }

    const { data: contact } = await supabase
      .from(TABLES.contacts)
      .select('*')
      .eq('id', contactId)
      .single();

    if (!contact || !contact.email) {
      return NextResponse.json(
        { error: 'Contact not found or missing email' },
        { status: 404 }
      );
    }

    const interview = await scheduleInterview(
      contactId,
      scheduledTime,
      location || 'in_person',
      contact.email,
      contact.name || contact.business_name,
      contact.business_name,
      locationDetails
    );

    if (!interview) {
      return NextResponse.json(
        { error: 'Failed to schedule interview' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      interview,
    });
  } catch (error: any) {
    console.error('Interview scheduling error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to schedule interview' },
      { status: 500 }
    );
  }
}

// Send reminder endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { interviewId } = body;

    if (!interviewId) {
      return NextResponse.json(
        { error: 'Interview ID is required' },
        { status: 400 }
      );
    }

    const success = await sendInterviewReminder(interviewId);

    return NextResponse.json({
      success,
    });
  } catch (error: any) {
    console.error('Reminder sending error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reminder' },
      { status: 500 }
    );
  }
}



