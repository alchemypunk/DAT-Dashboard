import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext'; // NEW: Import Auth context
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Bitcoin,
  Building2,
  Target,
  Award,
  Lock
} from 'lucide-react';
// NEW: Chart Imports (Req 5)
import { CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltipContent } from './ui/chart';


interface AnalyticsProps {
  onViewCompany: (companyId: string) => void;
  onBack: () => void;
}

// MOCK DATA (Should be fetched/managed by admin, fulfilling Req 3)
const mockAnalyticsData = {
    totalMarketValue: 13567450000,
    totalBitcoinHoldings: 209219,
    avgAllocation: 34.2,
    topPerformer: 'MicroStrategy',
    
    performanceData: [
      { period: '1 Week', change: 8.7, value: 12468920000, color: 'hsl(var(--chart-1))' },
      { period: '1 Month', change: 15.2, value: 11768350000, color: 'hsl(var(--chart-2))' },
      { period: '3 Months', change: 28.9, value: 10526180000, color: 'hsl(var(--chart-3))' },
      { period: '6 Months', change: 42.1, value: 9541270000, color: 'hsl(var(--chart-4))' },
      { period: '1 Year', change: 156.7, value: 5286940000, color: 'hsl(var(--chart-5))' }
    ],
    
    sectorAnalysis: [
      { sector: 'Technology', companies: 1, holdings: 158245, value: 10640250000, avgAllocation: 88.7, color: 'hsl(var(--chart-1))' },
      { sector: 'Mining', companies: 2, holdings: 24046, value: 1616660000, avgAllocation: 79.8, color: 'hsl(var(--chart-2))' },
      { sector: 'Financial Services', companies: 2, holdings: 17208, value: 1157040000, avgAllocation: 8.0, color: 'hsl(var(--chart-3))' },
      { sector: 'Automotive', companies: 1, holdings: 9720, value: 653470000, avgAllocation: 2.3, color: 'hsl(var(--chart-4))' }
    ],
    
    trends: [
      { title: 'Increasing Corporate Adoption', description: 'More public companies are allocating treasury funds to Bitcoin', trend: 'up', impact: 'high' },
      { title: 'Mining Companies Leading', description: 'Mining companies show highest Bitcoin allocation percentages', trend: 'up', impact: 'medium' },
      { title: 'Diverse Sector Participation', description: 'Bitcoin adoption spanning across multiple industries', trend: 'up', impact: 'high' },
      { title: 'Long-term Strategy Focus', description: 'Companies viewing Bitcoin as long-term store of value', trend: 'stable', impact: 'high' }
    ],
    
    milestones: [
      { date: '2024-01-10', company: 'MicroStrategy', event: 'Purchased additional 3,000 BTC', value: 127500000, type: 'purchase' },
      { date: '2023-12-15', company: 'Marathon Digital', event: 'Reached 15,000+ BTC milestone', value: 1020000000, type: 'milestone' },
      { date: '2023-11-28', company: 'MicroStrategy', event: 'Total holdings exceeded 150,000 BTC', value: 10000000000, type: 'milestone' }
    ]
};

export function Analytics({ onViewCompany, onBack }: AnalyticsProps) {
  const [timeframe, setTimeframe] = useState('30d');
  const [metric, setMetric] = useState('value');
  const { t } = useLanguage();
  const { isRegistered } = useAuth(); // NEW: Auth context (Req 8)

  const analyticsData = mockAnalyticsData;
  const { performanceData, sectorAnalysis, trends, milestones } = analyticsData;

  // --- ACCESS CONTROL LOGIC (Req 8: 50% limit & blur) ---
  const visiblePerformanceData = isRegistered ? performanceData : performanceData.slice(0, Math.ceil(performanceData.length / 2));
  const visibleSectorAnalysis = isRegistered ? sectorAnalysis : sectorAnalysis.slice(0, Math.ceil(sectorAnalysis.length / 2));
  const visibleTrends = isRegistered ? trends : trends.slice(0, Math.ceil(trends.length / 2));
  const visibleMilestones = isRegistered ? milestones : milestones.slice(0, Math.ceil(milestones.length / 2));

  const obfuscate = (value: any) => {
    return isRegistered ? value : <span className="blur-sm">{value}</span>;
  };
  
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatBitcoin = (value: number) => {
    return `${value.toLocaleString()} BTC`;
  };

  // Chart config for Bar Chart
  const chartConfig = {
    avgAllocation: {
      label: "Allocation %",
      color: "hsl(var(--chart-3))",
      icon: PieChart,
    },
  };
  
  const sectorAllocationChartData = sectorAnalysis.map(s => ({
    sector: t(`sector.${s.sector.replace(/\s/g, '')}` as any) || s.sector,
    avgAllocation: s.avgAllocation
  })).slice(0, isRegistered ? sectorAnalysis.length : Math.ceil(sectorAnalysis.length / 2));


  return (
    <div className="space-y-6">
      {/* Header */}
      {/* R1 Fix: Changed to flex-col sm:flex-row and adjusted content classes */}
      <div className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('nav.backToDashboard')}
          </Button>
          
          <div>
            <h1 className="text-2xl font-semibold dark:text-gray-100">{t('analytics.title')}</h1>
            <p className="text-muted-foreground">{t('analytics.subtitle')}</p>
          </div>
        </div>
        
        {/* R1 Fix: Changed to flex-wrap gap-2 on mobile */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:space-x-2">
            {/* Timeframe and Metric selectors remain as filters */}
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{t('time.7d')}</SelectItem>
              <SelectItem value="30d">{t('time.30d')}</SelectItem>
              <SelectItem value="90d">{t('time.90d')}</SelectItem>
              <SelectItem value="1y">{t('time.1y')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value">USD Value</SelectItem>
              <SelectItem value="holdings">BTC Holdings</SelectItem>
              <SelectItem value="allocation">Allocation %</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Performance Indicators (with obfuscation) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('analytics.totalMarketValue')}</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(formatCurrency(analyticsData.totalMarketValue))}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.allCorporateHoldings')}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('analytics.totalBtcHoldings')}</CardTitle>
            <Bitcoin className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(formatBitcoin(analyticsData.totalBitcoinHoldings))}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.acrossAllCompanies')}</p>
          </CardContent>
        </Card>

        {/* ... (Other KPI cards with obfuscate) ... */}
        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('analytics.avgAllocation')}</CardTitle>
            <PieChart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(`${analyticsData.avgAllocation.toFixed(1)}%`)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.ofTreasuryAssets')}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('analytics.topPerformer')}</CardTitle>
            <Award className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(analyticsData.topPerformer)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.byTotalHoldings')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-card dark:border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
              <BarChart3 className="w-5 h-5" />
              <span>{t('analytics.performanceOverTime')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visiblePerformanceData.map((period, index) => (
                <div key={index} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${period.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium dark:text-gray-200">{t(`time.${period.period.replace(/\s/g, '').toLowerCase()}` as any) || period.period}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold dark:text-gray-100">{obfuscate(formatCurrency(period.value))}</div>
                    <div className={`text-sm flex items-center ${period.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {obfuscate(
                          <>
                            {period.change >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {period.change >= 0 ? '+' : ''}{period.change.toFixed(1)}%
                          </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
             {!isRegistered && performanceData.length > 0 && (
                <p className="text-center text-sm text-blue-600 dark:text-blue-400 mt-4">
                    <Lock className="inline h-4 w-4 mr-1" />
                    已显示 {visiblePerformanceData.length} 条数据。注册以查看所有 {performanceData.length} 条记录。
                </p>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-card dark:border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
              <Building2 className="w-5 h-5" />
              <span>{t('analytics.sectorAnalysis')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
             {/* NEW: Chart Integration (Req 5) */}
            <ChartContainer config={chartConfig} className="h-[250px]">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart layout="vertical" data={sectorAllocationChartData} margin={{ left: 10, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `${value.toFixed(0)}%`} />
                        <YAxis type="category" dataKey="sector" stroke="hsl(var(--muted-foreground))" width={80} />
                        <Tooltip content={<ChartTooltipContent indicator="dot" formatter={(value) => [`${value}%`, 'Allocation']} />} />
                        <Bar 
                            dataKey="avgAllocation" 
                            fill="hsl(var(--chart-3))" 
                            radius={[4, 4, 0, 0]}
                        >
                            {sectorAllocationChartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={isRegistered ? performanceData[index]?.color || "hsl(var(--chart-3))" : "hsl(var(--chart-5))"} 
                                    opacity={isRegistered ? 1 : 0.5}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>

            <div className="space-y-4 mt-6">
              {visibleSectorAnalysis.map((sector, index) => (
                <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium dark:text-gray-100">{t(`sector.${sector.sector.replace(/\s/g, '')}` as any) || sector.sector}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{sector.companies} {t('common.companies')}</p>
                    </div>
                    <Badge variant="outline" className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                      {obfuscate(`${sector.avgAllocation.toFixed(1)}% avg`)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
             {!isRegistered && sectorAnalysis.length > 0 && (
                <p className="text-center text-sm text-blue-600 dark:text-blue-400 mt-4">
                    <Lock className="inline h-4 w-4 mr-1" />
                    已显示 {visibleSectorAnalysis.length} 条数据。注册以查看完整行业分析。
                </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Market Trends (with obfuscation) */}
      <Card className="dark:bg-card dark:border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
            <TrendingUp className="w-5 h-5" />
            <span>{t('analytics.marketTrends')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleTrends.map((trend, index) => (
              <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium dark:text-gray-100">{t(`analytics.${trend.title.replace(/\s/g, '').replace(/-/g, '')}` as any) || trend.title}</h4>
                  <div className="flex items-center space-x-2">
                    {trend.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : trend.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <Target className="w-4 h-4 text-blue-600" />
                    )}
                    <Badge 
                      variant={trend.impact === 'high' ? 'default' : trend.impact === 'medium' ? 'secondary' : 'outline'}
                      className="text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    >
                      {obfuscate(`${trend.impact} impact`)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{trend.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}