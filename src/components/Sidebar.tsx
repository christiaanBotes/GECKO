import React from 'react';
import { 
  Terminal, 
  Menu, 
  LayoutDashboard, 
  Flame, 
  BookOpen, 
  HelpCircle,
  Sparkles,
  Bell
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeIncidentsCount: number;
}

export default function Sidebar({ currentTab, onTabChange, activeIncidentsCount }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-[#e2e8f0] bg-[#f8fafc] flex flex-col h-full overflow-y-auto pt-5 pb-4 shrink-0 font-sans">
      {/* Brand area */}
      <div className="flex items-center gap-3 px-6 mb-8">
        <div className="w-8 h-8 rounded bg-[#004ba7] flex items-center justify-center shrink-0 shadow-sm">
          <Terminal className="text-white w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="text-[#004ba7] font-bold text-lg tracking-tight leading-none flex items-center gap-1.5">
            Gecko
          </h2>
          <p className="text-[#424754] text-[10px] font-mono mt-1 bg-[#eceef0] py-0.5 px-1.5 rounded-full inline-block">
            v2.4.0-stable
          </p>
        </div>
      </div>

      {/* Main navigation */}
      <div className="flex-1 px-3 space-y-1">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded font-medium text-sm transition-all duration-150 ${
            currentTab === 'dashboard'
              ? 'bg-[#e2e8f0] text-[#191c1e]'
              : 'text-[#424754] hover:text-[#191c1e] hover:bg-[#eceef0]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-[#727785]" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange('incidents')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded font-medium text-sm transition-all duration-150 ${
            currentTab === 'incidents' || currentTab === 'incident-detail'
              ? 'bg-[#58a6ff]/20 text-[#004ba7]'
              : 'text-[#424754] hover:text-[#191c1e] hover:bg-[#eceef0]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Flame className="w-4 h-4 text-[#0060aa]" />
            <span>Incidents</span>
          </div>
          {activeIncidentsCount > 0 && (
            <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeIncidentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('agent-sandbox')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded font-medium text-sm transition-all duration-150 relative overflow-hidden group ${
            currentTab === 'agent-sandbox'
              ? 'bg-[#0062d6]/10 text-[#0062d6] border border-[#0062d6]/20'
              : 'text-[#424754] hover:text-[#191c1e] hover:bg-[#eceef0]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#0062d6] animate-pulse" />
            <span className="font-semibold">Gecko Agent Hub</span>
          </div>
          <span className="bg-[#0062d6] text-white text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded">
            Agent
          </span>
        </button>

        <button
          onClick={() => onTabChange('notifications')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded font-medium text-sm transition-all duration-150 ${
            currentTab === 'notifications'
              ? 'bg-[#e2e8f0] text-[#191c1e]'
              : 'text-[#424754] hover:text-[#191c1e] hover:bg-[#eceef0]'
          }`}
        >
          <Bell className="w-4 h-4 text-[#727785]" />
          <span>Notifications</span>
        </button>
      </div>

      {/* Support / Docs */}
      <div className="px-3 pt-4 border-t border-[#e2e8f0] space-y-1">
        <a
          href="#docs"
          className="flex items-center gap-3 px-3 py-2 rounded font-medium text-xs text-[#424754] hover:text-[#191c1e] hover:bg-[#eceef0] transition-all"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#727785]" />
          <span>Docs</span>
        </a>
        <a
          href="#support"
          className="flex items-center gap-3 px-3 py-2 rounded font-medium text-xs text-[#424754] hover:text-[#191c1e] hover:bg-[#eceef0] transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#727785]" />
          <span>Support</span>
        </a>
      </div>
    </aside>
  );
}
