import { PlayEvent, PerformanceMetric, CrashReport, QAFeedback, Issue, IssueCategory, IssueSeverity, IssueHypothesis, NextAction } from './types';

// 1. Issue Detection
export const detectPerformanceIssues = (metrics: PerformanceMetric[]) => {
  return metrics.filter(m => m.avgFps < 30 || m.hitchCount > 2 || m.memoryMb > 7000);
};

export const detectProgressionIssues = (events: PlayEvent[]) => {
  return events.filter(e => e.eventName === 'SessionEnd' && e.result === 'Quit');
};

// 2. Clustering (Mock text similarity / rule-based)
export const clusterIssues = (
  perfAnomalies: PerformanceMetric[],
  crashes: CrashReport[],
  qa: QAFeedback[],
  progression: PlayEvent[]
) => {
  // In a real AI system, this would use embeddings (e.g., text-embedding-ada-002) 
  // to group similar logs, QA feedback, and crash callstacks.
  // Here we use simple rule-based clustering based on Level + Topic.
  
  const clusters = [];

  // Cluster 1: Boss VFX (Level_04_Boss + Performance)
  const bossPerf = perfAnomalies.filter(p => p.level === 'Level_04_Boss');
  const bossQA = qa.filter(q => q.level === 'Level_04_Boss' && q.freeText.toLowerCase().includes('framerate'));
  if (bossPerf.length > 0 || bossQA.length > 0) {
    clusters.push({
      id: 'cluster-boss-vfx',
      category: 'Performance' as IssueCategory,
      title: 'Severe Frame Drops during Boss Phase',
      level: 'Level_04_Boss',
      perf: bossPerf,
      crashes: [],
      qa: bossQA,
      prog: []
    });
  }

  // Cluster 2: Tutorial UI (Tutorial + Progression + QA)
  const tutorialProg = progression.filter(p => p.level === 'Tutorial' && p.checkpoint === 'WeaponEquip');
  const tutorialQA = qa.filter(q => q.level === 'Tutorial' && q.freeText.toLowerCase().includes('inventory'));
  if (tutorialProg.length > 0 || tutorialQA.length > 0) {
    clusters.push({
      id: 'cluster-tutorial-ui',
      category: 'Progression' as IssueCategory,
      title: 'Tutorial UI Progression Blocker',
      level: 'Tutorial',
      perf: [],
      crashes: [],
      qa: tutorialQA,
      prog: tutorialProg
    });
  }

  // Cluster 3: City Crash (Level_02_City + Crash)
  const cityCrashes = crashes.filter(c => c.mapName === 'Level_02_City' && c.callstackSummary.includes('OOM'));
  const cityPerf = perfAnomalies.filter(p => p.level === 'Level_02_City' && p.memoryMb > 7000);
  if (cityCrashes.length > 0) {
    clusters.push({
      id: 'cluster-city-oom',
      category: 'Crash' as IssueCategory,
      title: 'OOM Crash during Extended Sessions',
      level: 'Level_02_City',
      perf: cityPerf,
      crashes: cityCrashes,
      qa: [],
      prog: []
    });
  }

  return clusters;
};

// 3. Priority Scoring
export const calculatePriority = (cluster: any): number => {
  // Weights requested by user
  const W_FREQ = 0.30;
  const W_SEV = 0.25;
  const W_BLOCK = 0.20;
  const W_IMPACT = 0.15;
  const W_FEEDBACK = 0.10;

  // Mock scoring logic based on cluster content
  let freqScore = Math.min((cluster.perf.length + cluster.crashes.length + cluster.qa.length + cluster.prog.length) * 10, 100);
  let sevScore = cluster.category === 'Crash' ? 100 : (cluster.category === 'Progression' ? 80 : 60);
  let blockScore = cluster.category === 'Progression' ? 100 : (cluster.category === 'Crash' ? 90 : 20);
  let impactScore = (cluster.crashes.length > 0 || cluster.perf.length > 0) ? 90 : 30;
  let feedbackScore = cluster.qa.length > 0 ? 80 : 0;

  const finalScore = (freqScore * W_FREQ) + (sevScore * W_SEV) + (blockScore * W_BLOCK) + (impactScore * W_IMPACT) + (feedbackScore * W_FEEDBACK);
  
  return Math.round(finalScore);
};

// 4. Summarization
export const generateSummary = (cluster: any) => {
  // Mocking the LLM summarization output.
  // In reality: `const prompt = "Summarize these QA comments: " + cluster.qa.map(q => q.freeText).join(', '); return await callLLM(prompt);`
  
  if (cluster.id === 'cluster-boss-vfx') {
    return {
      aiSummary: 'Massive GPU frame time spikes and hitches observed during the Phase 2 transition of the Level 4 Boss. QA feedback strongly correlates this with the new particle system VFX.',
      whyItMatters: 'Frame drops during a critical combat phase ruin player experience.',
      hypotheses: [
        { id: 'H1', text: 'Overdraw from overlapping translucent particles in the "Hellfire" VFX component is bottlenecking the GPU.', confidence: 0.85 },
      ],
      recommendedOwner: 'TA' as const,
      nextActions: [
        { id: 'A1', type: 'Immediate Fix' as const, description: 'Profile the Boss Phase 2 VFX in PIE.' }
      ]
    };
  }
  
  if (cluster.id === 'cluster-tutorial-ui') {
    return {
      aiSummary: 'A significant cluster of players are abandoning the game during the tutorial at the WeaponEquip checkpoint due to UI overlap issues.',
      whyItMatters: 'Early game churn is critical. If players cannot pass the tutorial, they will refund.',
      hypotheses: [{ id: 'H1', text: 'Z-order issue on the inventory canvas where an invisible blocker panel is intercepting click events.', confidence: 0.90 }],
      recommendedOwner: 'Designer' as const,
      nextActions: [{ id: 'A1', type: 'Immediate Fix' as const, description: 'Audit the Z-order visibility.' }]
    };
  }

  return {
    aiSummary: 'Multiple sessions ended in an Out of Memory (OOM) crash. Telemetry shows memory usage climbing linearly over time, indicating a leak.',
    whyItMatters: 'Platform compliance failure (TRC/XR). Hard crashes heavily impact reviewer scores.',
    hypotheses: [{ id: 'H1', text: 'Texture streaming pool is not releasing memory for unloaded sectors.', confidence: 0.88 }],
    recommendedOwner: 'Engineer' as const,
    nextActions: [{ id: 'A1', type: 'Investigate' as const, description: 'Capture a memory profile.' }]
  };
};

export const runFullPipeline = (rawPerf: PerformanceMetric[], rawCrashes: CrashReport[], rawQa: QAFeedback[], rawProg: PlayEvent[]): Issue[] => {
  const anomalies = detectPerformanceIssues(rawPerf);
  const churns = detectProgressionIssues(rawProg);
  
  const clusters = clusterIssues(anomalies, rawCrashes, rawQa, churns);
  
  return clusters.map(c => {
    const score = calculatePriority(c);
    const summaryData = generateSummary(c);
    
    // Determine severity from score
    let severity: IssueSeverity = 'Low';
    if (score > 80) severity = 'Critical';
    else if (score > 60) severity = 'High';
    else if (score > 40) severity = 'Medium';
    
    return {
      id: c.id,
      title: c.title,
      category: c.category,
      severity,
      priorityScore: score,
      affectedSessions: Math.floor(Math.random() * 200) + 10, // Mock
      representativeLevel: c.level,
      aiSummary: summaryData.aiSummary,
      firstSeen: new Date(Date.now() - 86400000).toISOString(),
      lastSeen: new Date().toISOString(),
      sourceTypes: ['QA Feedback', 'Performance'], // Simplified
      relatedQA: c.qa,
      relatedPerformance: c.perf,
      relatedCrashes: c.crashes,
      relatedEvents: c.prog,
      analysis: {
        whyItMatters: summaryData.whyItMatters,
        hypotheses: summaryData.hypotheses,
        recommendedOwner: summaryData.recommendedOwner,
        nextActions: summaryData.nextActions
      }
    };
  });
};
