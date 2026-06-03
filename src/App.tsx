import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RightSidebar from './components/RightSidebar';
import IncidentList from './components/IncidentList';
import IncidentDetail from './components/IncidentDetail';
import AgentSimulator from './components/AgentSimulator';
import PRDrawer from './components/PRDrawer';
import NotificationSettings from './components/NotificationSettings';
import { 
  DashboardView
} from './components/OtherViews';

import { INITIAL_INCIDENTS, INITIAL_ACTIVITIES } from './data';
import { Incident, ActivityFeedItem, SuggestedFix } from './types';

export default function App() {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [activities, setActivities] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITIES);
  
  // Navigation & Tabs
  const [currentTab, setCurrentTab] = useState<string>('incidents'); // 'dashboard', 'incidents', 'notifications', 'agent-sandbox'
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(INITIAL_INCIDENTS[0]); // default selected so view detail works
  const [lastSelectedDetail, setLastSelectedDetail] = useState<Incident | null>(INITIAL_INCIDENTS[0]);

  // Sidebar Toggling for Mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pull Request Drawer State
  const [isPRDrawerOpen, setIsPRDrawerOpen] = useState<boolean>(false);
  const [activeFixForPR, setActiveFixForPR] = useState<SuggestedFix | null>(null);

  // Claim handler
  const handleClaimIncident = (incidentId: string) => {
    // Update incident assignee
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, assignee: 'Sarah Jenkins', status: 'Investigating' };
      }
      return inc;
    }));

    // Add activity log
    const claimActivity: ActivityFeedItem = {
      id: `act-claim-${Math.random()}`,
      incidentId: incidentId,
      user: 'Sarah Jenkins',
      action: 'claimed this incident interactively',
      timestamp: 'Just now',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
    };
    setActivities(prev => [claimActivity, ...prev]);

    // Also update selected incident object
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, assignee: 'Sarah Jenkins', status: 'Investigating' } : null);
    }
  };

  // Add Comment handler
  const handleAddComment = (comment: string) => {
    if (!selectedIncident) return;
    
    const newActivity: ActivityFeedItem = {
      id: `act-comment-${Math.random()}`,
      incidentId: selectedIncident.id,
      user: 'Sarah Jenkins',
      action: `commented: "${comment}"`,
      timestamp: 'Just now',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
    };

    setActivities(prev => [newActivity, ...prev]);
  };

  // Open PR Modal / Drawer
  const handleOpenPRModal = (incident: Incident, selectedFix: SuggestedFix) => {
    setActiveFixForPR(selectedFix);
    setIsPRDrawerOpen(true);
  };

  // Submit PR Success Handler
  const handlePRSubmitSuccess = () => {
    if (!selectedIncident) return;

    // Update incident status to 'Mitigating'
    setIncidents(prev => prev.map(inc => {
      if (inc.id === selectedIncident.id) {
        return { ...inc, status: 'Mitigating' };
      }
      return inc;
    }));

    // Append AI activity feed log representing the merge request
    const prActivity: ActivityFeedItem = {
      id: `act-pr-${Math.random()}`,
      incidentId: selectedIncident.id,
      user: 'Gecko Agent',
      isAi: true,
      action: 'Gecko Automated Code patch Pull Request opened successfully #142',
      timestamp: 'Just now'
    };

    setActivities(prev => [prActivity, ...prev]);

    // Update current active detail state
    setSelectedIncident(prev => prev ? { ...prev, status: 'Mitigating' } : null);
  };

  // Simulation Hub: Handle simulated incident delivery
  const handleAddSimulatedIncident = (simulatedIncident: Incident) => {
    setIncidents(prev => [simulatedIncident, ...prev]);
    
    // Auto navigate user to view this incident
    setSelectedIncident(simulatedIncident);
    setLastSelectedDetail(simulatedIncident);
    setCurrentTab('incident-detail');

    // Seed activity logs
    const seedLogs: ActivityFeedItem[] = [
      {
        id: `act-sim-1-${Math.random()}`,
        incidentId: simulatedIncident.id,
        user: 'Gecko Agent',
        isAi: true,
        action: 'AI Root Cause Analysis generated autonomously',
        timestamp: 'Just now'
      },
      {
        id: `act-sim-2-${Math.random()}`,
        incidentId: simulatedIncident.id,
        user: simulatedIncident.service,
        isError: true,
        action: `Cluster warning triggered crash stream on '${simulatedIncident.service}'`,
        timestamp: 'Just now'
      }
    ];

    setActivities(prev => [...seedLogs, ...prev]);
  };

  // Nav select incident card
  const selectIncidentCard = (inc: Incident) => {
    setSelectedIncident(inc);
    setLastSelectedDetail(inc);
    setCurrentTab('incident-detail');
  };

  const activeIncidentsCount = incidents.filter(i => i.status !== 'Resolved').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f9fb] antialiased text-[#191c1e] font-sans">
      
      {/* Top Header */}
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Structural Layout Container */}
      <div className="flex flex-1 relative min-h-0">
        
        {/* LEFT NAV SIDEBAR (Static desktop, slider layout raw positioning on mobile) */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out shrink-0 h-full
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <Sidebar 
            currentTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              setMobileMenuOpen(false);
            }}
            activeIncidentsCount={activeIncidentsCount}
          />
        </div>

        {/* Backing clickable backdrop on mobile menu open */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-xs md:hidden"
          ></div>
        )}

        {/* CENTER CONTENT COLUMN */}
        <main className="flex-grow flex flex-col min-h-full min-w-0 bg-[#f7f9fb] relative">
          {currentTab === 'dashboard' && <DashboardView />}
          {currentTab === 'notifications' && <NotificationSettings />}
          {currentTab === 'agent-sandbox' && (
            <AgentSimulator onAddSimulatedIncident={handleAddSimulatedIncident} />
          )}

          {currentTab === 'incidents' && (
            <IncidentList 
              incidents={incidents}
              onSelectIncident={selectIncidentCard}
              onOpenSimulator={() => setCurrentTab('agent-sandbox')}
            />
          )}

          {currentTab === 'incident-detail' && lastSelectedDetail && (
            <IncidentDetail 
              incident={lastSelectedDetail}
              onBack={() => setCurrentTab('incidents')}
              onClaim={handleClaimIncident}
              onOpenPRModal={handleOpenPRModal}
            />
          )}
        </main>

        {/* RIGHT COLLABORATIVE COLLABORATIVE TIMELINE SIDEBAR */}
        {/* Render only when active on the Incident-Detail tab matching standard desktop screenshot */}
        {currentTab === 'incident-detail' && lastSelectedDetail && (
          <div className="hidden lg:block">
            <RightSidebar 
              activities={activities}
              incidentId={lastSelectedDetail.id}
              onAddComment={handleAddComment}
            />
          </div>
        )}

      </div>

      {/* PULL REQUEST INTERACTIVE DRAWER HOOK */}
      {lastSelectedDetail && activeFixForPR && (
        <PRDrawer 
          isOpen={isPRDrawerOpen}
          onClose={() => setIsPRDrawerOpen(false)}
          incident={lastSelectedDetail}
          fix={activeFixForPR}
          onSubmitSuccess={handlePRSubmitSuccess}
        />
      )}

    </div>
  );
}
