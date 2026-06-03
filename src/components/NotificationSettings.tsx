import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  MessageSquare, 
  Mail, 
  Webhook, 
  ShieldCheck, 
  Code2, 
  CheckCircle2, 
  Flame, 
  Save, 
  AlertTriangle,
  Sliders,
  Check
} from 'lucide-react';

export default function NotificationSettings() {
  // Global Switch
  const [globalEnabled, setGlobalEnabled] = useState<boolean>(true);
  
  // Delivery Channels State
  const [channels, setChannels] = useState({
    teams: true,
    email: false,
    webhook: true
  });
  
  // Channel Addresses State
  const [teamsUrl, setTeamsUrl] = useState('https://bmw.webhook.office.com/webhookb2/00000000-0000-0000-0000-000000000000@00000000-0000-0000-0000-000000000000/IncomingWebhook/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/00000000-0000-0000-0000-000000000000');
  const [emailAddress, setEmailAddress] = useState('production-alerts@bmwcom.com');
  const [webhookUrl, setWebhookUrl] = useState('https://api.bmw.internal/v1/gecko-callbacks');

  // Fine-Grained Notification Triggers
  const [triggers, setTriggers] = useState({
    newIncident: true,
    isolationBypass: true,
    triageComplete: true,
    fixGenerated: true,
    slaWarning: false
  });

  // Saving Notification State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate database update
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Auto dismiss success toast
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3500);
    }, 800);
  };

  const handleToggleChannel = (key: 'teams' | 'email' | 'webhook') => {
    if (!globalEnabled) return;
    setChannels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleTrigger = (key: keyof typeof triggers) => {
    if (!globalEnabled) return;
    setTriggers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-grow p-6 text-[#191c1e] font-sans">
      <div className="max-w-[1000px] mx-auto space-y-6">
        
        {/* Banner Section */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#0062d6] mb-1">
              <Sliders className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Preferences</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Gecko Notification Engine</h1>
            <p className="text-xs text-[#424754]">
              Configure delivery channels and fine-grained event filtering for autonomous triage, codebase isolation, and patch generation.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-[#0062d6]/10 shrink-0 ${
              isSaving
                ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                : 'bg-[#0062d6] text-white hover:bg-[#004ba7]'
            }`}
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Configuration
          </button>
        </div>

        {/* Global Save Success Notification Toast Inline */}
        {saveSuccess && (
          <div className="bg-[#b4f4cb] text-[#1b432e] border border-[#1a7f37]/25 text-xs font-semibold px-4 py-3 rounded-lg flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1a7f37]" />
              <span>Preferences committed successfully. Gecko notification policies updated in real-time.</span>
            </div>
            <button 
              onClick={() => setSaveSuccess(false)}
              className="text-[#1b432e]/60 hover:text-[#1b432e] text-[10px] font-mono tracking-wider uppercase font-bold px-1.5 py-0.5 rounded border border-[#1a7f37]/20 hover:bg-[#1a7f37]/10"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT 2 COLUMNS: SETTINGS SECTIONS */}
          <div className="lg:col-span-2 space-y-6">

            {/* MASTER GLOBAL TOGGLE CARD */}
            <div className="bg-white border border-[#c2c6d6] rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="bg-[#0062d6]/10 text-[#0062d6] text-[10px] font-bold px-2 py-0.5 rounded border border-[#0062d6]/20 inline-block uppercase tracking-wide mb-1 font-mono">
                    Global Override
                  </span>
                  <h3 className="text-sm font-bold text-[#191c1e] font-sans flex items-center gap-1.5">
                    {globalEnabled ? <BellRing className="w-4.5 h-4.5 text-[#0062d6]" /> : <Bell className="w-4.5 h-4.5 text-neutral-400" />}
                    Enable Gecko Webhook &amp; Mail Alerts
                  </h3>
                  <p className="text-[11px] text-[#424754] leading-relaxed">
                    When disabled, all channels and event-driven triggers are completely muted. Safe override for site-reliability and dev-ops planning cycles.
                  </p>
                </div>

                <button
                  onClick={() => setGlobalEnabled(!globalEnabled)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none flex ${
                    globalEnabled ? 'bg-[#0062d6] justify-end' : 'bg-[#e2e8f0] justify-start'
                  }`}
                >
                  <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-200"></span>
                </button>
              </div>
            </div>

            {/* FINE-GRAINED TRIGGERS SECTION */}
            <div className={`bg-white border border-[#c2c6d6] rounded-lg overflow-hidden shadow-sm transition-all duration-200 ${
              !globalEnabled ? 'opacity-60 bg-neutral-50/50 pointer-events-none' : ''
            }`}>
              <div className="bg-[#eceef0]/50 border-b border-[#c2c6d6] px-5 py-3.5">
                <h3 className="text-xs font-bold uppercase text-[#424754] tracking-wider flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#0062d6]" />
                  Fine-Grained Notification Triggers
                </h3>
                <p className="text-[10px] text-[#727785] mt-0.5">Define exactly which incidents and operational milestones trigger active alert broadcasts.</p>
              </div>

              <div className="divide-y divide-[#eceef0] px-5">
                
                {/* TRIGGER 1: New Ingested Incidents */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-sm">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#727785] font-mono">Inbound Ingest</span>
                    <h4 className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#ba1a1a]" />
                      New Ingested Incidents from ITSM.next
                    </h4>
                    <p className="text-[11px] text-[#424754] leading-relaxed">
                      Alert immediately when a client-side exception or server-side crash triggers a fresh incident ingestion entry.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleToggleTrigger('newIncident')}
                    disabled={!globalEnabled}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex shrink-0 ${
                      triggers.newIncident ? 'bg-[#0062d6] justify-end' : 'bg-[#e2e8f0] justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                  </button>
                </div>

                {/* TRIGGER 2: Isolation & Scope classification */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-sm">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#727785] font-mono">Scope Triage</span>
                    <h4 className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0062d6]" />
                      Incident Scope isolation &amp; classification alerts
                    </h4>
                    <p className="text-[11px] text-[#424754] leading-relaxed">
                      Receive diagnostics summarizing whether an incident is in-scope (codebase related) or bypassed as out-of-scope UI/UX navigation inquiry.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleToggleTrigger('isolationBypass')}
                    disabled={!globalEnabled}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex shrink-0 ${
                      triggers.isolationBypass ? 'bg-[#0062d6] justify-end' : 'bg-[#e2e8f0] justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                  </button>
                </div>

                {/* TRIGGER 3: Triage Complete & RCA */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-sm">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#727785] font-mono">Root Cause Analysis</span>
                    <h4 className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1a7f37]" />
                      Triage &amp; Root Cause Analysis complete
                    </h4>
                    <p className="text-[11px] text-[#424754] leading-relaxed">
                      Alert as soon as the parser isolates error stack-traces, queries corresponding dependencies, and compiles findings.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleToggleTrigger('triageComplete')}
                    disabled={!globalEnabled}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex shrink-0 ${
                      triggers.triageComplete ? 'bg-[#0062d6] justify-end' : 'bg-[#e2e8f0] justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                  </button>
                </div>

                {/* TRIGGER 4: Fix Patch Generation */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-sm">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#727785] font-mono">Remediation Code</span>
                    <h4 className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#0062d6]" />
                      PR Patch Generation events
                    </h4>
                    <p className="text-[11px] text-[#424754] leading-relaxed">
                      Alert immediately when a high-confidence codebase configuration fix patch is compiled and ready for Pull Request review.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleToggleTrigger('fixGenerated')}
                    disabled={!globalEnabled}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex shrink-0 ${
                      triggers.fixGenerated ? 'bg-[#0062d6] justify-end' : 'bg-[#e2e8f0] justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                  </button>
                </div>

                {/* TRIGGER 5: SLA Breach Warnings */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-sm">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#727785] font-mono">Service Level Agreements</span>
                    <h4 className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      SLA Resolution threshold warnings
                    </h4>
                    <p className="text-[11px] text-[#424754] leading-relaxed">
                      Trigger notification when an active codebase incident reaches 80% duration of the SLA response limit without patch delivery.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleToggleTrigger('slaWarning')}
                    disabled={!globalEnabled}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex shrink-0 ${
                      triggers.slaWarning ? 'bg-[#0062d6] justify-end' : 'bg-[#e2e8f0] justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DELIVERY CHANNELS CONFIGURATION */}
          <div className="space-y-6">

            {/* CHANNELS PANEL */}
            <div className={`bg-white border border-[#c2c6d6] rounded-lg overflow-hidden shadow-sm transition-all duration-200 ${
              !globalEnabled ? 'opacity-60 bg-neutral-50/50 pointer-events-none' : ''
            }`}>
              <div className="bg-[#eceef0]/50 border-b border-[#c2c6d6] px-5 py-3.5">
                <h3 className="text-xs font-bold uppercase text-[#424754] tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#0062d6]" />
                  Active Channels Info
                </h3>
                <p className="text-[10px] text-[#727785] mt-0.5">Select active platforms where alert payloads are pushed.</p>
              </div>

              <div className="p-5 space-y-4">
                
                {/* CHANNEL 1: Teams */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4.5 h-4.5 text-[#4f46e5]" />
                      <span className="text-xs font-bold text-[#191c1e]">MS Teams Webhook Channel</span>
                    </div>
                    <button
                      onClick={() => handleToggleChannel('teams')}
                      disabled={!globalEnabled}
                      className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none flex ${
                        channels.teams ? 'bg-[#0062d6] justify-end' : 'bg-[#e2e8f0] justify-start'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs"></span>
                    </button>
                  </div>
                  {channels.teams && (
                    <input 
                      type="url"
                      value={teamsUrl}
                      onChange={(e) => setTeamsUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-[#c2c6d6] rounded px-2.5 py-1.5 font-mono text-[10px] text-[#424754] focus:bg-white focus:outline-none focus:border-[#0062d6]"
                    />
                  )}
                </div>

                {/* CHANNEL 2: Email */}
                <div className="space-y-2 border-t border-[#eceef0] pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4.5 h-4.5 text-[#0062d6]" />
                      <span className="text-xs font-bold text-[#191c1e]">Email Distribution List</span>
                    </div>
                    <button
                      onClick={() => handleToggleChannel('email')}
                      disabled={!globalEnabled}
                      className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none flex ${
                        channels.email ? 'bg-[#0062d6] justify-end' : 'bg-[#e2e8f0] justify-start'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs"></span>
                    </button>
                  </div>
                  {channels.email && (
                    <input 
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-[#c2c6d6] rounded px-2 px-2.5 py-1.5 font-mono text-[10px] text-[#424754] focus:bg-white focus:outline-none focus:border-[#0062d6]"
                    />
                  )}
                </div>

                {/* CHANNEL 3: Webhook */}
                <div className="space-y-2 border-t border-[#eceef0] pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Webhook className="w-4.5 h-4.5 text-[#008f11]" />
                      <span className="text-xs font-bold text-[#191c1e]">Webhook Payload POST URL</span>
                    </div>
                    <button
                      onClick={() => handleToggleChannel('webhook')}
                      disabled={!globalEnabled}
                      className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none flex ${
                        channels.webhook ? 'bg-[#0062d6] justify-end' : 'bg-[#e2e8f0] justify-start'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs"></span>
                    </button>
                  </div>
                  {channels.webhook && (
                    <input 
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-[#c2c6d6] rounded px-2 px-2.5 py-1.5 font-mono text-[10px] text-[#424754] focus:bg-white focus:outline-none focus:border-[#0062d6]"
                    />
                  )}
                </div>

              </div>
            </div>

            {/* INFORMATION HELPER BLOCK */}
            <div className="bg-[#f0f4f9] border border-[#d1d5db] rounded-lg p-4 space-y-2">
              <h4 className="text-xs font-bold flex items-center gap-1.5 text-[#0062d6]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0062d6]" />
                Gecko Event Payloads
              </h4>
              <p className="text-[11px] text-[#424754] leading-relaxed">
                Gecko pushes standard JSON telemetry matching incident profiles. Every alert contains full root cause files, localized git diff additions/deletions chunks, logs, and sla status codes.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
