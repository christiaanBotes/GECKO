import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  UserPlus, 
  Terminal, 
  SlidersHorizontal,
  Download, 
  MapPin, 
  Sparkles, 
  Cpu, 
  AlertTriangle,
  History,
  Code2,
  GitPullRequest,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { Incident, SuggestedFix, Severity, IncidentStatus } from '../types';

interface IncidentDetailProps {
  incident: Incident;
  onBack: () => void;
  onClaim: (incidentId: string) => void;
  onOpenPRModal: (incident: Incident, selectedFix: SuggestedFix) => void;
}

export default function IncidentDetail({ incident, onBack, onClaim, onOpenPRModal }: IncidentDetailProps) {
  const [activeFixId, setActiveFixId] = useState<string>('fix-1');

  // Find the selected fix
  const selectedFix = incident.fixes.find(f => f.id === activeFixId) || incident.fixes[0];

  const handleClaim = () => {
    onClaim(incident.id);
  };

  const handleReviewPR = () => {
    if (selectedFix) {
      onOpenPRModal(incident, selectedFix);
    }
  };

  return (
    <div className="flex-grow bg-[#f7f9fb] text-[#191c1e] font-sans relative pb-32">
      
      {/* Detail Header & Navigation */}
      <header className="border-b border-[#c2c6d6] bg-white px-6 py-4 z-30 shadow-sm">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-3">
          
          {/* Back button */}
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0062d6] hover:underline cursor-pointer w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Incidents
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-sans font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-[#ba1a1a]/20">
                  <AlertTriangle className="w-3 h-3 text-[#ba1a1a]" />
                  {incident.severity.toUpperCase()} SEVERITY
                </span>
                <span className="text-[#424754] text-[11px] font-mono">{incident.createdAtText}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold font-sans text-[#191c1e] tracking-tight">
                Incident #{incident.id}: {incident.title}
              </h1>
            </div>
            <button className="bg-white hover:bg-[#eceef0] border border-[#c2c6d6] text-[#424754] px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>
      </header>

      {/* Main Column Grid */}
      <div className="max-w-[1000px] mx-auto px-6 py-6 flex flex-col gap-6">

        {/* SECTION 1: Status Metadata */}
        <section className="bg-white border border-[#c2c6d6] rounded-lg p-5 grid grid-cols-2 lg:grid-cols-4 gap-6 shadow-sm">
          
          {/* Status Column */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[#727785] tracking-wider uppercase">STATUS</span>
            <span className={`text-[#ba1a1a] text-sm font-semibold flex items-center gap-2`}>
              <span className={`w-2 h-2 rounded-full bg-[#ba1a1a] ${incident.status !== 'Resolved' ? 'animate-pulse' : ''}`}></span>
              {incident.status}
            </span>
          </div>

          {/* Assigned To Column */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[#727785] tracking-wider uppercase">ASSIGNED TO</span>
            <div className="flex items-center gap-2">
              {incident.assignee === 'Unassigned' ? (
                <div className="flex items-center gap-2">
                  <span className="text-[#424754] italic text-xs">Unassigned</span>
                  <button 
                    onClick={handleClaim}
                    className="bg-[#0062d6] text-white px-2.5 py-0.5 rounded text-[10px] font-semibold hover:bg-[#004ba7] transition-all shadow-sm cursor-pointer"
                  >
                    Claim
                  </button>
                  <button 
                    onClick={handleClaim}
                    className="p-1 border border-[#c2c6d6] rounded hover:bg-[#eceef0] text-[#424754]"
                    title="Assign to me"
                  >
                    <UserPlus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#e0e3e5] flex items-center justify-center border border-[#c2c6d6] text-[9px] text-[#474f65] font-bold">
                    {incident.assignee.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <span className="text-xs text-[#191c1e] font-semibold">{incident.assignee}</span>
                </div>
              )}
            </div>
          </div>

          {/* Service Column */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[#727785] tracking-wider uppercase">SERVICE</span>
            <span className="text-[#191c1e] font-mono text-xs bg-[#eceef0] px-2 py-0.5 rounded w-fit">
              {incident.service}
            </span>
          </div>

          {/* Timestamp Column */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[#727785] tracking-wider uppercase">TIMESTAMP</span>
            <span className="text-xs text-[#191c1e] font-medium font-sans">
              {incident.timestamp}
            </span>
          </div>

        </section>

        {/* SECTION 2: Technical Context - Syslogs */}
        <section className="flex flex-col border border-[#c2c6d6] rounded-lg overflow-hidden bg-[#f2f4f6]/40 shadow-sm animate-fade-in">
          <div className="bg-[#eceef0] border-b border-[#c2c6d6] px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#424754]">
              <Terminal className="w-3.5 h-3.5 text-[#424754]" />
              <span className="text-[10px] font-bold tracking-wider uppercase font-mono">SERVICE LOG STREAM - /var/log/syslog</span>
            </div>
            <div className="flex gap-2">
              <button className="text-[#727785] hover:text-[#191c1e] transition-colors">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="p-4 overflow-x-auto font-mono text-[11px] md:text-xs text-[#24292e] leading-relaxed whitespace-pre h-72 overflow-y-auto bg-[#1e1e1e] text-white">
            {incident.logs.split('\n').map((line, index) => {
              let lineClass = 'text-gray-300';
              if (line.includes('ERROR')) {
                lineClass = 'text-red-400 font-semibold';
              } else if (line.includes('WARN')) {
                lineClass = 'text-yellow-400';
              } else if (line.includes('CannotCreateTransactionException') || line.includes('JDBCConnectionException')) {
                lineClass = 'text-red-500 font-bold bg-red-950/40 p-0.5 rounded';
              } else if (line.startsWith('at ') || line.includes('\tat ')) {
                lineClass = 'text-gray-400 pl-4';
              }
              return (
                <div key={index} className={`${lineClass} font-mono py-0.5`}>
                  {line}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Impact Analysis */}
        <section className="bg-white border border-[#c2c6d6] rounded-lg p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#eceef0] pb-3">
            <MapPin className="w-4.5 h-4.5 text-[#474f65]" />
            <h3 className="text-sm font-bold text-[#191c1e] font-sans">Impact Analysis & Blast Radius</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 p-3 bg-[#f2f4f6]/50 border border-[#c2c6d6]/60 rounded-lg">
              <span className="text-[10px] font-bold text-[#727785] tracking-wider uppercase">Affected Services</span>
              <ul className="text-xs text-[#191c1e] space-y-1.5 font-medium">
                {incident.affectedServices.map((srv, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                    {srv}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-2 p-3 bg-[#f2f4f6]/50 border border-[#c2c6d6]/60 rounded-lg justify-center">
              <span className="text-[10px] font-bold text-[#727785] tracking-wider uppercase">SLA Status</span>
              <div className="flex items-center gap-2 font-medium text-[#ba1a1a]">
                <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
                <span className="font-bold text-sm">{incident.slaStatus}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: GECKO AGENT AI ROOT CAUSE ANALYSIS */}
        <section className="bg-white border border-[#c2c6d6] rounded-lg overflow-hidden relative shadow-sm">
          {/* Subtle agent glow background overlay */}
          <div className="absolute inset-0 bg-[#0062d6]/3 pointer-events-none"></div>
          
          <div className="border-b border-[#c2c6d6] px-5 py-3.5 flex items-center gap-2 relative z-10 bg-[#eceef0]/60">
            <Sparkles className="w-4.5 h-4.5 text-[#0062d6] animate-pulse" />
            <h3 className="text-sm font-bold text-[#191c1e] font-sans">Gecko Automated AI Analysis</h3>
          </div>

          <div className="p-5 relative z-10 text-xs text-[#424754] leading-relaxed space-y-4">
            {incident.isOutsideScope ? (
              <p className="text-[#191c1e] font-medium text-xs leading-relaxed">
                Diagnostic parser indicates this ticket is a <span className="text-[#424754] font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-[#c2c6d6] font-mono">UI/UX Onboarding Inquiry</span>. It does not contain any backend log failures, call exceptions, or database timeout events.
              </p>
            ) : (
              <p className="text-[#191c1e] font-medium text-xs leading-relaxed">
                Diagnostic parser indicates a critical <span className="text-[#ba1a1a] font-bold bg-[#ffdad6]/60 px-1.5 py-0.5 rounded border border-[#ba1a1a]/25 font-mono">Connection Pool Exhaustion</span> affecting the data persistency layer.
              </p>
            )}

            <div className="bg-[#f8fafc] border border-[#c2c6d6] rounded-md p-4 text-xs">
              <div className="flex items-center gap-1.5 text-[#191c1e] mb-2.5 font-bold">
                <Info className="w-4 h-4 text-[#0060aa]" />
                {incident.isOutsideScope ? 'Gecko Scope Triage Isolation Findings:' : 'Interactive Root Cause Findings:'}
              </div>
              <ul className="list-disc list-inside space-y-2 ml-1 text-[#424754] font-medium">
                {incident.keyFindings.map((finding, idx) => (
                  <li key={idx}>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 5: SUGGESTED CONFIGURATION FIX WITH INTERACTIVE DIFFS */}
        {incident.isOutsideScope ? (
          <section className="bg-white border border-[#c2c6d6] rounded-lg p-6 shadow-sm flex flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center text-gray-400">
              <Code2 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="text-sm font-bold text-[#191c1e]">Auto-Triage Bypass Active</h4>
              <p className="text-xs text-[#424754] leading-relaxed">
                Gecko autonomously determined this ticket is a user navigation or documentation request. Because no syntax anomaly exists in the codebase repository, code patch generation is dynamically bypassed.
              </p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-[#4c5563] border border-[#d1d5db]/60 px-2 py-0.5 rounded font-extrabold uppercase mt-1">
              🛡️ No Code Changes Necessary
            </span>
          </section>
        ) : (
          <section className="bg-white border border-[#c2c6d6] rounded-lg overflow-hidden flex flex-col shadow-sm">
            
            <div className="border-b border-[#c2c6d6] bg-[#eceef0]/80">
              <div className="px-5 py-3 flex items-center justify-between border-b border-[#c2c6d6]/60">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4.5 h-4.5 text-[#474f65]" />
                  <h3 className="text-sm font-bold text-[#191c1e] font-sans">Suggested Code Fix patch</h3>
                </div>
                
                {/* Fix selector toggling tabs */}
                <div className="flex items-center bg-[#eceef0] p-1 rounded-md border border-[#c2c6d6]/40">
                  {incident.fixes.map((fix) => (
                    <button
                      key={fix.id}
                      onClick={() => setActiveFixId(fix.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                        activeFixId === fix.id
                          ? 'bg-[#004ba7] text-white shadow-sm'
                          : 'text-[#424754] hover:bg-[#e6e8ea]'
                      }`}
                    >
                      {fix.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick stats on the selected fix */}
              <div className="px-5 py-2.5 flex items-center justify-between bg-[#f8fafc]">
                <div className="flex items-center">
                  <span className="bg-[#0062d6] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {selectedFix?.confidence || 90}% Confidence
                  </span>
                  <span className="text-[11px] text-[#424754] ml-3 italic font-medium">
                    {selectedFix?.description}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#727785] bg-[#eceef0] px-2 py-0.5 rounded">
                  {selectedFix?.filePath || 'application.yml'}
                </span>
              </div>
            </div>

            {/* Interactive Diffs Display */}
            <div className="font-mono text-xs bg-[#1e1e1e] text-white overflow-x-auto py-3 leading-relaxed">
              {selectedFix?.diff.map((line, idx) => {
                // Decide styles for additions, deletions, normal lines
                let lineStyle = 'text-white/90 hover:bg-white/5';
                let signal = ' ';
                let lineNumClass = 'text-white/40 border-r border-white/10 bg-white/5';
                if (line.type === 'added') {
                  lineStyle = 'bg-[#1b432e] text-[#b4f4cb] border-l-2 border-green-500';
                  signal = '+';
                  lineNumClass = 'text-green-400 font-bold bg-[#1b432e]/55 border-r border-[#1b432e]/80';
                } else if (line.type === 'removed') {
                  lineStyle = 'bg-[#4c1f1f] text-[#ffc1c1] border-l-2 border-red-500';
                  signal = '-';
                  lineNumClass = 'text-red-400 font-bold bg-[#4c1f1f]/55 border-r border-[#4c1f1f]/80';
                }

                return (
                  <div key={idx} className={`flex items-center ${lineStyle} py-0.5 font-mono text-xs`}>
                    {/* Line Number */}
                    <div className={`w-10 text-right pr-3 select-none ${lineNumClass}`}>
                      {line.lineNum}
                    </div>
                    {/* Plus/minus marker */}
                    <div className="w-6 text-center font-mono opacity-60">
                      {signal}
                    </div>
                    {/* Code contents */}
                    <div className="pl-2 pr-4 font-mono select-all">
                      {line.content}
                    </div>
                  </div>
                );
              })}
            </div>

          </section>
        )}

        {/* SECTION 6: Fix Rationale */}
        <section className="bg-white border border-[#c2c6d6] rounded-lg p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#191c1e] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-4 bg-[#004ba7] rounded-full inline-block"></span>
            Fix Rationale
          </h3>
          <p className="text-xs text-[#424754] leading-relaxed font-sans font-medium">
            {incident.rationale}
          </p>

          <div className="border-t border-[#eceef0] mt-4 pt-4">
            <h4 className="text-xs font-bold text-[#191c1e] mb-2.5 flex items-center gap-1.5">
              Similar Historical Incidents Resolved by Gecko Agent
            </h4>
            <ul className="space-y-2">
              {incident.similarIncidents.map((inc) => (
                <li key={inc.id}>
                  <a href={`#${inc.id}`} className="text-[#0062d6] font-semibold text-xs hover:underline flex items-center gap-1">
                    <ChevronRight className="w-3.5 h-3.5" />
                    #{inc.id}: {inc.title}
                  </a>
                </li>
              ))}
              {incident.similarIncidents.length === 0 && (
                <li className="text-xs text-[#727785] italic">No historical references isolated.</li>
              )}
            </ul>
          </div>
        </section>

      </div>

      {/* FIXED FLOATING ACTION BAR FOR PR INTEGRATION */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-[#c2c6d6] bg-white/95 backdrop-blur flex justify-end gap-3 z-40 shadow-lg md:left-64">
        <button 
          onClick={onBack}
          className="px-4 py-2 border border-[#c2c6d6] bg-white text-[#424754] rounded font-semibold text-xs hover:bg-[#eceef0] transition-colors cursor-pointer"
        >
          Dismiss
        </button>
        {incident.isOutsideScope ? (
          <button 
            disabled
            className="px-6 py-2 bg-gray-100 text-gray-400 border border-neutral-300 rounded font-semibold text-xs flex items-center gap-2 cursor-not-allowed select-none opacity-80"
          >
            <GitPullRequest className="w-4 h-4 text-gray-400" />
            Open PR (Not Available - Out of Scope)
          </button>
        ) : (
          <button 
            onClick={handleReviewPR}
            className="px-6 py-2 bg-[#0062d6] text-white rounded font-semibold text-xs hover:bg-[#004ba7] flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <GitPullRequest className="w-4 h-4" />
            Review & Open PR with Suggested Fix
          </button>
        )}
      </div>

    </div>
  );
}
