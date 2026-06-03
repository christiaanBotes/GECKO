import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Percent, 
  SlidersHorizontal, 
  Download, 
  CheckCircle, 
  User, 
  Search,
  ArrowUpDown,
  Filter,
  X,
  Play,
  Cpu
} from 'lucide-react';
import { Incident, Severity, IncidentStatus } from '../types';

interface IncidentListProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onOpenSimulator: () => void;
}

export default function IncidentList({ incidents, onSelectIncident, onOpenSimulator }: IncidentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'my-assignments' | 'active-alerts' | 'severity-high'>('all');

  // Filtering Logic
  const filteredIncidents = incidents.filter(incident => {
    // Search Term Filter
    const matchesSearch = 
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.assignee.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Quick View Filter Tabs
    switch (activeFilter) {
      case 'my-assignments':
        return incident.assignee.toLowerCase().includes('sarah') || incident.assignee.toLowerCase().includes('jenkins');
      case 'active-alerts':
        return incident.status !== 'Resolved';
      case 'severity-high':
        return incident.severity === 'High';
      default:
        return true;
    }
  });

  // Calculate Metrics
  const activeCount = incidents.filter(i => i.status !== 'Resolved').length;
  const highSeverityCount = incidents.filter(i => i.severity === 'High' && i.status !== 'Resolved').length;

  return (
    <div className="flex-grow bg-[#f7f9fb] text-[#191c1e] font-sans pb-16">
      <div className="max-w-[1240px] mx-auto px-6 pt-6 flex flex-col gap-6">
        
        {/* Row 1: Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sans text-[#191c1e] tracking-tight">All Incidents</h1>
            <p className="text-xs text-[#424754] font-medium mt-1">Overview of current system health and active alerts.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onOpenSimulator}
              className="bg-white hover:bg-[#eceef0] text-[#0062d6] border border-[#0062d6]/30 px-3 py-1.5 rounded text-xs font-semibold select-none flex items-center gap-2 shadow-sm transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Gecko Simulation Engine
            </button>
            <button className="bg-white hover:bg-[#eceef0] border border-[#c2c6d6] text-[#424754] px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 shadow-sm transition-all">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Row 2: Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Active Incidents */}
          <div className="bg-white border border-[#c2c6d6] rounded-lg p-4 shadow-sm flex flex-col justify-between h-30 hover:border-[#0062d6]/40 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-sans font-bold text-[#424754] uppercase tracking-wider text-opacity-80">ACTIVE INCIDENTS</span>
              <AlertTriangle className="text-[#004ba7] w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight">{activeCount}</span>
              <span className="text-xs text-[#0060aa] font-medium">+2 from last hour</span>
            </div>
          </div>

          {/* Card 2: Critical Alerts */}
          <div className="bg-white border border-[#ba1a1a]/30 border-l-4 border-l-[#ba1a1a] rounded-lg p-4 shadow-sm flex flex-col justify-between h-30 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-sans font-bold text-[#ba1a1a] uppercase tracking-wider">CRITICAL ALERTS</span>
              <AlertTriangle className="text-[#ba1a1a] w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-[#ba1a1a] tracking-tight">{highSeverityCount}</span>
              <span className="text-xs text-[#424754]">Immediate action req.</span>
            </div>
          </div>

          {/* Card 3: MTTR */}
          <div className="bg-white border border-[#c2c6d6] rounded-lg p-4 shadow-sm flex flex-col justify-between h-30 hover:border-[#0062d6]/40 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-sans font-bold text-[#424754] uppercase tracking-wider text-opacity-80">MTTR (7D AVG)</span>
              <Clock className="text-[#0060aa] w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight">42m</span>
              <span className="text-xs text-[#1a7f37] font-medium">-12% vs last week</span>
            </div>
          </div>

        </div>

        {/* Row 3: Live Quick Views & Filtration Bar */}
        <div className="bg-white border border-[#c2c6d6] rounded-lg p-4 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="w-full lg:max-w-md relative flex items-center">
              <Search className="absolute left-3.5 text-[#424754]/55 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#f2f4f6]/60 border border-[#c2c6d6] rounded px-3.5 pl-10 py-1.5 text-xs text-[#191c1e] placeholder:text-[#424754]/50 focus:outline-none focus:border-[#004ba7] focus:ring-1 focus:ring-[#004ba7]"
                placeholder="Filter by ID, service, or assignee..."
              />
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <button className="flex items-center gap-1.5 border border-[#c2c6d6] px-3 py-1.5 rounded text-xs font-semibold text-[#424754] hover:bg-[#eceef0] transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
            </div>

          </div>

          {/* Quick Views Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#424754] font-medium border-t border-[#eceef0] pt-3.5">
            <span className="text-[11px] font-sans font-bold text-[#727785] tracking-wider uppercase mr-1">Quick Views:</span>
            
            <button 
              onClick={() => setActiveFilter(activeFilter === 'my-assignments' ? 'all' : 'my-assignments')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                activeFilter === 'my-assignments' 
                  ? 'bg-[#0062d6]/10 border-[#0062d6]/40 text-[#0062d6]' 
                  : 'bg-transparent border-[#c2c6d6] text-[#424754] hover:bg-[#eceef0]'
              }`}
            >
              <span>My Assignments</span>
              {activeFilter === 'my-assignments' ? <X className="w-3 h-3 text-[#0062d6]" /> : null}
            </button>

            <button 
              onClick={() => setActiveFilter(activeFilter === 'active-alerts' ? 'all' : 'active-alerts')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                activeFilter === 'active-alerts' 
                  ? 'bg-[#0062d6]/10 border-[#0062d6]/40 text-[#0062d6]' 
                  : 'bg-transparent border-[#c2c6d6] text-[#424754] hover:bg-[#eceef0]'
              }`}
            >
              <span>Active Alerts</span>
              {activeFilter === 'active-alerts' ? <X className="w-3 h-3 text-[#0062d6]" /> : null}
            </button>

            <button 
              onClick={() => setActiveFilter(activeFilter === 'severity-high' ? 'all' : 'severity-high')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                activeFilter === 'severity-high' 
                  ? 'bg-[#ffdad6] border-[#ba1a1a]/40 text-[#ba1a1a]' 
                  : 'bg-transparent border-[#c2c6d6] text-[#424754] hover:bg-[#eceef0]'
              }`}
            >
              <span>Severity: High</span>
              {activeFilter === 'severity-high' ? <X className="w-3 h-3 text-[#ba1a1a]" /> : null}
            </button>
            
            {activeFilter !== 'all' && (
              <button 
                onClick={() => setActiveFilter('all')}
                className="text-xs text-[#0062d6] hover:underline cursor-pointer ml-1 font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Row 4: Incidents List Table */}
        <div className="bg-white border border-[#c2c6d6] rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#eceef0]/50 border-b border-[#c2c6d6] text-[10px] font-sans font-bold text-[#424754] tracking-wider uppercase">
                  <th className="py-3 px-4 flex items-center gap-1.5 cursor-pointer hover:text-[#191c1e] select-none">
                    INCIDENT ID
                    <ArrowUpDown className="w-3 h-3" />
                  </th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4">SEVERITY</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">SERVICE</th>
                  <th className="py-3 px-4">ASSIGNEE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef0] text-xs">
                {filteredIncidents.map((incident) => {
                  const isResolved = incident.status === 'Resolved';

                  // Calculate Status indicator style
                  let statusColor = 'text-[#727785]';
                  let statusBg = 'bg-[#eceef0]';
                  if (incident.status === 'Active') {
                    statusColor = 'text-[#ba1a1a]';
                    statusBg = 'bg-[#ba1a1a]';
                  } else if (incident.status === 'Mitigating') {
                    statusColor = 'text-[#0060aa]';
                    statusBg = 'bg-[#0060aa]';
                  } else if (incident.status === 'Resolved') {
                    statusColor = 'text-[#1a7f37]';
                    statusBg = 'bg-[#1a7f37]';
                  } else if (incident.status === 'Investigating') {
                    statusColor = 'text-[#474f65]';
                    statusBg = 'bg-[#474f65]';
                  }

                  // Calculate Severity Badge style
                  let severityStyle = 'bg-[#e2e8f0] text-[#424754]';
                  if (incident.severity === 'High') {
                    severityStyle = 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/10';
                  } else if (incident.severity === 'Med') {
                    severityStyle = 'bg-[#fef3c7] text-[#b35900] border border-[#fef3c7]/60';
                  }

                  return (
                    <tr 
                      key={incident.id} 
                      onClick={() => onSelectIncident(incident)}
                      className="hover:bg-[#f8fafc] cursor-pointer transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0062d6] group-hover:underline">
                        {incident.id}
                      </td>

                      {/* Description */}
                      <td className={`py-3.5 px-4 font-sans text-[#191c1e] font-medium max-w-sm ${isResolved ? 'line-through text-[#727785] opacity-60' : ''}`}>
                        <div className="flex flex-col gap-1">
                          <span className="truncate block font-semibold text-[#191c1e]">{incident.title}</span>
                          {incident.isOutsideScope && (
                            <span className="w-fit inline-flex items-center gap-1 bg-[#eceef0] border border-[#d1d5db]/60 text-[#4c5563] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                              🛡️ Non-Codebase (Not Actionable)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold tracking-wide ${severityStyle}`}>
                          {incident.severity}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 font-sans font-medium">
                        <span className="flex items-center gap-1.5">
                          {isResolved ? (
                            <CheckCircle className="w-3.5 h-3.5 text-[#1a7f37]" />
                          ) : (
                            <span className={`w-2 h-2 rounded-full ${statusBg}`}></span>
                          )}
                          <span className={statusColor}>{incident.status}</span>
                        </span>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#424754]">
                        {incident.service}
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4 text-[#424754] font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#eceef0] flex items-center justify-center border border-[#c2c6d6] overflow-hidden text-[9px] text-[#474f65] font-bold shadow-sm">
                            {incident.assignee === 'System' ? (
                              <Cpu className="w-3 h-3 text-[#474f65]" />
                            ) : (
                              <span>{incident.assignee.split(' ').map(n => n[0]).join('')}</span>
                            )}
                          </div>
                          <span>{incident.assignee}</span>
                        </div>
                      </td>

                    </tr>
                  );
                })}

                {filteredIncidents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#727785] italic font-sans">
                      No incidents found matching your active filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="bg-[#f8fafc] border-t border-[#eceef0] px-4 py-3 flex items-center justify-between text-[#424754] text-xs font-sans">
            <div>
              Showing <span className="font-semibold">{filteredIncidents.length}</span> of <span className="font-semibold">{incidents.length}</span> entries
            </div>

            <div className="flex gap-1">
              <button className="px-2.5 py-1 text-xs font-semibold rounded border border-[#c2c6d6] text-[#727785] bg-white cursor-not-allowed">
                Prev
              </button>
              <button className="px-3 py-1 text-xs font-bold rounded bg-[#eceef0] text-[#191c1e] border border-[#c2c6d6]">
                1
              </button>
              <button className="px-3 py-1 text-xs font-semibold rounded text-[#424754] hover:bg-[#eceef0] transition-colors">
                2
              </button>
              <button className="px-3 py-1 text-xs font-semibold rounded text-[#424754] hover:bg-[#eceef0] transition-colors">
                3
              </button>
              <span className="px-1.5 py-1 text-xs text-[#727785] font-semibold select-none">...</span>
              <button className="px-2.5 py-1 text-xs font-semibold rounded border border-[#c2c6d6] hover:bg-[#eceef0] bg-white text-[#424754] transition-colors">
                Next
              </button>
            </div>
          </div>

        </div>

        {/* Informational Callout regarding Gecko Agent */}
        <div className="bg-[#0062d6]/5 border border-[#0062d6]/10 rounded-lg p-5 flex flex-col md:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#0062d6]/15 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="text-[#0062d6] w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#191c1e]">Gecko Core Agent Autonomous Triage</h4>
            <p className="text-xs text-[#424754] mt-1 leading-relaxed">
              When a system warning triggers, our Gecko background agent autonomously ingests server log streams, isolates core database or config schema files in the codebase, traces active thread blocks, and devises visual code patches. 
              Review recommendations instantly inside the incident view to auto-generate pull requests and optimize system uptime.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
