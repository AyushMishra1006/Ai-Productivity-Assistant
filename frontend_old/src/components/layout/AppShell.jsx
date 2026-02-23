import { useState } from 'react';
import MiddlePanel from './MiddlePanel';
import RightPanel from './RightPanel';
import BottomTicker from './BottomTicker';
import { Sparkles } from 'lucide-react';

export default function AppShell() {
  return (
    <div className="flex flex-col h-full bg-brand-bg">
      {/* Modern Dark Header with Gradient */}
      <div className="flex items-center justify-between h-16 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent px-6 border-b border-brand-border shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
            <Sparkles size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white">AI Productivity</h1>
        </div>
        <p className="text-white/80 text-sm">✨ Mistral AI Powered</p>
      </div>

      {/* Main content area - 2 columns with gap and padding */}
      <div className="flex flex-1 overflow-hidden gap-3 p-4 bg-brand-bg">
        {/* Left Panel (Todo area) - 40% */}
        <div className="w-2/5 bg-brand-darker rounded-2xl overflow-auto shadow-card border border-brand-border/50">
          <MiddlePanel />
        </div>

        {/* Right Panel (Chat) - 60% */}
        <div className="w-3/5 bg-brand-darker rounded-2xl overflow-auto shadow-card border border-brand-border/50 flex flex-col">
          <RightPanel />
        </div>
      </div>

      {/* Bottom Ticker - Vibrant Gradient */}
      <div className="h-12 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-warning border-t border-brand-border overflow-hidden shadow-card">
        <BottomTicker />
      </div>
    </div>
  );
}
