'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Users, ArrowUp } from 'lucide-react';

interface RevenueCalculatorProps {
  className?: string;
}

export function RevenueCalculator({ className }: RevenueCalculatorProps) {
  const [currentMonthlyRevenue, setCurrentMonthlyRevenue] = useState(50000);
  const [currentCustomers, setCurrentCustomers] = useState(400);
  // 高端沙龙平均票据 $150-$350 (来源: Professional Beauty Association)
  const [averageServicePrice, setAverageServicePrice] = useState(165);
  const [conversionRate, setConversionRate] = useState(15);
  const [averageUpgrade, setAverageUpgrade] = useState(150);

  const calculations = useMemo(() => {
    const customersUpgrading = Math.round(currentCustomers * (conversionRate / 100));
    const extraRevenue = customersUpgrading * averageUpgrade;
    const newMonthlyRevenue = currentMonthlyRevenue + extraRevenue;
    const revenueIncrease = (extraRevenue / currentMonthlyRevenue) * 100;
    const annualExtra = extraRevenue * 12;
    const annualNew = newMonthlyRevenue * 12;

    return {
      customersUpgrading,
      extraRevenue,
      newMonthlyRevenue,
      revenueIncrease,
      annualExtra,
      annualNew,
    };
  }, [currentMonthlyRevenue, currentCustomers, conversionRate, averageUpgrade]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Situation */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-bold mb-4">当前情况</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              当前月收入 ($)
            </label>
            <input
              type="number"
              value={currentMonthlyRevenue}
              onChange={(e) => setCurrentMonthlyRevenue(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-2xl font-bold border-none outline-none bg-transparent"
              min="0"
            />
          </div>
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              每月客户数
            </label>
            <input
              type="number"
              value={currentCustomers}
              onChange={(e) => setCurrentCustomers(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-2xl font-bold border-none outline-none bg-transparent"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Upgrade Assumptions */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="text-lg font-bold mb-4">升级假设</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold mb-2">
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
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold mb-2">
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
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-2 flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            额外月收入
          </div>
          <div className="text-4xl font-bold mb-2">
            +${calculations.extraRevenue.toLocaleString()}
          </div>
          <div className="text-sm opacity-80">
            {calculations.customersUpgrading} 位客户升级
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            收入增长
          </div>
          <div className="text-4xl font-bold mb-2">
            +{calculations.revenueIncrease.toFixed(1)}%
          </div>
          <div className="text-sm opacity-80">
            从 ${currentMonthlyRevenue.toLocaleString()} 到 ${calculations.newMonthlyRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Annual Projection */}
      <div className="bg-gray-900 text-white rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-400 mb-2">年度额外收入潜力</div>
          <div className="text-5xl font-bold text-green-400">
            +${calculations.annualExtra.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            新年度总收入: ${calculations.annualNew.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

