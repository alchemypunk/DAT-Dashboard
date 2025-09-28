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
  ExternalLink,
  Send
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext'; // NEW: Import Auth context
import { NewsFeed } from './NewsFeed'; // NEW: Import NewsFeed

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
  onShowSubmit: () => void; // NEW: Prop to navigate to submission form
}

// MOCK DATA (Should be fetched/managed by admin, fulfilling Req 3)
const mockCompanies: Company[] = [
    { id: 'MSTR', name: 'MicroStrategy', symbol: 'MSTR', sector: 'Business Intelligence', country: 'United States', bitcoinHoldings: 158245, bitcoinValue: 10640250000, totalTreasuryValue: 12000000000, bitcoinPercentage: 88.7, lastUpdated: '2024-01-15', change24h: 2.4, publicCompany: true },
    { id: 'TSLA', name: 'Tesla Inc.', symbol: 'TSLA', sector: 'Automotive', country: 'United States', bitcoinHoldings: 9720, bitcoinValue: 653470000, totalTreasuryValue: 29000000000, bitcoinPercentage: 2.3, lastUpdated: '2024-01-14', change24h: -1.2, publicCompany: true },
    { id: 'COIN', name: 'Coinbase', symbol: 'COIN', sector: 'Financial Services', country: 'United States', bitcoinHoldings: 9181, bitcoinValue: 617420000, totalTreasuryValue: 8500000000, bitcoinPercentage: 7.3, lastUpdated: '2024-01-15', change24h: 3.1, publicCompany: true },
    { id: 'MARA', name: 'Marathon Digital', symbol: 'MARA', sector: 'Mining', country: 'United States', bitcoinHoldings: 15174, bitcoinValue: 1020180000, totalTreasuryValue: 1200000000, bitcoinPercentage: 85.0, lastUpdated: '2024-01-15', change24h: 5.7, publicCompany: true },
    { id: 'RIOT', name: 'Riot Platforms', symbol: 'RIOT', sector: 'Mining', country: 'United States', bitcoinHoldings: 8872, bitcoinValue: 596480000, totalTreasuryValue: 800000000, bitcoinPercentage: 74.6, lastUpdated: '2024-01-14', change24h: 4.2, publicCompany: true },
    { id: 'BLOCK', name: 'Block Inc.', symbol: 'SQ', sector: 'Financial Services', country: 'United States', bitcoinHoldings: 8027, bitcoinValue: 539620000, totalTreasuryValue: 6200000000, bitcoinPercentage: 8.7, lastUpdated: '2024-01-13', change24h: -0.8, publicCompany: true },
    // Hidden data for illustration purposes
    { id: 'Hidden1', name: 'Hidden Corp 1', symbol: 'HC1', sector: 'Technology', country: 'United States', bitcoinHoldings: 5000, bitcoinValue: 336205000, totalTreasuryValue: 4000000000, bitcoinPercentage: 8.4, lastUpdated: '2024-01-13', change24h: 1.5, publicCompany: true },
    { id: 'Hidden2', name: 'Hidden Corp 2', symbol: 'HC2', sector: 'Energy', country: 'United States', bitcoinHoldings: 4500, bitcoinValue: 302584500, totalTreasuryValue: 3500000000, bitcoinPercentage: 8.6, lastUpdated: '2024-01-13', change24h: 0.1, publicCompany: true },
];

export function TreasuryDashboard({ onViewCompany, onViewAsset, onShowSubmit }: TreasuryDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sortBy, setSortBy] = useState('bitcoinValue');
  const [asset, setAsset] = useState('BTC'); // NEW: Asset State (Req 6)
  const { t } = useLanguage();
  const { isRegistered } = useAuth(); // NEW: Auth context (Req 8)

  const data = mockCompanies;
  const totalCompanies = data.length;

  // --- ACCESS CONTROL LOGIC (Req 8: 50% limit & blur) ---
  const visibleDataCount = isRegistered ? totalCompanies : Math.ceil(totalCompanies / 2);
  
  const filteredCompanies = data
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
    })
    .slice(0, visibleDataCount); // Apply 50% limit here

  // Calculate totals based on ALL data for accurate summary cards (less sensitive)
  const totalHoldings = data.reduce((sum, company) => sum + company.bitcoinHoldings, 0);
  const totalValue = data.reduce((sum, company) => sum + company.bitcoinValue, 0);
  const avgChange = data.reduce((sum, company) => sum + company.change24h, 0) / data.length;

  // Function to wrap sensitive data with blur class
  const obfuscate = (value: any) => {
    return isRegistered ? value : <span className="blur-sm">{value}</span>;
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatBitcoin = (value: number) => {
    return `${value.toLocaleString()} ${asset}`;
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
            {/* Asset Switcher (Req 6) */}
            <Select value={asset} onValueChange={setAsset}>
                <SelectTrigger className="w-24">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
            </Select>

            {/* View Asset Tracker Button */}
            <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewAsset(asset)}
            >
                <Bitcoin className="w-4 h-4 mr-2" />
                {asset} {t('dashboard.bitcoinAnalytics')}
            </Button>
            
            {/* Submit Data Button (Req 4) */}
            <Button 
                variant="default" 
                size="sm"
                onClick={onShowSubmit}
            >
                <Send className="w-4 h-4 mr-2" />
                {t('nav.submitData')}
            </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('dashboard.totalHoldings')}</CardTitle>
            <Bitcoin className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(formatBitcoin(totalHoldings))}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.acrossCompanies').replace('{count}', totalCompanies.toString())}</p>
          </CardContent>
        </Card>

        {/* ... (Other Summary Cards with obfuscate applied) ... */}
        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('dashboard.totalValue')}</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(formatCurrency(totalValue))}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.currentMarketValue')}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('dashboard.avgChange')}</CardTitle>
            {avgChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {obfuscate(`${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(1)}%`)}
            </div>
            <p className="text-xs text-muted-foreground">{t('dashboard.portfolioPerformance')}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-400">{t('dashboard.companiesTracked')}</CardTitle>
            <Building2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{obfuscate(data.length)}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.publicCompanies')}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* News Feed (Req 7) */}
      <NewsFeed onShowSubmit={onShowSubmit} />

      {/* Filters and Search */}
      <Card className="dark:bg-card dark:border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
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
            {/* ... (Other filters remain the same) ... */}
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboard.allSectors')}</SelectItem>
                <SelectItem value="Technology">{t('sector.technology')}</SelectItem>
                <SelectItem value="Financial Services">{t('sector.financialServices')}</SelectItem>
                <SelectItem value="Mining">{t('sector.mining')}</SelectItem>
                <SelectItem value="Automotive">{t('sector.automotive')}</SelectItem>
                <SelectItem value="Business Intelligence">{t('sector.businessIntelligence')}</SelectItem>
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
      <Card className="dark:bg-card dark:border-border">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">{t('dashboard.corporateHoldings')} {isRegistered ? '' : `(${t('dashboard.totalHoldings')} 50% Limit)`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium dark:text-gray-400">{t('dashboard.company')}</th>
                  <th className="text-right py-3 px-4 font-medium dark:text-gray-400">{t('dashboard.btcHoldings')}</th>
                  <th className="text-right py-3 px-4 font-medium dark:text-gray-400">{t('dashboard.usdValue')}</th>
                  <th className="text-right py-3 px-4 font-medium dark:text-gray-400">{t('dashboard.treasuryPercent')}</th>
                  <th className="text-right py-3 px-4 font-medium dark:text-gray-400">{t('dashboard.change24h')}</th>
                  <th className="text-right py-3 px-4 font-medium dark:text-gray-400">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-b dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {company.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium dark:text-gray-100">{company.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                            <span>{company.symbol}</span>
                            <Badge variant="outline" className="text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                              {company.sector}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono dark:text-gray-200">
                      {obfuscate(formatBitcoin(company.bitcoinHoldings))}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold dark:text-gray-100">
                      {obfuscate(formatCurrency(company.bitcoinValue))}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1 dark:text-gray-300">
                        <Percent className="w-3 h-3 text-gray-400" />
                        <span className="font-medium">{obfuscate(`${company.bitcoinPercentage.toFixed(1)}%`)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Badge 
                        variant={company.change24h >= 0 ? "secondary" : "destructive"}
                        className={`${company.change24h >= 0 ? "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400" : ""} ${isRegistered ? "" : "blur-sm"}`}
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
                        <ExternalLink className="w-4 h-4 dark:text-gray-400" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isRegistered && totalCompanies > 0 && (
                <div className="text-center p-4 text-sm text-blue-600 dark:text-blue-400">
                    {t('dashboard.totalHoldings')} {Math.floor(totalCompanies / 2)} items shown. Register to view all {totalCompanies} records.
                </div>
            )}
            {totalCompanies === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    {t('common.loading')} {t('dashboard.corporateHoldings')}... (No data currently available. Please submit new data via Admin Panel)
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}