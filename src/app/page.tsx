"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { 
  ShieldAlert, 
  Zap, 
  Users, 
  BarChart3, 
  Map as MapIcon, 
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
  Cpu,
  Send,
  RotateCcw,
  MapPin,
  Check,
  Building,
  Award,
  MessageSquare,
  Activity,
  ArrowRightLeft,
  ChevronRight,
  TrendingUp,
  FileText
} from "lucide-react";

// Types for Simulator
interface MockVolunteer {
  name: string;
  role: string;
  match: string;
  avatarChar: string;
}

interface PresetScenario {
  text: string;
  score: number;
  category: string;
  tags: string[];
  volunteers: MockVolunteer[];
  coords: { x: number; y: number };
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    text: "Major landslide blockaded the mountain pass in Sector 4. Three houses buried under mud. Immediate rescue crew and excavation machinery required. At least 6 residents unaccounted for.",
    score: 9.6,
    category: "Search & Rescue",
    tags: ["Landslide", "Trapped", "Excavator", "High Urgency"],
    volunteers: [
      { name: "Aarav Mehta", role: "Search Specialist", match: "98% Match", avatarChar: "A" },
      { name: "Kabir Sen", role: "Heavy Machine Operator", match: "95% Match", avatarChar: "K" }
    ],
    coords: { x: 75, y: 35 }
  },
  {
    text: "Severe water supply contamination detected in North Ward camps. Over 150 families lacking safe drinking water. Child gastrointestinal issues rising.",
    score: 7.8,
    category: "Water & Sanitation",
    tags: ["Water Contamination", "Infants at Risk", "Sanitation Supply"],
    volunteers: [
      { name: "Diya Roy", role: "Public Health Engineer", match: "94% Match", avatarChar: "D" },
      { name: "Ananya Das", role: "Water Logistics Lead", match: "91% Match", avatarChar: "A" }
    ],
    coords: { x: 40, y: 70 }
  },
  {
    text: "Requesting 20 dry ration packs and basic hygiene kits for a temporary flood shelter in the community center. 35 people sheltered. All families currently safe and stable.",
    score: 4.5,
    category: "Food & Shelter",
    tags: ["Ration Supply", "Flood Shelter", "Stable Condition"],
    volunteers: [
      { name: "Rohan Bose", role: "Supply Chain Manager", match: "89% Match", avatarChar: "R" }
    ],
    coords: { x: 60, y: 55 }
  }
];

export default function LandingPage() {
  const [inputText, setInputText] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: Idle, 1: Reading, 2: Mapping, 3: Completed
  const [simResults, setSimResults] = useState<PresetScenario | null>(null);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"citizen" | "volunteer" | "ngo">("citizen");
  
  // Custom states for interactive elements
  const [activeStep, setActiveStep] = useState<number>(0);

  // Auto-scroll timeline to showcase dynamic layout
  useEffect(() => {
    if (isSimulating) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Run simulated AI engine with high-tech step logging
  const handleSimulate = (scenario: PresetScenario | string) => {
    setIsSimulating(true);
    setSimulationStep(1);
    setSimLogs(["[SYSTEM] Connection initialized..."]);
    
    let scenarioData: PresetScenario;
    
    if (typeof scenario === "string") {
      setInputText(scenario);
      const score = Math.min(9.9, Math.max(2.1, Number((2.5 + (scenario.length % 75) / 10).toFixed(1))));
      scenarioData = {
        text: scenario,
        score: score,
        category: score >= 7 ? "Emergency Operations" : score >= 4 ? "Medical & Support" : "Resource Supply",
        tags: score >= 7 ? ["Custom Urgent Alert", "Severe Crisis"] : ["General Inquiry", "Community Support"],
        volunteers: [
          { name: "Priya Sharma", role: "Emergency Coordinator", match: "92% Match", avatarChar: "P" },
          { name: "Dev Naskar", role: "Community Support Lead", match: "87% Match", avatarChar: "D" }
        ],
        coords: { x: 50, y: 50 }
      };
    } else {
      setInputText(scenario.text);
      scenarioData = scenario;
    }

    // Step-based dynamic terminal logging
    const logTimeline = [
      { text: "[NLP] Ingesting report text & extracting semantics...", delay: 250 },
      { text: `[AI-MODEL] Calculating urgency coefficients (Output: ${scenarioData.score}/10)...`, delay: 550 },
      { text: "[VECTOR-DB] Querying skill vectors against local responder registry...", delay: 850 },
      { text: "[DISPATCH] Resolving routing geometry to incident coordinates...", delay: 1150 },
      { text: `[SUCCESS] Matched ${scenarioData.volunteers.length} expert responders with >85% confidence.`, delay: 1450 }
    ];

    logTimeline.forEach((log) => {
      setTimeout(() => {
        setSimLogs((prev) => [...prev, log.text]);
      }, log.delay);
    });

    setTimeout(() => {
      setSimulationStep(2);
      setTimeout(() => {
        setSimulationStep(3);
        setSimResults(scenarioData);
        setIsSimulating(false);
      }, 900);
    }, 1600);
  };

  const handleResetSimulator = () => {
    setInputText("");
    setSimResults(null);
    setSimulationStep(0);
    setSimLogs([]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900/30">
      <BackgroundGlow />

      {/* Floating Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 text-left space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20 shadow-sm transition-all duration-300 hover:bg-blue-500/25 cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="tracking-wide uppercase font-black">NEXT-GEN AI DISASTER COORDINATION</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.05]">
              Coordinate Relief <br />
              With <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                AI Precision.
              </span>
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-xl">
              ReliefLink maps critical, unstructured community needs to qualified volunteers and local NGOs in seconds using semantic matching, dynamic routing, and automated urgency classification.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-95 transition-all duration-300 font-black group border-none">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2.5 transition-transform group-hover:translate-x-1.5" />
                </Button>
              </Link>
              <Link href="/community-needs" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 text-lg rounded-2xl font-black bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01]">
                  Report a Need
                </Button>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 border-t border-slate-200/60 dark:border-neutral-800/80 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Check className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Response Rate</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">&lt; 12-minute dispatch</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Semantic Matching</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">94.8% accuracy index</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right Content - Interactive AI Simulator */}
          <div className="lg:col-span-6 relative">
            {/* Glowing ambient ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-80 pointer-events-none" />

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-neutral-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-blue-500/20">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Simulator Header */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                    <Cpu className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                      Urgency Dispatch Engine
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] uppercase font-black tracking-wider border border-emerald-500/20">LIVE DEMO</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Semantic Urgency Scorer & Matching</p>
                  </div>
                </div>
                {simulationStep > 0 && (
                  <button 
                    onClick={handleResetSimulator}
                    className="p-2 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl transition-all"
                    title="Reset Simulator"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Simulation Screen */}
              <div className="space-y-4 relative z-10">
                {simulationStep === 0 ? (
                  // Step 0: Selection / Typing State
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                      Select a realistic disaster report below or input your custom description to watch the neural scoring models and volunteer dispatch pipelines run in real time:
                    </p>
                    
                    {/* Preset Scenarios Buttons */}
                    <div className="space-y-3">
                      {PRESET_SCENARIOS.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handleSimulate(preset)}
                          className="w-full text-left p-4.5 rounded-2xl bg-slate-50/50 dark:bg-neutral-800/30 border border-slate-200/50 dark:border-neutral-800/80 hover:border-blue-500/40 hover:bg-blue-500/[0.02] hover:scale-[1.01] transition-all duration-200 group flex items-start gap-3.5 cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            {index + 1}
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                              "{preset.text}"
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded uppercase">
                                {preset.category}
                              </span>
                              <span className="text-[9px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded uppercase">
                                Urgency {preset.score}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Custom text entry */}
                    <div className="relative mt-2">
                      <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Write a custom crisis scenario description (e.g. Tree collapsed on medical center driveway, blockading ambulance egress...)"
                          className="w-full h-24 p-4 text-xs font-semibold rounded-2xl bg-slate-100/50 dark:bg-neutral-800/20 border border-slate-200 dark:border-neutral-800 focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all resize-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                        />
                      <button
                        disabled={inputText.trim().length < 15}
                        onClick={() => handleSimulate(inputText)}
                        className="absolute right-3.5 bottom-3.5 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-30 disabled:hover:bg-blue-600 transition-all cursor-pointer"
                        title="Submit Custom Report"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : isSimulating ? (
                  // Step 1 & 2: Processing state with interactive terminal logs
                  <div className="py-6 flex flex-col space-y-4">
                    {/* Scanning indicator */}
                    <div className="flex flex-col items-center justify-center text-center py-6 relative">
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
                        </div>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mt-4">
                        Executing AI Pipeline
                      </h4>
                    </div>

                    {/* Dynamic console log outputs */}
                    <div className="bg-slate-950 text-slate-300 font-mono text-[10px] p-4.5 rounded-2xl border border-slate-800 max-h-[140px] overflow-y-auto space-y-1.5 shadow-inner leading-relaxed">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 text-slate-500">
                        <span>PIPELINE TELEMETRY</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      </div>
                      {simLogs.map((log, index) => (
                        <div key={index} className="animate-fade-in flex items-start gap-1">
                          <span className="text-emerald-500 select-none">&gt;</span>
                          <span className="break-all">{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Step 3: Finished / Display simulated details
                  <div className="space-y-5 animate-fade-in">
                    
                    {/* Simulated Need Text */}
                    <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-neutral-800/30 border border-slate-200/30 dark:border-neutral-800/50">
                      <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest block mb-1">ANALYZED DISASTER REPORT</span>
                      <p className="text-xs font-semibold italic text-slate-600 dark:text-slate-300 leading-relaxed">
                        "{simResults?.text}"
                      </p>
                    </div>

                    {/* Dashboard metrics preview */}
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4">
                      
                      {/* Urgency Meter */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/5 border border-rose-500/20 flex flex-col justify-between min-h-[120px]">
                        <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">Computed Urgency</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-4xl font-black text-rose-600 dark:text-rose-400">{simResults?.score}</span>
                          <span className="text-xs font-bold text-rose-500/60">/10</span>
                        </div>
                        <div className="h-1.5 w-full bg-rose-500/10 rounded-full mt-3 overflow-hidden p-[1px]">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-rose-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-1000" 
                            style={{ width: `${(simResults?.score || 0) * 10}%` }}
                          />
                        </div>
                      </div>

                      {/* AI Classification */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 flex flex-col justify-between min-h-[120px]">
                        <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">AI Classification</span>
                        <div className="text-base font-black text-slate-900 dark:text-white mt-2 leading-tight">
                          {simResults?.category}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {simResults?.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[8px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Dispatch Map Visual */}
                    <div className="rounded-2xl border border-slate-200/60 dark:border-neutral-800 overflow-hidden relative bg-slate-950 h-36">
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#808080_1px,transparent_1px)] bg-[size:16px_16px]" />
                      
                      {/* Grid representation */}
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Connecting Path */}
                        <path 
                          d={`M 20 80 Q 40 50 ${simResults?.coords?.x || 50} ${simResults?.coords?.y || 50}`}
                          fill="none" 
                          stroke="url(#gradient-path)" 
                          strokeWidth="1.5" 
                          strokeDasharray="4,4"
                          className="animate-[dash_10s_linear_infinite]"
                        />
                        {/* Volunteer base */}
                        <circle cx="20" cy="80" r="3.5" fill="#3b82f6" className="animate-pulse" />
                        
                        {/* Incident point */}
                        <circle cx={simResults?.coords?.x || 50} cy={simResults?.coords?.y || 50} r="4" fill="#ef4444" />
                        <circle cx={simResults?.coords?.x || 50} cy={simResults?.coords?.y || 50} r="10" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping" style={{ animationDuration: '2s' }} />

                        {/* Defs for gradient stroke */}
                        <defs>
                          <linearGradient id="gradient-path" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Map Badges */}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[8px] font-mono text-blue-400">
                        VOL_BASE (x:20, y:80)
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[8px] font-mono text-rose-400">
                        INCIDENT (x:{simResults?.coords?.x || 50}, y:{simResults?.coords?.y || 50})
                      </div>
                    </div>

                    {/* Matched Volunteers */}
                    <div className="space-y-2.5">
                      <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest block">AI SEMANTIC MATCH RESPONDERS</span>
                      <div className="space-y-2">
                        {simResults?.volunteers.map((vol, i) => (
                          <div 
                            key={i} 
                            className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800/40 border border-slate-200/50 dark:border-neutral-800/80 hover:border-blue-500/30 transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8.5 h-8.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs border border-blue-500/10">
                                {vol.avatarChar}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-xs text-slate-900 dark:text-white">{vol.name}</span>
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">{vol.role}</span>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {vol.match}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Grid Statistics Section */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm hover:scale-[1.02] hover:shadow-lg hover:border-blue-500/25 transition-all duration-300 group">
              <span className="text-4xl font-black text-slate-900 dark:text-white bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">94.8%</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">Semantic Accuracy</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">High-dimensional vector embedding mappings between report skills and responder catalogs.</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm hover:scale-[1.02] hover:shadow-lg hover:border-emerald-500/25 transition-all duration-300 group">
              <span className="text-4xl font-black text-slate-900 dark:text-white bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">&lt; 12m</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">Disaster Dispatch Latency</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Average pipeline traversal speed from citizen incident reporting to volunteer mobilization.</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm hover:scale-[1.02] hover:shadow-lg hover:border-indigo-500/25 transition-all duration-300 group">
              <span className="text-4xl font-black text-slate-900 dark:text-white bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">10,240+</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">Verified Responders</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Qualified specialists categorizing emergency, medical, water supply, and logistical operations.</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm hover:scale-[1.02] hover:shadow-lg hover:border-rose-500/25 transition-all duration-300 group">
              <span className="text-4xl font-black text-slate-900 dark:text-white bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">24/7</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">Live Coordination Mesh</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Autonomous micro-dispatch orchestration active continuously across regions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works pipeline - TIMELINE */}
      <section className="py-24 px-6 relative z-10 bg-slate-100/30 dark:bg-slate-900/30 border-y border-slate-200/40 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-wider uppercase border border-indigo-500/20">
              Pipeline Process
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
              How The ReliefLink <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Mesh Coordinates</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-base max-w-xl mx-auto">
              Behind our platform lies a real-time semantic processing pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
            {/* Visual connector line for timeline */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 hidden lg:block -translate-y-1/2 z-0" />

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">Report Logged</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                A localized citizen or organization logs a disaster situation using natural text.
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">Semantic Intake</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Our AI computes urgency indexes (1-10) and models skill classification tags.
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">Vector Match</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Qualified responders are query-matched via embedding indexes.
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-lg">
                4
              </div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">Deploy & Track</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                NGO dispatch links live tracking maps and sends automated alert broadcasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Switcher - INTERACTIVE TABS */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              Designed For Every <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-black">Role</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm max-w-lg mx-auto">
              ReliefLink builds dedicated modules specifically structured for citizens, volunteers, and rescue coordinating entities.
            </p>
          </div>

          {/* Interactive Role Switcher Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-200/60 dark:bg-neutral-800/80 rounded-2xl border border-slate-200/50 dark:border-neutral-800 shadow-md">
              <button
                onClick={() => setActiveTab("citizen")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "citizen" 
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                For Citizens
              </button>
              <button
                onClick={() => setActiveTab("volunteer")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "volunteer" 
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                For Volunteers
              </button>
              <button
                onClick={() => setActiveTab("ngo")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "ngo" 
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                For NGOs
              </button>
            </div>
          </div>

          {/* Tab content panel */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-neutral-800/80 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {activeTab === "citizen" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                <div className="lg:col-span-7 space-y-6">
                  <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded">FAST CRISIS REPORTING</span>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">Flag Community Crisis Situations Rapidly</h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    Citizens and residents can log incidents without navigating complex forms. Provide a brief text summary, upload geolocations, and submit. The platform translates your submission instantly into clean, prioritized dispatcher queues.
                  </p>
                  <ul className="space-y-2.5">
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4.5 h-4.5 text-blue-500" /> Natural language processing identifies required skills.
                    </li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4.5 h-4.5 text-blue-500" /> Automatic high-fidelity GPS pin tagging.
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/community-needs">
                      <Button size="md" className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white h-12 px-6">
                        Log an Incident
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-300 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-500 font-mono">
                    <span>MOCK REPORT SCREEN</span>
                    <span>ACTIVE</span>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">1. Situation Summary</label>
                    <div className="p-3 bg-slate-900 rounded-lg text-xs italic border border-slate-800 text-slate-300">
                      "Severe storm knocked down old oak tree, blockading local medical warehouse driveway. Supply vans cannot exit."
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">2. Geolocation Coordinate</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-lg text-xs font-mono text-emerald-400 border border-slate-800">
                      <MapPin className="w-3.5 h-3.5" /> Lat: 22.57, Lon: 88.36 (Accurate to 3m)
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="w-full py-2 bg-blue-600 rounded-lg text-xs text-center font-bold text-white font-mono opacity-80">
                      ANALYZING REPORT...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "volunteer" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                <div className="lg:col-span-7 space-y-6">
                  <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded">VECTOR MATCH REGISTRY</span>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">Mobilize Your Skills Where They Matter</h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    Volunteers register their professional skills, geographic location boundaries, and availabilities. When a crisis matches your expertise, the dispatcher engine alerts you with clear details. No spam, just real-time high-impact dispatches.
                  </p>
                  <ul className="space-y-2.5">
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500" /> Vector search maps your exact skills to needs.
                    </li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500" /> Direct SMS routing with path mapping.
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/signup">
                      <Button size="md" className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-6">
                        Join as a Volunteer
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-neutral-800 p-6 rounded-2xl text-slate-700 dark:text-slate-200 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-neutral-800 pb-2 text-xs text-slate-400 font-bold">
                    <span>VOLUNTEER MATCH CARD</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[9px] uppercase font-black">ACTIVE MATCH</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-sm text-slate-900 dark:text-white">Aarav Mehta</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Search & Rescue Specialist</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-neutral-800/40 rounded-xl border border-slate-200/30 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Target Match:</span>
                      <span className="font-black text-emerald-600">98% Confidence</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Target Job:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Landslide rescue</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ngo" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                <div className="lg:col-span-7 space-y-6">
                  <span className="text-[10px] font-black uppercase text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded">CENTRAL COORDINATION</span>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">Orchestrate Multiple Regional Dispatches</h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    NGO coordinators access unified administration boards to view incidents sorted by calculated urgency. Mobilize matched volunteers with one click, log completion details, and monitor regional progress via live priority heatmaps.
                  </p>
                  <ul className="space-y-2.5">
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4.5 h-4.5 text-purple-500" /> Prioritized ticket routing.
                    </li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4.5 h-4.5 text-purple-500" /> Export stats & telemetry records.
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/login">
                      <Button size="md" className="rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white h-12 px-6">
                        Access Dashboard
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 text-slate-300 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-500 font-mono">
                    <span>DISPATCH COMMAND BOARD</span>
                    <span className="text-purple-400 font-black">ADMIN VIEW</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-xs font-bold text-rose-500">12</div>
                      <div className="text-[8px] text-slate-400 font-mono uppercase mt-1">Pending</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-xs font-bold text-blue-400">8</div>
                      <div className="text-[8px] text-slate-400 font-mono uppercase mt-1">Dispatched</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-xs font-bold text-emerald-400">142</div>
                      <div className="text-[8px] text-slate-400 font-mono uppercase mt-1">Resolved</div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs px-2.5 py-2 bg-slate-950 rounded-lg border border-slate-850">
                      <span className="text-slate-400 font-mono">Emergency Alert Sector 4</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[8px] font-mono">URGENT 9.6</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-wider uppercase border border-blue-500/20">
              Platform Modules
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
              Powerful Coordination <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Capabilities</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-base max-w-xl mx-auto">
              Modern digital tools engineered for hyper-precise and efficient disaster response operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldAlert className="w-8 h-8 text-rose-500 animate-pulse" />}
              title="Urgency Scoring"
              description="Proprietary semantic AI models analyze incoming reports in real-time to compute mission-critical priority indexes."
              glowColor="group-hover:shadow-rose-500/10 group-hover:border-rose-500/30"
              iconBg="bg-rose-500/10 border border-rose-500/20"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-blue-500" />}
              title="Smart Matching"
              description="Cognitive semantic engines map skill sets to match local responders to the exact tasks requiring their expert skill sets."
              glowColor="group-hover:shadow-blue-500/10 group-hover:border-blue-500/30"
              iconBg="bg-blue-500/10 border border-blue-500/20"
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-indigo-500" />}
              title="Live Analytics"
              description="Monitor the state of entire relief operations instantly with detailed command dashboards and predictive logistics charts."
              glowColor="group-hover:shadow-indigo-500/10 group-hover:border-indigo-500/30"
              iconBg="bg-indigo-500/10 border border-indigo-500/20"
            />
            <FeatureCard 
              icon={<MapIcon className="w-8 h-8 text-emerald-500" />}
              title="Priority Heatmaps"
              description="Visualize localized priority coordinates instantly with maps that render regional urgency indexes dynamically."
              glowColor="group-hover:shadow-emerald-500/10 group-hover:border-emerald-500/30"
              iconBg="bg-emerald-500/10 border border-emerald-500/20"
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-amber-500" />}
              title="Rapid Reporting"
              description="Provide members of the public the capability to catalog community needs seamlessly with integrated geolocation protocols."
              glowColor="group-hover:shadow-amber-500/10 group-hover:border-amber-500/30"
              iconBg="bg-amber-500/10 border border-amber-500/20"
            />
            <FeatureCard 
              icon={<HeartHandshake className="w-8 h-8 text-purple-500" />}
              title="NGO Collaboration"
              description="Bridge coordinating bottlenecks by orchestrating direct tasks between NGOs, local responders, and affected zones."
              glowColor="group-hover:shadow-purple-500/10 group-hover:border-purple-500/30"
              iconBg="bg-purple-500/10 border border-purple-500/20"
            />
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-24 px-6 relative z-10 bg-slate-100/20 dark:bg-slate-900/10 border-t border-slate-200/40 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black tracking-wider uppercase border border-purple-500/20">
              Community Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
              Trusted by <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-black">First Responders & NGOs</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-base max-w-xl mx-auto">
              Read how ReliefLink has bridged coordination gaps during critical regional disasters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-neutral-800/80 rounded-3xl p-8 shadow-md flex flex-col justify-between group hover:border-blue-500/25 hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "During the heavy monsoon flooding last summer, coordinating our field volunteer squads manually was a logistics nightmare. ReliefLink matching volunteers directly based on geolocation reduced deployment time by 80%."
                </p>
              </div>
              <div className="flex items-center gap-3.5 pt-6 border-t border-slate-200/50 dark:border-neutral-850 mt-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Siddharth Sen</span>
                  <span className="text-[10px] text-slate-400 uppercase font-black mt-0.5">Director, Regional Rescue Foundation</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-neutral-800/80 rounded-3xl p-8 shadow-md flex flex-col justify-between group hover:border-indigo-500/25 hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "I was able to register as an operator for heavy excavators and get dispatched to a blocked highway sector within 30 minutes of the landslide report. The SMS alerts specify routing coordinates instantly."
                </p>
              </div>
              <div className="flex items-center gap-3.5 pt-6 border-t border-slate-200/50 dark:border-neutral-850 mt-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Amit Paul</span>
                  <span className="text-[10px] text-slate-400 uppercase font-black mt-0.5">Heavy Equipment Logistics Volunteer</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-neutral-800/80 rounded-3xl p-8 shadow-md flex flex-col justify-between group hover:border-purple-500/25 hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "Before, citizens reported details randomly on messaging groups. ReliefLink aggregates everything in one central console, scoring severity immediately so our agency handles highest priority tasks first."
                </p>
              </div>
              <div className="flex items-center gap-3.5 pt-6 border-t border-slate-200/50 dark:border-neutral-850 mt-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-sm">
                  R
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Dr. Rashmi Das</span>
                  <span className="text-[10px] text-slate-400 uppercase font-black mt-0.5">Medical Dispatch Coordinator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto rounded-[3.5rem] bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900 p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/10 group">
          
          <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Ready to make a <br className="hidden sm:inline" /> monumental difference?
            </h2>
            <p className="text-blue-100 text-base md:text-lg font-semibold leading-relaxed">
              Join thousands of community responders, dedicated volunteers, and leading NGOs working together to establish resilient regional relief.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 hover:scale-[1.02] h-16 px-10 text-lg rounded-2xl font-black shadow-xl transition-all border-none">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/10 hover:scale-[1.02] h-16 px-10 text-lg rounded-2xl font-black backdrop-blur-md transition-all">
                  Volunteer Login
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative background structures */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  glowColor: string;
  iconBg: string;
}

function FeatureCard({ icon, title, description, glowColor, iconBg }: FeatureCardProps) {
  return (
    <div className={`p-8 rounded-[2.5rem] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/40 dark:border-neutral-800/80 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col group relative ${glowColor}`}>
      
      {/* Light Reflection */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem]" />

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${iconBg}`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-black mb-3 text-neutral-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {title}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">
        {description}
      </p>
    </div>
  );
}
