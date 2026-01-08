'use client';

// Campaign Manager
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Mail, 
  Users,
  TrendingUp,
  Calendar,
  Send,
  Eye,
  MousePointerClick,
  MessageSquare,
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: string;
  sent_count: number;
  open_count: number;
  click_count: number;
  response_count: number;
  created_at: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      const response = await fetch('/api/campaigns');
      const data = await response.json();
      setCampaigns(data.campaigns || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setLoading(false);
    }
  }

  async function handleCreateCampaign() {
    const name = prompt('Campaign name:');
    if (!name) return;

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          template: 'interview_request',
          subject: 'Market Research Opportunity',
        }),
      });

      if (response.ok) {
        fetchCampaigns();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  }

  async function handleGenerateDrafts(campaignId: string) {
    const contactIdsInput = prompt('Enter contact IDs (comma-separated):');
    if (!contactIdsInput) return;

    const contactIds = contactIdsInput.split(',').map(id => id.trim());

    try {
      const response = await fetch('/api/outreach/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          contactIds,
          campaignType: 'interview_request',
        }),
      });

      if (response.ok) {
        alert('Drafts generated! Check the drafts page.');
      }
    } catch (error) {
      console.error('Error generating drafts:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaigns</h1>
          <p className="text-gray-600">Create and manage email campaigns</p>
        </div>

        {/* Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <button
            onClick={handleCreateCampaign}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        {/* Campaigns List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const openRate = campaign.sent_count > 0 
                ? (campaign.open_count / campaign.sent_count) * 100 
                : 0;
              const clickRate = campaign.sent_count > 0 
                ? (campaign.click_count / campaign.sent_count) * 100 
                : 0;
              const responseRate = campaign.sent_count > 0 
                ? (campaign.response_count / campaign.sent_count) * 100 
                : 0;

              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'sending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Send className="w-4 h-4" />
                        Sent
                      </span>
                      <span className="font-medium">{campaign.sent_count}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Opened
                      </span>
                      <span className="font-medium">{campaign.open_count} ({openRate.toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <MousePointerClick className="w-4 h-4" />
                        Clicked
                      </span>
                      <span className="font-medium">{campaign.click_count} ({clickRate.toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        Responses
                      </span>
                      <span className="font-medium">{campaign.response_count} ({responseRate.toFixed(1)}%)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGenerateDrafts(campaign.id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Generate Drafts
                  </button>
                </motion.div>
              );
            })}
            {campaigns.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No campaigns yet. Create one to get started!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

