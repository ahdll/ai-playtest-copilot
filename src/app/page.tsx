'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockBuildSummary } from '@/lib/mockData';
import { Users, AlertTriangle, TrendingDown, Bug as BugIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Link from 'next/link';

export default function Dashboard() {
  const { totalSessions, totalIssues, highSeverityIssues, riskChangePercent, topRisks, executiveSummary } = mockBuildSummary;

  // Mock data for the chart
  const categoryData = [
    { name: 'Performance', count: 45, color: '#6366f1' }, // indigo-500
    { name: 'Crash', count: 12, color: '#ef4444' }, // red-500
    { name: 'Progression', count: 28, color: '#f59e0b' }, // amber-500
    { name: 'UI/UX', count: 31, color: '#8b5cf6' }, // violet-500
    { name: 'Gameplay', count: 8, color: '#10b981' }, // emerald-500
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">Analysis updated 10 mins ago</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Total Play Sessions</CardTitle>
            <Users className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalSessions.toLocaleString()}</div>
            <p className="text-xs text-neutral-500">+12% from previous build</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Unique Issues Detected</CardTitle>
            <BugIcon className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalIssues}</div>
            <p className="text-xs text-neutral-500">24 new in this build</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">High/Critical Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{highSeverityIssues}</div>
            <p className="text-xs text-neutral-500">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Risk vs Previous Build</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-2xl font-bold text-orange-500">
              +{riskChangePercent}%
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <p className="text-xs text-neutral-500">Stability degraded</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Top Priority Issues */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Top Priority Issues</CardTitle>
            <CardDescription>Highest scored issues across all categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRisks.map((issue) => (
                <div key={issue.id} className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900/30 p-4 transition-colors hover:bg-neutral-800/50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <Link href={`/issues/${issue.id}`} className="font-medium text-indigo-400 hover:underline">
                        {issue.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Badge variant="outline" className="text-xs font-normal">{issue.category}</Badge>
                        <Badge variant={issue.severity === 'Critical' ? 'destructive' : 'secondary'} className="text-[10px]">
                          {issue.severity}
                        </Badge>
                        <span>•</span>
                        <span>{issue.affectedSessions} affected sessions</span>
                        <span>•</span>
                        <span>Level: {issue.representativeLevel}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-white">{issue.priorityScore}</span>
                      <span className="text-[10px] text-neutral-500">Priority Score</span>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-sm text-neutral-400">{issue.aiSummary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts & Summary */}
        <div className="flex flex-col gap-6 md:col-span-3">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Issue Distribution</CardTitle>
              <CardDescription>By category in current build</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                      itemStyle={{ color: '#ededed' }}
                      cursor={{ fill: '#262626' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1 bg-indigo-950/20 border-indigo-900/50">
            <CardHeader>
              <CardTitle className="text-indigo-300">Copilot Build Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-indigo-100/80">
                {executiveSummary}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
