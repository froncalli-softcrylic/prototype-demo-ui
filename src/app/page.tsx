'use client';

import { AppProvider, useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatPanel from '@/components/ChatPanel';
import SummaryStrip from '@/components/SummaryStrip';
import OfficeCardGrid from '@/components/OfficeCardGrid';
import OfficeDetail from '@/components/OfficeDetail';
import RecommendationsQueue from '@/components/RecommendationsQueue';
import PerformanceTrends from '@/components/PerformanceTrends';

function CenterPanel() {
  const { centerView, setCenterView, pendingRecommendationsCount, selectedOfficeId } = useApp();

  // If in detail mode, don't show tabs
  if (centerView === 'detail') {
    return (
      <div className="center-panel">
        <OfficeDetail />
      </div>
    );
  }

  return (
    <div className="center-panel">
      <div className="center-tabs">
        <button
          className={`center-tab ${centerView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCenterView('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`center-tab ${centerView === 'recommendations' ? 'active' : ''}`}
          onClick={() => setCenterView('recommendations')}
        >
          Recommendations
          {pendingRecommendationsCount > 0 && (
            <span className="tab-badge">{pendingRecommendationsCount}</span>
          )}
        </button>
        <button
          className={`center-tab ${centerView === 'trends' ? 'active' : ''}`}
          onClick={() => setCenterView('trends')}
        >
          Performance
        </button>
      </div>

      {centerView === 'dashboard' && (
        <>
          <SummaryStrip />
          <OfficeCardGrid />
        </>
      )}

      {centerView === 'recommendations' && <RecommendationsQueue />}
      {centerView === 'trends' && <PerformanceTrends />}
    </div>
  );
}

function AppShell() {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <Sidebar />
        <CenterPanel />
        <ChatPanel />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
