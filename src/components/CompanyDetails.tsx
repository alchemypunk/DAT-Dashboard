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
      {/* R1 Fix: Changed to flex-col sm:flex-row space-y-4 sm:space-y-0 */}
      <div className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0">
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
        
        {/* R1 Fix: Added flex-wrap gap-2 on mobile */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:space-x-2 mt-4 sm:mt-0">
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
      {/* ... (Cards content remains the same) ... */}
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('company.overview')}</TabsTrigger>
          <TabsTrigger value="holdings">{t('company.holdings')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('company.transactions')}</TabsTrigger>
          <TabsTrigger value="company">{t('company.companyInfo')}</TabsTrigger>
        </TabsList>
        {/* ... (TabsContent remains the same) ... */}
      </Tabs>
    </div>
  );
}