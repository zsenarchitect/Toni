# Credit System Documentation

## Overview

The credit system provides a flexible pricing model for the barbershop hair visualization service:
- **Base credits** included with subscription plans
- **Pay-as-you-go** for additional usage
- **Automatic model fallback** to lower-tier Gemini Flash when credits are low
- **Monthly credit reset** for base credits
- **Never blocks service** - allows overage (negative balance) for seamless customer experience
- **Pay later** - overage is tracked and billed at the end of billing cycle

## Subscription Plans

### Essential Plan - $199/month
- **Base Credits**: 200 generations/month
- **Pay-as-you-go**: $0.15 per additional credit
- **Features**: System style library, basic brand customization

### Professional Plan - $499/month
- **Base Credits**: 500 generations/month
- **Pay-as-you-go**: $0.14 per additional credit
- **Features**: Custom style library, full white-label, service recommendations

### Enterprise Plan - $999/month
- **Base Credits**: 2000 generations/month
- **Pay-as-you-go**: $0.13 per additional credit
- **Features**: Unlimited custom styles, analytics dashboard, API access

**定价策略**：
- **主要收入来源**：订阅套餐（$199-$999/月）
- **按需付费定价**：接近成本价，主要目的是鼓励用户升级到更高套餐
- 基于 Gemini 3 Pro 官方 API 成本：1K 图像约 $0.135（输出 $0.134 + 输入 $0.001）
- Essential: $0.15/credit（接近成本价，仅覆盖运营成本）
- Professional: $0.14/credit（接近成本价，鼓励升级）
- Enterprise: $0.13/credit（接近成本价，最大优惠）
- **为什么接近成本价**：让用户意识到订阅套餐更划算，从而促进订阅收入

## Credit Cost Structure

### Model-Based Credit Costs

| Model | 1K Resolution | 2K Resolution | 4K Resolution |
|-------|---------------|----------------|----------------|
| Gemini 3.0 Pro | 1.0 credit | 1.0 credit | 1.8 credits |
| Gemini 2.0 Flash | 0.5 credits | 0.5 credits | 0.9 credits |

**注意**：系统始终使用 Gemini 3.0 Pro 计算信用成本，确保服务质量一致。只有在 API 错误（不可用/配额限制）时才会降级到 Flash，这是业务安全方案。

### Model Selection Logic

1. **Consistent Quality**: Always uses Gemini 3.0 Pro - never downgrades due to credit issues
2. **Business Safety Fallback**: Only downgrades to Gemini 2.0 Flash when Pro model is unavailable or at quota limit (API errors)
3. **Never blocks**: Service always continues - if credits are insufficient, system allows overage
4. **Overage tracking**: Negative balance is tracked separately for later billing
5. **Customer experience**: Customers never see credit errors or limitations, always get consistent quality

## API Usage

### Generate Image with Credits

```typescript
POST /api/generate
{
  "photo": "data:image/jpeg;base64,...",
  "styleId": "style-123",
  "viewAngle": "front",
  "backgroundId": "studio",
  "resolution": "1K", // Optional: "1K" | "2K" | "4K"
  "salonId": "salon-abc123" // Optional: If provided, credit system is used
}
```

**Response:**
```json
{
  "success": true,
  "resultUrl": "data:image/jpeg;base64,...",
  "resolution": "1K",
  "estimatedCost": 0.0134,
  "credits": {
    "used": 1.0,
    "remaining": 199,
    "model": "gemini-3.0-pro-image-generation"
  }
}
```

**Note**: The generate API never returns credit errors to customers. Service always continues, even with negative balance. Credit information is only available through admin APIs.

### Get Credit Balance

```typescript
GET /api/credits/balance?salonId=salon-abc123
```

**Response:**
```json
{
  "success": true,
  "balance": {
    "salonId": "salon-abc123",
    "subscriptionTier": "professional",
    "baseCredits": 500,
    "usedCredits": 150,
    "purchasedCredits": 50,
    "resetDate": "2024-02-01T00:00:00.000Z"
  },
  "stats": {
    "total": 550,
    "used": 150,
    "available": 400,
    "overage": 0,
    "overageCost": 0,
    "usagePercent": 27,
    "remainingDays": 12,
    "isOverage": false
  }
}
```

### Purchase Additional Credits

```typescript
POST /api/credits/purchase
{
  "salonId": "salon-abc123",
  "credits": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully purchased 100 credits",
  "balance": {
    "salonId": "salon-abc123",
    "subscriptionTier": "professional",
    "baseCredits": 500,
    "usedCredits": 150,
    "purchasedCredits": 150,
    "resetDate": "2024-02-01T00:00:00.000Z"
  },
  "stats": {
    "total": 650,
    "used": 150,
    "available": 500,
    "usagePercent": 23
  },
  "purchase": {
    "credits": 100,
    "cost": "$8.00"
  }
}
```

### Update Subscription

```typescript
PUT /api/credits/subscription
{
  "salonId": "salon-abc123",
  "tier": "professional" // "essential" | "professional" | "enterprise"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription updated to Professional",
  "balance": {
    "salonId": "salon-abc123",
    "subscriptionTier": "professional",
    "baseCredits": 500,
    "usedCredits": 150,
    "purchasedCredits": 50,
    "resetDate": "2024-02-01T00:00:00.000Z"
  },
  "stats": {
    "total": 550,
    "used": 150,
    "available": 400,
    "usagePercent": 27
  },
  "plan": {
    "name": "Professional",
    "monthlyPrice": 499,
    "baseCredits": 500,
    "payAsYouGoPrice": 0.14
  }
}
```

### Get Usage History

```typescript
GET /api/credits/usage?salonId=salon-abc123&limit=50
```

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": "usage-1234567890-abc",
      "creditsUsed": 1.0,
      "model": "gemini-3.0-pro-image-generation",
      "resolution": "1K",
      "cost": 0.0134,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 50
}
```

## Credit Reset

- **Base credits** reset monthly on the 1st of each month
- **Purchased credits** do not reset (can be configured with expiration)
- **Overage credits** reset monthly (billed separately before reset)
- Automatic reset check happens when fetching balance

## Overage System (Pay Later)

- **Never blocks service**: Customers never see credit errors
- **Automatic overage**: System allows negative balance
- **Tracking**: Overage is tracked separately in `overageCredits` field
- **Billing**: Overage amount is calculated and can be billed at end of cycle
- **Admin visibility**: Only barbershop admin sees credit status and overage

## Model Fallback Example

### Scenario: Professional Plan with 2 credits remaining

1. **Request**: Generate 1K image
2. **Pro model requires**: 1.0 credit ✅ Available
3. **Result**: Uses Gemini 3.0 Pro, deducts 1.0 credit

### Scenario: Professional Plan with 0.3 credits remaining

1. **Request**: Generate 1K image
2. **Pro model requires**: 1.0 credit ❌ Insufficient
3. **Service continues**: Always uses Gemini 3.0 Pro (consistent quality, never downgrades for credits)
4. **Overage mode**: Service continues, tracks 0.7 credits overage
5. **Result**: Image generated successfully with Pro model, 0.7 credits overage tracked for later billing
6. **Customer**: Sees no error, always gets consistent high-quality service

### Scenario: Professional Plan with 0.6 credits remaining

1. **Request**: Generate 1K image
2. **Pro model requires**: 1.0 credit ❌ Insufficient
3. **Service continues**: Always uses Gemini 3.0 Pro (consistent quality)
4. **Result**: Uses Gemini 3.0 Pro, deducts 1.0 credit, tracks 0.4 credits overage
5. **Log**: "Overage mode - service continues with Pro model, will be billed later"

### Scenario: API Quota Limit (Business Safety)

1. **Request**: Generate 1K image
2. **Pro model call**: Returns quota/rate limit error
3. **Business safety fallback**: Automatically tries Gemini 2.0 Flash
4. **Result**: Uses Flash model, service continues without interruption
5. **Log**: "Pro model unavailable (quota limit), falling back to Flash for business continuity"

## Implementation Details

### Credit Storage

Currently uses in-memory storage (`Map`). For production, replace with:
- Supabase/PostgreSQL
- Redis (for high-performance scenarios)
- MongoDB

See `src/lib/credit-storage.ts` for the storage interface.

### Backward Compatibility

- If `salonId` is not provided in generate request, credit system is bypassed
- Uses default Gemini 3.0 Pro model
- Maintains existing behavior for non-subscription usage

### Customer Experience

- **No credit errors**: Generate API never returns credit-related errors to customers
- **Seamless service**: Service continues even with negative balance
- **Admin dashboard**: Credit information only visible to barbershop admin
- **Overage transparency**: Admin can see overage amount and cost in dashboard

### Admin Dashboard Component

A React component is available at `src/components/admin/CreditDashboard.tsx` that displays:
- Current credit balance
- Usage statistics
- Overage information (if any)
- Days until reset
- Visual progress indicators

Usage:
```tsx
import CreditDashboard from '@/components/admin/CreditDashboard';

<CreditDashboard salonId="salon-abc123" />
```

## Cost Optimization Benefits

1. **Automatic Cost Reduction**: Falls back to cheaper Flash model when credits are low
2. **Flexible Pricing**: Pay only for what you use beyond base credits
3. **Predictable Costs**: Base subscription covers typical usage
4. **Quality Preservation**: Always tries best model first

## 自动使用提醒系统

系统会自动检测过度使用并发送友好的邮件提醒：

### 提醒阈值

- **80% 使用率**: 发送友好提醒，告知使用情况
- **95% 使用率**: 发送严重警告，建议升级或购买信用
- **超支**: 任何超支都会发送通知，说明服务继续运行，超支部分将在月底结算

### 邮件频率控制

- 同一类型的提醒邮件至少间隔 24 小时
- 避免重复发送，确保用户体验友好

### API 端点

#### 检查并发送提醒

```typescript
POST /api/credits/check-alerts
{
  "salonId": "salon-abc123",
  "salonEmail": "owner@salon.com",
  "salonName": "美丽沙龙"
}
```

**响应:**
```json
{
  "success": true,
  "sent": true,
  "alertType": "warning", // "warning" | "critical" | "overage"
  "reason": null
}
```

### 邮件模板

提醒邮件包含：
- 友好的标题和问候
- 详细的使用统计表格
- 清晰的行动建议（查看详情/购买信用）
- 视觉化的进度指示
- 温馨的提示信息

### 定时任务集成

建议设置定时任务（例如每天检查一次）：

```typescript
// 示例：使用 Vercel Cron 或类似服务
import { checkAllSalonsAndSendAlerts } from '@/lib/credit-alerts';
import { getAllCreditBalances } from '@/lib/credit-storage';

// 获取所有沙龙列表（需要从数据库）
const salons = await getSalonsFromDatabase();
const salonList = salons.map(s => ({
  salonId: s.id,
  email: s.email,
  name: s.name,
}));

// 批量检查并发送提醒
const result = await checkAllSalonsAndSendAlerts(
  salonList,
  getCreditBalance
);

console.log(`Checked ${result.checked} salons, sent ${result.sent} alerts`);
```

## Future Enhancements

- [x] Credit alerts and notifications ✅
- [ ] Credit expiration policies for purchased credits
- [ ] Usage analytics and reporting
- [ ] Bulk credit purchase discounts
- [ ] Annual subscription discounts
- [ ] Credit sharing across salon locations (Enterprise)

