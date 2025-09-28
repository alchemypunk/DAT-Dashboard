import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext'; // NEW: Import Auth context
import { 
  ArrowLeft,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  ExternalLink,
  Building2,
  Lock
} from 'lucide-react';
// NEW: Chart Imports (Req 5)
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, ResponsiveContainer, Pie, Cell, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

interface AssetTrackerProps {
  selectedAsset?: string;
  onViewCompany: (companyId: string) => void;
  onBack: () => void;
}

// MOCK DATA (Should be fetched/managed by admin, fulfilling Req 3)
const mockAssetData = {
    BTC: {
        assetName: 'Bitcoin',
        assetSymbol: 'BTC',
        currentPrice: 67241,
        change24h: 2.4,
        change7d: 8.7,
        change30d: 15.2,
        marketCap: 1321000000000,
        volume24h: 42500000000,
        totalSupply: 21000000,
        circulatingSupply: 19652468,
        corporateHoldings: [
            { companyId: 'MSTR', company: 'MicroStrategy', symbol: 'MSTR', holdings: 158245, percentage: 30.2, value: 10640250000, sector: 'Technology' },
            { companyId: 'MARA', company: 'Marathon Digital', symbol: 'MARA', holdings: 15174, percentage: 2.9, value: 1020180000, sector: 'Mining' },
            { companyId: 'RIOT', company: 'Riot Platforms', symbol: 'RIOT', holdings: 8872, percentage: 1.7, value: 596480000, sector: 'Mining' },
            { companyId: 'COIN', company: 'Coinbase', symbol: 'COIN', holdings: 9181, percentage: 1.8, value: 617420000, sector: 'Financial Services' },
            { companyId: 'TSLA', company: 'Tesla Inc.', symbol: 'TSLA', holdings: 9720, percentage: 1.9, value: 653470000, sector: 'Automotive' },
            { companyId: 'BLOCK', company: 'Block Inc.', symbol: 'SQ', holdings: 8027, percentage: 1.5, value: 539620000, sector: 'Financial Services' },
            { companyId: 'Hidden1', company: 'Hidden Corp 1', symbol: 'HC1', holdings: 5000, percentage: 0.9, value: 336205000, sector: 'Technology' },
            { companyId: 'Hidden2', company: 'Hidden Corp 2', symbol: 'HC2', holdings: 4500, percentage: 0.8, value: 302584500, sector: 'Energy' },
        ],
        priceHistory: [
            { date: 'Jan 8', price: 65800 }, { date: 'Jan 9', price: 66200 }, { date: 'Jan 10', price: 66800 },
            { date: 'Jan 11', price: 67100 }, { date: 'Jan 12', price: 66900 }, { date: 'Jan 13', price: 67300 },
            { date: 'Jan 14', price: 67600 }, { date: 'Jan 15', price: 67241 }
        ],
    },
    ETH: {
        assetName: 'Ethereum',
        assetSymbol: 'ETH',
        currentPrice: 3520,
        change24h: -0.5,
        change7d: 3.2,
        change30d: 8.1,
        marketCap: 420000000000,
        volume24h: 15000000000,
        totalSupply: 120000000,
        circulatingSupply: 119800000,
        corporateHoldings: [
            { companyId: 'COIN', company: 'Coinbase', symbol: 'COIN', holdings: 15000, percentage: 40.5, value: 52800000, sector: 'Financial Services' },
            { companyId: 'GBTC', company: 'Grayscale ETH', symbol: 'GETH', holdings: 22000, percentage: 59.5, value: 77440000, sector: 'Financial Services' },
        ],
        priceHistory: [
            { date: 'Jan 8', price: 3450 }, { date: 'Jan 9', price: 3400 }, { date: 'Jan 10', price: 3490 },
            { date: 'Jan 11', price: 3550 }, { date: 'Jan 12', price: 3500 }, { date: 'Jan 13', price: 3580 },
            { date: 'Jan 14', price: 3600 }, { date: 'Jan 15', price: 3520 }
        ],
    }
};

export function AssetTracker({ selectedAsset = 'BTC', onViewCompany, onBack }: AssetTrackerProps) {
  const [asset, setAsset] = useState(selectedAsset); // Allow switching (Req 6)
  const [timeframe, setTimeframe] = useState('7d');
  const { t } = useLanguage();
  const { isRegistered } = useAuth(); // NEW: Auth context (Req 8)

  const assetData = mockAssetData[asset as keyof typeof mockAssetData] || mockAssetData.BTC;
  const { corporateHoldings, priceHistory } = assetData;

  const totalCorporateHoldings = corporateHoldings.reduce((sum, holding) => sum + holding.holdings, 0);
  const totalCorporateValue = corporateHoldings.reduce((sum, holding) => sum + holding.value, 0);
  const totalHoldingsCount = corporateHoldings.length;

  // --- ACCESS CONTROL LOGIC (Req 8: 50% limit & blur) ---
  const visibleHoldingsCount = isRegistered ? totalHoldingsCount : Math.ceil(totalHoldingsCount / 2);
  const visibleHoldings = corporateHoldings.slice(0, visibleHoldingsCount);

  // Data for Charts
  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-3))",
    },
    // Sector colors for Pie Chart (use tailwind colors for simplicity, or chart-1, chart-2 from globals.css)
    technology: { label: t('sector.technology'), color: "hsl(var(--chart-1))" },
    mining: { label: t('sector.mining'), color: "hsl(var(--chart-2))" },
    financialServices: { label: t('sector.financialServices'), color: "hsl(var(--chart-3))" },
    automotive: { label: t('sector.automotive'), color: "hsl(var(--chart-4))" },
    other: { label: "Other", color: "hsl(var(--chart-5))" },
  };
  
  const sectorDistributionData = Object.entries(
    corporateHoldings.reduce((acc, h) => {
        const key = h.sector;
        acc[key] = (acc[key] || 0) + h.holdings;
        return acc;
    }, {} as Record<string, number>)
  ).map(([sector, holdings]) => ({
    name: sector,
    value: holdings,
    percentage: (holdings / totalCorporateHoldings) * 100
  }));

  // Function to wrap sensitive data with blur class
  const obfuscate = (value: any) => {
    return isRegistered ? value : <span className="blur-sm">{value}</span>;
  };
  
  // Formatters (Unchanged)
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatBitcoin = (value: number) => {
    return `${value.toLocaleString()} ${asset}`;
  };

  const getTimeframeChange = () => {
    switch (timeframe) {
      case '24h': return assetData.change24h;
      case '7d': return assetData.change7d;
      case '30d': return assetData.change30d;
      default: return assetData.change7d;
    }
  };

  const timeframeChange = getTimeframeChange();

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* R1 Fix: Added flex-col sm:flex-row space-y-4 sm:space-y-0 */}
      <div className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('nav.backToDashboard')}
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/20 rounded-lg flex items-center justify-center">
              <Bitcoin className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold dark:text-gray-100">{assetData.assetName} {t('asset.title')}</h1>
              <p className="text-muted-foreground">{t('asset.subtitle')}</p>
            </div>
          </div>
        </div>
        
        {/* R1 Fix: Removed unnecessary wrapper div, adjusted spacing */}
        <div className="flex items-center space-x-2 w-full sm:w-auto"> 
            {/* Asset Switcher (Req 6) */}
            <Select value={asset} onValueChange={setAsset}>
                <SelectTrigger className="w-24">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDC">USDC (Mock)</SelectItem>
                </SelectContent>
            </Select>
          <div className="text-right flex-1"> {/* Added flex-1 to price container on mobile */}
            <div className="text-2xl font-bold dark:text-gray-100">${assetData.currentPrice.toLocaleString()}</div>
            <div className={`flex items-center justify-end text-sm ${timeframeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
        {/* ... (Summary cards with obfuscate applied) ... */}
        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('asset.corporateHoldings')}</CardTitle>
            <Building2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(formatBitcoin(totalCorporateHoldings))}</div>
            <p className="text-xs text-muted-foreground">{t('asset.acrossTrackedCompanies')}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('asset.totalValue')}</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(formatCurrency(totalCorporateValue))}</div>
            <p className="text-xs text-muted-foreground">{t('asset.usdMarketValue')}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('asset.marketCap')}</CardTitle>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(formatCurrency(assetData.marketCap))}</div>
            <p className="text-xs text-muted-foreground">{t('asset.totalBitcoinMarketCap')}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('asset.volume24h')}</CardTitle>
            <PieChart className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(formatCurrency(assetData.volume24h))}</div>
            <p className="text-xs text-muted-foreground">{t('asset.tradingVolume')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="holdings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="holdings">{t('asset.corporateHoldingsTitle')}</TabsTrigger>
          <TabsTrigger value="market">{t('asset.marketData')}</TabsTrigger>
          <TabsTrigger value="charts">{t('asset.chart')}</TabsTrigger> {/* NEW Tab for Charts */}
        </TabsList>

        <TabsContent value="holdings" className="space-y-6">
          <Card className="dark:bg-card dark:border-border">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">{t('asset.corporateHoldingsTitle')} {isRegistered ? '' : `(${t('asset.companiesTracked')} 50% Limit)`}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visibleHoldings.map((holding, index) => (
                  <div key={holding.companyId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                        #{index + 1}
                      </div>
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {holding.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium dark:text-gray-100">{holding.company}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                          <span>{holding.symbol}</span>
                          <Badge variant="outline" className="text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                            {t(`sector.${holding.sector.replace(/\s/g, '')}` as any) || holding.sector}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold dark:text-gray-100">{obfuscate(formatBitcoin(holding.holdings))}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{obfuscate(formatCurrency(holding.value))}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium dark:text-gray-100">{obfuscate(`${holding.percentage.toFixed(1)}%`)}</div>
                      <div className="text-sm text-muted-foreground">of total</div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewCompany(holding.companyId)}
                    >
                      <ExternalLink className="w-4 h-4 dark:text-gray-400" />
                    </Button>
                  </div>
                ))}
                {!isRegistered && totalHoldingsCount > 0 && (
                    <div className="text-center p-4 text-sm text-blue-600 dark:text-blue-400">
                        <Lock className="inline h-4 w-4 mr-1" />
                        {t('asset.companiesTracked')} {visibleHoldingsCount} items shown. Register to view all {totalHoldingsCount} records.
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NEW: Charts Tab (Req 5) */}
        <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="dark:bg-card dark:border-border">
                    <CardHeader>
                        <CardTitle className="dark:text-gray-100">Price History (Area Chart)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={priceHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                                    <YAxis 
                                        domain={['dataMin - 100', 'dataMax + 100']} 
                                        tickFormatter={(value) => `$${value.toLocaleString()}`} 
                                        stroke="hsl(var(--muted-foreground))"
                                    />
                                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="price" 
                                        name="Price"
                                        stroke={isRegistered ? "hsl(var(--chart-3))" : "hsl(var(--chart-5))"} 
                                        fill={isRegistered ? "url(#colorPrice)" : "url(#colorObf)"} 
                                        strokeWidth={2}
                                        dot={{ fill: isRegistered ? "hsl(var(--chart-3))" : "hsl(var(--chart-5))" }}
                                    />
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorObf" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        {!isRegistered && (
                            <p className="text-center text-sm text-red-600 dark:text-red-400 mt-2">（图表数据已模糊化。注册以查看实时和完整数据。）</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="dark:bg-card dark:border-border">
                    <CardHeader>
                        <CardTitle className="dark:text-gray-100">Holdings by Sector (Pie Chart)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={sectorDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        nameKey="name"
                                        labelLine={false}
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {sectorDistributionData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={isRegistered ? (chartConfig as any)[entry.name.replace(/\s/g, '')]?.color || chartConfig.other.color : chartConfig.other.color} 
                                                opacity={isRegistered ? 1 : 0.5}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [formatBitcoin(value), 'Holdings']} />
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        
        {/* ... (Market Tab remains the same but with obfuscate applied to values) ... */}
        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dark:bg-card dark:border-border">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">{t('asset.pricePerformance')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* ... (Content with obfuscate applied) ... */}
                  <div className="flex justify-between items-center">
                    <span className='dark:text-gray-400'>{t('time.24h')}</span>
                    <div className={`flex items-center ${assetData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {obfuscate(
                          <>
                            {assetData.change24h >= 0 ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {assetData.change24h >= 0 ? '+' : ''}{assetData.change24h.toFixed(1)}%
                          </>
                      )}
                    </div>
                  </div>
                  
                  {/* ... (Other performance metrics) ... */}
                  <div className="flex justify-between items-center">
                    <span className='dark:text-gray-400'>{t('time.7d')}</span>
                    <div className={`flex items-center ${assetData.change7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {obfuscate(
                          <>
                            {assetData.change7d >= 0 ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {assetData.change7d >= 0 ? '+' : ''}{assetData.change7d.toFixed(1)}%
                          </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className='dark:text-gray-400'>{t('time.30d')}</span>
                    <div className={`flex items-center ${assetData.change30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {obfuscate(
                          <>
                            {assetData.change30d >= 0 ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {assetData.change30d >= 0 ? '+' : ''}{assetData.change30d.toFixed(1)}%
                          </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-card dark:border-border">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">{t('asset.supplyInformation')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('asset.circulatingSupply')}:</span>
                    <span className="font-medium dark:text-gray-100">{obfuscate(assetData.circulatingSupply.toLocaleString())} {asset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('asset.totalSupply')}:</span>
                    <span className="font-medium dark:text-gray-100">{obfuscate(assetData.totalSupply.toLocaleString())} {asset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('asset.supplyProgress')}:</span>
                    <span className="font-medium dark:text-gray-100">{obfuscate(`${((assetData.circulatingSupply / assetData.totalSupply) * 100).toFixed(1)}%`)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(assetData.circulatingSupply / assetData.totalSupply) * 100}%` }}
                    ></div>
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