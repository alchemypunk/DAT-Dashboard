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
  Globe,
  Wrench,
  Send,
  LogOut,
  User
} from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onScreenChange: (screenId: string) => void;
}

export function Layout({ children, currentScreen, onScreenChange }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isRegistered, isAdmin, login, logout, register } = useAuth(); // Use useAuth

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
    },
    // New Admin Panel for admin users
    ...(isAdmin ? [{
      id: 'admin',
      label: t('nav.adminPanel'),
      icon: Wrench,
      description: 'Manage data and users'
    }] : [])
  ];
  
  // New action button for submitting data
  const submitDataButton = {
    id: 'submit-data',
    label: t('nav.submitData'),
    icon: Send,
    description: 'Manually submit new data for review'
  }

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
  
  const handleAuthClick = (asAdmin: boolean = false) => {
    if (isRegistered) {
      logout();
    } else {
      // For simplicity, a single button handles login/register/admin
      if (asAdmin) {
        login(true);
      } else {
        login(false);
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    // Dark mode fix 1: Add dark background to the whole app container
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900"> 
      {/* Header */}
      {/* Dark mode fix 2: Add dark bg/border to header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-gray-100">DAT Monitor</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Digital Asset Treasury</p>
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

            {/* Controls (Desktop) */}
            <div className="hidden lg:flex items-center space-x-4">
              
              {/* Submit Data Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onScreenChange(submitDataButton.id)}
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitDataButton.label}</span>
              </Button>
              
              {/* Language Selector */}
              <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="w-32">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
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
                className="w-10 h-10 p-0 text-gray-600 dark:text-gray-400"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              
              {/* Auth Button */}
              <Button
                variant={isRegistered ? "outline" : "default"}
                size="sm"
                onClick={() => handleAuthClick(false)}
                className="flex items-center space-x-2"
              >
                {isRegistered ? <LogOut className="w-4 h-4" /> : <User className="w-4 h-4" />}
                <span>{isRegistered ? 'Logout' : 'Login/Register'}</span>
              </Button>
              
              {/* Admin Login/Badge */}
              {!isRegistered && (
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAuthClick(true)}
                      className="flex items-center space-x-1"
                  >
                      <Wrench className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Admin</span>
                  </Button>
              )}
              
              {/* Market Status (Dark mode fix applied to text and badge) */}
              <div className="flex items-center space-x-2">
                <Bitcoin className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">$67,241</span>
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
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.concat(submitDataButton).map((item) => {
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
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
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

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Account</span>
                  <Button
                    variant={isRegistered ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleAuthClick(false)}
                  >
                    {isRegistered ? 'Logout' : 'Login/Register'}
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
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
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