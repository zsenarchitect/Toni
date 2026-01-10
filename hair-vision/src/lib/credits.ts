import type { SubscriptionTier, CreditBalance, CreditUsage, SubscriptionPlan, ImageResolution, GeminiModel } from '@/types';

// ============================================
// 订阅套餐配置 (2025-01 更新)
// ============================================
// 
// 📄 官方定价文档:
//    https://ai.google.dev/pricing
// 
// 📄 Gemini API 模型文档:
//    https://ai.google.dev/gemini-api/docs/models
// 
// ============================================
// 定价策略
// ============================================
// - 竞品价格的50% + 免费试用，快速获取市场份额
// - 竞品参考：Boulevard $175-$325, Zenoti $300-$500
// - 我们的定价 = 竞品50%，降低客户决策门槛
//
// ============================================
// Gemini 2.0 Flash API 成本 (最新模型)
// ============================================
// 官方定价页面: https://ai.google.dev/pricing
// 
// - 1K/2K 图像：~$0.039 per image (~3.9 cents)
// - 4K 图像：~$0.078 per image (~7.8 cents, estimated)
// 
// 输入 tokens: $0.10 / 1M tokens (≤128K context)
// 输出 tokens: $0.40 / 1M tokens
// 
// ============================================
// 免费试用策略
// ============================================
// 1个月免费，让沙龙零风险体验产品价值
export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  essential: {
    tier: 'essential',
    name: 'Essential',
    monthlyPrice: 79, // 50% of Boulevard entry ($175) ≈ $87 → $79
    baseCredits: 300, // 300次/月
    payAsYouGoPrice: 0.15, // $0.15 per additional credit
    features: ['System style library', 'Basic brand customization', '300 generations/month', '1 month free trial'],
    freeTrialDays: 30, // 1个月免费试用
  },
  professional: {
    tier: 'professional',
    name: 'Professional',
    monthlyPrice: 149, // 50% of Boulevard mid ($300) = $150 → $149
    baseCredits: 800, // 800次/月
    payAsYouGoPrice: 0.14, // $0.14 per additional credit
    features: ['Custom style library', 'Full white-label', 'Service recommendations', '800 generations/month', '1 month free trial'],
    freeTrialDays: 30, // 1个月免费试用
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 249, // 50% of Zenoti ($500) = $250 → $249
    baseCredits: 2500, // 2500次/月
    payAsYouGoPrice: 0.13, // $0.13 per additional credit
    features: ['Unlimited custom styles', 'Analytics dashboard', 'API access', '2500 generations/month', '1 month free trial'],
    freeTrialDays: 30, // 1个月免费试用
  },
};

// 信用成本映射 (不同模型和分辨率的成本)
// 官方模型文档: https://ai.google.dev/gemini-api/docs/models
const CREDIT_COST_MAP: Record<GeminiModel, Record<ImageResolution, number>> = {
  // Gemini 2.0 Flash - 最新推荐模型 (2025年1月)
  'gemini-2.0-flash-exp': {
    '1K': 1.0, // 1 credit = 1 generation at 1K
    '2K': 1.0,
    '4K': 2.0, // 4K costs more credits
  },
  'gemini-2.0-flash-exp-image-generation': {
    '1K': 1.0, // 专用图像生成版本
    '2K': 1.0,
    '4K': 2.0,
  },
  // 旧版模型 (向后兼容)
  'gemini-1.5-pro': {
    '1K': 1.0,
    '2K': 1.0,
    '4K': 1.8,
  },
  'gemini-1.5-flash': {
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
 * 计算信用需求（始终使用最新推荐模型 Gemini 2.0 Flash）
 * 官方文档: https://ai.google.dev/gemini-api/docs/models
 * 
 * 注意：我们永远不因为信用问题而降级模型，确保服务质量一致
 * 只有在 API 错误（不可用/配额限制）时才降级，这是业务安全方案
 */
export function calculateCreditsRequiredForRequest(
  resolution: ImageResolution
): number {
  // 使用 Gemini 2.0 Flash 作为默认模型
  const defaultModel: GeminiModel = 'gemini-2.0-flash-exp';
  return calculateCreditsRequired(defaultModel, resolution);
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

