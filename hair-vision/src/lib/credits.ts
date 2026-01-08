import type { SubscriptionTier, CreditBalance, CreditUsage, SubscriptionPlan, ImageResolution, GeminiModel } from '@/types';

// 订阅套餐配置
export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  essential: {
    tier: 'essential',
    name: 'Essential',
    monthlyPrice: 199,
    baseCredits: 200, // 200 generations/month
    payAsYouGoPrice: 0.10, // $0.10 per additional credit
    features: ['System style library', 'Basic brand customization', '200 generations/month'],
  },
  professional: {
    tier: 'professional',
    name: 'Professional',
    monthlyPrice: 499,
    baseCredits: 500, // 500 generations/month
    payAsYouGoPrice: 0.08, // $0.08 per additional credit (discount for higher tier)
    features: ['Custom style library', 'Full white-label', 'Service recommendations', '500 generations/month'],
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 999,
    baseCredits: 2000, // 2000 generations/month
    payAsYouGoPrice: 0.06, // $0.06 per additional credit (best rate)
    features: ['Unlimited custom styles', 'Analytics dashboard', 'API access', '2000 generations/month'],
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
 * 选择模型 (优先使用Pro，信用不足时降级到Flash)
 * 永远不抛出错误 - 允许超支，服务不中断
 */
export function selectModel(
  balance: CreditBalance,
  resolution: ImageResolution
): { model: GeminiModel; creditsRequired: number; isOverage: boolean } {
  const proModel: GeminiModel = 'gemini-3.0-pro-image-generation';
  const flashModel: GeminiModel = 'gemini-2.0-flash-preview-image-generation';
  
  const proCredits = calculateCreditsRequired(proModel, resolution);
  const flashCredits = calculateCreditsRequired(flashModel, resolution);
  
  const available = getAvailableCredits(balance);
  
  // 如果有足够信用使用Pro模型，优先使用
  if (available >= proCredits) {
    return { model: proModel, creditsRequired: proCredits, isOverage: false };
  }
  
  // 如果Pro不够但Flash够，降级到Flash
  if (available >= flashCredits) {
    console.log(`[Credits] Insufficient credits for Pro model, falling back to Flash. Available: ${available}, Required: ${proCredits}`);
    return { model: flashModel, creditsRequired: flashCredits, isOverage: false };
  }
  
  // 即使信用不足，也允许继续服务（超支模式）
  // 优先尝试Flash（更便宜），如果连Flash都不够，仍然使用Flash但标记为超支
  const isOverage = available < flashCredits;
  if (isOverage) {
    console.log(`[Credits] Overage mode: Available: ${available}, Required (Flash): ${flashCredits}. Service continues, will be billed later.`);
  }
  return { model: flashModel, creditsRequired: flashCredits, isOverage };
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

