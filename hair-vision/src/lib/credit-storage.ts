import type { CreditBalance, CreditUsage, SubscriptionTier } from '@/types';
import { SUBSCRIPTION_PLANS, resetMonthlyCredits, shouldResetCredits } from './credits';

// 简单的内存存储 (生产环境应使用数据库)
// TODO: 替换为 Supabase/PostgreSQL 或其他持久化存储
const creditBalances = new Map<string, CreditBalance>();
const creditUsageHistory = new Map<string, CreditUsage[]>();

/**
 * 获取或创建信用余额
 */
export async function getCreditBalance(salonId: string, tier?: SubscriptionTier): Promise<CreditBalance> {
  let balance = creditBalances.get(salonId);
  
  // 如果不存在，创建新的余额记录
  if (!balance) {
    const defaultTier: SubscriptionTier = tier || 'essential';
    const plan = SUBSCRIPTION_PLANS[defaultTier];
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    
    balance = {
      salonId,
      subscriptionTier: defaultTier,
      baseCredits: plan.baseCredits,
      usedCredits: 0,
      purchasedCredits: 0,
      overageCredits: 0,
      resetDate: nextMonth,
      lastUpdated: now,
    };
    creditBalances.set(salonId, balance);
  }
  
  // 检查是否需要重置
  if (shouldResetCredits(balance)) {
    balance = resetMonthlyCredits(balance, balance.subscriptionTier);
    creditBalances.set(salonId, balance);
  }
  
  return balance;
}

/**
 * 更新信用余额
 */
export async function updateCreditBalance(balance: CreditBalance): Promise<void> {
  creditBalances.set(balance.salonId, balance);
}

/**
 * 记录信用使用
 */
export async function recordCreditUsage(usage: CreditUsage): Promise<void> {
  const history = creditUsageHistory.get(usage.salonId) || [];
  history.push(usage);
  creditUsageHistory.set(usage.salonId, history);
}

/**
 * 获取信用使用历史
 */
export async function getCreditUsageHistory(salonId: string, limit = 100): Promise<CreditUsage[]> {
  const history = creditUsageHistory.get(salonId) || [];
  return history.slice(-limit).reverse(); // 最新的在前
}

/**
 * 购买额外信用
 */
export async function purchaseCredits(
  salonId: string,
  credits: number
): Promise<CreditBalance> {
  const balance = await getCreditBalance(salonId);
  balance.purchasedCredits += credits;
  balance.lastUpdated = new Date();
  await updateCreditBalance(balance);
  return balance;
}

/**
 * 更新订阅套餐
 */
export async function updateSubscription(
  salonId: string,
  newTier: SubscriptionTier
): Promise<CreditBalance> {
  const balance = await getCreditBalance(salonId);
  const plan = SUBSCRIPTION_PLANS[newTier];
  
  // 更新套餐
  balance.subscriptionTier = newTier;
  
  // 如果当前已使用的基础信用少于新套餐的基础信用，重置
  // 否则保持当前使用量，但更新基础信用额度
  if (balance.usedCredits < plan.baseCredits) {
    balance.baseCredits = plan.baseCredits;
  } else {
    // 如果已使用超过新套餐额度，保持当前状态，但更新基础信用
    balance.baseCredits = plan.baseCredits;
  }
  
  balance.lastUpdated = new Date();
  await updateCreditBalance(balance);
  return balance;
}

