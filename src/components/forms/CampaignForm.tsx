'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from "firebase/auth";
const platformOptions = [
  'Facebook',
  'Instagram',
  'Twitter',
  'LinkedIn',
  'Google Ads',
  'TikTok',
  'Email',
];

const toneOptions = [
  'Professional',
  'Friendly',
  'Humorous',
  'Inspirational',
  'Urgent',
  'Educational',
];

const visualStyleOptions = [
  'Minimalist',
  'Vibrant',
  'Corporate',
  'Artistic',
  'Retro',
  'Modern',
];

export default function CampaignForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
  });
  const [campaignInfo, setCampaignInfo] = useState({
    campaignGoal: '',
    platform: 'Facebook',
    tone: 'Professional',
    visualStyle: 'Modern',
  });
  const [previousPerformance, setPreviousPerformance] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (!businessInfo.businessName || !campaignInfo.campaignGoal) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }  
  
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        alert("You must be logged in to create a campaign.");
        setLoading(false);
        return;
      }
  
      // Get Firebase auth token
      const token = await user.getIdToken();
  
      const generateResponse = await fetch("/api/generate/campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify({
          businessInfo,
          campaignInfo,
          previousPerformance,
        }),
      });
  
      const responseData = await generateResponse.json();
  
      if (!generateResponse.ok) {
        throw new Error(responseData.error || "Failed to generate campaign");
      }
  
      const saveResponse = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify({
          businessInfo,
          campaignInfo,
          previousPerformance,
          generatedContent: {
            adCopy: responseData.adCopy,
            imagePrompt: responseData.imagePrompt,
            targetingRecommendations: responseData.targetingRecommendations,
          },
        }),
      });
  
      if (!saveResponse.ok) {
        throw new Error("Failed to save campaign");
      }
  
      const savedCampaign = await saveResponse.json();
      router.push(`/campaigns/${savedCampaign.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl text-black font-semibold mb-4">Business Information</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={businessInfo.businessName}
              onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
              required
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={businessInfo.industry}
              onChange={(e) => setBusinessInfo({...businessInfo, industry: e.target.value})}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
              Target Audience
            </label>
            <textarea
              id="targetAudience"
              rows={3}
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={businessInfo.targetAudience}
              onChange={(e) => setBusinessInfo({...businessInfo, targetAudience: e.target.value})}
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl text-black font-semibold mb-4">Campaign Information</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="campaignGoal" className="block text-sm font-medium text-gray-700">
              Campaign Goal
            </label>
            <textarea
              id="campaignGoal"
              rows={2}
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={campaignInfo.campaignGoal}
              onChange={(e) => setCampaignInfo({...campaignInfo, campaignGoal: e.target.value})}
              required
            />
          </div>
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
              Platform
            </label>
            <select
              id="platform"
              className="mt-1 cursor-pointer block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={campaignInfo.platform}
              onChange={(e) => setCampaignInfo({...campaignInfo, platform: e.target.value})}
            >
              {platformOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
              Tone
            </label>
            <select
              id="tone"
              className="mt-1 cursor-pointer text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={campaignInfo.tone}
              onChange={(e) => setCampaignInfo({...campaignInfo, tone: e.target.value})}
            >
              {toneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="visualStyle" className="block text-sm font-medium text-gray-700">
              Visual Style
            </label>
            <select
              id="visualStyle"
              className="mt-1 cursor-pointer text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={campaignInfo.visualStyle}
              onChange={(e) => setCampaignInfo({...campaignInfo, visualStyle: e.target.value})}
            >
              {visualStyleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="previousPerformance" className="block text-sm font-medium text-gray-700">
              Previous Campaign Performance (Optional)
            </label>
            <textarea
              id="previousPerformance"
              rows={3}
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={previousPerformance}
              onChange={(e) => setPreviousPerformance(e.target.value)}
              placeholder="Describe any previous campaign performance metrics that might be helpful"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center cursor-pointer py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Campaign'}
        </button>
      </div>
    </form>
  );
}