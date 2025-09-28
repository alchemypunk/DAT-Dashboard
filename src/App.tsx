import { useState } from 'react';
import { Layout } from './components/Layout';
import { TreasuryDashboard } from './components/TreasuryDashboard';
import { CompanyDetails } from './components/CompanyDetails';
import { AssetTracker } from './components/AssetTracker';
import { Analytics } from './components/Analytics';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext'; // NEW
import { AdminPanel } from './components/AdminPanel'; // NEW
import { DataSubmissionForm } from './components/DataSubmissionForm'; // NEW

// Define new screen types
type Screen = 'dashboard' | 'company-details' | 'asset-tracker' | 'analytics' | 'admin' | 'submit-data';

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
      'analytics': 'analytics',
      'admin': 'admin', // New route
      'submit-data': 'submit-data', // New route
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
            onShowSubmit={() => navigateToScreen('submit-data')} // Add submit shortcut
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
      
      case 'admin':
        return (
          <AdminPanel
            onBack={() => navigateToScreen('dashboard')}
          />
        );
        
      case 'submit-data':
        return (
          <DataSubmissionForm
            onBack={() => navigateToScreen('dashboard')}
          />
        );

      default:
        return (
          <TreasuryDashboard 
            onViewCompany={(companyId) => navigateToScreen('company-details', companyId)}
            onViewAsset={(asset) => navigateToScreen('asset-tracker', undefined, asset)}
            onShowSubmit={() => navigateToScreen('submit-data')}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider> {/* Wrap with AuthProvider for global auth state */}
          <Layout 
            currentScreen={appState.currentScreen} 
            onScreenChange={handleScreenChange}
          >
            {renderCurrentScreen()}
          </Layout>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}