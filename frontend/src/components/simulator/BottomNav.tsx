'use client';

import { useEffect, useState } from 'react';
import { useAns } from '@/store/useAns';
import { useNav } from '@/store/useNav';

interface BottomNavProps {
  totalQuestions?: number;
  questionIds: string[]; // e.g. ["q1", "q2", ..., "q40"]
}

export default function BottomNav({ totalQuestions = 40, questionIds }: BottomNavProps) {
  const { ans } = useAns();
  const { active_q, set_nav } = useNav();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-center">
        <div className="flex gap-1 overflow-hidden px-4">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex items-center px-4 overflow-x-auto">
      <div className="flex gap-2 mx-auto min-w-max">
        {questionIds.map((qid, index) => {
          const hasAnswer = ans[qid] && ans[qid].trim().length > 0;
          const isActive = active_q === qid;
          
          return (
            <button
              key={qid}
              onClick={() => {
                // Determine section ID based on your data structure, for now just sending null
                set_nav('section-id', qid);
                // Also scroll to the element with id=`q-${qid}`
                document.getElementById(`q-${qid}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className={`
                w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-all
                ${isActive ? 'ring-2 ring-primary ring-offset-1 scale-110' : ''}
                ${hasAnswer ? 'bg-primary text-white border border-primary' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
