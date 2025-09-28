import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Bitcoin,
  DollarSign,
  Percent,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Company {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  country: string;
  bitcoinHoldings: number;
  bitcoinValue: number;
  totalTreasuryValue: number;
  bitcoinPercentage: number;
  lastUpdated: string;
  change24h: number;
  publicCompany: boolean;
}

interface TreasuryDashboardProps {
  onViewCompany: (companyId: string) => void;
  onViewAsset: (asset: string) => void;
}

export function TreasuryDashboard({ onViewCompany, onViewAsset }: TreasuryDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sortBy, setSortBy] = useState('bitcoinValue');
  const { t } = useLanguage();

  // Mock data for companies holding Bitcoin
  const companies: Company[] = [
    {
      id: 'MSTR',
      name: 'MicroStrategy',
      symbol: 'MSTR',
      sector: t('sector.technology'),
      country: 'United States',
      bitcoinHoldings: 158245,
      bitcoinValue: 10640250000,
      totalTreasuryValue: 12000000000,
      bitcoinPercentage: 88.7,
      lastUpdated: '2024-01-15',
      change24h: 2.4,
      publicCompany: true
    },
    {
      id: 'TSLA',
      name: 'Tesla Inc.',
      symbol: 'TSLA',
      sector: t('sector.automotive'),
      country: 'United States',
      bitcoinHoldings: 9720,
      bitcoinValue: 653470000,
      totalTreasuryValue: 29000000000,
      bitcoinPercentage: 2.3,
      lastUpdated: '2024-01-14',
      change24h: -1.2,
      publicCompany: true
    },
    {
      id: 'COIN',
      name: 'Coinbase',
      symbol: 'COIN',
      sector: t('sector.financialServices'),
      country: 'United States',
      bitcoinHoldings: 9181,
      bitcoinValue: 617420000,
      totalTreasuryValue: 8500000000,
      bitcoinPercentage: 7.3,
      lastUpdated: '2024-01-15',
      change24h: 3.1,
      publicCompany: true
    },
    {
      id: 'MARA',
      name: 'Marathon Digital',
      symbol: 'MARA',
      sector: t('sector.mining'),
      country: 'United States',
      bitcoinHoldings: 15174,
      bitcoinValue: 1020180000,
      totalTreasuryValue: 1200000000,
      bitcoinPercentage: 85.0,
      lastUpdated: '2024-01-15',
      change24h: 5.7,
      publicCompany: true
    },
    {
      id: 'RIOT',
      name: 'Riot Platforms',
      symbol: 'RIOT',
      sector: t('sector.mining'),
      country: 'United States',
      bitcoinHoldings: 8872,
      bitcoinValue: 596480000,
      totalTreasuryValue: 800000000,
      bitcoinPercentage: 74.6,
      lastUpdated: '2024-01-14',
      change24h: 4.2,
      publicCompany: true
    },
    {
      id: 'BLOCK',
      name: 'Block Inc.',
      symbol: 'SQ',
      sector: t('sector.financialServices'),
      country: 'United States',
      bitcoinHoldings: 8027,
      bitcoinValue: 539620000,
      totalTreasuryValue: 6200000000,
      bitcoinPercentage: 8.7,
      lastUpdated: '2024-01-13',
      change24h: -0.8,
      publicCompany: true
    }
  ];

  // Calculate totals
  const totalBitcoin = companies.reduce((sum, company) => sum + company.bitcoinHoldings, 0);
  const totalValue = companies.reduce((sum, company) => sum + company.bitcoinValue, 0);
  const avgChange = companies.reduce((sum, company) => sum + company.change24h, 0) / companies.length;

  // Filter companies
  const filteredCompanies = companies
    .filter(company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(company => sectorFilter === 'all' || company.sector === sectorFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'bitcoinValue':
          return b.bitcoinValue - a.bitcoinValue;
        case 'bitcoinHoldings':
          return b.bitcoinHoldings - a.bitcoinHoldings;
        case 'bitcoinPercentage':
          return b.bitcoinPercentage - a.bitcoinPercentage;
        case 'change24h':
          return b.change24h - a.change24h;
        default:
          return 0;
      }
    });

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
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('dashboard.subtitle')}</p>
        </div>
        
        <div className="flex items-center space-x-2">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalHoldings')}</CardTitle>
            <Bitcoin className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBitcoin(totalBitcoin)}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.acrossCompanies').replace('{count}', companies.length.toString())}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalValue')}</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.currentMarketValue')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.avgChange')}</CardTitle>
            {avgChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">{t('dashboard.portfolioPerformance')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.companiesTracked')}</CardTitle>
            <Building2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.publicCompanies')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>{t('common.filter')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('dashboard.searchCompanies')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboard.allSectors')}</SelectItem>
                <SelectItem value={t('sector.technology')}>{t('sector.technology')}</SelectItem>
                <SelectItem value={t('sector.financialServices')}>{t('sector.financialServices')}</SelectItem>
                <SelectItem value={t('sector.mining')}>{t('sector.mining')}</SelectItem>
                <SelectItem value={t('sector.automotive')}>{t('sector.automotive')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder={t('common.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoinValue">{t('dashboard.usdValue')}</SelectItem>
                <SelectItem value="bitcoinHoldings">{t('dashboard.btcHoldings')}</SelectItem>
                <SelectItem value="bitcoinPercentage">BTC %</SelectItem>
                <SelectItem value="change24h">{t('dashboard.change24h')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.corporateHoldings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">{t('dashboard.company')}</th>
                  <th className="text-right py-3 px-4 font-medium">{t('dashboard.btcHoldings')}</th>
                  <th className="text-right py-3 px-4 font-medium">{t('dashboard.usdValue')}</th>
                  <th className="text-right py-3 px-4 font-medium">{t('dashboard.treasuryPercent')}</th>
                  <th className="text-right py-3 px-4 font-medium">{t('dashboard.change24h')}</th>
                  <th className="text-right py-3 px-4 font-medium">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {company.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <span>{company.symbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {company.sector}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {formatBitcoin(company.bitcoinHoldings)}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold">
                      {formatCurrency(company.bitcoinValue)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Percent className="w-3 h-3 text-gray-400" />
                        <span className="font-medium">{company.bitcoinPercentage.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Badge 
                        variant={company.change24h >= 0 ? "secondary" : "destructive"}
                        className={company.change24h >= 0 ? "text-green-600 bg-green-50" : ""}
                      >
                        {company.change24h >= 0 ? '+' : ''}{company.change24h.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewCompany(company.id)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}