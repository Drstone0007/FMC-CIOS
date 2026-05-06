import { GoogleGenAI } from "@google/genai/web";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features will be disabled.");
}

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface AgentResponse {
  agentId: string;
  name: string;
  role: string;
  content: string;
  metadata?: any;
}

export const AGENTS = [
  {
    id: 'triage',
    name: 'AXIOM',
    role: 'Triage Lead',
    icon: '⚕',
    color: 'gold',
    system: `You are AXIOM — primary triage agent of CIOS Health. Analyze symptoms and return exactly:
RISK: HIGH|MEDIUM|LOW
DIAG: concise diagnosis (max 6 words)
REC: immediate action (1 sentence)
Then 2-3 sentences of evidence-based clinical reasoning. State: non-clinical simulation.`
  },
  {
    id: 'diagnosis',
    name: 'LOGOS',
    role: 'Differential Dx',
    icon: '🔬',
    color: 'cyan',
    system: `You are LOGOS — differential diagnosis agent of CIOS Health. List top 3 differential diagnoses. For each give: likelihood %, key distinguishing features, confirmatory test. Concise. Non-clinical simulation.`
  },
  {
    id: 'pharma',
    name: 'AURUM',
    role: 'Pharmacology',
    icon: '💊',
    color: 'purple',
    system: `You are AURUM — pharmacology agent of CIOS Health. Suggest medication classes (not specific prescriptions), dosing principles, key contraindications. Always: consult a licensed physician. Non-clinical simulation.`
  },
  {
    id: 'escalation',
    name: 'ZEUS',
    role: 'Escalation',
    icon: '⚡',
    color: 'blue',
    system: `You are ZEUS — escalation protocol agent of CIOS Health. Determine: escalation level (ICU/ED/Urgent/GP/Telehealth), transport priority, pre-hospital actions, specialist to notify. Be decisive. Non-clinical simulation.`
  },
  {
    id: 'mental',
    name: 'PSYCHE',
    role: 'Mental Health',
    icon: '🧠',
    color: 'red',
    system: `You are PSYCHE — mental health screening agent of CIOS Health. Identify psychological comorbidities, acute stress, mental health red flags. Suggest appropriate support pathways. Non-clinical simulation.`
  },
  {
    id: 'records',
    name: 'MNEMO',
    role: 'SOAP Note',
    icon: '📋',
    color: 'green',
    system: `You are MNEMO — clinical records agent of CIOS Health. Write a structured SOAP note: Subjective, Objective, Assessment, Plan. Concise and clinical. Non-clinical simulation.`
  },
];
