# Outreach System Documentation

## Overview

The Outreach System is a fully automated tool for market validation research. It handles:

- **Automated Business Discovery** - Find salons and barbershops using Google Places and Yelp APIs
- **Automated Contact Scraping** - Extract contact information from websites
- **AI-Powered Email Drafting** - Generate personalized emails using Ollama
- **Automated Reply Parsing** - Extract structured data from email replies
- **Automated Interview Scheduling** - Schedule interviews and create calendar events
- **Tracking & Analytics** - Track opens, clicks, and responses

## Setup

### 1. Database Setup

Run the SQL schema in `database-schema.sql` in your Supabase SQL editor.

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all required values:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `RESEND_API_KEY` - Resend API key for sending emails
- `OLLAMA_BASE_URL` - URL of your Ollama instance (default: http://localhost:11434)
- `GOOGLE_PLACES_API_KEY` - For business discovery
- `YELP_API_KEY` - For business discovery
- `GOOGLE_CALENDAR_*` - For interview scheduling

### 3. Install Ollama

If you haven't already, install Ollama and pull a model:

```bash
# Install Ollama (macOS)
brew install ollama

# Start Ollama
ollama serve

# Pull a model
ollama pull llama3.2
```

### 4. Run the Application

```bash
npm run dev
```

## Usage

### Access Admin Dashboard

Navigate to `/admin/outreach` to access the dashboard.

### Workflow

1. **Discover Businesses**
   - Go to Contacts page
   - Click "Discover Businesses"
   - Enter location (e.g., "SoHo, NYC")
   - Select business type (salon/barbershop/both)

2. **Scrape Contact Info**
   - Go to Contacts page
   - Click "Scrape URLs"
   - Enter website URLs (comma-separated)

3. **Generate Email Drafts**
   - Go to Campaigns page
   - Create a campaign
   - Click "Generate Drafts"
   - Enter contact IDs

4. **Review & Approve Drafts**
   - Go to Drafts page
   - Review AI-generated emails
   - Approve or reject drafts
   - Click "Send Approved" to send emails

5. **Track Responses**
   - Replies are automatically parsed
   - Interview requests are automatically scheduled
   - View stats on the dashboard

## API Endpoints

### Business Discovery
- `POST /api/businesses/discover` - Discover businesses

### Contact Management
- `GET /api/contacts` - List contacts
- `POST /api/contacts` - Create contact
- `PUT /api/contacts` - Update contact
- `DELETE /api/contacts` - Delete contact
- `POST /api/contacts/scrape` - Scrape contact info from URLs

### Email Drafting
- `POST /api/outreach/draft` - Generate email drafts
- `GET /api/outreach/drafts` - List drafts
- `POST /api/outreach/send` - Send approved emails

### Reply Parsing
- `POST /api/outreach/parse-reply` - Parse email reply

### Interview Scheduling
- `POST /api/interviews/schedule` - Schedule interview
- `GET /api/interviews` - List interviews

### Tracking
- `GET /api/outreach/track` - Track email opens/clicks

## Automation Features

All features are fully automated:

- **Auto-discovery** - Finds businesses automatically
- **Auto-scraping** - Extracts contact info automatically
- **Auto-drafting** - Generates personalized emails automatically
- **Auto-parsing** - Extracts structured data from replies automatically
- **Auto-scheduling** - Creates calendar events automatically
- **Auto-tracking** - Tracks opens/clicks automatically

## Notes

- The system respects rate limits for external APIs
- All emails are tracked with pixels and link rewriting
- Interview reminders are sent automatically (24h and 1h before)
- The dashboard auto-refreshes every 30 seconds


