import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ProjectForm } from './components/ProjectForm';
import { Dashboard } from './components/Dashboard';
import { Timeline } from './components/Timeline';
import { BlueprintView } from './components/Blueprint';
import { History } from './components/History';
import { ProjectInputs, ProjectPlan } from './types';
import { HardHat, Info, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function App() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [history, setHistory] = useState<ProjectPlan[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleCalculate = async (inputs: ProjectInputs) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get deterministic calculations from backend
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const result = await res.json();
      
      if (!result.success) throw new Error(result.error);
      const partialPlan = result.data;

      // 2. Enhance with AI (Gemini)
      const prompt = `As a professional civil engineer and construction planner, provide a detailed analysis for this project:
      - Plot Area: ${inputs.plotArea} ${inputs.unit}
      - Floors: ${inputs.floors}
      - Type: ${inputs.buildingType}
      - Location: ${inputs.location}
      - Target Timeline: ${inputs.timeline}
      - Estimated Cost: ₹${partialPlan.metrics.totalCost.toLocaleString()}

      Provide the following in JSON format:
      1. "schedule": Array of 8-12 weeks with "week", "phase", and "activities" (list of strings).
      2. "blueprints": Array of objects for each floor with "floor" name and "rooms" (array of {name, dim}).
      3. "tips": Array of 5 professional construction tips.
      4. "optimizationSuggestions": Array of 4 ways to reduce cost or time.
      5. "environmentalImpact": { "carbonFootprint": string, "waterUsage": string, "sustainabilityTips": string[] }

      Return ONLY the JSON.`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      const aiData = JSON.parse(aiResponse.text || "{}");
      
      const fullPlan: ProjectPlan = {
        ...partialPlan,
        ...aiData
      };

      // 3. Save to history
      await fetch('/api/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, plan: fullPlan })
      });

      setPlan(fullPlan);
      fetchHistory();
      
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('results');
    if (!element) return;
    
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Construction_Plan_${plan?.inputs.location || 'Report'}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <HardHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">BuildAI <span className="text-indigo-600">Pro</span></h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Construction Intelligence</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#results" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</a>
              <a href="#resources" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Resources</a>
              <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                Project Portal
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-l from-indigo-500 to-transparent" />
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-500/30">
              <Info className="w-4 h-4" />
              AI-Powered Estimation v3.1
            </div>
            <h2 className="text-5xl lg:text-7xl font-black leading-tight mb-8">
              Build Smarter. <br />
              <span className="text-indigo-400">Plan Better.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Generate comprehensive construction plans, material estimates, and architectural layouts 
              using advanced civil engineering algorithms and AI.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-bold">Granite 3.3 Engine</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-sm font-bold">Real-time Costing</span>
              </div>
            </div>
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-rose-900">Analysis Error</h4>
              <p className="text-rose-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Input Form */}
        <section>
          <ProjectForm onSubmit={handleCalculate} loading={loading} />
        </section>

        {/* History Section */}
        <section>
          <History history={history} onSelect={setPlan} />
        </section>

        {/* Results Section */}
        {plan && (
          <div id="results" className="space-y-12 pb-20">
            <Dashboard plan={plan} onDownload={downloadPDF} />
            <Timeline schedule={plan.schedule} />
            <BlueprintView blueprints={plan.blueprints} />
            
            {/* Tips Section */}
            <div id="resources" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">Professional Engineering Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plan.tips.map((tip, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <HardHat className="w-8 h-8 text-indigo-500" />
                <h3 className="text-2xl font-black">BuildAI Pro</h3>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                The world's most advanced AI-powered construction planning platform for modern civil engineers and contractors.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Material Standards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Labor Laws</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cost Indices</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
            <p>© 2026 BuildAI Pro Systems. All rights reserved.</p>
            <p>Designed for Professional Engineering Use</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
