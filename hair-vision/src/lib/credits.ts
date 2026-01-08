import type { SubscriptionTier, CreditBalance, CreditUsage, SubscriptionPlan, ImageResolution, GeminiModel } from '@/types';

// 订阅套餐配置 (2026-01更新，基于市场验证)
// 定价策略：参照竞品定价 (Boulevard $175-$325, Zenoti $300-$500)
// 基于 Gemini 3 Pro 官方 API 成本：
// - 1K/2K 图像：~$0.134 per image (1,120 tokens × $120/1M tokens)
// - 4K 图像：~$0.24 per image (2,000 tokens × $120/1M tokens)
// - 输入成本：~$0.001 per request (100-200 tokens × $2/1M tokens)
// 总成本约 $0.135 per 1K image
// 
// 市场验证结果：原定价偏高50-200%，已调整至市场合理范围
// 参考来源：Square Appointments ($69), Vagaro ($25-85), Boulevard ($175-325)
export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  essential: {
    tier: 'essential',
    name: 'Essential',
    monthlyPrice: 149, // 从$199降至$149，对标中端沙龙软件
    baseCredits: 300, // 从200增至300次/月，提高性价比
    payAsYouGoPrice: 0.15, // $0.15 per additional credit (接近成本价 $0.135，仅覆盖运营成本)
    features: ['System style library', 'Basic brand customization', '300 generations/month'],
  },
  professional: {
    tier: 'professional',
    name: 'Professional',
    monthlyPrice: 299, // 从$499降至$299，对标Boulevard定价
    baseCredits: 800, // 从500增至800次/月
    payAsYouGoPrice: 0.14, // $0.14 per additional credit (接近成本价，鼓励升级)
    features: ['Custom style library', 'Full white-label', 'Service recommendations', '800 generations/month'],
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 599, // 从$999降至$599，对标高端沙龙软件
    baseCredits: 2500, // 从2000增至2500次/月
    payAsYouGoPrice: 0.13, // $0.13 per additional credit (接近成本价，最大优惠)
    features: ['Unlimited custom styles', 'Analytics dashboard', 'API access', '2500 generations/month'],
  },
};

// 信用成本映射 (不同模型和分辨率的成本)
const CREDIT_COST_MAP: Record<GeminiModel, Record<ImageResolution, number>> = {
  'gemini-3.0-pro-image-generation': {
    '1K': 1.0, // 1 credit = 1 generation at 1K
    '2K': 1.0,
    '4K': 1.8, // 4K costs more credits
  },
  'gemini-2.0-flash-preview-image-generation': {
    '1K': 0.5, // Flash model costs half credits
    '2K': 0.5,
    '4K': 0.9,
  },
};

/**
 * 计算生成所需的信用数
 */
export function calculateCreditsRequired(
  model: GeminiModel,
  resolution: ImageResolution
): number {
  return CREDIT_COST_MAP[model]?.[resolution] || 1.0;
}

/**
 * 获取可用信用数（允许负数，表示超支）
 */
export function getAvailableCredits(balance: CreditBalance): number {
  const totalCredits = balance.baseCredits + balance.purchasedCredits;
  return totalCredits - balance.usedCredits;
}

/**
 * 获取实际可用信用数（负数返回0，用于显示）
 */
export function getDisplayAvailableCredits(balance: CreditBalance): number {
  return Math.max(0, getAvailableCredits(balance));
}

/**
 * 获取超支信用数（负数余额）
 */
export function getOverageCredits(balance: CreditBalance): number {
  const available = getAvailableCredits(balance);
  return available < 0 ? Math.abs(available) : 0;
}

/**
 * 检查是否有足够的信用
 */
export function hasEnoughCredits(
  balance: CreditBalance,
  model: GeminiModel,
  resolution: ImageResolution
): boolean {
  const required = calculateCreditsRequired(model, resolution);
  const available = getAvailableCredits(balance);
  return available >= required;
}

/**
 * 计算信用需求（始终使用 Pro 模型）
 * 注意：我们永远不因为信用问题而降级模型，确保服务质量一致
 * 只有在 API 错误（不可用/配额限制）时才降级，这是业务安全方案
 */
export function calculateCreditsRequiredForRequest(
  resolution: ImageResolution
): number {
  const proModel: GeminiModel = 'gemini-3.0-pro-image-generation';
  return calculateCreditsRequired(proModel, resolution);
}

/**
 * 使用信用（允许超支）
 */
export function useCredits(
  balance: CreditBalance,
  creditsRequired: number
): CreditBalance {
  const newUsedCredits = balance.usedCredits + creditsRequired;
  const totalCredits = balance.baseCredits + balance.purchasedCredits;
  const overage = Math.max(0, newUsedCredits - totalCredits);
  
  return {
    ...balance,
    usedCredits: newUsedCredits,
    overageCredits: overage,
    lastUpdated: new Date(),
  };
}

/**
 * 计算额外购买信用的成本
 */
export function calculatePayAsYouGoCost(
  tier: SubscriptionTier,
  credits: number
): number {
  const plan = SUBSCRIPTION_PLANS[tier];
  return credits * plan.payAsYouGoPrice;
}

/**
 * 检查是否需要重置信用 (每月重置)
 */
export function shouldResetCredits(balance: CreditBalance): boolean {
  const now = new Date();
  const resetDate = new Date(balance.resetDate);
  
  // 如果当前日期已经超过重置日期，需要重置
  return now >= resetDate;
}

/**
 * 重置信用 (每月重置基础信用)
 */
export function resetMonthlyCredits(balance: CreditBalance, tier: SubscriptionTier): CreditBalance {
  const plan = SUBSCRIPTION_PLANS[tier];
  const now = new Date();
  
  // 计算下个月的重置日期
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1); // 每月1号重置
  
  return {
    ...balance,
    baseCredits: plan.baseCredits,
    usedCredits: 0, // 重置使用量
    purchasedCredits: 0, // 购买的信用不重置，但可以设置过期策略
    resetDate: nextMonth,
    lastUpdated: now,
  };
}

/**
 * 获取信用使用统计
 */
export function getCreditStats(balance: CreditBalance) {
  const available = getAvailableCredits(balance);
  const displayAvailable = getDisplayAvailableCredits(balance);
  const overage = getOverageCredits(balance);
  const total = balance.baseCredits + balance.purchasedCredits;
  const used = balance.usedCredits;
  const usagePercent = total > 0 ? (used / total) * 100 : 0;
  const overageCost = overage > 0 ? calculatePayAsYouGoCost(balance.subscriptionTier, overage) : 0;
  
  return {
    total,
    used,
    available, // 可能为负数（超支）
    displayAvailable, // 显示用（负数显示为0）
    overage, // 超支信用数
    overageCost, // 超支成本（待支付）
    usagePercent: Math.round(usagePercent),
    remainingDays: Math.ceil(
      (balance.resetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    ),
    isOverage: available < 0, // 是否超支
  };
}

