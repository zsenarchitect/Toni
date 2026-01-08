import type { CreditBalance, SubscriptionTier } from '@/types';
import { getCreditStats, SUBSCRIPTION_PLANS, calculatePayAsYouGoCost } from './credits';
import { sendEmail } from './email';

// 邮件提醒阈值配置
const ALERT_THRESHOLDS = {
  // 使用率阈值（百分比）
  usageWarning: 80, // 80% 使用率时发送警告
  usageCritical: 95, // 95% 使用率时发送严重警告
  overageNotice: 0, // 任何超支都发送通知
  
  // 邮件发送频率控制（避免重复发送）
  minHoursBetweenEmails: 24, // 同一类型的邮件至少间隔24小时
};

// 记录已发送的邮件（生产环境应使用数据库）
// 格式: salonId -> { lastWarningEmail: Date, lastCriticalEmail: Date, lastOverageEmail: Date }
const emailHistory = new Map<string, {
  lastWarningEmail?: Date;
  lastCriticalEmail?: Date;
  lastOverageEmail?: Date;
}>();

/**
 * 检查是否应该发送邮件（基于频率控制）
 */
function shouldSendEmail(
  salonId: string,
  emailType: 'warning' | 'critical' | 'overage'
): boolean {
  const history = emailHistory.get(salonId) || {};
  const lastSent = history[`last${emailType.charAt(0).toUpperCase() + emailType.slice(1)}Email` as keyof typeof history] as Date | undefined;
  
  if (!lastSent) {
    return true; // 从未发送过，可以发送
  }
  
  const hoursSinceLastEmail = (Date.now() - lastSent.getTime()) / (1000 * 60 * 60);
  return hoursSinceLastEmail >= ALERT_THRESHOLDS.minHoursBetweenEmails;
}

/**
 * 记录邮件发送时间
 */
function recordEmailSent(salonId: string, emailType: 'warning' | 'critical' | 'overage'): void {
  const history = emailHistory.get(salonId) || {};
  const key = `last${emailType.charAt(0).toUpperCase() + emailType.slice(1)}Email` as keyof typeof history;
  history[key] = new Date();
  emailHistory.set(salonId, history);
}

/**
 * 生成友好的使用提醒邮件内容
 */
function generateUsageAlertEmail(
  salonName: string,
  stats: ReturnType<typeof getCreditStats>,
  tier: SubscriptionTier,
  alertType: 'warning' | 'critical' | 'overage'
): { subject: string; html: string } {
  const plan = SUBSCRIPTION_PLANS[tier];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://merror.app';
  const dashboardUrl = `${baseUrl}/admin/credits`;
  
  let subject: string;
  let title: string;
  let message: string;
  let ctaText: string;
  let ctaUrl: string;
  let color: string;
  
  if (alertType === 'overage') {
    subject = `💳 ${salonName} - 您的信用使用已超出套餐额度`;
    title = '您的服务使用量已超出套餐额度';
    message = `我们注意到您的信用使用已超出本月的基础额度。服务将继续正常运行，超出的部分（${stats.overage} 次，约 $${stats.overageCost.toFixed(2)}）将在本月底结算。`;
    ctaText = '查看详细使用情况';
    ctaUrl = dashboardUrl;
    color = '#F59E0B'; // 琥珀色
  } else if (alertType === 'critical') {
    subject = `⚠️ ${salonName} - 您的信用即将用完`;
    title = '您的信用使用量已达到 95%';
    message = `您本月已使用 ${stats.used} 次生成，剩余 ${stats.available} 次。建议您考虑升级套餐或购买额外信用，以确保服务不中断。`;
    ctaText = '购买额外信用';
    ctaUrl = `${dashboardUrl}?action=purchase`;
    color = '#EF4444'; // 红色
  } else {
    // warning
    subject = `📊 ${salonName} - 您的信用使用提醒`;
    title = '您的信用使用量已达到 80%';
    message = `您本月已使用 ${stats.used} 次生成，剩余 ${stats.available} 次。还有 ${stats.remainingDays} 天重置。`;
    ctaText = '查看使用详情';
    ctaUrl = dashboardUrl;
    color = '#3B82F6'; // 蓝色
  }
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, ${color}15 0%, ${color}05 100%); border-radius: 12px; padding: 30px; margin-bottom: 20px;">
    <h1 style="color: ${color}; margin-top: 0; font-size: 24px;">${title}</h1>
    <p style="font-size: 16px; color: #666; margin: 20px 0;">${message}</p>
    
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin-top: 0; color: #333; font-size: 18px;">📊 使用统计</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">套餐类型：</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right;">${plan.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">基础额度：</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right;">${stats.total} 次/月</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">已使用：</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #3B82F6;">${stats.used} 次</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">剩余：</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; color: ${stats.available > 0 ? '#10B981' : '#EF4444'};">${stats.available > 0 ? stats.available : 0} 次</td>
        </tr>
        ${stats.isOverage ? `
        <tr style="background: #FEF3C7;">
          <td style="padding: 8px 0; color: #92400E; font-weight: 600;">超支额度：</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #92400E;">${stats.overage} 次</td>
        </tr>
        <tr style="background: #FEF3C7;">
          <td style="padding: 8px 0; color: #92400E; font-weight: 600;">待支付金额：</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #92400E;">$${stats.overageCost.toFixed(2)}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; color: #666;">使用率：</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right;">${stats.usagePercent}%</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">重置日期：</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right;">还有 ${stats.remainingDays} 天</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${ctaUrl}" style="display: inline-block; background: ${color}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">${ctaText}</a>
    </div>
    
    ${alertType === 'critical' || alertType === 'overage' ? `
    <div style="background: #FEF3C7; border-left: 4px solid ${color}; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; color: #92400E; font-size: 14px;">
        <strong>💡 小贴士：</strong>${alertType === 'overage' 
          ? '服务将继续正常运行，超出的部分将在月底结算。您也可以随时购买额外信用。'
          : '升级到更高套餐可以获得更多基础信用，通常更经济实惠。'}
      </p>
    </div>
    ` : ''}
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; color: #9CA3AF; font-size: 12px;">
      <p style="margin: 5px 0;">这是自动发送的使用提醒邮件</p>
      <p style="margin: 5px 0;">如有疑问，请回复此邮件或联系我们的客服团队</p>
    </div>
  </div>
</body>
</html>
  `;
  
  return { subject, html };
}

/**
 * 检测并发送使用提醒邮件
 */
export async function checkAndSendUsageAlert(
  salonId: string,
  salonEmail: string,
  salonName: string,
  balance: CreditBalance
): Promise<{ sent: boolean; alertType?: 'warning' | 'critical' | 'overage'; reason?: string }> {
  const stats = getCreditStats(balance);
  
  // 检查超支情况（优先级最高）
  if (stats.isOverage && shouldSendEmail(salonId, 'overage')) {
    const { subject, html } = generateUsageAlertEmail(salonName, stats, balance.subscriptionTier, 'overage');
    const result = await sendEmail({
      to: salonEmail,
      subject,
      html,
    });
    
    if (result) {
      recordEmailSent(salonId, 'overage');
      console.log(`[Credit Alert] Sent overage alert to ${salonName} (${salonEmail})`);
      return { sent: true, alertType: 'overage' };
    }
    return { sent: false, reason: 'Failed to send email' };
  }
  
  // 检查严重警告（95%使用率）
  if (stats.usagePercent >= ALERT_THRESHOLDS.usageCritical && shouldSendEmail(salonId, 'critical')) {
    const { subject, html } = generateUsageAlertEmail(salonName, stats, balance.subscriptionTier, 'critical');
    const result = await sendEmail({
      to: salonEmail,
      subject,
      html,
    });
    
    if (result) {
      recordEmailSent(salonId, 'critical');
      console.log(`[Credit Alert] Sent critical alert to ${salonName} (${salonEmail})`);
      return { sent: true, alertType: 'critical' };
    }
    return { sent: false, reason: 'Failed to send email' };
  }
  
  // 检查警告（80%使用率）
  if (stats.usagePercent >= ALERT_THRESHOLDS.usageWarning && shouldSendEmail(salonId, 'warning')) {
    const { subject, html } = generateUsageAlertEmail(salonName, stats, balance.subscriptionTier, 'warning');
    const result = await sendEmail({
      to: salonEmail,
      subject,
      html,
    });
    
    if (result) {
      recordEmailSent(salonId, 'warning');
      console.log(`[Credit Alert] Sent warning alert to ${salonName} (${salonEmail})`);
      return { sent: true, alertType: 'warning' };
    }
    return { sent: false, reason: 'Failed to send email' };
  }
  
  return { sent: false, reason: 'No alert needed or too soon since last email' };
}

/**
 * 批量检查所有沙龙的信用使用情况并发送提醒
 * 这个函数应该由定时任务调用（例如 cron job）
 * 
 * @param salonList 沙龙列表，包含 salonId, email, name
 * @param getCreditBalance 获取信用余额的函数
 */
export async function checkAllSalonsAndSendAlerts(
  salonList: Array<{ salonId: string; email: string; name: string }>,
  getCreditBalance: (salonId: string) => Promise<CreditBalance>
): Promise<{ checked: number; sent: number; errors: number }> {
  let sent = 0;
  let errors = 0;
  
  for (const salon of salonList) {
    try {
      const balance = await getCreditBalance(salon.salonId);
      const result = await checkAndSendUsageAlert(salon.salonId, salon.email, salon.name, balance);
      if (result.sent) {
        sent++;
        console.log(`[Credit Alert] Sent ${result.alertType} alert to ${salon.name}`);
      } else if (result.reason?.includes('Failed')) {
        errors++;
        console.error(`[Credit Alert] Failed to send alert to ${salon.name}: ${result.reason}`);
      }
    } catch (error) {
      console.error(`[Credit Alert] Error checking salon ${salon.salonId}:`, error);
      errors++;
    }
  }
  
  return { checked: salonList.length, sent, errors };
}

