'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Bug, Settings, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/explorer', label: 'Issue Explorer', icon: FileText },
    { href: '/report', label: 'Build Report', icon: PieChart },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-900/50">
      <div className="flex h-16 items-center border-b border-neutral-800 px-6">
        <div className="flex items-center gap-2 font-bold text-indigo-400">
          <Bug className="h-6 w-6" />
          <span>AI Playtest Copilot</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          // Highlight active state: exactly matches href, or if we are inside a specific issue details page, highlight 'Issue Explorer'
          const isActive = pathname === link.href || (link.href === '/explorer' && pathname?.startsWith('/issues/'));
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
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
