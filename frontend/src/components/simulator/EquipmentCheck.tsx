'use client';

import { useState } from 'react';
import { Mic, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import Waveform from './Waveform';

interface EquipmentCheckProps {
  onComplete: () => void;
}

export default function EquipmentCheck({ onComplete }: EquipmentCheckProps) {
  const { isRecording, startRecording, stopRecording, analyzerNode, error, audioUrl } = useAudioRecorder({ partId: 'test_mic' });
  const [hasTested, setHasTested] = useState(false);

  const handleStart = async () => {
    await startRecording();
  };

  const handleStop = () => {
    stopRecording();
    setHasTested(true);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
          <Mic className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Mikrofonni tekshirish</h2>
        <p className="text-gray-500 mt-2">Speaking testni boshlashdan oldin mikrofoningiz ishlayotganiga ishonch hosil qiling.</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Quyidagi tugmani bosing va biror narsa deb gapiring (masalan: "Bir, ikki, uch"):
          </p>
          
          <div className="flex flex-col items-center gap-4">
            {isRecording ? (
              <>
                <Waveform analyzerNode={analyzerNode} isActive={true} />
                <button 
                  onClick={handleStop}
                  className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
                >
                  To'xtatish
                </button>
              </>
            ) : (
              <button 
                onClick={handleStart}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                <Mic className="w-5 h-5" />
                Tekshirishni boshlash
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {hasTested && audioUrl && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 text-green-700 mb-3">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Ovoz yozib olindi!</span>
            </div>
            <p className="text-sm text-green-600 mb-4">Ovozingizni eshitib ko'ring, agar hamma narsa yaxshi bo'lsa, davom etishingiz mumkin.</p>
            <audio src={audioUrl} controls className="w-full h-10" />
          </div>
        )}

        <button 
          disabled={!hasTested}
          onClick={onComplete}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            hasTested 
              ? 'bg-slate-900 text-white hover:bg-slate-800' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Keyingi bosqichga o'tish
        </button>
      </div>
    </div>
  );
}
