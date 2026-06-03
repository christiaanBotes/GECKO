export type Severity = 'High' | 'Med' | 'Low';
export type IncidentStatus = 'Active' | 'Investigating' | 'Mitigating' | 'Resolved';

export interface CodeDiffLine {
  lineNum: number;
  content: string;
  type: 'added' | 'removed' | 'normal';
}

export interface SuggestedFix {
  id: string;
  name: string;
  confidence: number;
  description: string;
  filePath: string;
  diff: CodeDiffLine[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  service: string;
  assignee: string;
  timestamp: string;
  createdAtText: string;
  logs: string;
  affectedServices: string[];
  slaStatus: string;
  keyFindings: string[];
  fixes: SuggestedFix[];
  rationale: string;
  similarIncidents: { id: string; title: string }[];
  isOutsideScope?: boolean;
}

export interface ActivityFeedItem {
  id: string;
  incidentId: string;
  user: string;
  action: string;
  timestamp: string;
  avatarUrl?: string;
  isAi?: boolean;
  isError?: boolean;
}

export interface TriageStep {
  id: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
  label: string;
  description: string;
  durationMs: number;
}
