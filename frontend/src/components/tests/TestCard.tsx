'use client';

import Link from 'next/link';
import { Clock, BarChart, Users, PlayCircle, CheckCircle2 } from 'lucide-react';

interface TestCardProps {
  id: string;
  title: string;
  type: 'Academic' | 'General';
  duration: string;
  participants: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPremium?: boolean;
  progress?: number; // 0-100
}

export default function TestCard({
  id,
  title,
  type,
  duration,
  participants,
  difficulty,
  isPremium = false,
  progress = 0,
}: TestCardProps) {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-orange-200 transition-all flex flex-col h-full relative overflow-hidden">
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
          Premium
        </div>
      )}

      {/* Header */}
      <div className="mb-4 pr-16">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          {type}
        </span>
        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">
          {title}
        </h3>
      </div>

      {/* Data Density Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          {duration}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users className="w-4 h-4 text-slate-400" />
          {participants.toLocaleString()} ta
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <BarChart className="w-4 h-4 text-slate-400" />
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColors[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>
      </div>

      {/* Progress & CTA */}
      <div className="mt-auto">
        {progress > 0 && progress < 100 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Jarayonda</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {progress === 100 && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-bold mb-4">
            <CheckCircle2 className="w-5 h-5" />
            Bajarilgan
          </div>
        )}

        <Link
          href={`/tests/${id}`}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            progress === 100
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-slate-900 text-white hover:bg-orange-600 shadow-md'
          }`}
        >
          {progress > 0 && progress < 100
            ? 'Davom ettirish'
            : progress === 100
              ? "Natijani ko'rish"
              : 'Testni boshlash'}
          {progress < 100 && <PlayCircle className="w-4 h-4" />}
        </Link>
      </div>
    </div>
  );
}
