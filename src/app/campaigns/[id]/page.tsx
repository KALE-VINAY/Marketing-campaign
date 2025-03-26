'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignDoc = await getDoc(doc(db, 'campaigns', id as string));
        
        if (campaignDoc.exists()) {
          setCampaign({
            id: campaignDoc.id,
            ...campaignDoc.data()
          });
        } else {
          setError('Campaign not found');
        }
      } catch (err) {
        console.error('Error fetching campaign:', err);
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Campaign for {campaign.businessInfo.businessName}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Created on {new Date(campaign.createdAt.seconds * 1000).toLocaleDateString()}
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Business Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{campaign.businessInfo.businessName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Industry</dt>
              <dd className="mt-1 text-sm text-gray-900">{campaign.businessInfo.industry}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Target Audience</dt>
              <dd className="mt-1 text-sm text-gray-900">{campaign.businessInfo.targetAudience}</dd>
            </div>
          </dl>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Information</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <dt className="text-sm font-medium text-gray-500">Campaign Goal</dt>
              <dd className="mt-1 text-sm text-gray-900">{campaign.campaignInfo.campaignGoal}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Platform</dt>
              <dd className="mt-1 text-sm text-gray-900">{campaign.campaignInfo.platform}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tone</dt>
              <dd className="mt-1 text-sm text-gray-900">{campaign.campaignInfo.tone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Visual Style</dt>
              <dd className="mt-1 text-sm text-gray-900">{campaign.campaignInfo.visualStyle}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Generated Ad Copy</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{campaign.generatedContent.adCopy}</pre>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Targeting Recommendations</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{campaign.generatedContent.targetingRecommendations}</pre>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg lg:col-span-2">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Image Prompt</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{campaign.generatedContent.imagePrompt}</pre>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Use this prompt with an image generation tool like DALL-E or Midjourney to create your campaign image.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}