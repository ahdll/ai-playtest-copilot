import { PlayEvent, PerformanceMetric, CrashReport, QAFeedback, Issue } from './types';

// Generators for raw data
export const generatePlayEvents = (): PlayEvent[] => {
  return [
    { sessionId: 'S-1001', timestamp: '2023-10-24T10:05:00Z', level: 'Tutorial', checkpoint: 'Start', eventName: 'SessionStart', result: 'Success' },
    { sessionId: 'S-1001', timestamp: '2023-10-24T10:07:30Z', level: 'Tutorial', checkpoint: 'WeaponEquip', eventName: 'UI_Open_Inventory', result: 'Success' },
    { sessionId: 'S-1001', timestamp: '2023-10-24T10:08:15Z', level: 'Tutorial', checkpoint: 'WeaponEquip', eventName: 'SessionEnd', result: 'Quit' }, // Churn
    
    { sessionId: 'S-1002', timestamp: '2023-10-24T10:15:00Z', level: 'Tutorial', checkpoint: 'Start', eventName: 'SessionStart', result: 'Success' },
    { sessionId: 'S-1002', timestamp: '2023-10-24T10:16:00Z', level: 'Tutorial', checkpoint: 'Movement', eventName: 'AreaComplete', result: 'Success' },
    { sessionId: 'S-1002', timestamp: '2023-10-24T10:19:30Z', level: 'Tutorial', checkpoint: 'WeaponEquip', eventName: 'UI_Open_Inventory', result: 'Success' },
    { sessionId: 'S-1002', timestamp: '2023-10-24T10:20:45Z', level: 'Tutorial', checkpoint: 'WeaponEquip', eventName: 'SessionEnd', result: 'Quit' }, // Churn
    
    { sessionId: 'S-2001', timestamp: '2023-10-24T11:00:00Z', level: 'Level_04_Boss', checkpoint: 'BossArena', eventName: 'BossPhase1Start', result: 'Success' },
    { sessionId: 'S-2001', timestamp: '2023-10-24T11:02:15Z', level: 'Level_04_Boss', checkpoint: 'BossArena', eventName: 'BossPhase2Start', result: 'Success' }, // VFX Heavy
    
    { sessionId: 'S-3001', timestamp: '2023-10-24T12:00:00Z', level: 'Level_02_City', checkpoint: 'Plaza', eventName: 'ZoneLoad', result: 'Success' },
    { sessionId: 'S-3001', timestamp: '2023-10-24T12:30:00Z', level: 'Level_02_City', checkpoint: 'Sewers', eventName: 'ZoneLoad', result: 'Success' },
  ];
};

export const generatePerformanceMetrics = (): PerformanceMetric[] => {
  return [
    // Normal tutorial performance
    { sessionId: 'S-1001', timestamp: '2023-10-24T10:06:00Z', avgFps: 59.5, frameTimeMs: 16.8, hitchCount: 0, memoryMb: 2450, gpuTimeMs: 14.2, level: 'Tutorial' },
    
    // Boss Phase 2 VFX Drops
    { sessionId: 'S-2001', timestamp: '2023-10-24T11:01:00Z', avgFps: 60.1, frameTimeMs: 16.6, hitchCount: 0, memoryMb: 3100, gpuTimeMs: 15.1, level: 'Level_04_Boss' },
    { sessionId: 'S-2001', timestamp: '2023-10-24T11:02:15Z', avgFps: 22.4, frameTimeMs: 44.6, hitchCount: 5, memoryMb: 3250, gpuTimeMs: 38.4, level: 'Level_04_Boss' }, // Drop
    { sessionId: 'S-2001', timestamp: '2023-10-24T11:02:30Z', avgFps: 18.2, frameTimeMs: 54.9, hitchCount: 8, memoryMb: 3260, gpuTimeMs: 48.1, level: 'Level_04_Boss' }, // Drop
    
    // Normal level load
    { sessionId: 'S-3001', timestamp: '2023-10-24T12:05:00Z', avgFps: 60.0, frameTimeMs: 16.6, hitchCount: 1, memoryMb: 4100, gpuTimeMs: 15.5, level: 'Level_02_City' },
    // Memory leak building up
    { sessionId: 'S-3001', timestamp: '2023-10-24T12:35:00Z', avgFps: 58.0, frameTimeMs: 17.2, hitchCount: 0, memoryMb: 5800, gpuTimeMs: 16.0, level: 'Level_02_City' },
    { sessionId: 'S-3001', timestamp: '2023-10-24T12:45:00Z', avgFps: 55.0, frameTimeMs: 18.1, hitchCount: 2, memoryMb: 7900, gpuTimeMs: 17.5, level: 'Level_02_City' }, // Spike before crash
  ];
};

export const generateCrashReports = (): CrashReport[] => {
  return [
    {
      crashId: 'CR-901',
      sessionId: 'S-3001',
      buildVersion: '0.8.4_CL102934',
      mapName: 'Level_02_City',
      callstackSummary: 'OOM Error in UTexture2D::CreateResource - Out of Video Memory',
      logExcerpt: 'Warning: Texture streaming pool over budget by 2048 MB. Fatal error: [File:D:\\build\\++UE5\\Sync\\Engine\\Source\\Runtime\\Core\\Private\\GenericPlatform\\GenericPlatformMemory.cpp] [Line: 221] Ran out of memory allocating 16384 bytes with alignment 0',
      platform: 'PS5'
    },
    {
      crashId: 'CR-902',
      sessionId: 'S-3042',
      buildVersion: '0.8.4_CL102934',
      mapName: 'Level_03_Forest',
      callstackSummary: 'OOM Error in UTexture2D::CreateResource',
      logExcerpt: 'Warning: Texture streaming pool over budget by 2100 MB. Fatal error...',
      platform: 'PS5'
    }
  ];
};

export const generateQAFeedback = (): QAFeedback[] => {
  return [
    {
      feedbackId: 'QA-01',
      sessionId: 'S-1005',
      testerId: 'Tester_Alice',
      severityManual: 'High',
      freeText: 'I got stuck in the tutorial. It says to equip the sword, but when I open the inventory, the UI overlaps and I cannot click the equip button. I eventually gave up and force quit.',
      reproductionHint: 'Play tutorial until weapon room. Open inventory quickly while sprinting.',
      level: 'Tutorial'
    },
    {
      feedbackId: 'QA-02',
      sessionId: 'S-1006',
      testerId: 'Tester_Bob',
      severityManual: 'Medium',
      freeText: 'Tutorial inventory UI is really confusing. Took me 3 minutes to figure out how to equip the item. Needs better highlighting.',
      reproductionHint: 'N/A',
      level: 'Tutorial'
    },
    {
      feedbackId: 'QA-03',
      sessionId: 'S-2010',
      testerId: 'Tester_Charlie',
      severityManual: 'High',
      freeText: 'During the Phase 2 transition of the boss fight, the game basically freezes for a few seconds. The new particle effects are tanking the framerate.',
      reproductionHint: 'Reach 50% health on Boss 4. Watch the transition animation.',
      level: 'Level_04_Boss'
    }
  ];
};

// Pre-aggregated mock issues for the UI
export const mockIssues: Issue[] = [
  {
    id: 'ISSUE-001',
    title: 'Severe Frame Drops during Boss Phase 2 Transition',
    category: 'Performance',
    severity: 'Critical',
    priorityScore: 92,
    affectedSessions: 145,
    representativeLevel: 'Level_04_Boss',
    aiSummary: 'Massive GPU frame time spikes (up to 54ms) and hitches observed during the Phase 2 transition of the Level 4 Boss. QA feedback strongly correlates this with the new particle system VFX introduced in the latest build.',
    firstSeen: '2023-10-23T14:00:00Z',
    lastSeen: '2023-10-24T11:02:15Z',
    sourceTypes: ['Performance', 'QA Feedback'],
    relatedQA: [generateQAFeedback()[2]],
    relatedPerformance: [generatePerformanceMetrics()[2], generatePerformanceMetrics()[3]],
    relatedCrashes: [],
    relatedEvents: [generatePlayEvents()[8]],
    analysis: {
      whyItMatters: 'Frame drops during a critical combat phase ruin player experience and increase perceived difficulty unfairly. This is a highly visible performance regression.',
      hypotheses: [
        { id: 'H1', text: 'Overdraw from overlapping translucent particles in the "Hellfire" VFX component is bottlenecking the GPU.', confidence: 0.85 },
        { id: 'H2', text: 'Niagara system spawning too many particles per second during the transition sequence.', confidence: 0.65 }
      ],
      recommendedOwner: 'TA',
      nextActions: [
        { id: 'A1', type: 'Immediate Fix', description: 'Profile the Boss Phase 2 VFX in PIE and reduce max particle count or material complexity.' },
        { id: 'A2', type: 'Investigate', description: 'Check if LODs are properly configured for the new boss arena assets.' }
      ]
    }
  },
  {
    id: 'ISSUE-002',
    title: 'Tutorial UI Progression Blocker (Inventory Equip)',
    category: 'Progression',
    severity: 'High',
    priorityScore: 85,
    affectedSessions: 312,
    representativeLevel: 'Tutorial',
    aiSummary: 'A significant cluster of players (approx. 22%) are abandoning the game during the tutorial at the "WeaponEquip" checkpoint. QA confirms the inventory UI can become unclickable due to overlapping z-orders.',
    firstSeen: '2023-10-22T09:00:00Z',
    lastSeen: '2023-10-24T10:20:45Z',
    sourceTypes: ['Telemetry', 'QA Feedback'],
    relatedQA: [generateQAFeedback()[0], generateQAFeedback()[1]],
    relatedPerformance: [],
    relatedCrashes: [],
    relatedEvents: [generatePlayEvents()[2], generatePlayEvents()[6]],
    analysis: {
      whyItMatters: 'Early game churn is critical. If players cannot pass the tutorial due to a UI bug, they will refund or abandon the game immediately.',
      hypotheses: [
        { id: 'H1', text: 'Z-order issue on the inventory canvas where an invisible blocker panel is intercepting click events.', confidence: 0.90 },
        { id: 'H2', text: 'Onboarding highlight mask is rendering over the interactable buttons.', confidence: 0.70 }
      ],
      recommendedOwner: 'Designer', // Or UI Engineer
      nextActions: [
        { id: 'A1', type: 'Immediate Fix', description: 'Audit the Z-order and hit test visibility of the Tutorial Inventory Widget.' },
        { id: 'A2', type: 'Monitor', description: 'Add specific telemetry for button clicks within the inventory screen to track funnel.' }
      ]
    }
  },
  {
    id: 'ISSUE-003',
    title: 'OOM Crash on PS5 during Extended Sessions in City Level',
    category: 'Crash',
    severity: 'Critical',
    priorityScore: 88,
    affectedSessions: 42,
    representativeLevel: 'Level_02_City',
    aiSummary: 'Multiple PS5 sessions ended in an Out of Memory (OOM) crash while exploring Level_02_City. Telemetry shows memory usage climbing linearly over time, peaking near 8GB before the crash. Indicates a memory leak in texture streaming.',
    firstSeen: '2023-10-24T01:00:00Z',
    lastSeen: '2023-10-24T12:45:00Z',
    sourceTypes: ['Crash', 'Performance'],
    relatedQA: [],
    relatedPerformance: [generatePerformanceMetrics()[5], generatePerformanceMetrics()[6]],
    relatedCrashes: generateCrashReports(),
    relatedEvents: [generatePlayEvents()[9], generatePlayEvents()[10]],
    analysis: {
      whyItMatters: 'Platform compliance failure (TRC/XR). Hard crashes heavily impact reviewer scores and player retention.',
      hypotheses: [
        { id: 'H1', text: 'Texture streaming pool is not releasing memory for unloaded sectors in the City level.', confidence: 0.88 },
        { id: 'H2', text: 'Virtual Texture memory leak introduced in the recent City art pass.', confidence: 0.60 }
      ],
      recommendedOwner: 'Engineer',
      nextActions: [
        { id: 'A1', type: 'Investigate', description: 'Capture a memory profile (MemReport) on PS5 dev kit after 30 mins in the City.' },
        { id: 'A2', type: 'Immediate Fix', description: 'Review recent commits to texture settings and streaming volume configurations in Level_02.' }
      ]
    }
  }
];

export const mockBuildSummary = {
  buildId: '0.8.4_CL102934',
  date: '2023-10-24',
  totalSessions: 1420,
  totalIssues: 124,
  highSeverityIssues: 12,
  riskChangePercent: 15.4, // e.g., 15.4% worse than last build
  topRisks: mockIssues,
  executiveSummary: 'Build 0.8.4 shows a regression in overall stability. While gameplay tuning was positively received, new art assets in Boss 4 and City level have introduced critical performance and memory bottlenecks. The tutorial UI issue remains the largest source of early player churn.',
  regressions: [
    'Boss 4 Phase 2 framerate dropped by 60% compared to 0.8.3.',
    'PS5 OOM crashes in City level increased significantly (0 cases in 0.8.3).',
  ],
  actionPlan: 'Prioritize fixing the Tutorial UI blocker to unblock wide playtests. Assign Tech Art to immediately profile Boss 4 VFX. Engineering needs to investigate the PS5 memory leak before the milestone candidate cut next week.'
};
