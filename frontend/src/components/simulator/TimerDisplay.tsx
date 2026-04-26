'use client';

import { useEffect, useState } from 'react';
import { useTmr } from '@/store/useTmr';
import { Clock } from 'lucide-react';

export default function TimerDisplay() {
  const { end_t, is_running, stop_t } = useTmr();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!is_running || !end_t) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end_t - now) / 1000));
      
      setTimeLeft(diff);

      if (diff <= 0) {
        clearInterval(interval);
        stop_t();
        // TODO: Trigger global submit action here
      }
    }, 1000);

    // Initial calculation
    setTimeLeft(Math.max(0, Math.floor((end_t - Date.now()) / 1000)));

    return () => clearInterval(interval);
  }, [end_t, is_running, stop_t]);

  if (!mounted) {
    return <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>; // Skeleton for hydration
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isWarning = timeLeft > 0 && timeLeft < 300; // less than 5 minutes

  return (
    <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-lg border ${
      isWarning ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-gray-50 text-gray-800 border-gray-200'
    }`}>
      <Clock className="w-5 h-5" />
      <span>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
