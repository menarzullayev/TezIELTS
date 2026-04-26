'use client';

import { ReactNode, useEffect, useState } from 'react';
import TimerDisplay from '@/components/simulator/TimerDisplay';
import BottomNav from '@/components/simulator/BottomNav';
import { useNav } from '@/store/useNav';

interface SimulatorLayoutProps {
  children: ReactNode;
}

export default function SimulatorLayout({ children }: SimulatorLayoutProps) {
  const [mounted, setMounted] = useState(false);

  // Mock question IDs for BottomNav - in real use, this comes from the test data
  const mockQIds = Array.from({ length: 40 }, (_, i) => `q${i + 1}`);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black tracking-tighter text-slate-900">
            Tez<span className="text-primary">IELTS</span>
          </span>
          <div className="h-6 w-px bg-gray-200"></div>
          <h1 className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            Mock Test Simulator
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <TimerDisplay />
          <button className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
            Yakunlash
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden">{children}</main>

      {/* Bottom Navigation */}
      <BottomNav questionIds={mockQIds} />
    </div>
  );
}
