import { NextRequest, NextResponse } from 'next/server';
import { generateFullCampaign } from '@/lib/ai/graphs/campaignGraph';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessInfo, campaignInfo, previousPerformance } = body;
    
    // Comprehensive input validation
    if (!businessInfo || !businessInfo.businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    if (!campaignInfo || !campaignInfo.campaignGoal) {
      return NextResponse.json(
        { error: 'Campaign goal is required' },
        { status: 400 }
      );
    }
    
    // Generate campaign using LangGraph
    const campaignResult = await generateFullCampaign({
      businessInfo,
      campaignInfo,
      previousPerformance: previousPerformance || ''
    });
    
    // Ensure the function returns a meaningful result
    if (typeof campaignResult === 'undefined') {
      return NextResponse.json(
        { error: 'Campaign generation failed' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(campaignResult);
  } catch (error) {
    console.error('Detailed error generating campaign:', error);
    
    // More granular error response
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Failed to generate campaign', 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}