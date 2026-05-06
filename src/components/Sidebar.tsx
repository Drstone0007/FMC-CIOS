import React from 'react';
import { cn } from '../lib/utils';
import { AGENTS } from '../lib/gemini';
import NeuralOrb from './NeuralOrb';

interface SidebarProps {
  activeAgents: Record<string, 'idle' | 'running' | 'done' | 'error'>;
  isOrchestrating: boolean;
  onCaseSelect: (sym: string) => void;
  selectedCaseId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeAgents, isOrchestrating, onCaseSelect, selectedCaseId }) => {
  return (
    <aside className="w-[240px] shrink-0 flex flex-col overflow-y-auto border-r border-gold/20 bg-[#020508]/72 backdrop-blur-[22px] z-10">
      <div className="p-3 border-b border-gold/5">
        <div className="flex flex-col items-center py-2">
          <div className="relative inline-block">
            <div className={cn(
              "w-[66px] h-[66px] rounded-full cursor-pointer relative bg-[radial-gradient(circle_at_38%_32%,#FFD060,#FF6B00_47%,rgba(0,200,180,0.18))] shadow-[0_0_32px_rgba(255,185,40,0.52),0_0_64px_rgba(255,185,40,0.1)] transition-transform duration-300 hover:scale-110",
              isOrchestrating && "animate-pulse"
            )}>
              <div className="absolute inset-[-9px] rounded-full border border-gold/15 animate-[spin_6s_linear_infinite]" />
              <div className="absolute inset-[-17px] rounded-full border border-dashed border-cyan/10 animate-[spin_12s_linear_infinite_reverse]" />
            </div>
            <div className="text-center font-mono text-[8.5px] tracking-[0.22em] text-gold/40 uppercase mt-4">
              FMC CORE · {isOrchestrating ? 'ANALYZING' : 'STANDBY'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border-b border-gold/5">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-3">System Vitals</div>
        <VitalRow label="NEURAL" value={87} className="bg-linear-to-r from-gold to-cyan" />
        <VitalRow label="TRIAGE" value={94} className="bg-linear-to-r from-cyan to-blue" />
        <VitalRow label="SWARM" value={isOrchestrating ? 82 : 0} className="bg-linear-to-r from-purple to-blue" />
      </div>

      <div className="p-3 border-b border-gold/5">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-3">Swarm Agents</div>
        <div className="space-y-2">
          {AGENTS.map(agent => (
            <AgentItem 
              key={agent.id} 
              agent={agent} 
              status={activeAgents[agent.id] || 'idle'} 
            />
          ))}
        </div>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-3">Case Queue</div>
        <div className="space-y-1.5">
          <CaseItem 
            id="#C-0047" 
            name="Adewale Okafor, M 34" 
            symptoms="fever · headache · neck stiffness" 
            risk="HIGH" 
            active={selectedCaseId === '#C-0047'}
            onClick={() => onCaseSelect('Patient: fever 39.5C, severe headache, neck stiffness, photophobia x12h. Kernig sign positive.')}
          />
          <CaseItem 
            id="#C-0046" 
            name="Ngozi Adesuwa, F 52" 
            symptoms="chest · dizziness · fatigue" 
            risk="MED" 
            active={selectedCaseId === '#C-0046'}
            onClick={() => onCaseSelect('Patient: chest tightness, mild dizziness on exertion, fatigue x3 days. No syncope or palpitations.')}
          />
          <CaseItem 
            id="#C-0045" 
            name="Emeka Taiwo, M 9" 
            symptoms="cough · rhinorrhea · low fever" 
            risk="LOW" 
            active={selectedCaseId === '#C-0045'}
            onClick={() => onCaseSelect('Pediatric: mild cough, rhinorrhea, fever 37.8C. Eating well, no respiratory distress.')}
          />
        </div>
      </div>
    </aside>
  );
};

const VitalRow = ({ label, value, className }: { label: string; value: number; className: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <div className="font-mono text-[8.5px] text-white/30 w-[50px]">{label}</div>
    <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
      <div 
        className={cn("h-full rounded-full transition-all duration-1000", className)} 
        style={{ width: `${value}%` }} 
      />
    </div>
    <div className="font-mono text-[8.5px] text-gold/50 w-[27px] text-right">{value || '—'}%</div>
  </div>
);

const AgentItem = ({ agent, status }: { agent: typeof AGENTS[0]; status: string; key?: any }) => (
  <div className={cn(
    "flex items-center gap-2.5 p-2 rounded-lg border border-white/5 bg-white/5 transition-all duration-250 relative overflow-hidden",
    status === 'running' && "border-gold/30 bg-gold/5 animate-pulse",
    status === 'done' && "border-green/20 bg-green/5"
  )}>
    <div className={cn("w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center text-xs shadow-md", 
      agent.color === 'gold' ? 'bg-radial-to-br from-[#FFD060] to-[#FF8C00]' : 
      agent.color === 'cyan' ? 'bg-radial-to-br from-[#80FFF0] to-[#00B090]' : 
      agent.color === 'purple' ? 'bg-radial-to-br from-[#D080FF] to-[#7030C0]' : 
      agent.color === 'blue' ? 'bg-radial-to-br from-[#80B0FF] to-[#2050C0]' : 
      agent.color === 'red' ? 'bg-radial-to-br from-[#FF8090] to-[#C02030]' : 
      'bg-radial-to-br from-[#80FFB0] to-[#00A050]'
    )}>
      {agent.icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[10.5px] font-semibold text-white/75 truncate">{agent.name}</div>
      <div className="font-mono text-[8px] text-white/25">{agent.role}</div>
    </div>
    {status === 'running' && (
      <div className="w-3.5 h-3.5 rounded-full border-1.5 border-gold/15 border-t-gold animate-spin" />
    )}
  </div>
);

const CaseItem = ({ id, name, symptoms, risk, active, onClick }: { id: string; name: string; symptoms: string; risk: string; active?: boolean; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "p-2.5 rounded-lg border border-white/5 bg-white/5 cursor-pointer transition-all duration-200 hover:bg-gold/5 hover:border-gold/15",
      active && "bg-gold/5 border-gold/25"
    )}
  >
    <div className="flex items-center gap-1.5 mb-0.5">
      <span className="font-mono text-[8.5px] text-white/20">{id}</span>
      <span className={cn(
        "px-1.5 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider",
        risk === 'HIGH' ? "bg-red/10 text-red border border-red/20" :
        risk === 'MED' ? "bg-gold/10 text-gold border border-gold/20" :
        "bg-cyan/10 text-cyan border border-cyan/20"
      )}>{risk}</span>
    </div>
    <div className="text-[10.5px] text-white/65 font-medium truncate">{name}</div>
    <div className="font-mono text-[8.5px] text-white/20 truncate">{symptoms}</div>
  </div>
);

export default Sidebar;
