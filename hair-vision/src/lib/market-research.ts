// 市场研究数据收集和验证工具
import { discoverBusinesses } from './business-discovery';

// 研究数据接口
export interface MarketResearchData {
  id: string;
  category: 'market_size' | 'customer_satisfaction' | 'competition' | 'pricing' | 'local_market';
  title: string;
  value: string | number;
  source: string;
  sourceUrl?: string;
  date: Date;
  verified: boolean;
  notes?: string;
}

// 研究数据存储（实际应用中应使用数据库）
const researchData: MarketResearchData[] = [];

/**
 * 验证 NYC 沙龙数量
 */
export async function validateNYCSalonCount(): Promise<MarketResearchData> {
  try {
    // 使用 business discovery 工具获取实际数据
    const salons = await discoverBusinesses('New York, NY', 'both', 1000);
    
    // 分析数据
    const totalSalons = salons.length;
    const premiumSalons = salons.filter(s => (s.rating || 0) >= 4.5).length;
    
    const data: MarketResearchData = {
      id: `nyc-salons-${Date.now()}`,
      category: 'local_market',
      title: 'NYC 沙龙数量统计',
      value: `${totalSalons} 总沙龙数, ${premiumSalons} 高端沙龙 (评分≥4.5)`,
      source: 'Google Places + Yelp API',
      date: new Date(),
      verified: true,
      notes: `基于实际 API 查询结果。总查询数: ${totalSalons}`,
    };
    
    researchData.push(data);
    return data;
  } catch (error) {
    console.error('Error validating NYC salon count:', error);
    throw error;
  }
}

/**
 * 添加研究数据（手动验证的数据）
 */
export function addResearchData(data: Omit<MarketResearchData, 'id' | 'date'>): MarketResearchData {
  const research: MarketResearchData = {
    ...data,
    id: `research-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date(),
  };
  
  researchData.push(research);
  return research;
}

/**
 * 获取所有研究数据
 */
export function getAllResearchData(): MarketResearchData[] {
  return researchData;
}

/**
 * 按类别获取研究数据
 */
export function getResearchDataByCategory(category: MarketResearchData['category']): MarketResearchData[] {
  return researchData.filter(d => d.category === category);
}

/**
 * 获取已验证的数据
 */
export function getVerifiedResearchData(): MarketResearchData[] {
  return researchData.filter(d => d.verified);
}

/**
 * 更新研究数据验证状态
 */
export function updateResearchVerification(id: string, verified: boolean, notes?: string): boolean {
  const index = researchData.findIndex(d => d.id === id);
  if (index === -1) return false;
  
  researchData[index].verified = verified;
  if (notes) {
    researchData[index].notes = notes;
  }
  
  return true;
}

