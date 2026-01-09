// API route for automated business discovery
import { NextRequest, NextResponse } from 'next/server';
import { discoverBusinesses } from '@/lib/business-discovery';
import { supabase, TABLES } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, businessType = 'both', maxResults = 50 } = body;

    if (!location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    // Discover businesses
    const businesses = await discoverBusinesses(location, businessType, maxResults);

    // Store discovered businesses in database
    const contactsToInsert = businesses.map(business => ({
      email: business.email,
      phone: business.phone,
      business_name: business.name,
      business_type: business.business_type,
      business_url: business.url,
      address: business.address,
      status: 'new',
      tags: [],
    }));

    if (contactsToInsert.length > 0) {
      // Check for duplicates before inserting
      const existingContacts = await supabase
        .from(TABLES.contacts)
        .select('business_name, address')
        .in('business_name', contactsToInsert.map(c => c.business_name));

      const existingSet = new Set(
        (existingContacts.data || []).map(c => `${c.business_name}-${c.address}`)
      );

      const newContacts = contactsToInsert.filter(
        c => !existingSet.has(`${c.business_name}-${c.address}`)
      );

      if (newContacts.length > 0) {
        await supabase.from(TABLES.contacts).insert(newContacts);
      }
    }

    return NextResponse.json({
      success: true,
      count: businesses.length,
      businesses,
    });
  } catch (error: any) {
    console.error('Business discovery error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to discover businesses' },
      { status: 500 }
    );
  }
}


