// API route wrapper for Ollama
import { NextRequest, NextResponse } from 'next/server';
import { generateEmailDraft, parseEmailReply, extractInterviewScheduling } from '@/lib/ollama';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'generate_email':
        if (!params.contactInfo || !params.campaignType) {
          return NextResponse.json(
            { error: 'contactInfo and campaignType are required' },
            { status: 400 }
          );
        }
        const email = await generateEmailDraft(params.contactInfo, params.campaignType);
        return NextResponse.json({ success: true, email });

      case 'parse_reply':
        if (!params.replyText) {
          return NextResponse.json(
            { error: 'replyText is required' },
            { status: 400 }
          );
        }
        const parsed = await parseEmailReply(params.replyText);
        return NextResponse.json({ success: true, parsed });

      case 'extract_scheduling':
        if (!params.replyText) {
          return NextResponse.json(
            { error: 'replyText is required' },
            { status: 400 }
          );
        }
        const scheduling = await extractInterviewScheduling(params.replyText);
        return NextResponse.json({ success: true, scheduling });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Ollama API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}



