export interface PlayEvent {
  sessionId: string;
  timestamp: string;
  level: string;
  checkpoint: string;
  eventName: string;
  result: string;
}

export interface PerformanceMetric {
  sessionId: string;
  timestamp: string;
  avgFps: number;
  frameTimeMs: number;
  hitchCount: number;
  memoryMb: number;
  gpuTimeMs: number;
  level: string;
}

export interface CrashReport {
  crashId: string;
  sessionId: string;
  buildVersion: string;
  mapName: string;
  callstackSummary: string;
  logExcerpt: string;
  platform: string;
}

export interface QAFeedback {
  feedbackId: string;
  sessionId: string;
  testerId: string;
  severityManual: 'Low' | 'Medium' | 'High' | 'Blocker';
  freeText: string;
  reproductionHint: string;
  level: string;
}

export type IssueCategory = 'Performance' | 'Crash' | 'Progression' | 'UI/UX' | 'Gameplay';
export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type RecommendedOwner = 'TA' | 'Designer' | 'Engineer' | 'QA';
export type ActionType = 'Immediate Fix' | 'Investigate' | 'Monitor' | 'More Data Needed';

export interface IssueHypothesis {
  id: string;
  text: string;
  confidence: number;
}

export interface NextAction {
  id: string;
  type: ActionType;
  description: string;
}

export interface AIAnalysisSummary {
  whyItMatters: string;
  hypotheses: IssueHypothesis[];
  recommendedOwner: RecommendedOwner;
  nextActions: NextAction[];
}

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  severity: IssueSeverity;
  priorityScore: number; // 0-100
  affectedSessions: number;
  representativeLevel: string;
  aiSummary: string;
  firstSeen: string;
  lastSeen: string;
  sourceTypes: ('Performance' | 'Crash' | 'QA Feedback' | 'Telemetry')[];
  
  // Evidence references
  relatedQA: QAFeedback[];
  relatedPerformance: PerformanceMetric[];
  relatedCrashes: CrashReport[];
  relatedEvents: PlayEvent[];
  
  analysis: AIAnalysisSummary;
}

export interface BuildSummary {
  buildId: string;
  date: string;
  totalSessions: number;
  totalIssues: number;
  highSeverityIssues: number;
  riskChangePercent: number; // negative is good
  topRisks: Issue[];
  executiveSummary: string;
  regressions: string[];
  actionPlan: string;
}
