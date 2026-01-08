// Web scraping utilities for extracting contact information
import cheerio from 'cheerio';
import type { ScrapedContactData, BusinessType } from '@/types/outreach';

/**
 * Extract email addresses from text using regex
 */
function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return text.match(emailRegex) || [];
}

/**
 * Extract phone numbers from text using regex
 */
function extractPhones(text: string): string[] {
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const matches = text.match(phoneRegex) || [];
  return matches.map(phone => phone.replace(/\s+/g, '-'));
}

/**
 * Scrape contact information from a website URL
 */
export async function scrapeContactInfo(
  url: string,
  businessType: BusinessType
): Promise<ScrapedContactData | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract all text content
    const bodyText = $('body').text();
    
    // Extract emails
    const emails = extractEmails(bodyText);
    const email = emails.length > 0 ? emails[0] : null;

    // Extract phones
    const phones = extractPhones(bodyText);
    const phone = phones.length > 0 ? phones[0] : null;

    // Extract business name (from title or h1)
    const businessName = $('title').text() || $('h1').first().text() || '';

    // Extract address (look for common patterns)
    let address: string | null = null;
    const addressPatterns = [
      /(\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)[\w\s,]+(?:NY|New York)[\s,]*\d{5})/i,
      /([\w\s]+(?:Street|St|Avenue|Ave|Road|Rd)[\w\s,]+(?:NY|New York))/i,
    ];

    for (const pattern of addressPatterns) {
      const match = bodyText.match(pattern);
      if (match) {
        address = match[1];
        break;
      }
    }

    // Extract social media links
    const socialMedia: Record<string, string> = {};
    $('a[href*="facebook.com"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) socialMedia.facebook = href;
    });
    $('a[href*="instagram.com"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) socialMedia.instagram = href;
    });
    $('a[href*="twitter.com"], a[href*="x.com"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) socialMedia.twitter = href;
    });

    // Extract business hours (look for common patterns)
    let businessHours: string | undefined;
    const hoursText = $('*').text();
    const hoursMatch = hoursText.match(/(?:Mon|Monday|Tue|Tuesday|Wed|Wednesday|Thu|Thursday|Fri|Friday|Sat|Saturday|Sun|Sunday)[\s\S]{0,100}(?:AM|PM|am|pm)/i);
    if (hoursMatch) {
      businessHours = hoursMatch[0];
    }

    // Extract description (meta description or first paragraph)
    const description = $('meta[name="description"]').attr('content') || 
                       $('p').first().text().substring(0, 200) || 
                       undefined;

    // Extract services (look for common service keywords)
    const services: string[] = [];
    const serviceKeywords = ['haircut', 'coloring', 'styling', 'perm', 'treatment', 'blowout', 'trim'];
    $('*').each((_, el) => {
      const text = $(el).text().toLowerCase();
      for (const keyword of serviceKeywords) {
        if (text.includes(keyword) && !services.includes(keyword)) {
          services.push(keyword);
        }
      }
    });

    return {
      email,
      phone,
      business_name: businessName.trim() || 'Unknown',
      address: address || null,
      business_type: businessType,
      social_media: Object.keys(socialMedia).length > 0 ? socialMedia : undefined,
      business_hours: businessHours,
      description,
      services: services.length > 0 ? services : undefined,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

/**
 * Batch scrape multiple URLs
 */
export async function batchScrapeContacts(
  urls: Array<{ url: string; businessType: BusinessType }>,
  delayMs: number = 1000
): Promise<Array<ScrapedContactData & { url: string }>> {
  const results: Array<ScrapedContactData & { url: string }> = [];

  for (const { url, businessType } of urls) {
    try {
      const data = await scrapeContactInfo(url, businessType);
      if (data) {
        results.push({ ...data, url });
      }
      
      // Rate limiting - wait between requests
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
    }
  }

  return results;
}

