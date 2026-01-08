// 市场研究数据验证 API
import { NextResponse } from 'next/server';
import {
  validateClaim,
  validateAllClaims,
  generateValidationReport,
  MARKET_CLAIMS,
  KNOWN_SOURCES,
  type ValidationResult,
} from '@/lib/data-validation';

/**
 * GET - 获取所有验证结果
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const claimId = searchParams.get('claim');
  const format = searchParams.get('format') || 'json';

  try {
    let results: ValidationResult[];

    if (claimId) {
      // 验证单个声明
      const result = await validateClaim(claimId);
      results = [result];
    } else {
      // 验证所有声明
      results = await validateAllClaims();
    }

    if (format === 'markdown') {
      const report = generateValidationReport(results);
      return new NextResponse(report, {
        headers: { 'Content-Type': 'text/markdown' },
      });
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        confirmed: results.filter(r => r.status === 'confirmed').length,
        partiallyConfirmed: results.filter(r => r.status === 'partially_confirmed').length,
        needsReview: results.filter(r => r.status === 'needs_review').length,
        unconfirmed: results.filter(r => r.status === 'unconfirmed').length,
      },
      claims: Object.values(MARKET_CLAIMS),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST - 添加自定义数据源或更新验证
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, claimId, source } = body;

    if (action === 'add_source' && claimId && source) {
      // 在实际应用中，这会更新数据库
      // 这里我们只返回确认
      return NextResponse.json({
        success: true,
        message: `Source added to ${claimId}`,
        source,
      });
    }

    if (action === 'validate' && claimId) {
      const result = await validateClaim(claimId);
      return NextResponse.json({
        success: true,
        result,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action or missing parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
