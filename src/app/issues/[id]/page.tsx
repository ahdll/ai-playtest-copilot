import { mockIssues } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BrainCircuit, Activity, MessageSquare, AlertTriangle, FileText, Target } from 'lucide-react';
import Link from 'next/link';

export default async function IssueDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const issue = mockIssues.find(i => i.id === resolvedParams.id);
  
  if (!issue) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/explorer"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">{issue.title}</h1>
            <Badge variant={issue.severity === 'Critical' ? 'destructive' : 'secondary'}>{issue.severity}</Badge>
            <Badge variant="outline">{issue.category}</Badge>
          </div>
          <p className="text-sm text-neutral-400">Issue ID: {issue.id} • Detected: {new Date(issue.firstSeen).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-white">{issue.priorityScore}</span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Priority Score</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content Column */}
        <div className="space-y-6 md:col-span-2">
          
          {/* AI Analysis Section */}
          <Card className="border-indigo-900/50 bg-indigo-950/20">
            <CardHeader className="pb-3 border-b border-indigo-900/30">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-400" />
                <CardTitle className="text-indigo-300">AI Copilot Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-indigo-200 mb-1">Executive Summary</h4>
                <p className="text-sm text-indigo-100/80 leading-relaxed">{issue.aiSummary}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-indigo-200 mb-1">Why This Matters</h4>
                <p className="text-sm text-indigo-100/80 leading-relaxed">{issue.analysis.whyItMatters}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-indigo-200 mb-2">Generated Hypotheses</h4>
                <div className="space-y-2">
                  {issue.analysis.hypotheses.map(hyp => (
                    <div key={hyp.id} className="flex items-start gap-3 rounded-md bg-indigo-950/40 p-3 border border-indigo-900/30">
                      <div className="flex flex-col items-center justify-center bg-indigo-900 text-indigo-200 rounded text-xs font-bold px-2 py-1 min-w-[3rem]">
                        {Math.round(hyp.confidence * 100)}%
                      </div>
                      <p className="text-sm text-indigo-100">{hyp.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Section */}
          <Card>
            <CardHeader>
              <CardTitle>Supporting Evidence</CardTitle>
              <CardDescription>Raw logs, telemetry, and feedback clustered into this issue.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                {issue.relatedQA.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-white border-b border-neutral-800 pb-2">
                      <MessageSquare className="h-4 w-4 text-neutral-400" /> QA & Player Feedback ({issue.relatedQA.length})
                    </h4>
                    {issue.relatedQA.map(qa => (
                      <div key={qa.feedbackId} className="rounded-md bg-neutral-900 p-3 text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-neutral-300">{qa.testerId} <span className="text-neutral-500 font-normal">({qa.severityManual})</span></span>
                          <span className="text-xs text-neutral-500">Session: {qa.sessionId}</span>
                        </div>
                        <p className="text-neutral-400 italic">"{qa.freeText}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {issue.relatedPerformance.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-white border-b border-neutral-800 pb-2">
                      <Activity className="h-4 w-4 text-neutral-400" /> Performance Anomalies ({issue.relatedPerformance.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {issue.relatedPerformance.slice(0, 4).map((perf, i) => (
                        <div key={i} className="rounded-md border border-neutral-800 bg-neutral-900/50 p-3 text-sm">
                          <div className="flex justify-between text-xs text-neutral-500 mb-2">
                            <span>Session: {perf.sessionId}</span>
                            <span>{new Date(perf.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-xs text-neutral-500">Avg FPS</div>
                              <div className={`font-bold ${perf.avgFps < 30 ? 'text-red-400' : 'text-neutral-200'}`}>{perf.avgFps.toFixed(1)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-500">Hitches</div>
                              <div className={`font-bold ${perf.hitchCount > 0 ? 'text-orange-400' : 'text-neutral-200'}`}>{perf.hitchCount}</div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-500">Memory</div>
                              <div className={`font-bold ${perf.memoryMb > 6000 ? 'text-red-400' : 'text-neutral-200'}`}>{perf.memoryMb} MB</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {issue.relatedCrashes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-red-400 border-b border-neutral-800 pb-2">
                      <AlertTriangle className="h-4 w-4" /> Crash Reports ({issue.relatedCrashes.length})
                    </h4>
                    {issue.relatedCrashes.map(crash => (
                      <div key={crash.crashId} className="rounded-md border border-red-900/30 bg-red-950/10 p-3 text-sm font-mono text-neutral-300">
                        <div className="text-red-400 font-bold mb-1">{crash.callstackSummary}</div>
                        <div className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">{crash.logExcerpt}</div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Action Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Suggested Owner</h4>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-neutral-800 text-indigo-400 font-bold">
                    {issue.analysis.recommendedOwner}
                  </div>
                  <Button variant="outline" size="sm">Assign to Team</Button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Next Steps</h4>
                <div className="space-y-3">
                  {issue.analysis.nextActions.map(action => (
                    <div key={action.id} className="flex gap-3">
                      <div className="mt-0.5">
                        <Target className="h-4 w-4 text-neutral-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${action.type === 'Immediate Fix' ? 'text-red-400' : 'text-indigo-400'}`}>{action.type}</span>
                        <span className="text-sm text-neutral-300">{action.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
                <Button className="w-full">Create Jira Ticket</Button>
                <Button variant="secondary" className="w-full">Copy Share Link</Button>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Context Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-sm text-neutral-500">Representative Level</span>
                <span className="text-sm font-medium text-white">{issue.representativeLevel}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-sm text-neutral-500">Affected Sessions</span>
                <span className="text-sm font-medium text-white">{issue.affectedSessions}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-neutral-500">Source Signals</span>
                <div className="flex flex-wrap gap-1">
                  {issue.sourceTypes.map(st => (
                    <Badge key={st} variant="outline" className="text-[10px]">{st}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
