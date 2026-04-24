import { mockBuildSummary } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BuildReport() {
  const { buildId, date, executiveSummary, regressions, actionPlan, topRisks } = mockBuildSummary;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Build Summary Report</h1>
          <p className="text-sm text-neutral-400 mt-1">Build: <span className="font-medium text-indigo-400">{buildId}</span> • Analyzed: {date}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Copy className="h-4 w-4" />
            Copy Text
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-indigo-900/50 bg-indigo-950/10">
          <CardHeader>
            <CardTitle className="text-indigo-400 flex items-center gap-2">
              <FileText className="h-5 w-5" /> Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-100/90 leading-relaxed text-sm md:text-base">
              {executiveSummary}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" /> Regressions vs Previous Build
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {regressions.map((reg, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span className="text-neutral-300 text-sm">{reg}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Risks (Needs Action)</CardTitle>
            <CardDescription>Highest priority clustered issues preventing milestone progression.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRisks.map((risk, i) => (
                <div key={risk.id} className="p-4 rounded-md bg-neutral-900/50 border border-neutral-800 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-white">{i + 1}. {risk.title}</h4>
                    <span className="text-xs font-mono px-2 py-1 bg-neutral-800 rounded text-neutral-400">Score: {risk.priorityScore}</span>
                  </div>
                  <p className="text-sm text-neutral-400 line-clamp-2">{risk.aiSummary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-900/50 bg-emerald-950/10">
          <CardHeader>
            <CardTitle className="text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Recommended Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-100/90 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {actionPlan}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
