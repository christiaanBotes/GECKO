import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  RefreshCw, 
  ArrowRight,
  GitPullRequest,
  Info,
  Code2,
  ChevronRight,
  Gauge,
  Sliders,
  Layers,
  Search,
  CheckCircle
} from 'lucide-react';
import { Incident } from '../types';

interface AgentSimulatorProps {
  onAddSimulatedIncident: (incident: Incident) => void;
}

interface SimulationTemplate {
  name: string;
  service: string;
  severity: 'High' | 'Med' | 'Low';
  logs: string;
  findings: string[];
  rationale: string;
  filePath: string;
  diffCode: { lineNum: number; content: string; type: 'added' | 'removed' | 'normal' }[];
}

const TEMPLATES: SimulationTemplate[] = [
  {
    name: "IDP Key Gateway - JWT Buffer Out-of-Bounds Leak on Tenant Auth",
    service: "idp-gateway",
    severity: "High",
    logs: `2026-06-02 12:00:01 [ALERT] [idp-gateway] Tenant BMW-DE session token bypass validation flag active!
2026-06-02 12:00:02 [WARN] buffer: Buffer() allocation structure is deprecated due to memory safety flaws during security validation.
2026-06-02 12:00:04 [ERROR] [CryptoError]: Out-of-bounds memory allocation read. Leak threshold exceeded on cross-border token evaluation.
    at Buffer.allocUnsafe (node:buffer:392:12)
    at parseTenantToken (TenantAuthInterceptor.ts:142:19)`,
    findings: [
      "Vulnerability identified: Buffer allocation uses allocUnsafe during cross-border tenant OAuth signatures.",
      "The incoming payload is processed without bounds check, causing a potential memory leak of other tenant metadata.",
      "A complete replace with Buffer.alloc (guarantees zero-initialized spaces) ensures strict security for BMW corporate accounts."
    ],
    rationale: "Replacing allocUnsafe with safe zero-initialized Buffers prevents residual memory leak blocks from exposing transient tenant sessions or private document IDs.",
    filePath: "TenantAuthInterceptor.ts",
    diffCode: [
      { lineNum: 141, content: "function parseTenantToken(rawPayload) {", type: 'normal' },
      { lineNum: 142, content: "  // UNSAFE: allocUnsafe leaves memory un-zeroed, risking session leaks", type: 'removed' },
      { lineNum: 143, content: "  const buf = Buffer.allocUnsafe(rawPayload.length);", type: 'removed' },
      { lineNum: 142, content: "  // SAFE: alloc initializes allocated buffers completely with zero bytes", type: 'added' },
      { lineNum: 143, content: "  const buf = Buffer.alloc(rawPayload.length);", type: 'added' },
      { lineNum: 144, content: "  return buf.write(rawPayload);", type: 'normal' }
    ]
  },
  {
    name: "IDP Pipeline Queue - PostgreSQL Deadlock on Concurrent Skill Chaining Calculations",
    service: "idp-pipeline-worker",
    severity: "High",
    logs: `2026-06-02 12:12:30 [FATAL] org.postgresql.util.PSQLException: ERROR: deadlock detected in idp_skill_chain_runs
  Detail: Process 4104 waits for ShareLock on transaction 821949 (Munich workflow request); blocked by process 1224.
  Process 1224 waits for ExclusiveLock on relation "skill_chain_graphs" of database "idp_prod"; blocked by process 4104.
2026-06-02 12:12:35 [ERROR] [idp-pipeline-worker] Multi-tenant skill transaction aborted. Automatic graph status synchronization stalled.`,
    findings: [
      "Simultaneous update locks detected on the skill_chain_graphs records during concurrent multi-tenant skill config creations.",
      "Munich Hub node locked graph row first, while Paris Logistics node locked the allocation state, creating a cyclic lock dependency.",
      "The optimal fix is utilizing non-blocking locked row skips or 'SELECT ... FOR UPDATE SKIP LOCKED' to distribute allocations concurrently."
    ],
    rationale: "Adopting the FOR UPDATE SKIP LOCKED clause releases worker nodes instantly, preventing serial transaction lockouts on concurrent IDP flows.",
    filePath: "WorkflowQueueRepository.sql",
    diffCode: [
      { lineNum: 33, content: "BEGIN TRANSACTION;", type: 'normal' },
      { lineNum: 34, content: "  -- Blocking query causing serial deadlock overheads across European nodes", type: 'removed' },
      { lineNum: 35, content: "  SELECT * FROM skill_chain_graphs WHERE status = 'PENDING' FOR UPDATE;", type: 'removed' },
      { lineNum: 34, content: "  -- Clear locked vehicle rows to safely delegate request handles", type: 'added' },
      { lineNum: 35, content: "  SELECT * FROM skill_chain_graphs WHERE status = 'PENDING' FOR UPDATE SKIP LOCKED LIMIT 1;", type: 'added' },
      { lineNum: 36, content: "COMMIT;", type: 'normal' }
    ]
  },
  {
    name: "IDP Classifier Service - PDF Multi-Page Rasterizer Thread Pool Saturated",
    service: "idp-classifier-service",
    severity: "Med",
    logs: `2026-06-02 12:22:15 [WARNING] [uvicorn.error] Thread Pool saturated (50/50 active workers) due to high-resolution multipage TIFF/PDF data.
2026-06-02 12:22:18 [ERROR] [idp-classifier-service] Image conversion task blocked for 60000ms. Gateway timeout triggered.
2026-06-02 12:22:20 [FATAL] [OS] Out of memory: Kill process 1292 (image-worker-thread) score 91.`,
    findings: [
      "Heavy image resizing and page extraction computations execute synchronously on the main Event Loop.",
      "This blocks incoming REST and webhook uploads from tenants logging document validation runs.",
      "Moving pdf page rasterization steps onto background Worker Threads avoids blocking the primary event loop."
    ],
    rationale: "Offloading intensive graphic transformation routines prevents validation payload uploads from bottlenecking the primary tenant transaction thread pool.",
    filePath: "LayoutProcessor.ts",
    diffCode: [
      { lineNum: 10, content: "import { processImageMeta } from './utils';", type: 'normal' },
      { lineNum: 11, content: "export async function handleImageUpload(req: Request) {", type: 'normal' },
      { lineNum: 12, content: "    const resized = resizeImageBufferSync(req.body); // blocking execution", type: 'removed' },
      { lineNum: 13, content: "    return processImageMeta(resized);", type: 'removed' },
      { lineNum: 12, content: "    // Scale off to dedicated Worker Thread", type: 'added' },
      { lineNum: 13, content: "    const resized = await runImageWorkerThread(req.body);", type: 'added' },
      { lineNum: 14, content: "    return processImageMeta(resized);", type: 'added' }
    ]
  }
];

type SimulationState = 'idle' | 'parsing_logs' | 'building_ast' | 'calculating_fix' | 'completed';

export default function AgentSimulator({ onAddSimulatedIncident }: AgentSimulatorProps) {
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState<number>(0);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [demoMode, setDemoMode] = useState<'auto' | 'manual'>('auto');
  const [progressLog, setProgressLog] = useState<string[]>([]);
  
  const template = TEMPLATES[selectedTemplateIdx];

  // Helper messages for presentation steps
  const stepsConfig = [
    {
      id: 'parsing_logs',
      title: "1. Receive Incident from ITSM.next",
      desc: "Ingests raw webhook payloads from the ITSM.next deployment warning pool to kick-start triaging.",
      logTrigger: () => [
        `[ITSM.next] Ingested raw webhook trigger payload on route /api/v1/incidents/stream`,
        `[ITSM.next] Identified fault: '${template.severity}' priority exception for microservice '${template.service}'`,
        `[GECKO] Activated operational triage thread to isolate failure root-cause`
      ]
    },
    {
      id: 'building_ast',
      title: "2. Query Grafana Loki logs (PROD)",
      desc: "Executes targeted LogQL queries targeting the PROD namespace to filter out precise container runtime logs and trace files.",
      logTrigger: () => [
        `[GRAFANA LOKI] Querying production Loki DB via LogQL: {env="prod", service="${template.service}"} |= "exception"`,
        `[GRAFANA LOKI] Streamed 14 matching execution event lines into workspace buffer`,
        `[GECKO] Isolated target exception origin block from Loki telemetry stream`
      ]
    },
    {
      id: 'calculating_fix',
      title: "3. Traversal of Relevant Codebase AST",
      desc: "Autonomously traverses workspace folder mappings, compiles syntax trees (ASTs), and isolates code lines of interest.",
      logTrigger: () => [
        `[CODEBASE] Trait indexing repository codebase structure...`,
        `[CODEBASE] Successfully located relevant source file: '${template.filePath}'`,
        `[AST PARSER] Constructing Abstract Syntax Tree nodes to inspect line boundaries`,
        `[GECKO] Pinpointed structural misconfiguration block (95%+ match to historical patterns)`
      ]
    },
    {
      id: 'completed',
      title: "4. Suggest Fix & Mock Bundle Check",
      desc: "Drafts a safe code replacement patch, tests container compilation, and returns an actionable, click-to-merge PR.",
      logTrigger: () => [
        `[GECKO] Computing minimal secure code differential...`,
        `[CONTAINER SANDBOX] Initiating mock sandbox build integration check... Standard exit code 0 (Success)`,
        `[SUCCESS] Generated ready-to-inject code patch! Full findings mapped to active operational dashboard.`
      ]
    }
  ];

  // Automatically advance or run trigger sequences
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (demoMode === 'auto') {
      if (simulationState === 'parsing_logs') {
        timer = setTimeout(() => {
          setProgressLog(prev => [...prev, ...stepsConfig[1].logTrigger()]);
          setSimulationState('building_ast');
        }, 1500);
      } else if (simulationState === 'building_ast') {
        timer = setTimeout(() => {
          setProgressLog(prev => [...prev, ...stepsConfig[2].logTrigger()]);
          setSimulationState('calculating_fix');
        }, 1500);
      } else if (simulationState === 'calculating_fix') {
        timer = setTimeout(() => {
          setProgressLog(prev => [...prev, ...stepsConfig[3].logTrigger()]);
          setSimulationState('completed');
        }, 1500);
      }
    }
    return () => clearTimeout(timer);
  }, [simulationState, demoMode, selectedTemplateIdx]);

  const handleStartSimulation = () => {
    setSimulationState('parsing_logs');
    setProgressLog(stepsConfig[0].logTrigger());
  };

  const handleAdvanceStepManually = () => {
    if (simulationState === 'idle') {
      handleStartSimulation();
    } else if (simulationState === 'parsing_logs') {
      setProgressLog(prev => [...prev, ...stepsConfig[1].logTrigger()]);
      setSimulationState('building_ast');
    } else if (simulationState === 'building_ast') {
      setProgressLog(prev => [...prev, ...stepsConfig[2].logTrigger()]);
      setSimulationState('calculating_fix');
    } else if (simulationState === 'calculating_fix') {
      setProgressLog(prev => [...prev, ...stepsConfig[3].logTrigger()]);
      setSimulationState('completed');
    }
  };

  const handleReset = () => {
    setSimulationState('idle');
    setProgressLog([]);
  };

  const handleCreateIncidentAndGo = () => {
    const simulatedId = `INC-${Math.floor(8410 + Math.random() * 100)}`;
    const newIncident: Incident = {
      id: simulatedId,
      title: template.name,
      description: template.name,
      severity: template.severity,
      status: 'Active',
      service: template.service,
      assignee: 'Unassigned',
      timestamp: new Date().toUTCString().replace('GMT', 'UTC'),
      createdAtText: 'Created Just now',
      logs: template.logs,
      affectedServices: [template.service, 'Ingress Router'],
      slaStatus: 'Action Required',
      keyFindings: template.findings,
      fixes: [
        {
          id: 'fix-1',
          name: 'Fix 1',
          confidence: 95,
          description: 'Optimized fix generated by Gecko Agent',
          filePath: template.filePath,
          diff: template.diffCode
        }
      ],
      rationale: template.rationale,
      similarIncidents: [
        { id: 'INC-4091', title: 'Spring Boot OCR Pre-processing API throwing 500 Internal Server Error' }
      ]
    };

    onAddSimulatedIncident(newIncident);
    handleReset();
  };

  // Check the progress of each step
  const getStepStatus = (stepId: string) => {
    if (simulationState === 'idle') return 'pending';
    
    const stateOrder: SimulationState[] = ['idle', 'parsing_logs', 'building_ast', 'calculating_fix', 'completed'];
    const currentIdx = stateOrder.indexOf(simulationState);
    const stepIdx = stateOrder.indexOf(stepId as SimulationState);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="flex-grow bg-[#f7f9fb] text-[#191c1e] font-sans pb-16">
      <div className="max-w-[1000px] mx-auto px-6 pt-6 flex flex-col gap-6">
        
        {/* Simplified Premium Demo Header */}
        <div className="bg-white border border-[#c2c6d6] rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#0062d6]">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Gecko Simulator Sandbox</span>
            </div>
            <h1 className="text-xl font-bold font-sans text-[#191c1e] tracking-tight">
              Interactive Autonomous Triage Simulation
            </h1>
            <p className="text-xs text-[#424754] leading-relaxed">
              Use this controlled sandbox during your live presentation to demonstrate how Gecko immediately catches alert exceptions, maps the codebase structure, drafts correct security interventions, and prepares mergeable Pull Requests in seconds.
            </p>
          </div>

          {/* Quick Demo Controls Widget */}
          <div className="bg-[#f8fafc] border border-[#eceef0] p-4 rounded-lg flex flex-col gap-3 min-w-[200px] shrink-0">
            <div>
              <span className="text-[9px] font-bold text-[#727785] tracking-wider uppercase block">Demo Mode Toggle</span>
              <div className="flex gap-1.5 mt-1.5">
                <button
                  disabled={simulationState !== 'idle'}
                  onClick={() => setDemoMode('auto')}
                  className={`flex-1 text-[10px] py-1 px-2.5 rounded font-bold transition-all border ${
                    demoMode === 'auto'
                      ? 'bg-white border-[#0062d6] text-[#0062d6] shadow-xs'
                      : 'bg-transparent border-transparent text-[#727785] hover:text-[#191c1e]'
                  }`}
                >
                  Auto-Play
                </button>
                <button
                  disabled={simulationState !== 'idle'}
                  onClick={() => setDemoMode('manual')}
                  className={`flex-1 text-[10px] py-1 px-2.5 rounded font-bold transition-all border ${
                    demoMode === 'manual'
                      ? 'bg-white border-[#0062d6] text-[#0062d6] shadow-xs'
                      : 'bg-transparent border-transparent text-[#727785] hover:text-[#191c1e]'
                  }`}
                >
                  Step-by-Step
                </button>
              </div>
            </div>

            <div className="text-[10px] text-[#727785] leading-normal font-sans border-t border-[#eceef0] pt-2 italic">
              {demoMode === 'auto' 
                ? "💡 Runs continuously at an easy-to-follow demo pace." 
                : "💡 Control step transitions manually to explain each phase."
              }
            </div>
          </div>
        </div>

        {/* Primary Simulation Interface Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Choose scenario panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#c2c6d6] rounded-xl p-4 shadow-sm space-y-3.5">
              <h3 className="text-xs font-bold text-[#191c1e] tracking-wider uppercase flex items-center gap-1.5 border-b border-[#eceef0] pb-2">
                <Sliders className="w-3.5 h-3.5 text-[#727785]" />
                1. Select Demo Scenario
              </h3>
              
              <div className="space-y-2">
                {TEMPLATES.map((tpl, idx) => {
                  const isSelected = selectedTemplateIdx === idx;
                  return (
                    <button
                      key={idx}
                      disabled={simulationState !== 'idle'}
                      onClick={() => setSelectedTemplateIdx(idx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all transition-duration-150 flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-[#0062d6]/5 border-[#0062d6] text-[#004ba7] ring-1 ring-[#0062d6]/20'
                          : 'bg-transparent border-[#c2c6d6] text-[#424754] hover:bg-[#eceef0] disabled:opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider ${
                          tpl.severity === 'High' ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tpl.severity} Critical
                        </span>
                        <span className="font-mono text-[10px] text-[#727785]">{tpl.service}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#191c1e] leading-snug">{tpl.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons styled cleanly */}
              <div className="pt-2">
                {simulationState === 'idle' ? (
                  <button
                    onClick={demoMode === 'auto' ? handleStartSimulation : handleAdvanceStepManually}
                    className="w-full bg-[#0062d6] text-white hover:bg-[#004ba7] p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shadow-[#0062d6]/10 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    {demoMode === 'auto' ? 'Launch Autopilot Demo' : 'Begin Interactive Guide'}
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="w-full border border-[#c2c6d6] text-[#424754] bg-white hover:bg-[#eceef0] p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Simulation
                  </button>
                )}
              </div>
            </div>

            {/* Simulated Live logs visualizer */}
            <div className="bg-[#121212] border border-[#2d3139] rounded-xl p-4 shadow-xl overflow-hidden space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-green-500" />
                  Telemetry Log Source
                </span>
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
              </div>
              <div className="text-[10px] text-gray-300 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap font-mono">
                {template.logs}
              </div>
            </div>
          </div>

          {/* RIGHT: Clear flow / sandbox timeline execution */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white border border-[#c2c6d6] rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-5 py-3 border-b border-[#eceef0] flex justify-between items-center">
                <span className="text-xs font-bold text-[#424754] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0062d6]" />
                  2. Visual Triage Pipeline Stream
                </span>
                
                {simulationState !== 'idle' && simulationState !== 'completed' && demoMode === 'manual' && (
                  <button
                    onClick={handleAdvanceStepManually}
                    className="bg-[#0062d6] text-white hover:bg-[#004ba7] text-[10px] font-bold py-1 px-2.5 rounded flex items-center gap-1 transition-all"
                  >
                    Explain Next Step
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Progress Flow Visualization Cards */}
              <div className="p-5 space-y-3.5">
                {stepsConfig.map((step) => {
                  const status = getStepStatus(step.id);
                  return (
                    <div 
                      key={step.id}
                      className={`border rounded-lg p-4 transition-all duration-300 flex items-start gap-3.5 ${
                        status === 'completed'
                          ? 'bg-emerald-50/40 border-emerald-300/60 text-emerald-950'
                          : status === 'active'
                          ? 'bg-blue-50/50 border-[#0062d6]/50 shadow-xs ring-1 ring-[#0062d6]/10 animate-pulse'
                          : 'bg-white border-[#eceef0] opacity-50'
                      }`}
                    >
                      <div className="pt-0.5 shrink-0">
                        {status === 'completed' ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                        ) : status === 'active' ? (
                          <div className="w-5 h-5 rounded-full bg-[#0062d6] text-white flex items-center justify-center shadow-md animate-spin">
                            <RefreshCw className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-[#c2c6d6] text-[#727785] flex items-center justify-center font-mono text-[9px] font-bold">
                            •
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-bold ${
                          status === 'active' ? 'text-[#004ba7]' : 'text-[#191c1e]'
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-[#424754] leading-normal">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nested Micro Terminal console log feed below stack */}
              {simulationState !== 'idle' && (
                <div className="bg-[#121212] border-t border-[#c2c6d6]/20 p-4 font-mono text-[10px] text-gray-200 space-y-1.5 max-h-44 overflow-y-auto">
                  <div className="text-gray-500 text-[9px] font-bold border-b border-gray-800 pb-1 flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-emerald-400" />
                    Gecko Internal Stream Engine Logs
                  </div>
                  {progressLog.map((log, idx) => (
                    <div key={idx} className="animate-fade-in text-gray-300">
                      <span className="text-gray-600 mr-1.5 select-none">&gt;</span>
                      {log}
                    </div>
                  ))}
                  {simulationState !== 'completed' && (
                     <div className="text-[#58a6ff] italic animate-pulse flex items-center gap-1.5 pt-1">
                       <RefreshCw className="w-3 h-3 animate-spin" />
                       Computing analysis logic context...
                     </div>
                  )}
                </div>
              )}
            </div>

            {/* Visual Outcome Results Banner (Showcases AST match, Confidence rating, code patch ready-to-inject) */}
            {simulationState === 'completed' && (
              <div className="bg-white border-2 border-emerald-500 rounded-xl shadow-lg p-5 space-y-4 animate-scale-up">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[#eceef0] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#191c1e]">Completed Triage Simulation Successfully!</h4>
                      <p className="text-[11px] text-[#424754]">Gecko compiled the fault analysis and prepared a ready-made pull request outline.</p>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                    🛡️ Confidence: 95%
                  </span>
                </div>

                <div className="space-y-3">
                  {/* File fix destination info */}
                  <div className="bg-slate-50 border border-[#eceef0] rounded-lg p-3 text-xs flex justify-between items-center text-[#424754]">
                    <span className="font-semibold">Target Repository Scope:</span>
                    <span className="font-mono bg-[#eceef0] text-gray-800 px-2 py-0.5 rounded font-bold">
                      {template.filePath}
                    </span>
                  </div>

                  {/* High level outcome bullet list */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#727785] font-bold block uppercase tracking-wide">Key Findings Drafted</span>
                    <ul className="text-xs text-[#424754] space-y-1.5 list-disc list-inside bg-[#f8fafc] border border-[#eceef0] p-3.5 rounded-lg leading-relaxed">
                      {template.findings.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Micro Visual Code Diff Preview */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#727785] font-bold block uppercase tracking-wide">Synthesized Code Differential Patch</span>
                    <div className="border border-[#c2c6d6] rounded-lg overflow-hidden text-xs">
                      <div className="bg-[#f8fafc] px-3 py-1.5 text-[10px] font-mono border-b border-[#c2c6d6] text-[#727785] font-bold">
                        {template.filePath} - Diff View
                      </div>
                      <div className="font-mono text-[11px] bg-[#1e1e1e] text-white p-3 space-y-1 h-32 overflow-y-auto leading-relaxed">
                        {template.diffCode.map((line, idx) => {
                          let colorClass = 'text-white/60';
                          if (line.type === 'added') colorClass = 'text-green-300 bg-[#1b432e]/50 font-bold';
                          if (line.type === 'removed') colorClass = 'text-red-300 bg-[#4c1f1f]/50 line-through';
                          return (
                            <div key={idx} className={`${colorClass} font-mono px-1 flex`}>
                              <span className="text-white/30 w-8 select-none border-r border-[#2d3139] mr-2 text-[10px] text-right pr-2">
                                {line.lineNum}
                              </span>
                              <span>
                                {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '} {line.content}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action Block directing user into workflow */}
                <div className="bg-emerald-50/50 border border-emerald-200/80 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">Ready to present details?</span>
                    <p className="text-[11px] text-[#424754] leading-relaxed">Click below to push the freshly simulated incident into the Gecko Operational Incidents queue, where you can show stakeholders the full triage logs, interactive claim flows, and GitHub integration!</p>
                  </div>

                  <button
                    onClick={handleCreateIncidentAndGo}
                    className="bg-[#0062d6] hover:bg-[#004ba7] text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-md hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Inject Incident & View Live Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
