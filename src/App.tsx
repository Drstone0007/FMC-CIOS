import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import RightPanel from './components/RightPanel';
import Background3D from './components/Background3D';
import BootSequence from './components/BootSequence';
import { useSwarm } from './hooks/useSwarm';
import { AgentResponse, AGENTS, ai } from './lib/gemini';
import { AnimatePresence, motion } from 'motion/react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  agent?: { name: string; icon: string; color: string; role: string };
  timestamp: Date;
}

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: "CIOS Swarm v3.0 Online. I coordinate 6 parallel specialist agents to analyze your clinical queries.",
    timestamp: new Date()
  }]);
  const [swarmMode, setSwarmMode] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [visionActive, setVisionActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const { runSwarm, isOrchestrating, activeAgents } = useSwarm();

  const handleSendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setSelectedCaseId('');

    if (swarmMode) {
      await runSwarm(content, (res: AgentResponse) => {
        const agent = AGENTS.find(a => a.id === res.agentId);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: res.content,
          agent: agent ? { 
            name: agent.name, 
            icon: agent.icon, 
            color: agent.color, 
            role: agent.role 
          } : undefined,
          timestamp: new Date()
        }]);
      });
    } else {
      // Single agent mode
      if (!ai) return;
      try {
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: 'user', parts: [{ text: "You are CIOS ORI. Be concise and clinical. Symptom description: " + content }] }]
        });
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: result.text || "",
          timestamp: new Date()
        }]);
      } catch (err) {
        console.error("Single response failed:", err);
      }
    }
  }, [swarmMode, runSwarm]);

  const handleCaseSelect = (sym: string) => {
    handleSendMessage(sym);
  };

  return (
    <div className="relative w-full h-screen bg-bg font-sans select-none overflow-hidden text-[#E8EAF0]">
      <Background3D />
      <div className="scanline" />
      <div className="scan-sweep" />

      <AnimatePresence>
        {!isBooted && (
          <BootSequence onComplete={() => setIsBooted(true)} />
        )}
      </AnimatePresence>

      {isBooted && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-screen flex flex-col"
        >
          <Header 
            voiceActive={voiceActive} 
            visionActive={visionActive} 
            swarmActive={swarmMode} 
          />
          
          <div className="flex flex-1 overflow-hidden">
            <Sidebar 
              activeAgents={activeAgents} 
              isOrchestrating={isOrchestrating}
              onCaseSelect={handleCaseSelect}
              selectedCaseId={selectedCaseId}
            />
            
            <ChatArea 
              messages={messages}
              onSendMessage={handleSendMessage}
              isOrchestrating={isOrchestrating}
              swarmMode={swarmMode}
              toggleSwarm={() => setSwarmMode(!swarmMode)}
              toggleMic={() => setVoiceActive(!voiceActive)}
              toggleVision={() => setVisionActive(!visionActive)}
            />
            
            <RightPanel 
              isAnalyzing={isOrchestrating} 
              swarmActive={isOrchestrating ? 1 : 0} 
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
