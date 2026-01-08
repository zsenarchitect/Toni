'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Users, Percent } from 'lucide-react';

interface ROICalculatorProps {
  defaultPlan?: 'essential' | 'professional' | 'enterprise';
  className?: string;
}

const PLAN_PRICES = {
  essential: 199,
  professional: 499,
  enterprise: 999,
};

export function ROICalculator({ defaultPlan = 'professional', className }: ROICalculatorProps) {
  const [plan, setPlan] = useState<'essential' | 'professional' | 'enterprise'>(defaultPlan);
  const [monthlyCustomers, setMonthlyCustomers] = useState(400);
  const [conversionRate, setConversionRate] = useState(15);
  const [averageUpgrade, setAverageUpgrade] = useState(150);

  const calculations = useMemo(() => {
    const investment = PLAN_PRICES[plan];
    const customersUpgrading = Math.round(monthlyCustomers * (conversionRate / 100));
    const extraRevenue = customersUpgrading * averageUpgrade;
    const netProfit = extraRevenue - investment;
    const roi = investment > 0 ? ((extraRevenue - investment) / investment) * 100 : 0;
    const breakEvenCustomers = Math.ceil(investment / averageUpgrade);
    const paybackPeriod = extraRevenue > 0 ? (investment / extraRevenue) * 30 : 0; // days

    return {
      investment,
      customersUpgrading,
      extraRevenue,
      netProfit,
      roi,
      breakEvenCustomers,
      paybackPeriod,
    };
  }, [plan, monthlyCustomers, conversionRate, averageUpgrade]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Plan Selection */}
      <div className="bg-gray-50 rounded-xl p-4">
        <label className="block text-sm font-semibold mb-2">选择套餐</label>
        <div className="grid grid-cols-3 gap-2">
          {(['essential', 'professional', 'enterprise'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                plan === p
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {p === 'essential' ? 'Essential' : p === 'professional' ? 'Professional' : 'Enterprise'}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          价格: ${PLAN_PRICES[plan]}/月
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            每月客户数
          </label>
          <input
            type="number"
            value={monthlyCustomers}
            onChange={(e) => setMonthlyCustomers(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full text-2xl font-bold border-none outline-none bg-transparent"
            min="0"
          />
          <div className="text-xs text-gray-500 mt-1">输入您的月客户量</div>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
            <Percent className="w-4 h-4" />
            升级转化率 (%)
          </label>
          <input
            type="number"
            value={conversionRate}
            onChange={(e) => setConversionRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
            className="w-full text-2xl font-bold border-none outline-none bg-transparent"
            min="0"
            max="100"
            step="0.1"
          />
          <div className="text-xs text-gray-500 mt-1">看到预览后升级的客户比例</div>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            平均升级金额 ($)
          </label>
          <input
            type="number"
            value={averageUpgrade}
            onChange={(e) => setAverageUpgrade(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full text-2xl font-bold border-none outline-none bg-transparent"
            min="0"
          />
          <div className="text-xs text-gray-500 mt-1">每次升级的平均额外收入</div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-2">额外月收入</div>
          <div className="text-4xl font-bold mb-2">
            ${calculations.extraRevenue.toLocaleString()}
          </div>
          <div className="text-sm opacity-80">
            {calculations.customersUpgrading} 位客户 × ${averageUpgrade}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-2">净收益</div>
          <div className="text-4xl font-bold mb-2">
            ${calculations.netProfit.toLocaleString()}
          </div>
          <div className="text-sm opacity-80">
            收入 ${calculations.extraRevenue.toLocaleString()} - 成本 ${calculations.investment}
          </div>
        </div>
      </div>

      {/* ROI and Break-even */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 text-white rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">投资</div>
          <div className="text-2xl font-bold">${calculations.investment}</div>
          <div className="text-xs text-gray-400 mt-1">/月</div>
        </div>

        <div className="bg-blue-500 text-white rounded-xl p-4">
          <div className="text-xs opacity-90 mb-1">ROI</div>
          <div className="text-2xl font-bold">
            {calculations.roi > 0 ? '+' : ''}{calculations.roi.toFixed(0)}%
          </div>
          <div className="text-xs opacity-80 mt-1">
            {calculations.roi > 0 ? '投资回报率' : '亏损'}
          </div>
        </div>

        <div className="bg-purple-500 text-white rounded-xl p-4">
          <div className="text-xs opacity-90 mb-1">回本所需客户</div>
          <div className="text-2xl font-bold">{calculations.breakEvenCustomers}</div>
          <div className="text-xs opacity-80 mt-1">位客户/月</div>
        </div>
      </div>

      {/* Payback Period */}
      {calculations.extraRevenue > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-sm text-gray-600 mb-1">回本周期</div>
          <div className="text-xl font-bold text-gray-900">
            {calculations.paybackPeriod < 1 
              ? '< 1 天' 
              : calculations.paybackPeriod < 7
              ? `${Math.ceil(calculations.paybackPeriod)} 天`
              : `${Math.ceil(calculations.paybackPeriod / 7)} 周`}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            基于当前输入，{calculations.paybackPeriod < 30 ? '不到一个月' : '约 ' + Math.ceil(calculations.paybackPeriod / 30) + ' 个月'}即可回本
          </div>
        </div>
      )}
    </div>
  );
}

