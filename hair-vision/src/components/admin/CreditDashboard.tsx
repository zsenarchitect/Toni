'use client';

import { useEffect, useState } from 'react';
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CreditStats {
  total: number;
  used: number;
  available: number;
  overage: number;
  overageCost: number;
  usagePercent: number;
  remainingDays: number;
  isOverage: boolean;
}

interface CreditBalance {
  salonId: string;
  subscriptionTier: string;
  baseCredits: number;
  usedCredits: number;
  purchasedCredits: number;
  overageCredits: number;
  resetDate: string;
}

interface CreditDashboardProps {
  salonId: string;
}

export default function CreditDashboard({ salonId }: CreditDashboardProps) {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [stats, setStats] = useState<CreditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBalance();
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [salonId]);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`/api/credits/balance?salonId=${salonId}`);
      const data = await response.json();
      
      if (data.success) {
        setBalance(data.balance);
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to fetch credit balance');
      }
    } catch (err) {
      setError('Failed to fetch credit balance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !balance || !stats) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600">{error || 'Failed to load credit information'}</p>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Credit Management
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(balance.subscriptionTier)}`}>
          {balance.subscriptionTier.charAt(0).toUpperCase() + balance.subscriptionTier.slice(1)}
        </span>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Credits */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Available Credits</h3>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.available}</p>
          <p className="text-xs text-gray-500 mt-1">of {stats.total} total</p>
        </div>

        {/* Usage */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Usage</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.used}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.usagePercent}% used</p>
        </div>

        {/* Overage (if any) */}
        {stats.isOverage ? (
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Overage (Pay Later)</h3>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.overage}</p>
            <p className="text-xs text-gray-500 mt-1">${stats.overageCost.toFixed(2)} to be billed</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Days Until Reset</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.remainingDays}</p>
            <p className="text-xs text-gray-500 mt-1">Credits reset on {new Date(balance.resetDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Credit Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Base Credits (Plan)</span>
            <span className="font-medium">{balance.baseCredits}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Purchased Credits</span>
            <span className="font-medium">{balance.purchasedCredits}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Used Credits</span>
            <span className="font-medium text-blue-600">{balance.usedCredits}</span>
          </div>
          {stats.isOverage && (
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-red-600 font-medium">Overage Credits</span>
              <span className="font-bold text-red-600">{stats.overage}</span>
            </div>
          )}
          {stats.isOverage && (
            <div className="flex justify-between items-center">
              <span className="text-red-600">Amount to Pay</span>
              <span className="font-bold text-red-600">${stats.overageCost.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Overage Notice */}
      {stats.isOverage && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Service Continues - Overage Mode</h4>
              <p className="text-sm text-amber-700">
                Your salon has exceeded the base credit limit. Service continues uninterrupted. 
                The overage amount (${stats.overageCost.toFixed(2)}) will be billed at the end of the billing cycle.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Usage Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Monthly Usage</span>
          <span className="text-sm text-gray-500">{stats.usagePercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              stats.isOverage ? 'bg-red-500' : stats.usagePercent > 80 ? 'bg-amber-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(stats.usagePercent, 100)}%` }}
          ></div>
        </div>
        {stats.isOverage && (
          <p className="text-xs text-red-600 mt-2">
            Usage exceeds available credits. Overage: {stats.overage} credits
          </p>
        )}
      </div>
    </div>
  );
}


