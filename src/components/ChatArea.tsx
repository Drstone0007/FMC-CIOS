import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Camera, LayoutGrid } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  agent?: { name: string; icon: string; color: string; role: string };
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isOrchestrating: boolean;
  swarmMode: boolean;
  toggleSwarm: () => void;
  toggleMic: () => void;
  toggleVision: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, isOrchestrating, swarmMode, toggleSwarm, toggleMic, toggleVision }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isOrchestrating) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 z-10">
      <div className="px-[18px] py-2 bg-black/20 border-b border-gold/5 flex gap-1.5 overflow-x-auto shrink-0 min-h-[34px] items-center">
        <div className={cn(
          "flex items-center gap-[5px] px-[9px] py-[3px] rounded-full font-mono text-[8px] tracking-[0.07em] whitespace-nowrap bg-white/5 border border-white/10 text-white/30",
          swarmMode && "bg-purple/10 border-purple/20 text-purple"
        )}>
          <div className={cn("w-1 h-1 rounded-full", swarmMode ? "bg-purple animate-pulse" : "bg-white/20")} />
          {swarmMode ? 'SWARM MODE ACTIVE' : 'SINGLE AGENT'}
        </div>
        {isOrchestrating && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[8px] bg-gold/10 border border-gold/20 text-gold animate-pulse">
            <div className="w-1 h-1 rounded-full bg-gold" />
            ORCHESTRATING PARALLEL AGENTS
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
        </AnimatePresence>
        {isOrchestrating && (
          <div className="flex gap-1 px-4 py-3">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gold/50"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.16 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-[#020508]/84 backdrop-blur-[22px] border-t border-gold/20 shrink-0">
        <div className="flex gap-2 items-center max-w-4xl mx-auto">
          <button 
            onClick={toggleVision}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gold/15 bg-gold/5 text-gold hover:bg-gold/10 transition-colors"
          >
            <Camera size={18} />
          </button>
          <button 
            onClick={toggleMic}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-cyan/20 bg-cyan/5 text-cyan hover:bg-cyan/10 transition-colors"
          >
            <Mic size={18} />
          </button>
          <button 
            onClick={toggleSwarm}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-lg border border-purple/20 bg-purple/5 text-purple hover:bg-purple/10 transition-colors",
              swarmMode && "border-purple shadow-[0_0_11px_rgba(176,96,255,0.26)] bg-purple/15"
            )}
          >
            <LayoutGrid size={18} />
          </button>
          <input 
            className="flex-1 bg-white/5 border border-gold/15 rounded-xl px-4 py-2.5 font-sans text-sm text-white/90 outline-hidden focus:border-gold/40 transition-colors"
            placeholder="Describe symptoms or clinical query..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isOrchestrating}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-linear-to-br from-gold to-[#FF6400] text-bg shadow-lg shadow-gold/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all font-bold"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </main>
  );
};

const MessageBubble = ({ message }: { message: Message; key?: any }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn("flex gap-3 max-w-[85%]", isUser && "ml-auto flex-row-reverse")}
    >
      <div className={cn(
        "w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs",
        isUser ? "bg-cyan/10 border border-cyan/20 text-cyan font-mono" : "bg-radial-to-br from-gold to-[#FF6400] text-bg shadow-[0_0_15px_rgba(255,185,40,0.36)]"
      )}>
        {isUser ? 'U' : (message.agent?.icon || '⚕')}
      </div>
      <div className={cn("space-y-1", isUser && "text-right")}>
        <div className={cn(
          "px-4 py-3 rounded-2xl text-[13px] leading-relaxed relative overflow-hidden backdrop-blur-md",
          isUser 
            ? "bg-cyan/5 border border-cyan/15 rounded-tr-none text-white/90" 
            : "bg-white/5 border border-gold/20 rounded-tl-none text-white/90"
        )}>
          {message.agent && (
             <div className="font-mono text-[8px] text-white/40 mb-1 tracking-wider">
               {message.agent.name} · {message.agent.role}
             </div>
          )}
          <div className="whitespace-pre-wrap">{message.content}</div>
          <div className="absolute top-0 -left-full w-1/3 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent animate-[sh_4.5s_ease_infinite]" />
        </div>
        <div className="font-mono text-[7.5px] text-white/15 px-1 uppercase tracking-wider">
          {message.agent?.name || (isUser ? 'USER' : 'ORI')} · {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatArea;
