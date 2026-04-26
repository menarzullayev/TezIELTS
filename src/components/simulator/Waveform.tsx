'use client';

import { useEffect, useRef } from 'react';

interface WaveformProps {
  analyzerNode: AnalyserNode | null;
  isActive: boolean;
  color?: string;
}

export default function Waveform({ analyzerNode, isActive, color = '#2563eb' }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive || !analyzerNode || !canvasRef.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyzerNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyzerNode.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgba(255, 255, 255, 0)';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyzerNode, isActive, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-16 rounded-lg bg-gray-50 border border-gray-100"
      width={400}
      height={100}
    />
  );
}
