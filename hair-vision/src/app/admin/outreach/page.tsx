'use client';

// Automated Campaign Manager Dashboard
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Users, 
  Send, 
  Eye, 
  MousePointerClick, 
  MessageSquare,
  Calendar,
  TrendingUp,
  Zap,
  Building2,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

interface CampaignStats {
  total_campaigns: number;
  total_contacts: number;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  total_responses: number;
  total_interviews: number;
  open_rate: number;
  click_rate: number;
  response_rate: number;
}

export default function OutreachDashboard() {
  const [stats, setStats] = useState<CampaignStats>({
    total_campaigns: 0,
    total_contacts: 0,
    total_sent: 0,
    total_opened: 0,
    total_clicked: 0,
    total_responses: 0,
    total_interviews: 0,
    open_rate: 0,
    click_rate: 0,
    response_rate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    try {
      const [campaignsRes, contactsRes, eventsRes, responsesRes, interviewsRes] = await Promise.all([
        fetch('/api/campaigns'),
        fetch('/api/contacts'),
        fetch('/api/outreach/events'),
        fetch('/api/outreach/responses'),
        fetch('/api/interviews'),
      ]);

      const campaigns = await campaignsRes.json();
      const contacts = await contactsRes.json();
      const events = await eventsRes.json();
      const responses = await responsesRes.json();
      const interviews = await interviewsRes.json();

      const sent = events.events?.filter((e: any) => e.event_type === 'sent').length || 0;
      const opened = events.events?.filter((e: any) => e.event_type === 'opened').length || 0;
      const clicked = events.events?.filter((e: any) => e.event_type === 'clicked').length || 0;

      setStats({
        total_campaigns: campaigns.campaigns?.length || 0,
        total_contacts: contacts.contacts?.length || 0,
        total_sent: sent,
        total_opened: opened,
        total_clicked: clicked,
        total_responses: responses.responses?.length || 0,
        total_interviews: interviews.interviews?.length || 0,
        open_rate: sent > 0 ? (opened / sent) * 100 : 0,
        click_rate: sent > 0 ? (clicked / sent) * 100 : 0,
        response_rate: sent > 0 ? ((responses.responses?.length || 0) / sent) * 100 : 0,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  }

  const statCards = [
    { icon: Mail, label: 'Campaigns', value: stats.total_campaigns, color: 'blue' },
    { icon: Users, label: 'Contacts', value: stats.total_contacts, color: 'green' },
    { icon: Send, label: 'Emails Sent', value: stats.total_sent, color: 'purple' },
    { icon: Eye, label: 'Opened', value: stats.total_opened, color: 'orange' },
    { icon: MousePointerClick, label: 'Clicked', value: stats.total_clicked, color: 'pink' },
    { icon: MessageSquare, label: 'Responses', value: stats.total_responses, color: 'indigo' },
    { icon: Calendar, label: 'Interviews', value: stats.total_interviews, color: 'red' },
  ];

  const rateCards = [
    { label: 'Open Rate', value: `${stats.open_rate.toFixed(1)}%`, icon: TrendingUp },
    { label: 'Click Rate', value: `${stats.click_rate.toFixed(1)}%`, icon: TrendingUp },
    { label: 'Response Rate', value: `${stats.response_rate.toFixed(1)}%`, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Outreach Dashboard
          </h1>
          <p className="text-gray-600">
            Automated email outreach and interview scheduling system
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* NYC 高端理发店 - 新增入口 */}
          <Link href="/admin/outreach/nyc-barbershops">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg shadow-sm border-2 border-amber-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">NYC 高端理发店</h3>
                  <p className="text-sm text-gray-600">研究数据与客户池</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/outreach/contacts">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Contacts</h3>
                  <p className="text-sm text-gray-600">View and edit contacts</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/outreach/drafts">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Review Drafts</h3>
                  <p className="text-sm text-gray-600">Approve email drafts</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/outreach/campaigns">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Campaigns</h3>
                  <p className="text-sm text-gray-600">Create and manage campaigns</p>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-5 h-5 text-${card.color}-600`} />
                      <span className="text-sm text-gray-600">{card.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Rate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rateCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{card.label}</span>
                      <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{card.value}</div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

