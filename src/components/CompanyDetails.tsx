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
  Calendar,
  ExternalLink,
  Globe,
  Users,
  Briefcase,
  PieChart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CompanyDetailsProps {
  companyId: string;
  onBack: () => void;
  onViewAsset: (asset: string) => void;
}

export function CompanyDetails({ companyId, onBack, onViewAsset }: CompanyDetailsProps) {
  const { t } = useLanguage();
  // Mock detailed company data
  const companyData = {
    MSTR: {
      name: 'MicroStrategy Incorporated',
      symbol: 'MSTR',
      sector: t('sector.businessIntelligence'),
      country: 'United States',
      founded: '1989',
      employees: '4,500+',
      marketCap: 47800000000,
      website: 'https://microstrategy.com',
      ceo: 'Michael J. Saylor',
      description: 'MicroStrategy is a leading provider of enterprise analytics and mobility software. The company has been accumulating Bitcoin as a primary treasury reserve asset since August 2020.',
      bitcoinStrategy: 'MicroStrategy adopted Bitcoin as its primary treasury reserve asset, viewing it as a superior store of value compared to cash.',
      
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
        {
          date: '2024-01-10',
          type: 'Purchase',
          amount: 3000,
          price: 42500,
          value: 127500000,
          description: 'Q4 2023 Bitcoin acquisition'
        },
        {
          date: '2023-12-15',
          type: 'Purchase',
          amount: 2500,
          price: 41200,
          value: 103000000,
          description: 'Strategic treasury purchase'
        },
        {
          date: '2023-11-20',
          type: 'Purchase',
          amount: 5000,
          price: 38750,
          value: 193750000,
          description: 'Quarterly Bitcoin investment'
        },
        {
          date: '2023-10-30',
          type: 'Purchase',
          amount: 7500,
          price: 35600,
          value: 267000000,
          description: 'Treasury optimization'
        }
      ],
      
      financials: {
        totalAssets: 7800000000,
        cash: 500000000,
        bitcoinPercentage: 88.7,
        lastQuarter: 'Q4 2023',
        revenue: 508000000
      }
    }
  };

  const company = companyData[companyId as keyof typeof companyData] || companyData.MSTR;
  const btcHolding = company.holdings.bitcoin;

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
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-600">
                {company.symbol.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{company.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>{company.symbol}</span>
                <Badge variant="outline">{company.sector}</Badge>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('company.bitcoinHoldings')}</CardTitle>
            <Bitcoin className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBitcoin(btcHolding.amount)}</div>
            <p className="text-xs text-muted-foreground">{t('company.currentHoldings')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('company.currentValue')}</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(btcHolding.currentValue)}</div>
            <p className="text-xs text-muted-foreground">{t('company.marketValue')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('company.unrealizedPnL')}</CardTitle>
            {profitLossPercentage >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(btcHolding.unrealizedPnL)}
            </div>
            <p className="text-xs text-muted-foreground">
              {profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('company.averagePrice')}</CardTitle>
            <PieChart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${btcHolding.averagePrice.toLocaleString()}</div>
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
            <Card>
              <CardHeader>
                <CardTitle>Bitcoin Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{company.description}</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Treasury Strategy</h4>
                  <p className="text-blue-800 text-sm">{company.bitcoinStrategy}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Holdings Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">First Purchase:</span>
                  <span className="font-medium">{btcHolding.firstPurchase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Purchase:</span>
                  <span className="font-medium">{btcHolding.lastPurchase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost Basis:</span>
                  <span className="font-medium">{formatCurrency(btcHolding.totalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">% of Treasury:</span>
                  <span className="font-medium">{company.financials.bitcoinPercentage}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="holdings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Bitcoin Holdings */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Bitcoin className="w-6 h-6 text-orange-500" />
                      <span className="font-medium">Bitcoin (BTC)</span>
                    </div>
                    <Badge variant="secondary">Primary Asset</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold">{formatBitcoin(btcHolding.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Market Value</p>
                      <p className="font-semibold">{formatCurrency(btcHolding.currentValue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. Price</p>
                      <p className="font-semibold">${btcHolding.averagePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unrealized P&L</p>
                      <p className={`font-semibold ${profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(btcHolding.unrealizedPnL)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cash Holdings */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-6 h-6 text-green-500" />
                      <span className="font-medium">Cash & Equivalents</span>
                    </div>
                    <Badge variant="outline">Traditional Asset</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold">{formatCurrency(company.financials.cash)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">% of Treasury</p>
                      <p className="font-semibold">{(100 - company.financials.bitcoinPercentage).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bitcoin Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {company.transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">{formatBitcoin(transaction.amount)}</p>
                      <p className="text-sm text-gray-600">
                        ${transaction.price.toLocaleString()} per BTC
                      </p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(transaction.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Company Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Founded:</span>
                  <span className="font-medium">{company.founded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-medium">{company.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CEO:</span>
                  <span className="font-medium">{company.ceo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employees:</span>
                  <span className="font-medium">{company.employees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Cap:</span>
                  <span className="font-medium">{formatCurrency(company.marketCap)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Financial Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Assets:</span>
                  <span className="font-medium">{formatCurrency(company.financials.totalAssets)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bitcoin Holdings:</span>
                  <span className="font-medium">{formatCurrency(btcHolding.currentValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash & Equivalents:</span>
                  <span className="font-medium">{formatCurrency(company.financials.cash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Revenue:</span>
                  <span className="font-medium">{formatCurrency(company.financials.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Report:</span>
                  <span className="font-medium">{company.financials.lastQuarter}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}