'use client';

import { useState, useEffect, useRef } from 'react';
import localforage from 'localforage';
import { log_i, log_e } from '@/lib/logger';
import { Save, AlertCircle } from 'lucide-react';

interface WritingAreaProps {
  taskId: string; // unique ID for the task to save in DB
  initialContent?: string;
  onSave?: (content: string) => Promise<void>; // Server save callback
}

export default function WritingArea({ taskId, initialContent = '', onSave }: WritingAreaProps) {
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from IndexedDB if available (offline support)
  useEffect(() => {
    localforage.getItem<string>(`writing_backup_${taskId}`).then((savedContent) => {
      if (savedContent && !initialContent) {
        setContent(savedContent);
        log_i('writing_restored_from_idb', { taskId });
      }
    }).catch(log_e.bind(null, 'writing_idb_load_err'));
  }, [taskId, initialContent]);

  // Accurate word counting
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0 && /[a-zA-Z0-9]/.test(w));
    setWordCount(words.length);
  }, [content]);

  // Handle changes and debounce save
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setSaveStatus('unsaved');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Auto-save logic
    debounceTimerRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        // 1. Save to IndexedDB (offline guarantee)
        await localforage.setItem(`writing_backup_${taskId}`, newContent);
        log_i('writing_idb_saved', { taskId });

        // 2. Try saving to Server if provided
        if (onSave) {
          await onSave(newContent);
        }
        
        setSaveStatus('saved');
      } catch (err) {
        log_e('writing_save_err', err);
        setSaveStatus('error');
      }
    }, 2000); // 2 seconds debounce
  };

  return (
    <div className="flex flex-col h-full w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">So'zlar soni:</span>
          <span className={`font-mono px-2 py-1 rounded bg-white border font-bold ${
            wordCount < 150 ? 'text-amber-600 border-amber-200' : 'text-green-600 border-green-200'
          }`}>
            {wordCount}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          {saveStatus === 'saving' && <span className="text-gray-500 animate-pulse flex items-center gap-1"><Save className="w-4 h-4"/> Saqlanmoqda...</span>}
          {saveStatus === 'saved' && <span className="text-green-600 flex items-center gap-1"><Save className="w-4 h-4"/> Saqlandi</span>}
          {saveStatus === 'unsaved' && <span className="text-amber-500 flex items-center gap-1">Yozilmoqda...</span>}
          {saveStatus === 'error' && <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> Saqlashda xatolik! Xotirada turibdi</span>}
        </div>
      </div>

      {/* Strict Text Area */}
      <textarea
        className="flex-grow w-full p-6 resize-none focus:outline-none text-gray-800 text-lg leading-relaxed font-sans custom-scrollbar bg-transparent"
        value={content}
        onChange={handleChange}
        placeholder="Shu yerga yozing..."
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
      />
    </div>
  );
}
