import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import OverviewPage from './pages/OverviewPage';
import NewAnalysisPage from './pages/NewAnalysisPage';
import ScenarioComparisonPage from './pages/ScenarioComparisonPage';
import SavedAnalysesPage from './pages/SavedAnalysesPage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ToastContainer from './components/Toast';
import AuthModal from './components/AuthModal';
import ImportSheetModal from './components/ImportSheetModal';

function AppContent() {
  const { currentPage, importSheetModalOpen, closeImportModal } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // If on landing page, display the full-width public website
  if (currentPage === 'landing') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <LandingPage />
        <AuthModal />
        <ImportSheetModal isOpen={importSheetModalOpen} onClose={closeImportModal} />
        <ToastContainer />
      </div>
    );
  }

  // App Workspace Dashboard with Sidebar & TopBar
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F5' }}>
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflowX: 'hidden'
      }}>
        <TopBar />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {currentPage === 'overview' && <OverviewPage />}
          {currentPage === 'new-analysis' && <NewAnalysisPage />}
          {currentPage === 'scenario-comparison' && <ScenarioComparisonPage />}
          {currentPage === 'saved-analyses' && <SavedAnalysesPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>

      <AuthModal />
      <ImportSheetModal isOpen={importSheetModalOpen} onClose={closeImportModal} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
