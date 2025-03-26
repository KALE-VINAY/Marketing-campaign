'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import CampaignForm from '@/components/forms/CampaignForm';

export default function NewCampaign() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl bg-white mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Create New Marketing Campaign</h1>
        <p className="mt-2 text-sm text-gray-400">
          Fill in the details below to generate AI-powered marketing campaign materials.
        </p>
      </div>
      
      <CampaignForm />
    </div>
  );
}