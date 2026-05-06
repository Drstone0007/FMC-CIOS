import React from 'react';
import { cn } from '../lib/utils';

const Header: React.FC<{ voiceActive: boolean; visionActive: boolean; swarmActive: boolean }> = ({ voiceActive, visionActive, swarmActive }) => {
  return (
    <header className="h-[49px] flex items-center px-[18px] gap-3 shrink-0 bg-linear-to-r from-[#020508]/97 to-[#040A12]/93 border-b border-gold/20 z-10">
      <div className="flex flex-col">
        <div className="font-serif text-[19px] font-light text-white tracking-[0.1em]">
          FMC <span className="text-gold font-light">Abeokuta</span>
        </div>
        <div className="font-mono text-[8px] text-gold/30 tracking-[0.3em] uppercase">
          Health Neural OS · Idi-Aba, Ogun State
        </div>
      </div>

      <div className="ml-auto flex items-center gap-[10px]">
        <StatusChip label="ORI" active={true} />
        <StatusChip label="VOICE" active={voiceActive} color="gold" />
        <StatusChip label="VISION" active={visionActive} color="cyan" />
        <StatusChip label="SWARM" active={swarmActive} color="purple" />
      </div>

      <div className="flex gap-[5px] ml-[13px]">
        <div className="w-[7px] h-[7px] rounded-full bg-[#FF4560] shadow-[0_0_5px_#FF4560]" />
        <div className="w-[7px] h-[7px] rounded-full bg-[#FFB928] shadow-[0_0_5px_#FFB928]" />
        <div className="w-[7px] h-[7px] rounded-full bg-[#00FFE0] shadow-[0_0_5px_#00FFE0]" />
      </div>
    </header>
  );
};

const StatusChip: React.FC<{ label: string; active: boolean; color?: string }> = ({ label, active, color }) => {
  const dotColor = active 
    ? (color === 'gold' ? 'bg-gold shadow-[0_0_7px_#FFB928]' 
      : color === 'cyan' ? 'bg-cyan shadow-[0_0_7px_#00FFE0]' 
      : color === 'purple' ? 'bg-purple shadow-[0_0_7px_#B060FF]' 
      : 'bg-cyan shadow-[0_0_7px_#00FFE0]')
    : 'bg-[#222] shadow-none';

  return (
    <div className="flex items-center gap-[5px] font-mono text-[8px] tracking-[0.12em] text-white/30 uppercase">
      <div className={cn("w-[5px] h-[5px] rounded-full transition-all duration-300", dotColor)} />
      {label}
    </div>
  );
};

export default Header;
