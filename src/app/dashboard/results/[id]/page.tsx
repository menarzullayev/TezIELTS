'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Trophy, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic2, 
  Lock, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface ScoreData {
  listening: number | null;
  reading: number | null;
  writing: number | null;
  speaking: number | null;
  overall: number | null;
}

export default function ResultsPage() {
  const { id } = useParams();
  const [status, setStatus] = useState<'PROCESSING' | 'DONE' | 'ERROR'>('PROCESSING');
  const [scores, setScores] = useState<ScoreData | null>(null);
  const [isVip, setIsVip] = useState(false); // Mock VIP status

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/evl/status/${id}`);
        const data = await res.json();
        
        if (data.status === 'DONE') {
          setScores(data.scores);
          setStatus('DONE');
          return true; // stop polling
        }
        return false; // continue polling
      } catch (err) {
        console.error("Status check failed", err);
        return false;
      }
    };

    const interval = setInterval(async () => {
      const finished = await pollStatus();
      if (finished) clearInterval(interval);
    }, 5000);

    pollStatus(); // Initial check

    return () => clearInterval(interval);
  }, [id]);

  if (status === 'PROCESSING') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <Trophy className="absolute inset-0 m-auto w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Baholamoqda...</h1>
        <p className="text-slate-500 max-w-md">
          Sizning Writing va Speaking javoblaringiz AI examiner tomonidan IELTS mezonlari asosida tahlil qilinmoqda. Bu taxminan 30-60 soniya vaqt olishi mumkin.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Tabriklaymiz! 🎉</h1>
            <p className="text-slate-400 text-lg">Mock Test yakunlandi. Natijalaringiz tayyor.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center min-w-[200px]">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Overall Band</span>
            <div className="text-6xl font-black text-white mt-1">{scores?.overall || '7.5'}</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <ModuleScore icon={<Headphones className="w-5 h-5"/>} label="Listening" score={scores?.listening || 8.5} color="bg-blue-500" />
          <ModuleScore icon={<BookOpen className="w-5 h-5"/>} label="Reading" score={scores?.reading || 7.5} color="bg-green-500" />
          <ModuleScore icon={<PenTool className="w-5 h-5"/>} label="Writing" score={scores?.writing || 7.0} color="bg-orange-500" />
          <ModuleScore icon={<Mic2 className="w-5 h-5"/>} label="Speaking" score={scores?.speaking || 7.5} color="bg-purple-500" />
        </div>

        {/* Detailed Feedback Gating */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <TrendingUp className="text-primary" /> AI Writing Tahlili
                </h2>
                {!isVip && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> VIP
                  </span>
                )}
              </div>

              <div className="space-y-6">
                <div className={`transition-all duration-500 ${!isVip ? 'blur-md select-none pointer-events-none' : ''}`}>
                   <p className="text-slate-600 leading-relaxed">
                     Sizning inshoingizda "Lexical Resource" bo'yicha juda yaxshi natija ko'rsatilgan. Biroq, "Grammatical Range and Accuracy" qismida bir nechta murakkab gap qurilmalarida xatoliklar kuzatildi...
                   </p>
                </div>

                {!isVip && (
                  <div className="text-center py-10 px-6 bg-slate-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Tahlilni to'liq ko'rish uchun VIP bo'ling</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm">
                      AI tomonidan har bir xatoingizni tahlil qilingan batafsil hisobotni va Band 9.0 namunaviy javobni oling.
                    </p>
                    <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                      VIP Rejaga o'tish — $9.99
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
             <div className="bg-slate-900 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Statistika</h3>
                <div className="space-y-4">
                  <StatItem label="To'g'ri javoblar (L)" value="34/40" />
                  <StatItem label="To'g'ri javoblar (R)" value="31/40" />
                  <StatItem label="Vaqt sarfi" value="2:45:12" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleScore({ icon, label, score, color }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`${color} text-white p-3 rounded-xl shadow-lg shadow-${color}/20`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
        <div className="text-2xl font-black text-slate-900">{score}</div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/10">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
