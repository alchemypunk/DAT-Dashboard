import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'ko' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  en: {
    nav: {
      dashboard: 'Treasury Dashboard',
      assetTracker: 'Asset Tracker',
      analytics: 'Analytics',
      backToDashboard: 'Back to Dashboard'
    },
    
    common: {
      loading: 'Loading...',
      search: 'Search...',
      filter: 'Filter',
      sortBy: 'Sort by',
      actions: 'Actions',
      back: 'Back',
      website: 'Website',
      viewDetails: 'View Details',
      lastUpdated: 'Last updated',
      companies: 'Companies',
      totalAUM: 'Total AUM'
    },
    
    dashboard: {
      title: 'Treasury Dashboard',
      subtitle: 'Corporate Bitcoin treasury holdings tracker',
      totalHoldings: 'Total Bitcoin Holdings',
      totalValue: 'Total USD Value',
      avgChange: 'Average 24h Change',
      companiesTracked: 'Companies Tracked',
      currentMarketValue: 'Current market value',
      acrossCompanies: 'Across {count} companies',
      portfolioPerformance: 'Portfolio performance',
      publicCompanies: 'Public companies',
      bitcoinAnalytics: 'Bitcoin Analytics',
      searchCompanies: 'Search companies...',
      allSectors: 'All Sectors',
      corporateHoldings: 'Corporate Bitcoin Holdings',
      company: 'Company',
      btcHoldings: 'BTC Holdings',
      usdValue: 'USD Value',
      treasuryPercent: '% of Treasury',
      change24h: '24h Change'
    },
    
    company: {
      bitcoinStrategy: 'Bitcoin Strategy',
      keyMetrics: 'Key Holdings Metrics',
      bitcoinHoldings: 'Bitcoin Holdings',
      currentValue: 'Current Value',
      unrealizedPnL: 'Unrealized P&L',
      averagePrice: 'Average Price',
      currentHoldings: 'Current holdings',
      marketValue: 'Market value',
      perBitcoin: 'Per Bitcoin',
      overview: 'Overview',
      holdings: 'Holdings',
      transactions: 'Transactions',
      companyInfo: 'Company Info',
      treasuryStrategy: 'Treasury Strategy',
      firstPurchase: 'First Purchase',
      lastPurchase: 'Last Purchase',
      totalCostBasis: 'Total Cost Basis',
      portfolioBreakdown: 'Portfolio Breakdown',
      primaryAsset: 'Primary Asset',
      traditionalAsset: 'Traditional Asset',
      cashEquivalents: 'Cash & Equivalents',
      recentTransactions: 'Recent Bitcoin Transactions',
      companyInformation: 'Company Information',
      founded: 'Founded',
      country: 'Country',
      ceo: 'CEO',
      employees: 'Employees',
      marketCap: 'Market Cap',
      financialOverview: 'Financial Overview',
      totalAssets: 'Total Assets',
      annualRevenue: 'Annual Revenue',
      lastReport: 'Last Report'
    },
    
    asset: {
      title: 'Bitcoin Asset Tracker',
      subtitle: 'Corporate Bitcoin holdings analysis',
      corporateHoldings: 'Corporate Holdings',
      totalValue: 'Total Value',
      marketCap: 'Market Cap',
      volume24h: '24h Volume',
      acrossTrackedCompanies: 'Across tracked companies',
      usdMarketValue: 'USD market value',
      totalBitcoinMarketCap: 'Total Bitcoin market cap',
      tradingVolume: 'Trading volume',
      corporateHoldingsTitle: 'Corporate Holdings',
      marketData: 'Market Data',
      distribution: 'Distribution',
      pricePerformance: 'Price Performance',
      supplyInformation: 'Supply Information',
      circulatingSupply: 'Circulating Supply',
      totalSupply: 'Total Supply',
      supplyProgress: 'Supply Progress',
      recentPriceHistory: 'Recent Price History',
      holdingsBySector: 'Holdings by Sector',
      topHoldingsSummary: 'Top Holdings Summary',
      totalCorporateHoldings: 'Total Corporate Holdings',
      largestHolder: 'Largest Holder',
      companiesTracked: 'Companies Tracked'
    },
    
    analytics: {
      title: 'Treasury Analytics',
      subtitle: 'Market trends and performance insights',
      totalMarketValue: 'Total Market Value',
      totalBtcHoldings: 'Total BTC Holdings',
      avgAllocation: 'Avg. Allocation',
      topPerformer: 'Top Performer',
      allCorporateHoldings: 'All corporate holdings',
      acrossAllCompanies: 'Across all companies',
      ofTreasuryAssets: 'Of treasury assets',
      byTotalHoldings: 'By total holdings',
      performanceOverTime: 'Performance Over Time',
      sectorAnalysis: 'Sector Analysis',
      marketTrends: 'Market Trends',
      recentMilestones: 'Recent Milestones',
      increasingAdoption: 'Increasing Corporate Adoption',
      miningLeading: 'Mining Companies Leading',
      diverseSectors: 'Diverse Sector Participation',
      longTermFocus: 'Long-term Strategy Focus',
      highImpact: 'high impact',
      mediumImpact: 'medium impact',
      lowImpact: 'low impact'
    },
    
    sector: {
      technology: 'Technology',
      mining: 'Mining',
      financialServices: 'Financial Services',
      automotive: 'Automotive',
      businessIntelligence: 'Business Intelligence Software'
    },
    
    time: {
      '24h': '24 Hours',
      '7d': '7 Days',
      '30d': '30 Days',
      '90d': '90 Days',
      '1y': '1 Year',
      '1week': '1 Week',
      '2weeks': '2 Weeks',
      '1month': '1 Month',
      '3months': '3 Months',
      '6months': '6 Months'
    },
    
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode',
      toggle: 'Toggle Theme'
    },
    
    lang: {
      en: 'English',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      ko: '한국어',
      ja: '日本語'
    }
  },
  
  'zh-CN': {
    nav: {
      dashboard: '资产管理面板',
      assetTracker: '资产追踪器',
      analytics: '分析报告',
      backToDashboard: '返回面板'
    },
    
    common: {
      loading: '加载中...',
      search: '搜索...',
      filter: '筛选',
      sortBy: '排序方式',
      actions: '操作',
      back: '返回',
      website: '官网',
      viewDetails: '查看详情',
      lastUpdated: '最后更新',
      companies: '家公司',
      totalAUM: '总管理资产'
    },
    
    dashboard: {
      title: '资产管理面板',
      subtitle: '企业比特币资产持仓追踪器',
      totalHoldings: '比特币总持仓',
      totalValue: '美元总价值',
      avgChange: '24小时平均涨跌',
      companiesTracked: '追踪公司数',
      currentMarketValue: '当前市值',
      acrossCompanies: '横跨 {count} 家公司',
      portfolioPerformance: '投资组合表现',
      publicCompanies: '上市公司',
      bitcoinAnalytics: '比特币分析',
      searchCompanies: '搜索公司...',
      allSectors: '所有行业',
      corporateHoldings: '企业比特币持仓',
      company: '公司',
      btcHoldings: 'BTC持仓',
      usdValue: '美元价值',
      treasuryPercent: '资产占比',
      change24h: '24小时涨跌'
    },
    
    company: {
      bitcoinStrategy: '比特币策略',
      keyMetrics: '关键持仓指标',
      bitcoinHoldings: '比特币持仓',
      currentValue: '当前价值',
      unrealizedPnL: '未实现盈亏',
      averagePrice: '平均价格',
      currentHoldings: '当前持仓',
      marketValue: '市场价值',
      perBitcoin: '每个比特币',
      overview: '概览',
      holdings: '持仓',
      transactions: '交易记录',
      companyInfo: '公司信息',
      treasuryStrategy: '资产管理策略',
      firstPurchase: '首次购买',
      lastPurchase: '最近购买',
      totalCostBasis: '总成本基础',
      portfolioBreakdown: '投资组合分解',
      primaryAsset: '主要资产',
      traditionalAsset: '传统资产',
      cashEquivalents: '现金及等价物',
      recentTransactions: '最近比特币交易',
      companyInformation: '公司信息',
      founded: '成立年份',
      country: '国家',
      ceo: '首席执行官',
      employees: '员工数量',
      marketCap: '市值',
      financialOverview: '财务概览',
      totalAssets: '总资产',
      annualRevenue: '年收入',
      lastReport: '最新报告'
    },
    
    asset: {
      title: '比特币资产追踪器',
      subtitle: '企业比特币持仓分析',
      corporateHoldings: '企业持仓',
      totalValue: '总价值',
      marketCap: '市值',
      volume24h: '24小时交易量',
      acrossTrackedCompanies: '跨追踪公司',
      usdMarketValue: '美元市值',
      totalBitcoinMarketCap: '比特币总市值',
      tradingVolume: '交易量',
      corporateHoldingsTitle: '企业持仓',
      marketData: '市场数据',
      distribution: '分布情况',
      pricePerformance: '价格表现',
      supplyInformation: '供应信息',
      circulatingSupply: '流通供应量',
      totalSupply: '总供应量',
      supplyProgress: '供应进度',
      recentPriceHistory: '近期价格历史',
      holdingsBySector: '按行业持仓',
      topHoldingsSummary: '顶级持仓摘要',
      totalCorporateHoldings: '企业总持仓',
      largestHolder: '最大持有者',
      companiesTracked: '追踪公司'
    },
    
    analytics: {
      title: '资产分析',
      subtitle: '市场趋势和表现洞察',
      totalMarketValue: '总市值',
      totalBtcHoldings: 'BTC总持仓',
      avgAllocation: '平均配置',
      topPerformer: '最佳表现',
      allCorporateHoldings: '所有企业持仓',
      acrossAllCompanies: '跨所有公司',
      ofTreasuryAssets: '资产占比',
      byTotalHoldings: '按总持仓',
      performanceOverTime: '时间表现',
      sectorAnalysis: '行业分析',
      marketTrends: '市场趋势',
      recentMilestones: '最近里程碑',
      increasingAdoption: '企业采用增加',
      miningLeading: '挖矿公司领先',
      diverseSectors: '多元化行业参与',
      longTermFocus: '长期战略重点',
      highImpact: '高影响',
      mediumImpact: '中等影响',
      lowImpact: '低影响'
    },
    
    sector: {
      technology: '科技',
      mining: '挖矿',
      financialServices: '金融服务',
      automotive: '汽车',
      businessIntelligence: '商业智能软件'
    },
    
    time: {
      '24h': '24小时',
      '7d': '7天',
      '30d': '30天',
      '90d': '90天',
      '1y': '1年',
      '1week': '1周',
      '2weeks': '2周',
      '1month': '1个月',
      '3months': '3个月',
      '6months': '6个月'
    },
    
    theme: {
      light: '浅色模式',
      dark: '深色模式',
      toggle: '切换主题'
    },
    
    lang: {
      en: 'English',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      ko: '한국어',
      ja: '日本語'
    }
  },
  
  'zh-TW': {
    nav: {
      dashboard: '資產管理面板',
      assetTracker: '資產追蹤器',
      analytics: '分析報告',
      backToDashboard: '返回面板'
    },
    
    common: {
      loading: '載入中...',
      search: '搜尋...',
      filter: '篩選',
      sortBy: '排序方式',
      actions: '操作',
      back: '返回',
      website: '官網',
      viewDetails: '檢視詳情',
      lastUpdated: '最後更新',
      companies: '家公司',
      totalAUM: '總管理資產'
    },
    
    dashboard: {
      title: '資產管理面板',
      subtitle: '企業比特幣資產持倉追蹤器',
      totalHoldings: '比特幣總持倉',
      totalValue: '美元總價值',
      avgChange: '24小時平均漲跌',
      companiesTracked: '追蹤公司數',
      currentMarketValue: '當前市值',
      acrossCompanies: '橫跨 {count} 家公司',
      portfolioPerformance: '投資組合表現',
      publicCompanies: '上市公司',
      bitcoinAnalytics: '比特幣分析',
      searchCompanies: '搜尋公司...',
      allSectors: '所有行業',
      corporateHoldings: '企業比特幣持倉',
      company: '公司',
      btcHoldings: 'BTC持倉',
      usdValue: '美元價值',
      treasuryPercent: '資產占比',
      change24h: '24小時漲跌'
    },
    
    company: {
      bitcoinStrategy: '比特幣策略',
      keyMetrics: '關鍵持倉指標',
      bitcoinHoldings: '比特幣持倉',
      currentValue: '當前價值',
      unrealizedPnL: '未實現盈虧',
      averagePrice: '平均價格',
      currentHoldings: '當前持倉',
      marketValue: '市場價值',
      perBitcoin: '每個比特幣',
      overview: '概覽',
      holdings: '持倉',
      transactions: '交易記錄',
      companyInfo: '公司資訊',
      treasuryStrategy: '資產管理策略',
      firstPurchase: '首次購買',
      lastPurchase: '最近購買',
      totalCostBasis: '總成本基礎',
      portfolioBreakdown: '投資組合分解',
      primaryAsset: '主要資產',
      traditionalAsset: '傳統資產',
      cashEquivalents: '現金及等價物',
      recentTransactions: '最近比特幣交易',
      companyInformation: '公司資訊',
      founded: '成立年份',
      country: '國家',
      ceo: '執行長',
      employees: '員工數量',
      marketCap: '市值',
      financialOverview: '財務概覽',
      totalAssets: '總資產',
      annualRevenue: '年收入',
      lastReport: '最新報告'
    },
    
    asset: {
      title: '比特幣資產追蹤器',
      subtitle: '企業比特幣持倉分析',
      corporateHoldings: '企業持倉',
      totalValue: '總價值',
      marketCap: '市值',
      volume24h: '24小時交易量',
      acrossTrackedCompanies: '跨追蹤公司',
      usdMarketValue: '美元市值',
      totalBitcoinMarketCap: '比特幣總市值',
      tradingVolume: '交易量',
      corporateHoldingsTitle: '企業持倉',
      marketData: '市場數據',
      distribution: '分佈情況',
      pricePerformance: '價格表現',
      supplyInformation: '供應資訊',
      circulatingSupply: '流通供應量',
      totalSupply: '總供應量',
      supplyProgress: '供應進度',
      recentPriceHistory: '近期價格歷史',
      holdingsBySector: '按行業持倉',
      topHoldingsSummary: '頂級持倉摘要',
      totalCorporateHoldings: '企業總持倉',
      largestHolder: '最大持有者',
      companiesTracked: '追蹤公司'
    },
    
    analytics: {
      title: '資產分析',
      subtitle: '市場趨勢和表現洞察',
      totalMarketValue: '總市值',
      totalBtcHoldings: 'BTC總持倉',
      avgAllocation: '平均配置',
      topPerformer: '最佳表現',
      allCorporateHoldings: '所有企業持倉',
      acrossAllCompanies: '跨所有公司',
      ofTreasuryAssets: '資產占比',
      byTotalHoldings: '按總持倉',
      performanceOverTime: '時間表現',
      sectorAnalysis: '行業分析',
      marketTrends: '市場趨勢',
      recentMilestones: '最近里程碑',
      increasingAdoption: '企業採用增加',
      miningLeading: '挖礦公司領先',
      diverseSectors: '多元化行業參與',
      longTermFocus: '長期戰略重點',
      highImpact: '高影響',
      mediumImpact: '中等影響',
      lowImpact: '低影響'
    },
    
    sector: {
      technology: '科技',
      mining: '挖礦',
      financialServices: '金融服務',
      automotive: '汽車',
      businessIntelligence: '商業智能軟體'
    },
    
    time: {
      '24h': '24小時',
      '7d': '7天',
      '30d': '30天',
      '90d': '90天',
      '1y': '1年',
      '1week': '1週',
      '2weeks': '2週',
      '1month': '1個月',
      '3months': '3個月',
      '6months': '6個月'
    },
    
    theme: {
      light: '淺色模式',
      dark: '深色模式',
      toggle: '切換主題'
    },
    
    lang: {
      en: 'English',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      ko: '한국어',
      ja: '日本語'
    }
  },
  
  ko: {
    nav: {
      dashboard: '자산 관리 대시보드',
      assetTracker: '자산 추적기',
      analytics: '분석 보고서',
      backToDashboard: '대시보드로 돌아가기'
    },
    
    common: {
      loading: '로딩 중...',
      search: '검색...',
      filter: '필터',
      sortBy: '정렬 기준',
      actions: '작업',
      back: '뒤로',
      website: '웹사이트',
      viewDetails: '세부 정보 보기',
      lastUpdated: '마지막 업데이트',
      companies: '개 회사',
      totalAUM: '총 관리 자산'
    },
    
    dashboard: {
      title: '자산 관리 대시보드',
      subtitle: '기업 비트코인 자산 보유 추적기',
      totalHoldings: '총 비트코인 보유량',
      totalValue: '총 달러 가치',
      avgChange: '24시간 평균 변화율',
      companiesTracked: '추적 회사 수',
      currentMarketValue: '현재 시장 가치',
      acrossCompanies: '{count}개 회사 전체',
      portfolioPerformance: '포트폴리오 성과',
      publicCompanies: '상장 회사',
      bitcoinAnalytics: '비트코인 분석',
      searchCompanies: '회사 검색...',
      allSectors: '모든 섹터',
      corporateHoldings: '기업 비트코인 보유량',
      company: '회사',
      btcHoldings: 'BTC 보유량',
      usdValue: '달러 가치',
      treasuryPercent: '자산 비율',
      change24h: '24시간 변화'
    },
    
    company: {
      bitcoinStrategy: '비트코인 전략',
      keyMetrics: '주요 보유 지표',
      bitcoinHoldings: '비트코인 보유량',
      currentValue: '현재 가치',
      unrealizedPnL: '미실현 손익',
      averagePrice: '평균 가격',
      currentHoldings: '현재 보유량',
      marketValue: '시장 가치',
      perBitcoin: '비트코인당',
      overview: '개요',
      holdings: '보유량',
      transactions: '거래 기록',
      companyInfo: '회사 정보',
      treasuryStrategy: '자산 관리 전략',
      firstPurchase: '첫 구매',
      lastPurchase: '최근 구매',
      totalCostBasis: '총 비용 기준',
      portfolioBreakdown: '포트폴리오 분석',
      primaryAsset: '주요 자산',
      traditionalAsset: '전통 자산',
      cashEquivalents: '현금 및 현금성 자산',
      recentTransactions: '최근 비트코인 거래',
      companyInformation: '회사 정보',
      founded: '설립년도',
      country: '국가',
      ceo: '최고경영자',
      employees: '직원 수',
      marketCap: '시가총액',
      financialOverview: '재무 개요',
      totalAssets: '총 자산',
      annualRevenue: '연간 수익',
      lastReport: '최신 보고서'
    },
    
    asset: {
      title: '비트코인 자산 추적기',
      subtitle: '기업 비트코인 보유량 분석',
      corporateHoldings: '기업 보유량',
      totalValue: '총 가치',
      marketCap: '시가총액',
      volume24h: '24시간 거래량',
      acrossTrackedCompanies: '추적 회사 전체',
      usdMarketValue: '달러 시장 가치',
      totalBitcoinMarketCap: '비트코인 총 시가총액',
      tradingVolume: '거래량',
      corporateHoldingsTitle: '기업 보유량',
      marketData: '시장 데이터',
      distribution: '분포',
      pricePerformance: '가격 성과',
      supplyInformation: '공급 정보',
      circulatingSupply: '유통 공급량',
      totalSupply: '총 공급량',
      supplyProgress: '공급 진행률',
      recentPriceHistory: '최근 가격 이력',
      holdingsBySector: '섹터별 보유량',
      topHoldingsSummary: '주요 보유량 요약',
      totalCorporateHoldings: '총 기업 보유량',
      largestHolder: '최대 보유자',
      companiesTracked: '추적 회사'
    },
    
    analytics: {
      title: '자산 분석',
      subtitle: '시장 동향 및 성과 인사이트',
      totalMarketValue: '총 시장 가치',
      totalBtcHoldings: '총 BTC 보유량',
      avgAllocation: '평균 할당',
      topPerformer: '최우수 성과',
      allCorporateHoldings: '모든 기업 보유량',
      acrossAllCompanies: '모든 회사 전체',
      ofTreasuryAssets: '자산 비율',
      byTotalHoldings: '총 보유량 기준',
      performanceOverTime: '시간별 성과',
      sectorAnalysis: '섹터 분석',
      marketTrends: '시장 동향',
      recentMilestones: '최근 마일스톤',
      increasingAdoption: '기업 채택 증가',
      miningLeading: '채굴 회사 선도',
      diverseSectors: '다양한 섹터 참여',
      longTermFocus: '장기 전략 집중',
      highImpact: '높은 영향',
      mediumImpact: '중간 영향',
      lowImpact: '낮은 영향'
    },
    
    sector: {
      technology: '기술',
      mining: '채굴',
      financialServices: '금융 서비스',
      automotive: '자동차',
      businessIntelligence: '비즈니스 인텔리전스 소프트웨어'
    },
    
    time: {
      '24h': '24시간',
      '7d': '7일',
      '30d': '30일',
      '90d': '90일',
      '1y': '1년',
      '1week': '1주',
      '2weeks': '2주',
      '1month': '1개월',
      '3months': '3개월',
      '6months': '6개월'
    },
    
    theme: {
      light: '라이트 모드',
      dark: '다크 모드',
      toggle: '테마 전환'
    },
    
    lang: {
      en: 'English',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      ko: '한국어',
      ja: '日本語'
    }
  },
  
  ja: {
    nav: {
      dashboard: '資産管理ダッシュボード',
      assetTracker: '資産トラッカー',
      analytics: '分析レポート',
      backToDashboard: 'ダッシュボードに戻る'
    },
    
    common: {
      loading: '読み込み中...',
      search: '検索...',
      filter: 'フィルター',
      sortBy: '並び替え',
      actions: 'アクション',
      back: '戻る',
      website: 'ウェブサイト',
      viewDetails: '詳細を見る',
      lastUpdated: '最終更新',
      companies: '社',
      totalAUM: '総運用資産'
    },
    
    dashboard: {
      title: '資産管理ダッシュボード',
      subtitle: '企業ビットコイン資産保有追跡システム',
      totalHoldings: 'ビットコイン総保有量',
      totalValue: '総ドル価値',
      avgChange: '24時間平均変化率',
      companiesTracked: '追跡企業数',
      currentMarketValue: '現在の市場価値',
      acrossCompanies: '{count}社全体',
      portfolioPerformance: 'ポートフォリオパフォーマンス',
      publicCompanies: '上場企業',
      bitcoinAnalytics: 'ビットコイン分析',
      searchCompanies: '企業を検索...',
      allSectors: '全セクター',
      corporateHoldings: '企業ビットコイン保有量',
      company: '企業',
      btcHoldings: 'BTC保有量',
      usdValue: 'ドル価値',
      treasuryPercent: '資産比率',
      change24h: '24時間変化'
    },
    
    company: {
      bitcoinStrategy: 'ビットコイン戦略',
      keyMetrics: '主要保有指標',
      bitcoinHoldings: 'ビットコイン保有量',
      currentValue: '現在価値',
      unrealizedPnL: '未実現損益',
      averagePrice: '平均価格',
      currentHoldings: '現在保有量',
      marketValue: '市場価値',
      perBitcoin: 'ビットコイン当たり',
      overview: '概要',
      holdings: '保有量',
      transactions: '取引履歴',
      companyInfo: '企業情報',
      treasuryStrategy: '資産管理戦略',
      firstPurchase: '初回購入',
      lastPurchase: '最近の購入',
      totalCostBasis: '総コストベース',
      portfolioBreakdown: 'ポートフォリオ内訳',
      primaryAsset: '主要資産',
      traditionalAsset: '従来資産',
      cashEquivalents: '現金及び現金同等物',
      recentTransactions: '最近のビットコイン取引',
      companyInformation: '企業情報',
      founded: '設立年',
      country: '国',
      ceo: '最高経営責任者',
      employees: '従業員数',
      marketCap: '時価総額',
      financialOverview: '財務概要',
      totalAssets: '総資産',
      annualRevenue: '年間収益',
      lastReport: '最新レポート'
    },
    
    asset: {
      title: 'ビットコイン資産トラッカー',
      subtitle: '企業ビットコイン保有量分析',
      corporateHoldings: '企業保有量',
      totalValue: '総価値',
      marketCap: '時価総額',
      volume24h: '24時間取引量',
      acrossTrackedCompanies: '追跡企業全体',
      usdMarketValue: 'ドル市場価値',
      totalBitcoinMarketCap: 'ビットコイン総時価総額',
      tradingVolume: '取引量',
      corporateHoldingsTitle: '企業保有量',
      marketData: '市場データ',
      distribution: '分布',
      pricePerformance: '価格パフォーマンス',
      supplyInformation: '供給情報',
      circulatingSupply: '流通供給量',
      totalSupply: '総供給量',
      supplyProgress: '供給進捗',
      recentPriceHistory: '最近の価格履歴',
      holdingsBySector: 'セクター別保有量',
      topHoldingsSummary: '上位保有量サマリー',
      totalCorporateHoldings: '企業総保有量',
      largestHolder: '最大保有者',
      companiesTracked: '追跡企業'
    },
    
    analytics: {
      title: '資産分析',
      subtitle: '市場動向とパフォーマンス洞察',
      totalMarketValue: '総市場価値',
      totalBtcHoldings: '総BTC保有量',
      avgAllocation: '平均配分',
      topPerformer: 'トップパフォーマー',
      allCorporateHoldings: '全企業保有量',
      acrossAllCompanies: '全企業全体',
      ofTreasuryAssets: '資産比率',
      byTotalHoldings: '総保有量別',
      performanceOverTime: '時系列パフォーマンス',
      sectorAnalysis: 'セクター分析',
      marketTrends: '市場動向',
      recentMilestones: '最近のマイルストーン',
      increasingAdoption: '企業採用の増加',
      miningLeading: 'マイニング企業の先導',
      diverseSectors: '多様なセクター参加',
      longTermFocus: '長期戦略重点',
      highImpact: '高影響',
      mediumImpact: '中影響',
      lowImpact: '低影響'
    },
    
    sector: {
      technology: 'テクノロジー',
      mining: 'マイニング',
      financialServices: '金融サービス',
      automotive: '自動車',
      businessIntelligence: 'ビジネスインテリジェンスソフトウェア'
    },
    
    time: {
      '24h': '24時間',
      '7d': '7日',
      '30d': '30日',
      '90d': '90日',
      '1y': '1年',
      '1week': '1週間',
      '2weeks': '2週間',
      '1month': '1ヶ月',
      '3months': '3ヶ月',
      '6months': '6ヶ月'
    },
    
    theme: {
      light: 'ライトモード',
      dark: 'ダークモード',
      toggle: 'テーマ切り替え'
    },
    
    lang: {
      en: 'English',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      ko: '한국어',
      ja: '日本語'
    }
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
        return key;
      }
      current = current[k];
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}