'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ExternalLink, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MarketResearchData {
  id: string;
  category: 'market_size' | 'customer_satisfaction' | 'competition' | 'pricing' | 'local_market';
  title: string;
  value: string | number;
  source: string;
  sourceUrl?: string;
  date: string;
  verified: boolean;
  notes?: string;
}

export default function ResearchPage() {
  const [data, setData] = useState<MarketResearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/research/data');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching research data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateNYC = async () => {
    setValidating(true);
    try {
      const response = await fetch('/api/research/validate-nyc');
      const result = await response.json();
      if (result.success) {
        await fetchData(); // 刷新数据
      }
    } catch (error) {
      console.error('Error validating NYC:', error);
    } finally {
      setValidating(false);
    }
  };

  const handleToggleVerification = async (id: string, verified: boolean) => {
    try {
      const response = await fetch('/api/research/data', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, verified: !verified }),
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const categoryLabels: Record<string, string> = {
    market_size: '市场规模',
    customer_satisfaction: '客户满意度',
    competition: '竞争分析',
    pricing: '定价',
    local_market: '本地市场',
  };

  if (loading) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">市场研究数据管理</h1>
        <div className="flex gap-4">
          <Button
            onClick={handleValidateNYC}
            disabled={validating}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${validating ? 'animate-spin' : ''}`} />
            验证 NYC 沙龙数量
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            添加研究数据
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>暂无研究数据</p>
            <p className="text-sm mt-2">点击"验证 NYC 沙龙数量"开始收集数据</p>
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {categoryLabels[item.category] || item.category}
                    </span>
                    {item.verified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-700 mb-2">{item.value}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>来源: {item.source}</span>
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        查看来源
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <span>日期: {new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  {item.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">{item.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleToggleVerification(item.id, item.verified)}
                  className={`p-2 rounded ${
                    item.verified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.verified ? '已验证' : '标记为已验证'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

