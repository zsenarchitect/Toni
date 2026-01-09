// API route for scraping contact information from URLs
import { NextRequest, NextResponse } from 'next/server';
import { batchScrapeContacts } from '@/lib/scraper';
import { supabase, TABLES } from '@/lib/supabase';
import type { BusinessType } from '@/types/outreach';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls, delayMs = 1000 } = body;

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    // Prepare URLs with business types
    const urlList = urls.map((item: string | { url: string; businessType: BusinessType }) => {
      if (typeof item === 'string') {
        return { url: item, businessType: 'salon' as BusinessType };
      }
      return item;
    });

    // Scrape contacts
    const scrapedData = await batchScrapeContacts(urlList, delayMs);

    // Update or insert contacts in database
    const results = [];
    for (const data of scrapedData) {
      const { url, ...contactData } = data;

      // Check if contact exists
      const { data: existing } = await supabase
        .from(TABLES.contacts)
        .select('id')
        .eq('business_url', url)
        .single();

      if (existing) {
        // Update existing contact
        const { data: updated } = await supabase
          .from(TABLES.contacts)
          .update({
            email: contactData.email,
            phone: contactData.phone,
            business_name: contactData.business_name,
            address: contactData.address,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (updated) results.push(updated);
      } else {
        // Insert new contact
        const { data: inserted } = await supabase
          .from(TABLES.contacts)
          .insert({
            ...contactData,
            business_url: url,
            status: 'new',
            tags: [],
          })
          .select()
          .single();

        if (inserted) results.push(inserted);
      }
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      contacts: results,
    });
  } catch (error: any) {
    console.error('Contact scraping error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to scrape contacts' },
      { status: 500 }
    );
  }
}


