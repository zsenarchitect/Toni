// Automated interview scheduling with Google Calendar integration
import { google } from 'googleapis';
import type { Interview } from '@/types/outreach';
import { supabase, TABLES } from './supabase';
import { sendEmail } from './email';

interface CalendarEvent {
  summary: string;
  description: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees: Array<{ email: string }>;
  reminders: { useDefault: boolean; overrides: Array<{ method: string; minutes: number }> };
  location?: string;
}

const GOOGLE_CALENDAR_CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID;
const GOOGLE_CALENDAR_CLIENT_SECRET = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
const GOOGLE_CALENDAR_REFRESH_TOKEN = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

/**
 * Get Google Calendar OAuth2 client
 */
function getCalendarClient() {
  if (!GOOGLE_CALENDAR_CLIENT_ID || !GOOGLE_CALENDAR_CLIENT_SECRET || !GOOGLE_CALENDAR_REFRESH_TOKEN) {
    throw new Error('Google Calendar credentials not configured');
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CALENDAR_CLIENT_ID,
    GOOGLE_CALENDAR_CLIENT_SECRET,
    'http://localhost:3000' // Redirect URI
  );

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_CALENDAR_REFRESH_TOKEN,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Create calendar event for interview
 */
export async function createCalendarEvent(
  contactId: string,
  scheduledTime: string,
  location: 'in_person' | 'zoom' | 'phone',
  contactEmail: string,
  contactName: string,
  businessName: string
): Promise<string | null> {
  try {
    const calendar = getCalendarClient();

    const event: CalendarEvent = {
      summary: `Interview: ${businessName}`,
      description: `Market research interview with ${contactName} from ${businessName}`,
      start: {
        dateTime: scheduledTime,
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: new Date(new Date(scheduledTime).getTime() + 30 * 60 * 1000).toISOString(), // 30 min duration
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: contactEmail },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'email', minutes: 60 }, // 1 hour before
        ],
      },
    };

    // Add location based on type
    if (location === 'zoom') {
      event.location = 'Zoom Meeting (link to be sent)';
    } else if (location === 'phone') {
      event.location = 'Phone Call';
    }

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });

    return response.data.id || null;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return null;
  }
}

/**
 * Schedule interview and send confirmation
 */
export async function scheduleInterview(
  contactId: string,
  scheduledTime: string,
  location: 'in_person' | 'zoom' | 'phone',
  contactEmail: string,
  contactName: string,
  businessName: string,
  locationDetails?: string
): Promise<Interview | null> {
  try {
    // Create calendar event
    const calendarEventId = await createCalendarEvent(
      contactId,
      scheduledTime,
      location,
      contactEmail,
      contactName,
      businessName
    );

    // Save to database
    const { data, error } = await supabase
      .from(TABLES.interviews)
      .insert({
        contact_id: contactId,
        scheduled_time: scheduledTime,
        location,
        status: 'scheduled',
        calendar_event_id: calendarEventId,
        notes: locationDetails || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving interview to database:', error);
      return null;
    }

    // Send confirmation email
    const confirmationHtml = `
      <h2>Interview Confirmed</h2>
      <p>Hi ${contactName},</p>
      <p>Your interview has been scheduled for:</p>
      <p><strong>Date & Time:</strong> ${new Date(scheduledTime).toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
      <p><strong>Location:</strong> ${location === 'in_person' ? locationDetails || 'TBD' : location}</p>
      <p>Looking forward to speaking with you!</p>
    `;

    await sendEmail({
      to: contactEmail,
      subject: `Interview Confirmed - ${businessName}`,
      html: confirmationHtml,
    });

    // Update contact status
    await supabase
      .from(TABLES.contacts)
      .update({ status: 'interview_scheduled' })
      .eq('id', contactId);

    return data as Interview;
  } catch (error) {
    console.error('Error scheduling interview:', error);
    return null;
  }
}

/**
 * Send interview reminder
 */
export async function sendInterviewReminder(interviewId: string): Promise<boolean> {
  try {
    const { data: interview, error } = await supabase
      .from(TABLES.interviews)
      .select(`
        *,
        contacts:contact_id (
          email,
          name,
          business_name
        )
      `)
      .eq('id', interviewId)
      .single();

    if (error || !interview) {
      console.error('Error fetching interview:', error);
      return false;
    }

    const contact = interview.contacts as any;
    const scheduledTime = new Date(interview.scheduled_time);

    const reminderHtml = `
      <h2>Interview Reminder</h2>
      <p>Hi ${contact.name},</p>
      <p>This is a reminder that we have an interview scheduled for:</p>
      <p><strong>Date & Time:</strong> ${scheduledTime.toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
      <p>See you soon!</p>
    `;

    await sendEmail({
      to: contact.email,
      subject: `Interview Reminder - ${contact.business_name}`,
      html: reminderHtml,
    });

    return true;
  } catch (error) {
    console.error('Error sending reminder:', error);
    return false;
  }
}

