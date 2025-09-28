import { useState } from 'react';
import { Layout } from './components/Layout';
import { TreasuryDashboard } from './components/TreasuryDashboard';
import { CompanyDetails } from './components/CompanyDetails';
import { AssetTracker } from './components/AssetTracker';
import { Analytics } from './components/Analytics';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

type Screen = 'dashboard' | 'company-details' | 'asset-tracker' | 'analytics';

interface AppState {
  currentScreen: Screen;
  selectedCompanyId?: string;
  selectedAsset?: string;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'dashboard'
  });

  const navigateToScreen = (screen: Screen, companyId?: string, asset?: string) => {
    setAppState({
      currentScreen: screen,
      selectedCompanyId: companyId,
      selectedAsset: asset
    });
  };

  const handleScreenChange = (screenId: string) => {
    const screenMap: { [key: string]: Screen } = {
      'dashboard': 'dashboard',
      'asset-tracker': 'asset-tracker',
      'analytics': 'analytics'
    };
    navigateToScreen(screenMap[screenId] || 'dashboard');
  };

  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'dashboard':
        return (
          <TreasuryDashboard 
            onViewCompany={(companyId) => navigateToScreen('company-details', companyId)}
            onViewAsset={(asset) => navigateToScreen('asset-tracker', undefined, asset)}
          />
        );
      
      case 'company-details':
        return (
          <CompanyDetails 
            companyId={appState.selectedCompanyId || 'MSTR'}
            onBack={() => navigateToScreen('dashboard')}
            onViewAsset={(asset) => navigateToScreen('asset-tracker', undefined, asset)}
          />
        );
      
      case 'asset-tracker':
        return (
          <AssetTracker 
            selectedAsset={appState.selectedAsset}
            onViewCompany={(companyId) => navigateToScreen('company-details', companyId)}
            onBack={() => navigateToScreen('dashboard')}
          />
        );
      
      case 'analytics':
        return (
          <Analytics 
            onViewCompany={(companyId) => navigateToScreen('company-details', companyId)}
            onBack={() => navigateToScreen('dashboard')}
          />
        );
      
      default:
        return (
          <TreasuryDashboard 
            onViewCompany={(companyId) => navigateToScreen('company-details', companyId)}
            onViewAsset={(asset) => navigateToScreen('asset-tracker', undefined, asset)}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Layout 
          currentScreen={appState.currentScreen} 
          onScreenChange={handleScreenChange}
        >
          {renderCurrentScreen()}
        </Layout>
      </LanguageProvider>
    </ThemeProvider>
  );
}