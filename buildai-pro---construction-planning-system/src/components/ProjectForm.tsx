import React from 'react';
import { ProjectInputs } from '../types';
import { Calculator, MapPin, Building2, Calendar, IndianRupee } from 'lucide-react';

interface Props {
  onSubmit: (inputs: ProjectInputs) => void;
  loading: boolean;
}

export const ProjectForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [inputs, setInputs] = React.useState<ProjectInputs>({
    plotArea: 1000,
    unit: 'sqft',
    floors: 1,
    buildingType: 'Residential',
    location: '',
    timeline: '6 months',
    dailyWage: 600,
    costPerSqUnit: 1800
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Project Parameters</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Plot Area</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                required
                value={inputs.plotArea}
                onChange={(e) => setInputs({...inputs, plotArea: parseFloat(e.target.value)})}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <select 
                value={inputs.unit}
                onChange={(e) => setInputs({...inputs, unit: e.target.value as any})}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-none"
              >
                <option value="sqft">Sq. Ft</option>
                <option value="sqyard">Sq. Yard</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Number of Floors</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="number" 
                required
                min="1"
                value={inputs.floors}
                onChange={(e) => setInputs({...inputs, floors: parseInt(e.target.value)})}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Building Type</label>
            <select 
              value={inputs.buildingType}
              onChange={(e) => setInputs({...inputs, buildingType: e.target.value as any})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                required
                placeholder="City, State"
                value={inputs.location}
                onChange={(e) => setInputs({...inputs, location: e.target.value})}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Expected Timeline</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                required
                placeholder="e.g. 12 months"
                value={inputs.timeline}
                onChange={(e) => setInputs({...inputs, timeline: e.target.value})}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Avg. Daily Wage (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="number" 
                required
                value={inputs.dailyWage}
                onChange={(e) => setInputs({...inputs, dailyWage: parseInt(e.target.value)})}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Calculator className="w-5 h-5" />
          )}
          {loading ? 'Processing Analysis...' : 'Generate Construction Plan'}
        </button>
      </form>
    </div>
  );
};
