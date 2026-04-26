'use client';

import { useState, useRef, useCallback } from 'react';
import localforage from 'localforage';
import { log_i, log_e, log_w } from '@/lib/logger';

interface UseAudioRecorderProps {
  partId: string;
}

export function useAudioRecorder({ partId }: UseAudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Expose analyzer node for waveform visualization
  const analyzerRef = useRef<AnalyserNode | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up analyzer for waveform
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      analyzerRef.current = analyzer;

      // Try Opus first, fallback to standard types
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/mp4',
        'audio/webm',
        'audio/ogg',
      ];
      let selectedMimeType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          break;
        }
      }

      if (!selectedMimeType) {
        throw new Error(
          "Sizning brauzeringiz ovoz yozish formatlarini qo'llab-quvvatlamaydi."
        );
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: selectedMimeType,
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        log_i('audio_recording_stopped', {
          partId,
          size: audioBlob.size,
          type: selectedMimeType,
        });

        // Save to IndexedDB as backup
        try {
          await localforage.setItem(`speaking_backup_${partId}`, audioBlob);
        } catch (err) {
          log_w('idb_audio_save_failed', err);
        }
      };

      // Request data every 1 second (chunking)
      mediaRecorder.start(1000);
      setIsRecording(true);
      setError(null);
      log_i('audio_recording_started', { partId });
    } catch (err: any) {
      log_e('mic_permission_err', err);
      setError(
        err.name === 'NotAllowedError'
          ? 'Mikrofonga ruxsat berilmadi. Iltimos, brauzer sozlamalaridan ruxsat bering.'
          : err.message || "Ovoz yozish qurilmasini faollashtirib bo'lmadi."
      );
    }
  }, [partId]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      // Stop all tracks to release microphone
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  }, []);

  return {
    isRecording,
    isPaused,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    analyzerNode: analyzerRef.current,
  };
}
