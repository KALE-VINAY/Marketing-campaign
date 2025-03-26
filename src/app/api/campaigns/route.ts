import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Create a new campaign
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const userId = session.user.id;
    
    const campaignData = {
      ...body,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await addDoc(collection(db, 'campaigns'), campaignData);
    
    return NextResponse.json({
      id: docRef.id,
      ...campaignData
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

// Get all campaigns for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const campaignsQuery = query(
      collection(db, 'campaigns'),
      where('userId', '==', userId)
    );
    
    const campaignsSnapshot = await getDocs(campaignsQuery);
    const campaigns = campaignsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}