'use client';

import { ReactNode } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { GripVertical } from 'lucide-react';

interface SplitScreenProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  leftMinSize?: number;
  rightMinSize?: number;
}

export default function SplitScreen({ 
  leftContent, 
  rightContent, 
  leftMinSize = 30, 
  rightMinSize = 30 
}: SplitScreenProps) {
  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      <PanelGroup direction="horizontal" autoSaveId="ielts_sim_split">
        {/* Left Panel - Text / Passage / Graphics */}
        <Panel 
          defaultSize={50} 
          minSize={leftMinSize} 
          className="h-full relative overflow-hidden bg-[#fafafa]"
        >
          <div className="absolute inset-0 overflow-y-auto px-8 py-6 custom-scrollbar">
            {leftContent}
          </div>
        </Panel>

        {/* Resizer Handle */}
        <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-primary/50 active:bg-primary transition-colors flex items-center justify-center cursor-col-resize group z-10">
          <div className="h-8 w-1 bg-gray-400 rounded-full group-hover:bg-white transition-colors flex items-center justify-center">
            <GripVertical className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 absolute" />
          </div>
        </PanelResizeHandle>

        {/* Right Panel - Questions */}
        <Panel 
          defaultSize={50} 
          minSize={rightMinSize}
          className="h-full relative overflow-hidden bg-white"
        >
          <div className="absolute inset-0 overflow-y-auto px-8 py-6 custom-scrollbar pb-24">
            {rightContent}
          </div>
        </Panel>
      </PanelGroup>
      
      {/* Global styles for custom scrollbar within SplitScreen */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}} />
    </div>
  );
}
