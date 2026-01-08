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
- **Pay-as-you-go**: $0.10 per additional credit
- **Features**: System style library, basic brand customization

### Professional Plan - $499/month
- **Base Credits**: 500 generations/month
- **Pay-as-you-go**: $0.08 per additional credit
- **Features**: Custom style library, full white-label, service recommendations

### Enterprise Plan - $999/month
- **Base Credits**: 2000 generations/month
- **Pay-as-you-go**: $0.06 per additional credit
- **Features**: Unlimited custom styles, analytics dashboard, API access

## Credit Cost Structure

### Model-Based Credit Costs

| Model | 1K Resolution | 2K Resolution | 4K Resolution |
|-------|---------------|----------------|----------------|
| Gemini 3.0 Pro | 1.0 credit | 1.0 credit | 1.8 credits |
| Gemini 2.0 Flash | 0.5 credits | 0.5 credits | 0.9 credits |

### Model Selection Logic

1. **Priority**: Always tries to use Gemini 3.0 Pro first (best quality)
2. **Fallback**: If insufficient credits for Pro, automatically falls back to Gemini 2.0 Flash
3. **Never blocks**: Service always continues - if credits are insufficient, system allows overage
4. **Overage tracking**: Negative balance is tracked separately for later billing
5. **Customer experience**: Customers never see credit errors or limitations

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
    "payAsYouGoPrice": 0.08
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
3. **Fallback check**: Flash model requires 0.5 credits ❌ Still insufficient
4. **Overage mode**: Service continues, uses Flash model
5. **Result**: Image generated successfully, 0.2 credits overage tracked for later billing
6. **Customer**: Sees no error, service works normally

### Scenario: Professional Plan with 0.6 credits remaining

1. **Request**: Generate 1K image
2. **Pro model requires**: 1.0 credit ❌ Insufficient
3. **Fallback check**: Flash model requires 0.5 credits ✅ Available
4. **Result**: Uses Gemini 2.0 Flash, deducts 0.5 credits
5. **Log**: "Insufficient credits for Pro model, falling back to Flash"

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

## Future Enhancements

- [ ] Credit expiration policies for purchased credits
- [ ] Usage analytics and reporting
- [ ] Credit alerts and notifications
- [ ] Bulk credit purchase discounts
- [ ] Annual subscription discounts
- [ ] Credit sharing across salon locations (Enterprise)

