import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Building2,
  Bitcoin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Globe,
  Briefcase,
  PieChart,
  Lock
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext'; // NEW: Import Auth context

interface CompanyDetailsProps {
  companyId: string;
  onBack: () => void;
  onViewAsset: (asset: string) => void;
}

// MOCK DATA (Should be fetched/managed by admin, fulfilling Req 3)
const mockCompanyData = {
    MSTR: {
      name: 'MicroStrategy Incorporated',
      symbol: 'MSTR',
      sector: 'Business Intelligence Software',
      country: 'United States',
      founded: '1989',
      employees: '4,500+',
      marketCap: 47800000000,
      website: 'https://microstrategy.com',
      ceo: 'Michael J. Saylor',
      description: 'MicroStrategy adopted Bitcoin as its primary treasury reserve asset, viewing it as a superior store of value compared to cash and a hedge against inflation.',
      bitcoinStrategy: 'The company actively uses company debt and convertible notes to acquire more Bitcoin, implementing a pure Bitcoin-only treasury strategy.',
      
      holdings: {
        bitcoin: {
          amount: 158245,
          averagePrice: 29803,
          totalCost: 4716000000,
          currentValue: 10640250000,
          unrealizedPnL: 5924250000,
          lastPurchase: '2024-01-10',
          firstPurchase: '2020-08-11'
        }
      },
      
      transactions: [
        { date: '2024-01-10', type: 'Purchase', amount: 3000, price: 42500, value: 127500000, description: 'Q4 2023 Bitcoin acquisition' },
        { date: '2023-12-15', type: 'Purchase', amount: 2500, price: 41200, value: 103000000, description: 'Strategic treasury purchase' },
        { date: '2023-11-20', type: 'Purchase', amount: 5000, price: 38750, value: 193750000, description: 'Quarterly Bitcoin investment' },
        { date: '2023-10-30', type: 'Purchase', amount: 7500, price: 35600, value: 267000000, description: 'Treasury optimization' }
      ],
      
      financials: {
        totalAssets: 7800000000,
        cash: 500000000,
        bitcoinPercentage: 88.7,
        lastQuarter: 'Q4 2023',
        revenue: 508000000
      }
    }
    // Add other companies here, e.g., TSLA, COIN etc.
};

export function CompanyDetails({ companyId, onBack, onViewAsset }: CompanyDetailsProps) {
  const { t } = useLanguage();
  const { isRegistered } = useAuth(); // NEW: Auth context (Req 8)
  
  const company = mockCompanyData[companyId as keyof typeof mockCompanyData] || mockCompanyData.MSTR;
  const btcHolding = company.holdings.bitcoin;

  // --- ACCESS CONTROL LOGIC (Req 8: 50% limit & blur) ---
  const obfuscate = (value: any) => {
    return isRegistered ? value : <span className="blur-sm">{value}</span>;
  };
  
  // Hide transactions for unregistered users
  const visibleTransactions = isRegistered ? company.transactions : []; 
  const isTransactionHidden = !isRegistered && company.transactions.length > 0;
  
  // Formatters (Unchanged)
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatBitcoin = (value: number) => {
    return `${value.toLocaleString()} BTC`;
  };

  const profitLossPercentage = ((btcHolding.currentValue - btcHolding.totalCost) / btcHolding.totalCost) * 100;

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
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {company.symbol.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{company.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <span>{company.symbol}</span>
                <Badge variant="outline" className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">{t(`sector.${company.sector.replace(/\s/g, '')}` as any) || company.sector}</Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4 mr-2" />
              {t('common.website')}
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewAsset('BTC')}
          >
            <Bitcoin className="w-4 h-4 mr-2" />
            {t('dashboard.bitcoinAnalytics')}
          </Button>
        </div>
      </div>

      {/* Key Metrics (with obfuscation) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('company.bitcoinHoldings')}</CardTitle>
            <Bitcoin className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(formatBitcoin(btcHolding.amount))}</div>
            <p className="text-xs text-muted-foreground">{t('company.currentHoldings')}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('company.currentValue')}</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(formatCurrency(btcHolding.currentValue))}</div>
            <p className="text-xs text-muted-foreground">{t('company.marketValue')}</p>
          </CardContent>
        </Card>
        
        {/* Cost and PnL are highly sensitive, so they are always obfuscated unless logged in */}
        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('company.unrealizedPnL')}</CardTitle>
            {profitLossPercentage >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {obfuscate(formatCurrency(btcHolding.unrealizedPnL))}
            </div>
            <p className="text-xs text-muted-foreground">
              {obfuscate(`${profitLossPercentage >= 0 ? '+' : ''}${profitLossPercentage.toFixed(1)}%`)}
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('company.averagePrice')}</CardTitle>
            <PieChart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(`$${btcHolding.averagePrice.toLocaleString()}`)}</div>
            <p className="text-xs text-muted-foreground">{t('company.perBitcoin')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('company.overview')}</TabsTrigger>
          <TabsTrigger value="holdings">{t('company.holdings')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('company.transactions')}</TabsTrigger>
          <TabsTrigger value="company">{t('company.companyInfo')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dark:bg-card dark:border-border">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">{t('company.bitcoinStrategy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{company.description}</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">{t('company.treasuryStrategy')}</h4>
                  <p className="text-blue-800 dark:text-blue-300 text-sm">{company.bitcoinStrategy}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-card dark:border-border">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">{t('company.keyMetrics')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.firstPurchase')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(btcHolding.firstPurchase)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.lastPurchase')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(btcHolding.lastPurchase)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.totalCostBasis')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(formatCurrency(btcHolding.totalCost))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.treasuryPercent')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(`${company.financials.bitcoinPercentage}%`)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Holdings Tab (with obfuscation) */}
        <TabsContent value="holdings" className="space-y-6">
          <Card className="dark:bg-card dark:border-border">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">{t('company.portfolioBreakdown')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Bitcoin Holdings */}
                <div className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Bitcoin className="w-6 h-6 text-orange-500" />
                      <span className="font-medium dark:text-gray-100">Bitcoin (BTC)</span>
                    </div>
                    <Badge variant="secondary" className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">{t('company.primaryAsset')}</Badge>
                  </div>
                  
                  {/* ... (Holdings metrics with obfuscate) ... */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('company.currentHoldings')}</p>
                      <p className="font-semibold dark:text-gray-100">{obfuscate(formatBitcoin(btcHolding.amount))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('company.marketValue')}</p>
                      <p className="font-semibold dark:text-gray-100">{obfuscate(formatCurrency(btcHolding.currentValue))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('company.avgAllocation')}</p>
                      <p className="font-semibold dark:text-gray-100">{obfuscate(`$${btcHolding.averagePrice.toLocaleString()}`)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('company.unrealizedPnL')}</p>
                      <p className={`font-semibold ${profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {obfuscate(formatCurrency(btcHolding.unrealizedPnL))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cash Holdings */}
                <div className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-6 h-6 text-green-500" />
                      <span className="font-medium dark:text-gray-100">{t('company.cashEquivalents')}</span>
                    </div>
                    <Badge variant="outline" className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">{t('company.traditionalAsset')}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('company.currentHoldings')}</p>
                      <p className="font-semibold dark:text-gray-100">{obfuscate(formatCurrency(company.financials.cash))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('company.treasuryPercent')}</p>
                      <p className="font-semibold dark:text-gray-100">{obfuscate(`${(100 - company.financials.bitcoinPercentage).toFixed(1)}%`)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab (Restricted for unregistered users) */}
        <TabsContent value="transactions" className="space-y-6">
          <Card className="dark:bg-card dark:border-border">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">{t('company.recentTransactions')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isTransactionHidden ? (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Lock className="w-8 h-8 mx-auto text-red-500 dark:text-red-400 mb-2" />
                    <p className="font-semibold text-red-600 dark:text-red-400">Transaction History is restricted.</p>
                    <p className="text-sm text-muted-foreground">请注册/登录以查看完整的交易记录。</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium dark:text-gray-100">{transaction.type}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold dark:text-gray-100">{formatBitcoin(transaction.amount)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ${transaction.price.toLocaleString()} per BTC
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold dark:text-gray-100">{formatCurrency(transaction.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Info Tab (with obfuscation) */}
        <TabsContent value="company" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dark:bg-card dark:border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                  <Building2 className="w-5 h-5" />
                  <span>{t('company.companyInformation')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.founded')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(company.founded)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.country')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(company.country)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.ceo')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(company.ceo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.employees')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(company.employees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.marketCap')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(formatCurrency(company.marketCap))}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-card dark:border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                  <Briefcase className="w-5 h-5" />
                  <span>{t('company.financialOverview')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.totalAssets')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(formatCurrency(company.financials.totalAssets))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.bitcoinHoldings')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(formatCurrency(btcHolding.currentValue))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.cashEquivalents')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(formatCurrency(company.financials.cash))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.annualRevenue')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(formatCurrency(company.financials.revenue))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('company.lastReport')}:</span>
                  <span className="font-medium dark:text-gray-100">{obfuscate(company.financials.lastQuarter)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}