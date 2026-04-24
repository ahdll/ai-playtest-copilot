import { mockIssues } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Filter, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function IssueExplorer() {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Issue Explorer</h1>
          <p className="text-sm text-neutral-400 mt-1">Browse, filter, and search through all AI-clustered issues.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort: Priority
          </Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="p-0 flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-neutral-900/95 backdrop-blur z-10">
              <TableRow>
                <TableHead className="w-[80px]">Score</TableHead>
                <TableHead className="w-[400px]">Issue Title & Summary</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Affected</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-bold text-white">
                    <div className="flex flex-col items-center justify-center h-10 w-10 rounded-full border border-neutral-700 bg-neutral-800">
                      {issue.priorityScore}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 pr-6">
                      <Link href={`/issues/${issue.id}`} className="font-semibold text-indigo-400 hover:underline">
                        {issue.title}
                      </Link>
                      <span className="text-xs text-neutral-400 line-clamp-2">{issue.aiSummary}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{issue.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={issue.severity === 'Critical' ? 'destructive' : 'secondary'}>
                      {issue.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {issue.affectedSessions} <span className="text-neutral-500 text-xs">sessions</span>
                  </TableCell>
                  <TableCell className="text-neutral-300 text-sm">
                    {issue.representativeLevel}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/issues/${issue.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {/* Duplicate issues to show scroll and more data */}
              {mockIssues.map((issue, i) => (
                <TableRow key={`${issue.id}-copy-${i}`}>
                  <TableCell className="font-bold text-white">
                    <div className="flex flex-col items-center justify-center h-10 w-10 rounded-full border border-neutral-700 bg-neutral-800 opacity-50">
                      {issue.priorityScore - Math.floor(Math.random() * 20) - 10}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 pr-6">
                      <span className="font-semibold text-neutral-300">
                        {issue.title} (Minor Variant)
                      </span>
                      <span className="text-xs text-neutral-500 line-clamp-1">{issue.aiSummary}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="opacity-70">{issue.category}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className="opacity-70">Medium</Badge></TableCell>
                  <TableCell className="text-neutral-500">{Math.floor(Math.random() * 50)} sessions</TableCell>
                  <TableCell className="text-neutral-500 text-sm">{issue.representativeLevel}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled>View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
