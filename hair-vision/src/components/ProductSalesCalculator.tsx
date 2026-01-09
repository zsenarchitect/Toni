'use client';

import { useState, useMemo } from 'react';
import { ShoppingBag, DollarSign, TrendingUp, Package, Users } from 'lucide-react';

interface ProductSalesCalculatorProps {
  className?: string;
}

export function ProductSalesCalculator({ className }: ProductSalesCalculatorProps) {
  const [productPrice, setProductPrice] = useState(45);
  const [profitMargin, setProfitMargin] = useState(60); // 利润率百分比
  const [dailyCustomers, setDailyCustomers] = useState(15);
  const [upsellRate, setUpsellRate] = useState(25); // 看到预览后购买产品的客户比例 (%)
  const [productsPerSale, setProductsPerSale] = useState(1.2); // 每次销售平均产品数量

  const calculations = useMemo(() => {
    // 计算每次销售的利润
    const profitPerProduct = productPrice * (profitMargin / 100);
    const profitPerSale = profitPerProduct * productsPerSale;
    
    // 计算每日数据
    const customersUpselling = Math.round(dailyCustomers * (upsellRate / 100));
    const dailySales = customersUpselling * productsPerSale;
    const dailyRevenue = dailySales * productPrice;
    const dailyProfit = customersUpselling * profitPerSale;
    
    // 计算每月数据（假设每月工作25天）
    const workingDaysPerMonth = 25;
    const monthlySales = dailySales * workingDaysPerMonth;
    const monthlyRevenue = dailyRevenue * workingDaysPerMonth;
    const monthlyProfit = dailyProfit * workingDaysPerMonth;
    
    // 计算年度数据
    const annualSales = monthlySales * 12;
    const annualRevenue = monthlyRevenue * 12;
    const annualProfit = monthlyProfit * 12;
    
    // 参与度（购买产品的客户比例）
    const engagementRate = upsellRate;

    return {
      profitPerProduct,
      profitPerSale,
      customersUpselling,
      dailySales,
      dailyRevenue,
      dailyProfit,
      monthlySales,
      monthlyRevenue,
      monthlyProfit,
      annualSales,
      annualRevenue,
      annualProfit,
      engagementRate,
    };
  }, [productPrice, profitMargin, dailyCustomers, upsellRate, productsPerSale]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Product Information */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          产品信息
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold mb-2">
              产品单价 ($)
            </label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full text-2xl font-bold border-none outline-none bg-transparent"
              min="0"
              step="0.01"
            />
            <div className="text-xs text-gray-500 mt-1">例如：护发产品 $45</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold mb-2">
              利润率 (%)
            </label>
            <input
              type="number"
              value={profitMargin}
              onChange={(e) => setProfitMargin(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
              className="w-full text-2xl font-bold border-none outline-none bg-transparent"
              min="0"
              max="100"
              step="0.1"
            />
            <div className="text-xs text-gray-500 mt-1">每件产品的利润率</div>
          </div>
        </div>
      </div>

      {/* Sales Assumptions */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          销售假设
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold mb-2">
              每日客户数
            </label>
            <input
              type="number"
              value={dailyCustomers}
              onChange={(e) => setDailyCustomers(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-2xl font-bold border-none outline-none bg-transparent"
              min="0"
            />
            <div className="text-xs text-gray-500 mt-1">每天服务的客户数</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold mb-2">
              购买转化率 (%)
            </label>
            <input
              type="number"
              value={upsellRate}
              onChange={(e) => setUpsellRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
              className="w-full text-2xl font-bold border-none outline-none bg-transparent"
              min="0"
              max="100"
              step="0.1"
            />
            <div className="text-xs text-gray-500 mt-1">看到预览后购买产品的客户比例</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold mb-2">
              每次销售产品数
            </label>
            <input
              type="number"
              value={productsPerSale}
              onChange={(e) => setProductsPerSale(Math.max(0.1, parseFloat(e.target.value) || 0))}
              className="w-full text-2xl font-bold border-none outline-none bg-transparent"
              min="0.1"
              step="0.1"
            />
            <div className="text-xs text-gray-500 mt-1">平均每次销售的产品数量</div>
          </div>
        </div>
      </div>

      {/* Daily Results */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="text-sm opacity-90 mb-2 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            每日销售额
          </div>
          <div className="text-3xl font-bold mb-1">
            ${calculations.dailyRevenue.toFixed(0)}
          </div>
          <div className="text-xs opacity-80">
            {calculations.dailySales.toFixed(1)} 件产品
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="text-sm opacity-90 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            每日利润
          </div>
          <div className="text-3xl font-bold mb-1">
            ${calculations.dailyProfit.toFixed(0)}
          </div>
          <div className="text-xs opacity-80">
            {calculations.customersUpselling} 位客户购买
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="text-sm opacity-90 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            参与度
          </div>
          <div className="text-3xl font-bold mb-1">
            {calculations.engagementRate.toFixed(0)}%
          </div>
          <div className="text-xs opacity-80">
            {calculations.customersUpselling} / {dailyCustomers} 客户
          </div>
        </div>
      </div>

      {/* Monthly & Annual Projection */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 text-white rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-400 mb-2">月度额外收入</div>
            <div className="text-4xl font-bold text-green-400 mb-1">
              ${calculations.monthlyRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">
              利润: ${calculations.monthlyProfit.toLocaleString()} | {calculations.monthlySales.toFixed(0)} 件产品
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="text-sm opacity-90 mb-2">年度额外收入</div>
            <div className="text-4xl font-bold mb-1">
              ${calculations.annualRevenue.toLocaleString()}
            </div>
            <div className="text-xs opacity-80">
              利润: ${calculations.annualProfit.toLocaleString()} | {calculations.annualSales.toFixed(0)} 件产品
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="text-sm text-gray-600 space-y-1">
          <p>• 每件产品利润: <span className="font-bold">${calculations.profitPerProduct.toFixed(2)}</span></p>
          <p>• 每次销售平均利润: <span className="font-bold">${calculations.profitPerSale.toFixed(2)}</span></p>
          <p>• 每月工作天数: <span className="font-bold">25 天</span></p>
        </div>
      </div>
    </div>
  );
}


