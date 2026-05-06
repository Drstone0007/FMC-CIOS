import { useState, useCallback } from 'react';
import { ai, AGENTS, AgentResponse } from '../lib/gemini';

export function useSwarm() {
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [activeAgents, setActiveAgents] = useState<Record<string, 'idle' | 'running' | 'done' | 'error'>>({});

  const runSwarm = useCallback(async (input: string, onAgentResult: (res: AgentResponse) => void) => {
    if (!ai) return;
    
    setIsOrchestrating(true);
    const initialStatus = AGENTS.reduce((acc, a) => ({ ...acc, [a.id]: 'idle' }), {});
    setActiveAgents(initialStatus);

    // 1. Triage First (AXIOM)
    setActiveAgents(prev => ({ ...prev, triage: 'running' }));
    
    try {
      const triagePrompt = AGENTS[0].system + "\n\nUser Input: " + input;
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: triagePrompt }] }]
      });
      const triageText = result.text || "";
      
      onAgentResult({
        agentId: 'triage',
        name: AGENTS[0].name,
        role: AGENTS[0].role,
        content: triageText
      });
      setActiveAgents(prev => ({ ...prev, triage: 'done' }));

      // 2. Run others in parallel with context
      const context = "Triage findings: " + triageText.substring(0, 300);
      
      const otherAgents = AGENTS.slice(1);
      
      await Promise.all(otherAgents.map(async (agent) => {
        setActiveAgents(prev => ({ ...prev, [agent.id]: 'running' }));
        try {
          const prompt = agent.system + "\n\nContext:\n" + context + "\n\nOriginal Symptoms: " + input;
          const agentResult = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          });
          const text = agentResult.text || "";
          
          onAgentResult({
            agentId: agent.id,
            name: agent.name,
            role: agent.role,
            content: text
          });
          setActiveAgents(prev => ({ ...prev, [agent.id]: 'done' }));
        } catch (err) {
          console.error(`Error in agent ${agent.name}:`, err);
          setActiveAgents(prev => ({ ...prev, [agent.id]: 'error' }));
        }
      }));

    } catch (err) {
      console.error("Swarm orchestration failure:", err);
      setActiveAgents(prev => ({ ...prev, triage: 'error' }));
    } finally {
      setIsOrchestrating(false);
    }
  }, []);

  return { runSwarm, isOrchestrating, activeAgents };
}
