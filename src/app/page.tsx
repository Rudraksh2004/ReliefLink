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
  Play,
  RotateCcw
} from "lucide-react";

// Types for Simulator
interface MockVolunteer {
  name: string;
  role: string;
  match: string;
}

interface PresetScenario {
  text: string;
  score: number;
  category: string;
  tags: string[];
  volunteers: MockVolunteer[];
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    text: "Major landslide blockaded the mountain pass in Sector 4. Three houses buried under mud. Immediate rescue crew and excavation machinery required. At least 6 residents unaccounted for.",
    score: 9.6,
    category: "Search & Rescue",
    tags: ["Landslide", "Trapped", "Excavator", "High Urgency"],
    volunteers: [
      { name: "Aarav Mehta", role: "Search & Rescue Specialist", match: "98% Match" },
      { name: "Kabir Sen", role: "Heavy Equipment Operator", match: "95% Match" }
    ]
  },
  {
    text: "Severe water supply contamination detected in North Ward camps. Over 150 families lacking safe drinking water. Child gastrointestinal issues rising.",
    score: 7.8,
    category: "Water & Sanitation",
    tags: ["Water Contamination", "Infants at Risk", "Sanitation Supply"],
    volunteers: [
      { name: "Diya Roy", role: "Public Health Engineer", match: "94% Match" },
      { name: "Ananya Das", role: "Water Logistics Lead", match: "91% Match" }
    ]
  },
  {
    text: "Requesting 20 dry ration packs and basic hygiene kits for a temporary flood shelter in the community center. 35 people sheltered. All families currently safe and stable.",
    score: 4.5,
    category: "Food & Shelter",
    tags: ["Ration Supply", "Flood Shelter", "Stable Condition"],
    volunteers: [
      { name: "Rohan Bose", role: "Supply Chain & Logistics", match: "89% Match" }
    ]
  }
];

export default function LandingPage() {
  const [inputText, setInputText] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: Idle, 1: Reading, 2: Mapping, 3: Completed
  const [simResults, setSimResults] = useState<PresetScenario | null>(null);

  // Run simulated AI engine
  const handleSimulate = (scenario: PresetScenario | string) => {
    setIsSimulating(true);
    setSimulationStep(1);
    
    let scenarioData: PresetScenario;
    
    if (typeof scenario === "string") {
      setInputText(scenario);
      // Generate some dynamic values based on string length/contents for user's custom text
      const score = Math.min(9.9, Math.max(2.1, Number((2.5 + (scenario.length % 75) / 10).toFixed(1))));
      scenarioData = {
        text: scenario,
        score: score,
        category: score >= 7 ? "Emergency Operations" : score >= 4 ? "Medical & Support" : "Resource Supply",
        tags: score >= 7 ? ["Custom Urgent Alert", "Severe Crisis"] : ["General Inquiry", "Community Support"],
        volunteers: [
          { name: "Priya Sharma", role: "Emergency Coordinator", match: "92% Match" },
          { name: "Dev Naskar", role: "Community Support Lead", match: "87% Match" }
        ]
      };
    } else {
      setInputText(scenario.text);
      scenarioData = scenario;
    }

    // Step-based beautiful visual simulation timings
    setTimeout(() => {
      setSimulationStep(2);
      setTimeout(() => {
        setSimulationStep(3);
        setSimResults(scenarioData);
        setIsSimulating(false);
      }, 900);
    }, 800);
  };

  const handleResetSimulator = () => {
    setInputText("");
    setSimResults(null);
    setSimulationStep(0);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900/30">
      <BackgroundGlow />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-black border border-blue-500/20 shadow-sm animate-pulse">
              <Zap className="w-4 h-4 fill-current" />
              <span>NEXT-GEN AI DISASTER COORDINATION</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
              Coordinating Relief with <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Intelligent Precision.
              </span>
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-xl">
              ReliefLink is an AI-powered NGO coordination platform that instantly bridges the gap between critical community needs and volunteers using semantic skill matching and real-time urgency classification.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all font-black group">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1.5" />
                </Button>
              </Link>
              <Link href="/community-needs" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 text-lg rounded-2xl font-black bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 backdrop-blur-xl transition-all">
                  Report a Need
                </Button>
              </Link>
            </div>

            {/* Metrics Snapshot */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-slate-200/50 dark:border-neutral-800/80">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900 dark:text-white">94%</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Match Accuracy</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900 dark:text-white">&lt;12m</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Response Latency</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900 dark:text-white">10k+</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Verified Responders</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900 dark:text-white">24/7</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Live Coordination</span>
              </div>
            </div>
          </div>

          {/* Hero Right Content - Interactive AI Simulator */}
          <div className="lg:col-span-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-neutral-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
              
              {/* Simulator Header */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                      Urgency Engine
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] uppercase font-black border border-emerald-500/20">LIVE DEMO</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Semantic Urgency Scorer</p>
                  </div>
                </div>
                {simulationStep > 0 && (
                  <button 
                    onClick={handleResetSimulator}
                    className="p-2 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl transition-all"
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
                      Select a realistic disaster report below or write your own to witness the AI urgency and semantic volunteer matching system.
                    </p>
                    
                    {/* Preset Scenarios Buttons */}
                    <div className="space-y-2.5">
                      {PRESET_SCENARIOS.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handleSimulate(preset)}
                          className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/40 border border-slate-200/40 dark:border-neutral-800 hover:border-blue-500/35 hover:bg-blue-500/[0.01] hover:scale-[1.01] transition-all group flex items-start gap-3"
                        >
                          <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
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
                        placeholder="Write a custom crisis scenario description..."
                        className="w-full h-24 p-4 text-xs font-semibold rounded-2xl bg-slate-100/50 dark:bg-neutral-800/20 border border-slate-200 dark:border-neutral-800 focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all resize-none text-slate-700 dark:text-slate-200"
                      />
                      <button
                        disabled={inputText.trim().length < 15}
                        onClick={() => handleSimulate(inputText)}
                        className="absolute right-3.5 bottom-3.5 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-30 disabled:hover:bg-blue-600 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : isSimulating ? (
                  // Step 1 & 2: Processing state
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        {simulationStep === 1 ? "Extracting Semantics..." : "Calculating Urgency..."}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                        Neural Scoring Models Active
                      </p>
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
                            className="h-full bg-gradient-to-r from-orange-500 to-rose-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
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
                              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs border border-blue-500/10">
                                {vol.name.charAt(0)}
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

      {/* Features Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
              Powerful AI <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Capabilities</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg max-w-xl mx-auto">
              Modern digital tools engineered for hyper-precise and efficient real-time disaster response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldAlert className="w-8 h-8 text-rose-500" />}
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

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10">
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
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 h-16 px-10 text-lg rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-98 transition-all">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/10 h-16 px-10 text-lg rounded-2xl font-black backdrop-blur-md transition-all">
                  Volunteer Login
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative background structures */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-200/50 dark:border-neutral-900/80 relative z-10 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-[11px] text-white font-black shadow-md shadow-blue-500/20">RL</div>
            <span className="font-black tracking-tight text-lg">ReliefLink</span>
          </div>
          <div className="flex gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-500 transition-colors">Platform</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Resources</a>
            <a href="#" className="hover:text-blue-500 transition-colors">About</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Contact</a>
          </div>
          <div className="text-xs text-slate-400 font-bold">
            © 2026 ReliefLink Emergency Operations. All rights reserved.
          </div>
        </div>
      </footer>
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
    <div className={`p-8 rounded-[2.5rem] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/40 dark:border-neutral-800/80 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col group ${glowColor}`}>
      
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
