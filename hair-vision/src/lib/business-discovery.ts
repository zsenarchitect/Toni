// Automated business discovery using Google Places and Yelp APIs
import type { BusinessDiscoveryResult, BusinessType } from '@/types/outreach';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const YELP_API_KEY = process.env.YELP_API_KEY;

interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  types: string[];
}

interface YelpBusinessResult {
  id: string;
  name: string;
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
  };
  phone?: string;
  url?: string;
  rating?: number;
  categories: Array<{ alias: string; title: string }>;
}

/**
 * Discover businesses using Google Places API
 */
export async function discoverBusinessesGoogle(
  location: string,
  businessType: 'salon' | 'barbershop' | 'both',
  maxResults: number = 50
): Promise<BusinessDiscoveryResult[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key not configured');
  }

  const results: BusinessDiscoveryResult[] = [];
  const queries = [];

  if (businessType === 'salon' || businessType === 'both') {
    queries.push('hair salon');
    queries.push('beauty salon');
  }
  if (businessType === 'barbershop' || businessType === 'both') {
    queries.push('barbershop');
    queries.push('barber shop');
  }

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' ' + location)}&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (!response.ok) {
        console.error(`Google Places API error: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      
      if (data.results) {
        for (const place of data.results.slice(0, maxResults)) {
          const placeDetails = await getPlaceDetails(place.place_id);
          
          const businessType: BusinessType = 
            place.types?.some((t: string) => t.includes('barber')) ? 'barbershop' : 'salon';

          results.push({
            name: place.name,
            url: placeDetails?.website || null,
            address: place.formatted_address,
            phone: placeDetails?.formatted_phone_number || null,
            email: null, // Google Places doesn't provide email
            rating: place.rating || null,
            business_type: businessType,
            place_id: place.place_id,
          });
        }
      }
    } catch (error) {
      console.error(`Error discovering businesses with Google Places:`, error);
    }
  }

  return results;
}

/**
 * Get detailed place information
 */
async function getPlaceDetails(placeId: string): Promise<GooglePlaceResult | null> {
  if (!GOOGLE_PLACES_API_KEY) return null;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,website,rating&key=${GOOGLE_PLACES_API_KEY}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error(`Error fetching place details:`, error);
    return null;
  }
}

/**
 * Discover businesses using Yelp Fusion API
 */
export async function discoverBusinessesYelp(
  location: string,
  businessType: 'salon' | 'barbershop' | 'both',
  maxResults: number = 50
): Promise<BusinessDiscoveryResult[]> {
  if (!YELP_API_KEY) {
    throw new Error('Yelp API key not configured');
  }

  const results: BusinessDiscoveryResult[] = [];
  const categories = [];

  if (businessType === 'salon' || businessType === 'both') {
    categories.push('hair');
    categories.push('beautysvc');
  }
  if (businessType === 'barbershop' || businessType === 'both') {
    categories.push('barbers');
  }

  for (const category of categories) {
    try {
      const response = await fetch(
        `https://api.yelp.com/v3/businesses/search?location=${encodeURIComponent(location)}&categories=${category}&limit=${Math.min(maxResults, 50)}`,
        {
          headers: {
            'Authorization': `Bearer ${YELP_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`Yelp API error: ${response.statusText}`);
        continue;
      }

      const data = await response.json();

      if (data.businesses) {
        for (const business of data.businesses) {
          const businessType: BusinessType = 
            business.categories?.some((c: any) => c.alias === 'barbers') ? 'barbershop' : 'salon';

          results.push({
            name: business.name,
            url: business.url || null,
            address: `${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}`,
            phone: business.phone || null,
            email: null, // Yelp doesn't provide email
            rating: business.rating || null,
            business_type: businessType,
            yelp_id: business.id,
          });
        }
      }
    } catch (error) {
      console.error(`Error discovering businesses with Yelp:`, error);
    }
  }

  return results;
}

/**
 * Main discovery function - combines Google Places and Yelp results
 */
export async function discoverBusinesses(
  location: string,
  businessType: 'salon' | 'barbershop' | 'both' = 'both',
  maxResults: number = 50
): Promise<BusinessDiscoveryResult[]> {
  const results: BusinessDiscoveryResult[] = [];
  const seen = new Set<string>();

  // Try Google Places first
  try {
    const googleResults = await discoverBusinessesGoogle(location, businessType, maxResults);
    for (const result of googleResults) {
      const key = `${result.name}-${result.address}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push(result);
      }
    }
  } catch (error) {
    console.error('Google Places discovery failed:', error);
  }

  // Then Yelp
  try {
    const yelpResults = await discoverBusinessesYelp(location, businessType, maxResults);
    for (const result of yelpResults) {
      const key = `${result.name}-${result.address}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push(result);
      }
    }
  } catch (error) {
    console.error('Yelp discovery failed:', error);
  }

  return results;
}


