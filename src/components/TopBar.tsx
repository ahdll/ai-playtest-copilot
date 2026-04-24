import { Bell, Search, User } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-8">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Current Build</span>
          <select className="bg-transparent text-sm font-semibold text-white focus:outline-none">
            <option value="0.8.4">0.8.4_CL102934 (Latest)</option>
            <option value="0.8.3">0.8.3_CL101500</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search issues, logs..."
            className="h-9 w-64 rounded-md border border-neutral-800 bg-neutral-900 pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        
        <button className="relative text-neutral-400 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">3</span>
        </button>
        
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
          <User className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
