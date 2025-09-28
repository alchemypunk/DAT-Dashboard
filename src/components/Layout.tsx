import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BarChart3, 
  Building2, 
  TrendingUp, 
  Wallet,
  Menu,
  X,
  Bitcoin,
  DollarSign,
  Sun,
  Moon,
  Languages,
  Globe
} from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onScreenChange: (screenId: string) => void;
}

export function Layout({ children, currentScreen, onScreenChange }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      icon: BarChart3,
      description: 'Overview of all corporate treasuries'
    },
    {
      id: 'asset-tracker',
      label: t('nav.assetTracker'),
      icon: Wallet,
      description: 'Track crypto assets across companies'
    },
    {
      id: 'analytics',
      label: t('nav.analytics'),
      icon: TrendingUp,
      description: 'Market trends and performance'
    }
  ];

  const languageOptions = [
    { value: 'en', label: t('lang.en'), flag: '🇺🇸' },
    { value: 'zh-CN', label: t('lang.zh-CN'), flag: '🇨🇳' },
    { value: 'zh-TW', label: t('lang.zh-TW'), flag: '🇹🇼' },
    { value: 'ko', label: t('lang.ko'), flag: '🇰🇷' },
    { value: 'ja', label: t('lang.ja'), flag: '🇯🇵' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">DAT Monitor</h1>
                <p className="text-xs text-gray-500">Digital Asset Treasury</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onScreenChange(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* Controls */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Language Selector */}
              <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="w-32">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">
                      {languageOptions.find(opt => opt.value === language)?.flag}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <span>{option.flag}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-10 h-10 p-0"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              
              {/* Market Status */}
              <div className="flex items-center space-x-2">
                <Bitcoin className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">$67,241</span>
                <Badge variant="secondary" className="text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                  +2.4%
                </Badge>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onScreenChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              {/* Mobile Controls */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Language</span>
                  <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                    <SelectTrigger className="w-24">
                      <span className="text-sm">
                        {languageOptions.find(opt => opt.value === language)?.flag}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <span>{option.flag}</span>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="w-10 h-8 p-0"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">45 {t('common.companies')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">$127.8B {t('common.totalAUM')}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('common.lastUpdated')}: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}