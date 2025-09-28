import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '../contexts/LanguageContext';
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
  Award
} from 'lucide-react';

interface AnalyticsProps {
  onViewCompany: (companyId: string) => void;
  onBack: () => void;
}

export function Analytics({ onViewCompany, onBack }: AnalyticsProps) {
  const [timeframe, setTimeframe] = useState('30d');
  const [metric, setMetric] = useState('value');
  const { t } = useLanguage();

  // Mock analytics data
  const analyticsData = {
    totalMarketValue: 13567450000,
    totalBitcoinHoldings: 209219,
    avgAllocation: 34.2,
    topPerformer: 'MSTR',
    
    performanceData: [
      { period: t('time.1week'), change: 8.7, value: 12468920000 },
      { period: t('time.2weeks'), change: 12.3, value: 12095430000 },
      { period: t('time.1month'), change: 15.2, value: 11768350000 },
      { period: t('time.3months'), change: 28.9, value: 10526180000 },
      { period: t('time.6months'), change: 42.1, value: 9541270000 },
      { period: t('time.1y'), change: 156.7, value: 5286940000 }
    ],
    
    sectorAnalysis: [
      { sector: t('sector.technology'), companies: 1, holdings: 158245, value: 10640250000, avgAllocation: 88.7 },
      { sector: t('sector.mining'), companies: 2, holdings: 24046, value: 1616660000, avgAllocation: 79.8 },
      { sector: t('sector.financialServices'), companies: 2, holdings: 17208, value: 1157040000, avgAllocation: 8.0 },
      { sector: t('sector.automotive'), companies: 1, holdings: 9720, value: 653470000, avgAllocation: 2.3 }
    ],
    
    trends: [
      {
        title: t('analytics.increasingAdoption'),
        description: 'More public companies are allocating treasury funds to Bitcoin',
        trend: 'up',
        impact: 'high'
      },
      {
        title: t('analytics.miningLeading'),
        description: 'Mining companies show highest Bitcoin allocation percentages',
        trend: 'up',
        impact: 'medium'
      },
      {
        title: t('analytics.diverseSectors'),
        description: 'Bitcoin adoption spanning across multiple industries',
        trend: 'up',
        impact: 'high'
      },
      {
        title: t('analytics.longTermFocus'),
        description: 'Companies viewing Bitcoin as long-term store of value',
        trend: 'stable',
        impact: 'high'
      }
    ],
    
    milestones: [
      {
        date: '2024-01-10',
        company: 'MicroStrategy',
        event: 'Purchased additional 3,000 BTC',
        value: 127500000,
        type: 'purchase'
      },
      {
        date: '2023-12-15',
        company: 'Marathon Digital',
        event: 'Reached 15,000+ BTC milestone',
        value: 1020000000,
        type: 'milestone'
      },
      {
        date: '2023-11-28',
        company: 'MicroStrategy',
        event: 'Total holdings exceeded 150,000 BTC',
        value: 10000000000,
        type: 'milestone'
      }
    ]
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatBitcoin = (value: number) => {
    return `${value.toLocaleString()} BTC`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('nav.backToDashboard')}
          </Button>
          
          <div>
            <h1 className="text-2xl font-semibold">{t('analytics.title')}</h1>
            <p className="text-muted-foreground">{t('analytics.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-32">
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

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.totalMarketValue')}</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalMarketValue)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.allCorporateHoldings')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.totalBtcHoldings')}</CardTitle>
            <Bitcoin className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBitcoin(analyticsData.totalBitcoinHoldings)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.acrossAllCompanies')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.avgAllocation')}</CardTitle>
            <PieChart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.avgAllocation.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{t('analytics.ofTreasuryAssets')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.topPerformer')}</CardTitle>
            <Award className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.topPerformer}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.byTotalHoldings')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>{t('analytics.performanceOverTime')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.performanceData.map((period, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${period.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">{period.period}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(period.value)}</div>
                    <div className={`text-sm flex items-center ${period.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {period.change >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {period.change >= 0 ? '+' : ''}{period.change.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Sector Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.sectorAnalysis.map((sector, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{sector.sector}</h4>
                      <p className="text-sm text-gray-600">{sector.companies} companies</p>
                    </div>
                    <Badge variant="outline">
                      {sector.avgAllocation.toFixed(1)}% avg
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Holdings:</p>
                      <p className="font-semibold">{formatBitcoin(sector.holdings)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Value:</p>
                      <p className="font-semibold">{formatCurrency(sector.value)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Market Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsData.trends.map((trend, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{trend.title}</h4>
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
                      className="text-xs"
                    >
                      {trend.impact} impact
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{trend.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Recent Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.milestones.map((milestone, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    milestone.type === 'purchase' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {milestone.type === 'purchase' ? (
                      <DollarSign className={`w-5 h-5 ${
                        milestone.type === 'purchase' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    ) : (
                      <Award className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{milestone.event}</div>
                    <div className="text-sm text-gray-600 flex items-center space-x-2">
                      <span>{milestone.company}</span>
                      <span>•</span>
                      <span>{milestone.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(milestone.value)}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-auto p-1"
                    onClick={() => {
                      const companyMap: { [key: string]: string } = {
                        'MicroStrategy': 'MSTR',
                        'Marathon Digital': 'MARA'
                      };
                      const companyId = companyMap[milestone.company];
                      if (companyId) onViewCompany(companyId);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}