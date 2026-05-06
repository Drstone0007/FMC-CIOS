import React, { useRef, useEffect } from 'react';
import NeuralOrb from './NeuralOrb';

interface RightPanelProps {
  isAnalyzing: boolean;
  swarmActive: number;
}

const RightPanel: React.FC<RightPanelProps> = ({ isAnalyzing, swarmActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visionActive, setVisionActive] = React.useState(false);

  // Note: Vision activity state would typically be passed from App, 
  // but we can locally handle the video stream here for simplicity if requested.

  return (
    <aside className="w-[252px] shrink-0 border-l border-gold/20 bg-[#020508]/72 backdrop-blur-[22px] flex flex-col overflow-y-auto hidden lg:flex z-10">
      <div className="p-3 border-b border-gold/5">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-2">Ori Neural Orb</div>
        <NeuralOrb isAnalyzing={isAnalyzing} swarmActive={swarmActive} />
      </div>

      <div className="p-3 border-b border-gold/5">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-3">Vision Channel</div>
        <div className="w-full aspect-video bg-black/40 rounded-lg border border-gold/10 overflow-hidden relative flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl opacity-20 mb-1">👁</div>
              <p className="font-mono text-[7.5px] text-white/20 tracking-widest uppercase">Vision Offline</p>
            </div>
            <div className="absolute inset-0 border border-gold/30 rounded-lg animate-pulse pointer-events-none opacity-30" />
        </div>
      </div>

      <div className="p-3 border-b border-gold/5">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-3">Architecture</div>
        <div className="space-y-1.5">
          <ArchNode icon="⬡" name="React Frontend" tech="GLASS · GOLD · v3" active />
          <ArchNode icon="⚡" name="Gemini Node" tech="FLASH 2.0" active />
          <ArchNode icon="🕸" name="Swarm Router" tech="6-AGENT MESH" active={isAnalyzing} />
          <ArchNode icon="🗄" name="Vector DB" tech="CONTEXT MESH" active />
        </div>
      </div>

      <div className="p-3 mt-auto">
        <p className="font-mono text-[7.5px] text-white/15 leading-relaxed">
          NON-CLINICAL SIMULATION.<br />DEMONSTRATION ONLY.
        </p>
      </div>
    </aside>
  );
};

const ArchNode = ({ icon, name, tech, active }: { icon: string; name: string; tech: string; active?: boolean }) => (
  <div className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 border border-gold/5 ${active ? 'bg-gold/5 border-gold/15' : 'bg-white/5 opacity-50'}`}>
    <span className="text-xs">{icon}</span>
    <div className="flex-1">
      <div className="text-[10px] text-white/70 font-medium truncate">{name}</div>
      <div className="font-mono text-[7.5px] text-gold/30 tracking-wider uppercase">{tech}</div>
    </div>
    <div className={`w-1 h-1 rounded-full ${active ? 'bg-cyan shadow-[0_0_5px_#00FFE0]' : 'bg-white/10'}`} />
  </div>
);

export default RightPanel;
