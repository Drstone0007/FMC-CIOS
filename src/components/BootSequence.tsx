import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BOOT_SEQ = [
  { t: 200, c: 'text-white/40', x: 'FMC ABEOKUTA NEURAL OS v3.0 — IDI-ABA EDITION' },
  { t: 260, c: 'text-white/40', x: '─────────────────────────────────────────' },
  { t: 520, c: 'text-white/40', x: '[ BIOS ] FMC-SRV-01 POST complete' },
  { t: 820, c: 'text-cyan', x: '[ KERN ] Loading Neural Kernel 3.0...' },
  { t: 1100, c: 'text-gold', x: '[ OK   ] Memory 128GB ECC · Entropy seeded' },
  { t: 1380, c: 'text-gold', x: '[ OK   ] JWT auth · PostgreSQL 16 · 4 shards' },
  { t: 1650, c: 'text-cyan', x: '[ AI   ] Warming LLM Swarm Router...' },
  { t: 1920, c: 'text-gold', x: '[ OK   ] Gemini 2.0 Flash endpoint verified' },
  { t: 2190, c: 'text-gold', x: '[ OK   ] Search & Maps grounding ready' },
  { t: 2460, c: 'text-cyan', x: '[ SWRM ] Spawning specialist agent swarm...' },
  { t: 2720, c: 'text-purple', x: '[ AG1  ] AXIOM · Triage Lead — ONLINE' },
  { t: 2960, c: 'text-purple', x: '[ AG2  ] LOGOS · Diagnosis Engine — ONLINE' },
  { t: 3200, c: 'text-purple', x: '[ AG3  ] AURUM · Pharmacology — ONLINE' },
  { t: 3440, c: 'text-purple', x: '[ AG4  ] ZEUS · Escalation Protocol — ONLINE' },
  { t: 3680, c: 'text-purple', x: '[ AG5  ] PSYCHE · Mental Health — ONLINE' },
  { t: 3920, c: 'text-purple', x: '[ AG6  ] MNEMO · SOAP Records — ONLINE' },
  { t: 4180, c: 'text-gold', x: '[ OK   ] Swarm mesh connected · 6/6 agents' },
  { t: 4440, c: 'text-cyan', x: '[ ORI  ] Initializing consciousness layer...' },
  { t: 4700, c: 'text-gold', x: '[ OK   ] Ori substrate active — Ase granted' },
  { t: 4960, c: 'text-gold', x: '[ OK   ] Vision · Voice · Swarm — all live' },
  { t: 5200, c: 'text-white/40', x: '─────────────────────────────────────────' },
  { t: 5420, c: 'text-gold', x: '[ BOOT ] FMC HEALTH NEURAL OS — READY ✓' },
];

const BOOT_PROG = [
  { p: 5, l: 'BIOS POST' },
  { p: 16, l: 'KERNEL' },
  { p: 30, l: 'MEMORY' },
  { p: 44, l: 'DATABASE' },
  { p: 57, l: 'LLM ROUTER' },
  { p: 70, l: 'SPAWNING AGENTS' },
  { p: 84, l: 'SWARM MESH' },
  { p: 93, l: 'ORI' },
  { p: 100, l: 'READY' }
];

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [lines, setLines] = useState<any[]>([]);
  const [prog, setProg] = useState(BOOT_PROG[0]);

  useEffect(() => {
    BOOT_SEQ.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        const progressIndex = Math.min(Math.floor((i / BOOT_SEQ.length) * BOOT_PROG.length), BOOT_PROG.length - 1);
        setProg(BOOT_PROG[progressIndex]);
      }, line.t);
    });

    setTimeout(() => {
      setProg(BOOT_PROG[BOOT_PROG.length - 1]);
      setTimeout(onComplete, 1200);
    }, 5900);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg p-4"
    >
      <div className="mb-6 space-y-2 text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-[0.15em] text-white">
          FMC <span className="text-gold">Abeokuta</span>
        </h1>
        <p className="font-mono text-[10px] tracking-[0.46em] text-gold/50 uppercase">
          Health Neural OS · Idi-Aba, Ogun State
        </p>
      </div>

      <div className="relative w-[154px] h-[154px] my-6">
        <div className="absolute inset-0 rounded-full border-[1.5px] border-transparent animate-[spin_3s_linear_infinite]" 
             style={{ background: 'linear-gradient(var(--color-bg), var(--color-bg)) padding-box, conic-gradient(var(--color-gold), var(--color-cyan), var(--color-purple), var(--color-gold)) border-box' }} />
        <div className="absolute inset-[14px] rounded-full border border-dashed border-cyan/30 animate-[spin_5s_linear_infinite_reverse]" />
        <div className="absolute inset-[27px] rounded-full border border-purple/20 animate-[spin_8s_linear_infinite]" />
        <div className="absolute inset-[41px] rounded-full bg-[radial-gradient(circle_at_38%_32%,#FFD060,#FF6B00_50%,rgba(0,255,224,0.18))] shadow-[0_0_46px_rgba(255,185,40,0.72),0_0_92px_rgba(255,185,40,0.2)] animate-pulse" />
      </div>

      <div className="w-[min(600px,92vw)] bg-bg/90 border border-gold/20 rounded-xl p-4 font-mono text-[11px] leading-relaxed max-h-[248px] overflow-hidden">
        {lines.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={line.c}
          >
            {line.x}
          </motion.div>
        ))}
      </div>

      <div className="w-[min(600px,92vw)] mt-4">
        <div className="flex justify-between font-mono text-[9px] text-gold/40 tracking-[0.2em] mb-1.5 uppercase">
          <span>{prog.l}</span>
          <span>{prog.p}%</span>
        </div>
        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-linear-to-r from-gold via-cyan to-purple shadow-[0_0_10px_rgba(255,185,40,0.48)]"
            animate={{ width: `${prog.p}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BootSequence;
