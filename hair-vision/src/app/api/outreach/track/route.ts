// API route for tracking email opens and clicks
import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'open' or 'click'
    const id = searchParams.get('id');
    const url = searchParams.get('url');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    // Extract contact/campaign ID from tracking ID
    // Format: pixel_<timestamp>_<random> or click_<timestamp>_<random>
    const parts = id.split('_');
    if (parts.length < 2) {
      return NextResponse.json({ error: 'Invalid tracking ID' }, { status: 400 });
    }

    // For now, we'll need to store the mapping in the database
    // This is a simplified version - in production, you'd want to store the mapping
    // when creating the email draft

    // Log the event
    const eventType = type === 'open' ? 'opened' : 'clicked';
    
    // Try to find the email draft or event by the tracking ID
    // In a real implementation, you'd have a mapping table
    // For now, we'll just log it
    await supabase.from(TABLES.email_events).insert({
      event_type: eventType,
      timestamp: new Date().toISOString(),
      metadata: { tracking_id: id, url: url || null },
    });

    // Return tracking pixel (1x1 transparent GIF) for opens
    if (type === 'open') {
      const pixel = Buffer.from(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        'base64'
      );
      return new NextResponse(pixel, {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    // Redirect to original URL for clicks
    if (type === 'click' && url) {
      return NextResponse.redirect(decodeURIComponent(url));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track event' },
      { status: 500 }
    );
  }
}



