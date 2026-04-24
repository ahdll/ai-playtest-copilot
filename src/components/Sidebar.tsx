import Link from 'next/link';
import { LayoutDashboard, FileText, Bug, Settings, PieChart } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-900/50">
      <div className="flex h-16 items-center border-b border-neutral-800 px-6">
        <div className="flex items-center gap-2 font-bold text-indigo-400">
          <Bug className="h-6 w-6" />
          <span>AI Playtest Copilot</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <Link href="/" className="flex items-center gap-3 rounded-md bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-400">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link href="/explorer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white">
          <FileText className="h-5 w-5" />
          Issue Explorer
        </Link>
        <Link href="/report" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white">
          <PieChart className="h-5 w-5" />
          Build Report
        </Link>
      </nav>
      <div className="p-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white">
          <Settings className="h-5 w-5" />
          Settings
        </button>
      </div>
    </div>
  );
}
