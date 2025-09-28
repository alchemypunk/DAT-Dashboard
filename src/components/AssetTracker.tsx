import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ArrowLeft,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  ExternalLink,
  Building2
} from 'lucide-react';

interface AssetTrackerProps {
  selectedAsset?: string;
  onViewCompany: (companyId: string) => void;
  onBack: () => void;
}

export function AssetTracker({ selectedAsset = 'BTC', onViewCompany, onBack }: AssetTrackerProps) {
  const [timeframe, setTimeframe] = useState('7d');
  const { t } = useLanguage();

  // Mock Bitcoin data and company holdings
  const bitcoinData = {
    currentPrice: 67241,
    change24h: 2.4,
    change7d: 8.7,
    change30d: 15.2,
    marketCap: 1321000000000,
    volume24h: 42500000000,
    totalSupply: 21000000,
    circulatingSupply: 19652468,
    
    corporateHoldings: [
      {
        companyId: 'MSTR',
        company: 'MicroStrategy',
        symbol: 'MSTR',
        holdings: 158245,
        percentage: 30.2,
        value: 10640250000,
        sector: t('sector.technology')
      },
      {
        companyId: 'TSLA',
        company: 'Tesla Inc.',
        symbol: 'TSLA',
        holdings: 9720,
        percentage: 1.9,
        value: 653470000,
        sector: t('sector.automotive')
      },
      {
        companyId: 'MARA',
        company: 'Marathon Digital',
        symbol: 'MARA',
        holdings: 15174,
        percentage: 2.9,
        value: 1020180000,
        sector: t('sector.mining')
      },
      {
        companyId: 'COIN',
        company: 'Coinbase',
        symbol: 'COIN',
        holdings: 9181,
        percentage: 1.8,
        value: 617420000,
        sector: t('sector.financialServices')
      },
      {
        companyId: 'RIOT',
        company: 'Riot Platforms',
        symbol: 'RIOT',
        holdings: 8872,
        percentage: 1.7,
        value: 596480000,
        sector: t('sector.mining')
      },
      {
        companyId: 'BLOCK',
        company: 'Block Inc.',
        symbol: 'SQ',
        holdings: 8027,
        percentage: 1.5,
        value: 539620000,
        sector: t('sector.financialServices')
      }
    ],
    
    priceHistory: [
      { date: '2024-01-08', price: 65800 },
      { date: '2024-01-09', price: 66200 },
      { date: '2024-01-10', price: 66800 },
      { date: '2024-01-11', price: 67100 },
      { date: '2024-01-12', price: 66900 },
      { date: '2024-01-13', price: 67300 },
      { date: '2024-01-14', price: 67600 },
      { date: '2024-01-15', price: 67241 }
    ]
  };

  const totalCorporateHoldings = bitcoinData.corporateHoldings.reduce((sum, holding) => sum + holding.holdings, 0);
  const totalCorporateValue = bitcoinData.corporateHoldings.reduce((sum, holding) => sum + holding.value, 0);

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatBitcoin = (value: number) => {
    return `${value.toLocaleString()} BTC`;
  };

  const getTimeframeChange = () => {
    switch (timeframe) {
      case '24h': return bitcoinData.change24h;
      case '7d': return bitcoinData.change7d;
      case '30d': return bitcoinData.change30d;
      default: return bitcoinData.change7d;
    }
  };

  const timeframeChange = getTimeframeChange();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('nav.backToDashboard')}
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bitcoin className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{t('asset.title')}</h1>
              <p className="text-muted-foreground">{t('asset.subtitle')}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-2xl font-bold">${bitcoinData.currentPrice.toLocaleString()}</div>
            <div className={`flex items-center text-sm ${timeframeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {timeframeChange >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {timeframeChange >= 0 ? '+' : ''}{timeframeChange.toFixed(1)}% ({timeframe})
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('asset.corporateHoldings')}</CardTitle>
            <Building2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBitcoin(totalCorporateHoldings)}</div>
            <p className="text-xs text-muted-foreground">{t('asset.acrossTrackedCompanies')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('asset.totalValue')}</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCorporateValue)}</div>
            <p className="text-xs text-muted-foreground">{t('asset.usdMarketValue')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('asset.marketCap')}</CardTitle>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(bitcoinData.marketCap)}</div>
            <p className="text-xs text-muted-foreground">{t('asset.totalBitcoinMarketCap')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('asset.volume24h')}</CardTitle>
            <PieChart className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(bitcoinData.volume24h)}</div>
            <p className="text-xs text-muted-foreground">{t('asset.tradingVolume')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="holdings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="holdings">{t('asset.corporateHoldingsTitle')}</TabsTrigger>
          <TabsTrigger value="market">{t('asset.marketData')}</TabsTrigger>
          <TabsTrigger value="distribution">{t('asset.distribution')}</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('asset.corporateHoldingsTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bitcoinData.corporateHoldings.map((holding, index) => (
                  <div key={holding.companyId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-400">
                        #{index + 1}
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {holding.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{holding.company}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <span>{holding.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {holding.sector}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">{formatBitcoin(holding.holdings)}</div>
                      <div className="text-sm text-gray-600">{formatCurrency(holding.value)}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{holding.percentage.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">of total</div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewCompany(holding.companyId)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('asset.pricePerformance')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{t('time.24h')}</span>
                    <div className={`flex items-center ${bitcoinData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bitcoinData.change24h >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {bitcoinData.change24h >= 0 ? '+' : ''}{bitcoinData.change24h.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>{t('time.7d')}</span>
                    <div className={`flex items-center ${bitcoinData.change7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bitcoinData.change7d >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {bitcoinData.change7d >= 0 ? '+' : ''}{bitcoinData.change7d.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>{t('time.30d')}</span>
                    <div className={`flex items-center ${bitcoinData.change30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bitcoinData.change30d >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {bitcoinData.change30d >= 0 ? '+' : ''}{bitcoinData.change30d.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('asset.supplyInformation')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('asset.circulatingSupply')}:</span>
                    <span className="font-medium">{bitcoinData.circulatingSupply.toLocaleString()} BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('asset.totalSupply')}:</span>
                    <span className="font-medium">{bitcoinData.totalSupply.toLocaleString()} BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('asset.supplyProgress')}:</span>
                    <span className="font-medium">{((bitcoinData.circulatingSupply / bitcoinData.totalSupply) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(bitcoinData.circulatingSupply / bitcoinData.totalSupply) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('asset.recentPriceHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bitcoinData.priceHistory.slice(-5).reverse().map((point, index) => (
                  <div key={point.date} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="text-muted-foreground">{point.date}</span>
                    <span className="font-mono font-medium">${point.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('asset.holdingsBySector')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[t('sector.technology'), t('sector.mining'), t('sector.financialServices'), t('sector.automotive')].map((sector) => {
                    const sectorHoldings = bitcoinData.corporateHoldings.filter(h => h.sector === sector);
                    const sectorTotal = sectorHoldings.reduce((sum, h) => sum + h.holdings, 0);
                    const sectorPercentage = (sectorTotal / totalCorporateHoldings) * 100;
                    
                    return (
                      <div key={sector} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{sector}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatBitcoin(sectorTotal)} ({sectorPercentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${sectorPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('asset.topHoldingsSummary')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <Bitcoin className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">
                      {formatBitcoin(totalCorporateHoldings)}
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-400">{t('asset.totalCorporateHoldings')}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('asset.largestHolder')}:</span>
                      <span className="font-medium">MicroStrategy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('asset.companiesTracked')}:</span>
                      <span className="font-medium">{bitcoinData.corporateHoldings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('asset.totalValue')}:</span>
                      <span className="font-medium">{formatCurrency(totalCorporateValue)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}