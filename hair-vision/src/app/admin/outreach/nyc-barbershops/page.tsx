'use client';

// NYC 高端理发店客户池管理页面
import { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star,
  Upload,
  RefreshCw,
  Filter,
  CheckCircle,
  XCircle,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NYCBarbershopData {
  business_name: string;
  business_type: 'barbershop' | 'salon';
  neighborhood: string;
  address: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  rating: number | null;
  price_range: string;
  services: string[];
  specialties: string[];
  clientele: string;
  notes: string;
  tags: string[];
}

interface ResearchStats {
  total: number;
  byBorough: {
    manhattan: number;
    brooklyn: number;
  };
  byPriceRange: {
    '$$': number;
    '$$$': number;
    '$$$$': number;
  };
  avgRating: number;
  withEmail: number;
  withPhone: number;
  withWebsite: number;
}

export default function NYCBarbershopsPage() {
  const [barbershops, setBarbershops] = useState<NYCBarbershopData[]>([]);
  const [stats, setStats] = useState<ResearchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    stats?: {
      total: number;
      skipped: number;
      inserted: number;
    };
  } | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>(['$$$', '$$$$']);
  const [minRating, setMinRating] = useState(4.0);

  useEffect(() => {
    fetchPreview();
  }, [selectedPriceRange, minRating]);

  async function fetchPreview() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        priceRange: selectedPriceRange.join(','),
        minRating: minRating.toString(),
      });

      const response = await fetch(`/api/contacts/seed?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setBarbershops(data.preview || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedContacts(overwrite: boolean = false) {
    if (!confirm(overwrite 
      ? '确定要覆盖现有数据吗？这将删除所有现有联系人！' 
      : '确定要导入这些联系人到客户池吗？')) {
      return;
    }

    setSeeding(true);
    setSeedResult(null);

    try {
      const response = await fetch('/api/contacts/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceRange: selectedPriceRange,
          minRating,
          overwrite,
        }),
      });

      const data = await response.json();
      setSeedResult(data);

      if (data.success) {
        // 刷新数据
        await fetchPreview();
      }
    } catch (error) {
      console.error('Error seeding contacts:', error);
      setSeedResult({ error: '导入失败' });
    } finally {
      setSeeding(false);
    }
  }

  const togglePriceRange = (range: string) => {
    setSelectedPriceRange(prev => 
      prev.includes(range) 
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            NYC 高端理发店客户池
          </h1>
          <p className="text-gray-600">
            管理和导入经过研究筛选的纽约市高端理发店联系人数据
          </p>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">总数量</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">曼哈顿</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.byBorough.manhattan}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">布鲁克林</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.byBorough.brooklyn}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">平均评分</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">有邮箱</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.withEmail}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm">有电话</span>
              </div>
              <p className="text-2xl font-bold text-indigo-600">{stats.withPhone}</p>
            </div>
          </div>
        )}

        {/* 筛选和操作 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* 价格范围筛选 */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">价格范围:</span>
              {['$$', '$$$', '$$$$'].map(range => (
                <button
                  key={range}
                  onClick={() => togglePriceRange(range)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedPriceRange.includes(range)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* 最低评分 */}
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">最低评分:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="0">全部</option>
                <option value="4.0">4.0+</option>
                <option value="4.5">4.5+</option>
                <option value="4.7">4.7+</option>
              </select>
            </div>

            <div className="flex-1" />

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <Button
                onClick={() => fetchPreview()}
                variant="outline"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                刷新预览
              </Button>
              <Button
                onClick={() => handleSeedContacts(false)}
                disabled={seeding || loading}
              >
                <Upload className={`w-4 h-4 mr-2 ${seeding ? 'animate-spin' : ''}`} />
                导入到客户池
              </Button>
            </div>
          </div>
        </div>

        {/* 导入结果 */}
        {seedResult && (
          <div className={`p-4 rounded-lg mb-6 ${
            seedResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {seedResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                seedResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {seedResult.success ? seedResult.message : '导入失败'}
              </span>
            </div>
            {seedResult.stats && (
              <div className="text-sm text-gray-600 mt-2">
                <span>总计: {seedResult.stats.total} | </span>
                <span>已存在: {seedResult.stats.skipped} | </span>
                <span>新增: {seedResult.stats.inserted}</span>
              </div>
            )}
            {seedResult.error && (
              <p className="text-sm text-red-600 mt-1">{seedResult.error}</p>
            )}
          </div>
        )}

        {/* 数据预览 */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">加载中...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {barbershops.map((shop, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                {/* 标题和评分 */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{shop.business_name}</h3>
                    <p className="text-sm text-gray-500">{shop.neighborhood}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {shop.rating && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                        <Star className="w-3 h-3 fill-current" />
                        {shop.rating}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      shop.price_range === '$$$$' ? 'bg-purple-50 text-purple-700' :
                      shop.price_range === '$$$' ? 'bg-blue-50 text-blue-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {shop.price_range}
                    </span>
                  </div>
                </div>

                {/* 联系信息 */}
                <div className="space-y-2 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{shop.address}</span>
                  </div>
                  {shop.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{shop.phone}</span>
                    </div>
                  )}
                  {shop.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{shop.email}</span>
                    </div>
                  )}
                  {shop.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <a 
                        href={shop.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="truncate text-blue-600 hover:underline"
                      >
                        {shop.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>

                {/* 客户群 */}
                <p className="text-sm text-gray-500 mb-3">
                  <Users className="w-3 h-3 inline mr-1" />
                  {shop.clientele}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1">
                  {shop.tags.slice(0, 4).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {shop.tags.length > 4 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      +{shop.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 显示更多提示 */}
        {stats && barbershops.length < stats.total && (
          <div className="text-center mt-8 py-4 border-t border-gray-200">
            <p className="text-gray-500">
              显示 {barbershops.length} / {stats.total} 条数据
              <span className="ml-2">• 导入后可在联系人管理页面查看完整列表</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
