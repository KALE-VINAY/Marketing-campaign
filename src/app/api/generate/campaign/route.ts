import { NextRequest, NextResponse } from 'next/server';
import { generateFullCampaign } from '@/lib/ai/graphs/campaignGraph';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessInfo, campaignInfo, previousPerformance } = body;
    
    // Validate input
    if (!businessInfo || !campaignInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate campaign using LangGraph
    const campaignResult = await generateFullCampaign({
      businessInfo,
      campaignInfo,
      previousPerformance
    });
    
    return NextResponse.json(campaignResult);
  } catch (error) {
    console.error('Error generating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to generate campaign' },
      { status: 500 }
    );
  }
}