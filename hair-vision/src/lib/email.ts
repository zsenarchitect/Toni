// Email service wrapper for Resend/SendGrid
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@merror.app';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  trackingPixel?: string; // Unique ID for open tracking
  trackingLinks?: Array<{ original: string; tracked: string }>; // Link tracking
}

/**
 * Send email via Resend
 */
export async function sendEmail(options: EmailOptions): Promise<{ id: string } | null> {
  if (!resend) {
    console.error('Resend API key not configured');
    return null;
  }

  try {
    // Add tracking pixel if provided
    let html = options.html;
    if (options.trackingPixel) {
      const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/outreach/track?type=open&id=${options.trackingPixel}`;
      html += `<img src="${trackingUrl}" width="1" height="1" style="display:none;" />`;
    }

    // Replace links with tracked versions
    if (options.trackingLinks) {
      for (const { original, tracked } of options.trackingLinks) {
        html = html.replace(new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), tracked);
      }
    }

    const result = await resend.emails.send({
      from: options.from || FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html,
      reply_to: options.replyTo,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return null;
    }

    return { id: result.data?.id || '' };
  } catch (error) {
    console.error('Error sending email:', error);
    return null;
  }
}

/**
 * Generate tracking pixel URL
 */
export function generateTrackingPixelId(): string {
  return `pixel_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate tracked link URL
 */
export function generateTrackedLink(originalUrl: string, clickId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/api/outreach/track?type=click&id=${clickId}&url=${encodeURIComponent(originalUrl)}`;
}


