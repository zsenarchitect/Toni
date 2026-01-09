import { NextRequest, NextResponse } from 'next/server';
import { getCircuitBreakerStatus, resetCircuitBreaker } from '@/lib/gemini';

/**
 * 获取生成 API 的熔断器状态
 * GET /api/generate/status
 * 用于调试和监控 API 健康状况
 */
export async function GET() {
  const status = getCircuitBreakerStatus();
  
  return NextResponse.json({
    circuitBreaker: {
      ...status,
      status: status.isOpen ? 'OPEN (blocking requests)' : 'CLOSED (accepting requests)',
      message: status.isOpen 
        ? `Circuit breaker is open due to ${status.failureCount} failures. Will auto-reset when oldest failure expires.`
        : `Circuit breaker is closed. ${status.failureCount}/${status.threshold} failures in the current window.`,
    },
    apiKeyConfigured: !!process.env.GEMINI_API_KEY,
    resolution: process.env.GEMINI_IMAGE_RESOLUTION || '1K (default)',
    timestamp: new Date().toISOString(),
  });
}

/**
 * 重置熔断器（用于手动恢复）
 * POST /api/generate/status
 * 注意：仅供调试使用，生产环境应有适当的访问控制
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    
    if (body.action === 'reset') {
      const beforeStatus = getCircuitBreakerStatus();
      resetCircuitBreaker();
      const afterStatus = getCircuitBreakerStatus();
      
      console.log(`[Gemini API] Circuit breaker manually reset by API call`);
      
      return NextResponse.json({
        success: true,
        message: 'Circuit breaker has been reset',
        before: {
          isOpen: beforeStatus.isOpen,
          failureCount: beforeStatus.failureCount,
        },
        after: {
          isOpen: afterStatus.isOpen,
          failureCount: afterStatus.failureCount,
        },
        timestamp: new Date().toISOString(),
      });
    }
    
    return NextResponse.json({
      error: 'Invalid action. Use { "action": "reset" } to reset the circuit breaker.',
    }, { status: 400 });
    
  } catch (error) {
    console.error('[Gemini API] Error resetting circuit breaker:', error);
    return NextResponse.json({
      error: 'Failed to reset circuit breaker',
    }, { status: 500 });
  }
}
