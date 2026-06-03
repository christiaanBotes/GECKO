import React from 'react';
import { 
  Cpu, 
  Network, 
  Layers, 
  Database, 
  Activity, 
  CheckCircle2, 
  AlertOctagon, 
  RefreshCw, 
  ArrowUpRight,
  TrendingUp,
  Server
} from 'lucide-react';

/* SERVICES VIEW TAB */
export function ServicesView() {
  const services = [
    { name: 'spring-boot-core', status: 'Healthy', latency: '42ms', cpu: '14%', memory: '512MB', instances: '3/3' },
    { name: 'auth-api', status: 'Healthy', latency: '12ms', cpu: '4%', memory: '256MB', instances: '2/2' },
    { name: 'cloud-storage', status: 'Healthy', latency: '120ms', cpu: '22%', memory: '1.2GB', instances: '4/4' },
    { name: 'cache-01', status: 'Healthy', latency: '1.2ms', cpu: '1.5%', memory: '512MB', instances: '1/1' },
    { name: 'gateway-auth', status: 'Healthy', latency: '8ms', cpu: '3%', memory: '128MB', instances: '2/2' },
    { name: 'ml-inference-api', status: 'Healthy', latency: '280ms', cpu: '45%', memory: '4.1GB', instances: '2/2' }
  ];

  return (
    <div className="flex-grow p-6 text-[#191c1e] font-sans">
      <div className="max-w-[1000px] mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Active Microservices Status</h1>
          <p className="text-xs text-[#424754]">Real-time operational inspection metrics for clustered container endpoints.</p>
        </div>

        <div className="bg-white border border-[#c2c6d6] rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eceef0]/50 border-b border-[#c2c6d6] text-[10px] font-bold text-[#424754] tracking-wider uppercase">
                <th className="py-3 px-4">SERVICE NAME</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">AVG LATENCY</th>
                <th className="py-3 px-4">CPU LOAD</th>
                <th className="py-3 px-4">JVM HEAP MEM</th>
                <th className="py-3 px-4">REPLICAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0] text-xs">
              {services.map((svc) => (
                <tr key={svc.name} className="hover:bg-[#f8fafc]">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0062d6]">
                    {svc.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1.5 text-xs text-[#1a7f37] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#1a7f37]"></span>
                      {svc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">{svc.latency}</td>
                  <td className="py-3.5 px-4 font-mono">{svc.cpu}</td>
                  <td className="py-3.5 px-4 font-mono text-[#424754]">{svc.memory}</td>
                  <td className="py-3.5 px-4 font-sans font-medium">{svc.instances}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* INFRASTRUCTURE TOPOLOGICAL CLUSTERS VIEW */
export function InfrastructureView() {
  const regions = [
    { name: 'AWS us-east-1 (N. Virginia)', zoneCount: 3, status: 'Active', latency: '35ms' },
    { name: 'GCP europe-west2 (London)', zoneCount: 4, status: 'Active', latency: '40ms' },
    { name: 'GCP asia-east1 (Taiwan)', zoneCount: 3, status: 'Active', latency: '128ms' }
  ];

  return (
    <div className="flex-grow p-6 text-[#191c1e] font-sans">
      <div className="max-w-[1000px] mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Gecko Infrastructures topological maps</h1>
          <p className="text-xs text-[#424754]">Inspecting load balancer status metrics across global region availability clusters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regions.map((reg, idx) => (
            <div key={idx} className="bg-white border border-[#c2c6d6] rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded bg-[#0062d6]/5 border border-[#0062d6]/20">
                  <Server className="w-5 h-5 text-[#0062d6]" />
                </div>
                <span className="bg-[#1a7f37]/10 text-[#1a7f37] text-[10px] font-bold px-2 py-0.5 rounded border border-[#1a7f37]/10 uppercase">
                  {reg.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#191c1e] tracking-tight">{reg.name}</h3>
                <p className="text-[11px] text-[#727785] mt-1 font-mono">Zones: {reg.zoneCount} Availability Clusters</p>
              </div>

              <div className="flex border-t border-[#eceef0] pt-3 justify-between text-xs text-[#424754] font-medium font-sans">
                <span>Core network ping:</span>
                <span className="font-mono font-bold text-[#191c1e]">{reg.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* OPERATIONS DASHBOARD (METRICS GRIDS & CHARTS MOUNT) */
export function DashboardView() {
  const [hoveredHourIndex, setHoveredHourIndex] = React.useState<number | null>(null);

  const hourlyIncidentData = [
    { hour: '12 AM', count: 1, desc: 'PostgreSQL connection queue warn' },
    { hour: '1 AM', count: 0, desc: 'No incidents' },
    { hour: '2 AM', count: 0, desc: 'No incidents' },
    { hour: '3 AM', count: 2, desc: 'Redis memory ceiling warning' },
    { hour: '4 AM', count: 0, desc: 'No incidents' },
    { hour: '5 AM', count: 0, desc: 'No incidents' },
    { hour: '6 AM', count: 1, desc: 'S3 policy lockdown notice' },
    { hour: '7 AM', count: 0, desc: 'No incidents' },
    { hour: '8 AM', count: 3, desc: 'Auth Latency spikes' },
    { hour: '9 AM', count: 4, desc: 'Hikari pool exhaustion logs' },
    { hour: '10 AM', count: 2, desc: 'Token redundant parser leak' },
    { hour: '11 AM', count: 1, desc: 'Ingress timeout warning' },
    { hour: '12 PM', count: 0, desc: 'No incidents' },
    { hour: '1 PM', count: 0, desc: 'No incidents' },
    { hour: '2 PM', count: 5, desc: 'ML Inference API resource limit' },
    { hour: '3 PM', count: 3, desc: 'PostgreSQL deadlock in Order Billing' },
    { hour: '4 PM', count: 2, desc: 'Vulnerability threat check bypass' },
    { hour: '5 PM', count: 1, desc: 'Minor CORS warn resolved' },
    { hour: '6 PM', count: 0, desc: 'No incidents' },
    { hour: '7 PM', count: 0, desc: 'No incidents' },
    { hour: '8 PM', count: 2, desc: 'User Session database disconnect' },
    { hour: '9 PM', count: 1, desc: 'Memory volatile-lru eviction' },
    { hour: '10 PM', count: 0, desc: 'No incidents' },
    { hour: '11 PM', count: 2, desc: 'Security Token buffer threat' }
  ];

  const totalIncidents24h = hourlyIncidentData.reduce((sum, item) => sum + item.count, 0);
  const peakHourIndex = hourlyIncidentData.reduce((maxIdx, current, idx, arr) => 
    current.count > arr[maxIdx].count ? idx : maxIdx, 0
  );

  return (
    <div className="flex-grow p-6 text-[#191c1e] font-sans">
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Global Operational Status</h1>
            <p className="text-xs text-[#424754]">Overview metrics tracking service uptimes, operational SLA budgets, and error rates.</p>
          </div>
          <span className="text-xs font-mono bg-[#eceef0] py-1 px-3 rounded text-[#424754] font-medium border border-[#c2c6d6]/60">
            SYSTEM GREEN ● 99.98% SLA
          </span>
        </div>

        {/* Dashboard grid metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#c2c6d6] rounded-lg p-4 shadow-sm">
            <span className="text-[10px] font-bold text-[#727785] block uppercase">Network Ingress Rate</span>
            <span className="text-2xl font-semibold mt-1 block">14.2k rps</span>
            <span className="text-[10px] text-[#1a7f37] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3" /> +4.2% vs average
            </span>
          </div>

          <div className="bg-white border border-[#c2c6d6] rounded-lg p-4 shadow-sm">
            <span className="text-[10px] font-bold text-[#727785] block uppercase">Average Latency</span>
            <span className="text-2xl font-semibold mt-1 block">12.5ms</span>
            <span className="text-[10px] text-[#1a7f37] font-semibold mt-1 flex items-center gap-1">
              Stable
            </span>
          </div>

          <div className="bg-white border border-[#c2c6d6] rounded-lg p-4 shadow-sm">
            <span className="text-[10px] font-bold text-[#727785] block uppercase">Global Error Rate</span>
            <span className="text-2xl font-semibold mt-1 block text-[#1a7f37]">0.02%</span>
            <span className="text-[10px] text-[#1a7f37] font-semibold mt-1 flex items-center gap-1">
              Nominal
            </span>
          </div>

          <div className="bg-white border border-[#c2c6d6] rounded-lg p-4 shadow-sm">
            <span className="text-[10px] font-bold text-[#727785] block uppercase">Active Clusters</span>
            <span className="text-2xl font-semibold mt-1 block">22 / 22</span>
            <span className="text-[10px] text-[#1a7f37] font-semibold mt-1 flex items-center gap-1">
              Fully redundant
            </span>
          </div>
        </div>

        {/* Updated Incident Volume graph matching dashboard elements */}
        <div className="bg-white border border-[#c2c6d6] rounded-lg p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 border-b border-[#eceef0] pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase text-[#727785] tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#ba1a1a]" />
                Incident Volume by Hour (Last 24 Hours)
              </h3>
              <p className="text-[10px] text-[#424754] mt-0.5">Distribution of triggered operational alerts, system exceptions, and code-related bugs.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#ba1a1a] rounded-sm"></span>
                <span className="text-[#424754]">Peak Hour ({hourlyIncidentData[peakHourIndex].hour})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#0062d6] rounded-sm"></span>
                <span className="text-[#424754]">Standard Volume</span>
              </div>
              <span className="text-[11px] font-mono bg-[#f1f3f5] py-0.5 px-2 rounded text-[#191c1e] font-bold">
                Total 24h: {totalIncidents24h} Alerts
              </span>
            </div>
          </div>
          
          <div className="h-44 flex items-end gap-1.5 px-4 select-none relative pt-4">
            {hourlyIncidentData.map((item, idx) => {
              const maxCountInDataset = 6;
              const barHeightPct = item.count === 0 ? 3 : (item.count / maxCountInDataset) * 100;
              const isPeak = item.count >= 4;

              return (
                <div 
                  key={idx} 
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group relative"
                  onMouseEnter={() => setHoveredHourIndex(idx)}
                  onMouseLeave={() => setHoveredHourIndex(null)}
                >
                  {/* Floating tooltip inline on hover */}
                  {hoveredHourIndex === idx && (
                    <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[10px] p-2 rounded shadow-xl z-30 w-36 pointer-events-none text-center font-sans">
                      <div className="font-bold border-b border-white/10 pb-1 mb-1 text-white">{item.hour}</div>
                      <div className="text-[11px] font-bold text-red-300 font-mono">{item.count} {item.count === 1 ? 'Incident' : 'Incidents'}</div>
                      {item.count > 0 && <div className="text-[9px] text-gray-300 leading-tight mt-1">{item.desc}</div>}
                    </div>
                  )}

                  {/* The bar element */}
                  <div 
                    className={`w-full rounded-t transition-all ${
                      isPeak 
                        ? 'bg-[#ba1a1a] opacity-90 group-hover:opacity-100 group-hover:scale-x-105' 
                        : item.count > 0 
                        ? 'bg-[#0062d6] opacity-80 group-hover:opacity-100 group-hover:scale-x-105' 
                        : 'bg-slate-200 opacity-60 group-hover:bg-slate-300'
                    }`} 
                    style={{ height: `${barHeightPct}%` }}
                  ></div>

                  {/* Hourly labels */}
                  <span className="text-[9px] text-[#727785] font-mono select-none hidden md:block leading-none mt-1">
                    {item.hour.replace(' ', '')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Stats Summary underneath */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-t border-[#eceef0] mt-4 pt-4 text-xs font-sans text-[#424754]">
            <div className="bg-[#f8fafc] border border-[#eceef0] p-2.5 rounded">
              <span className="text-[10px] text-[#727785] font-bold block mb-0.5 uppercase">Max Incident Surge</span>
              <span className="font-bold text-[#191c1e] text-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                {hourlyIncidentData[peakHourIndex].count} alerts at {hourlyIncidentData[peakHourIndex].hour}
              </span>
            </div>

            <div className="bg-[#f8fafc] border border-[#eceef0] p-2.5 rounded">
              <span className="text-[10px] text-[#727785] font-bold block mb-0.5 uppercase">Average Incidents / Hr</span>
              <span className="font-bold text-[#191c1e] text-sm">
                {(totalIncidents24h / 24).toFixed(1)} incidents / hour
              </span>
            </div>

            <div className="bg-[#f8fafc] border border-[#eceef0] p-2.5 rounded">
              <span className="text-[10px] text-[#727785] font-bold block mb-0.5 uppercase">Current Gecko MTTA</span>
              <span className="font-bold text-[#191c1e] text-sm text-[#1a7f37]">
                &lt; 2.1 seconds (Autonomous)
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* HISTORICS LOG INSPECTOR STREAM */
export function LogsView() {
  return (
    <div className="flex-grow p-6 text-[#191c1e] font-sans">
      <div className="max-w-[1000px] mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Clustered Log Aggregator</h1>
          <p className="text-xs text-[#424754]">Search and query log outputs universally across clustered docker deployments.</p>
        </div>

        <div className="bg-white border border-[#c2c6d6] rounded-lg overflow-hidden shadow-sm flex flex-col h-[400px]">
          <div className="bg-[#eceef0]/60 border-b border-[#c2c6d6] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
            <div className="flex items-center gap-2 w-full sm:-max-w-xs">
              <span className="text-xs text-[#424754] font-medium font-sans shrink-0">Source Service:</span>
              <select className="bg-white border border-[#c2c6d6] rounded py-1 px-2.5 text-xs text-[#191c1e] focus:outline-none w-full">
                <option>ALL SERVICES</option>
                <option>spring-boot-core</option>
                <option>auth-api</option>
                <option>cloud-storage</option>
                <option>cache-01</option>
              </select>
            </div>

            <button className="bg-white hover:bg-[#eceef0] border border-[#c2c6d6] text-[#424754] px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto justify-center select-none">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Stream
            </button>
          </div>

          <div className="bg-[#1e1e1e] text-white p-4 font-mono text-[11px] leading-relaxed overflow-y-auto flex-grow h-full">
            <div className="text-white/40 italic mb-2">// Aggregated logs stream...</div>
            <div className="text-green-300">2026-06-02 14:00:12 [INFO] gateway-auth: Received authentication request for user_session_82194</div>
            <div>2026-06-02 14:00:15 [DEBUG] cache-01: Local key cache hit inside memory clusters for token_guid_829</div>
            <div>2026-06-02 14:00:18 [INFO] user-profile-db: Connection request accepted. (Thread ID: 41)</div>
            <div className="text-[#58a6ff]">2026-06-02 14:01:02 [INFO] spring-boot-core: Scheduled metrics summary push to Gecko telemetry... OK.</div>
            <div className="text-gray-400">2026-06-02 14:01:45 [DEBUG] cloud-storage: Checking S3 Bucket policy constraints... authenticated bucket.</div>
            <div className="text-[#1a7f37] font-bold">2026-06-02 14:01:53 [SUCCESS] billing-worker: Database synchronization completed successfully on thread replica_00.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
