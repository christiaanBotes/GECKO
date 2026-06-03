import React from 'react';
import { Search, Bell, Terminal, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onMenuToggle: () => void;
}

export default function Header({ onSearchChange, searchQuery, onMenuToggle }: HeaderProps) {
  return (
    <header className="flex justify-between items-center w-full px-6 h-12 sticky top-0 z-50 bg-[#f7f9fb] border-b border-[#c2c6d6] shrink-0 font-sans">
      {/* Mobile Title with Hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button 
          onClick={onMenuToggle}
          className="text-[#424754] p-1 hover:bg-[#eceef0] rounded transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-lg font-bold text-[#004ba7] tracking-tighter">Gecko</span>
      </div>

      {/* Desktop brand/title or breadcrumb */}
      <div className="hidden md:block text-lg font-bold text-[#004ba7] tracking-tighter">
        Gecko
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md ml-4 mr-8 hidden md:block">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-[#424754] w-4.5 h-4.5 opacity-50" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#eceef0] border border-[#c2c6d6] rounded-md py-1 px-3 pl-9 text-xs focus:outline-none focus:border-[#004ba7] focus:ring-1 focus:ring-[#004ba7] text-[#191c1e] placeholder:text-[#424754]/50 font-mono transition-colors"
            placeholder="Search incidents, services, logs..."
            type="text"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button className="w-8 h-8 rounded flex items-center justify-center text-[#424754] hover:bg-[#e6e8ea] transition-colors relative cursor-pointer">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#ba1a1a] rounded-full"></span>
        </button>
        <button className="w-8 h-8 rounded flex items-center justify-center text-[#424754] hover:bg-[#e6e8ea] transition-colors cursor-pointer">
          <Terminal className="w-4.5 h-4.5" />
        </button>
        <button className="w-8 h-8 rounded flex items-center justify-center text-[#424754] hover:bg-[#e6e8ea] transition-colors cursor-pointer">
          <Settings className="w-4.5 h-4.5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#e0e3e5] border border-[#c2c6d6] ml-2 overflow-hidden cursor-pointer shadow-sm">
          <img 
            alt="User Profile" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120" 
          />
        </div>
      </div>
    </header>
  );
}
