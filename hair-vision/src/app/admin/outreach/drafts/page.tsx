'use client';

// Automated Draft Review
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Check, 
  X, 
  Edit,
  Send,
  Clock,
} from 'lucide-react';
import type { EmailDraft } from '@/types/outreach';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDrafts();
  }, []);

  async function fetchDrafts() {
    try {
      const response = await fetch('/api/outreach/drafts');
      const data = await response.json();
      setDrafts(data.drafts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      setLoading(false);
    }
  }

  async function handleApprove(draftId: string) {
    try {
      const response = await fetch(`/api/outreach/drafts/${draftId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        fetchDrafts();
      }
    } catch (error) {
      console.error('Error approving draft:', error);
    }
  }

  async function handleReject(draftId: string) {
    try {
      const response = await fetch(`/api/outreach/drafts/${draftId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (response.ok) {
        fetchDrafts();
      }
    } catch (error) {
      console.error('Error rejecting draft:', error);
    }
  }

  async function handleBulkApprove() {
    try {
      const response = await fetch('/api/outreach/drafts/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftIds: Array.from(selectedDrafts) }),
      });

      if (response.ok) {
        setSelectedDrafts(new Set());
        fetchDrafts();
      }
    } catch (error) {
      console.error('Error bulk approving:', error);
    }
  }

  async function handleSend() {
    try {
      const draftIds = drafts
        .filter(d => d.status === 'approved')
        .map(d => d.id);

      if (draftIds.length === 0) {
        alert('No approved drafts to send');
        return;
      }

      const response = await fetch('/api/outreach/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftIds }),
      });

      if (response.ok) {
        alert(`Sent ${draftIds.length} emails!`);
        fetchDrafts();
      }
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  }

  const pendingDrafts = drafts.filter(d => d.status === 'draft');
  const approvedDrafts = drafts.filter(d => d.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Draft Review</h1>
          <p className="text-gray-600">Review and approve AI-generated email drafts</p>
        </div>

        {/* Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-3">
            <button
              onClick={handleBulkApprove}
              disabled={selectedDrafts.size === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Bulk Approve ({selectedDrafts.size})
            </button>
            <button
              onClick={handleSend}
              disabled={approvedDrafts.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Approved ({approvedDrafts.length})
            </button>
          </div>
        </div>

        {/* Drafts List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-4">
            {pendingDrafts.map((draft) => (
              <motion.div
                key={draft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{draft.subject}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Generated {new Date(draft.generated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(draft.id)}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(draft.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <div 
                    className="text-gray-700 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: draft.body }}
                  />
                </div>
              </motion.div>
            ))}
            {pendingDrafts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No pending drafts
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


