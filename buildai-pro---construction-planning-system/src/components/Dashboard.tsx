import React from 'react';
import { ProjectPlan } from '../types';
import { 
  IndianRupee, Users, Clock, Package, 
  TrendingUp, Leaf, CheckCircle2, 
  FileDown, Share2, Printer
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

interface Props {
  plan: ProjectPlan;
  onDownload: () => void;
}

export const Dashboard: React.FC<Props> = ({ plan, onDownload }) => {
  const costData = [
    { name: 'Labor', value: plan.metrics.laborCost },
    { name: 'Material', value: plan.metrics.materialCost },
    { name: 'Overhead', value: plan.metrics.overhead },
  ];

  const materialData = [
    { name: 'Steel', value: plan.materials.steel * 1000 }, // kg
    { name: 'Cement', value: plan.materials.cement * 50 }, // kg
    { name: 'Sand', value: plan.materials.sand * 1000 }, // kg
    { name: 'Aggregates', value: plan.materials.aggregates * 1000 }, // kg
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Project Dashboard</h2>
          <p className="text-slate-500">Comprehensive analysis for {plan.inputs.location}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <FileDown className="w-4 h-4" />
            Download Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Share2 className="w-4 h-4" />
            Share Plan
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon={IndianRupee} 
          label="Total Project Cost" 
          value={`₹${plan.metrics.totalCost.toLocaleString()}`}
          subValue={`₹${(plan.metrics.totalCost / plan.inputs.plotArea).toFixed(0)} / ${plan.inputs.unit}`}
          color="bg-emerald-500"
        />
        <MetricCard 
          icon={Users} 
          label="Workforce Required" 
          value={`${plan.metrics.totalWorkers} Workers`}
          subValue={`${plan.workforce.totalLabourDays} Total Man-Days`}
          color="bg-indigo-500"
        />
        <MetricCard 
          icon={Clock} 
          label="Estimated Duration" 
          value={`${Math.ceil(plan.metrics.durationDays)} Days`}
          subValue={`Target: ${plan.inputs.timeline}`}
          color="bg-amber-500"
        />
        <MetricCard 
          icon={Package} 
          label="Material Intensity" 
          value="High Grade"
          subValue="RCC Structure"
          color="bg-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Cost Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {costData.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-slate-500 mb-1">{item.name}</div>
                <div className="font-bold text-slate-900">₹{(item.value / 100000).toFixed(1)}L</div>
              </div>
            ))}
          </div>
        </div>

        {/* Material Quantities */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Material Requirements
          </h3>
          <div className="space-y-4">
            <MaterialRow label="Steel" value={plan.materials.steel} unit="Tons" />
            <MaterialRow label="Cement" value={plan.materials.cement} unit="Bags" />
            <MaterialRow label="Bricks" value={plan.materials.bricks} unit="Units" />
            <MaterialRow label="Sand" value={plan.materials.sand} unit="Tons" />
            <MaterialRow label="Aggregates" value={plan.materials.aggregates} unit="Tons" />
          </div>
        </div>
      </div>

      {/* Workforce & Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Workforce Allocation
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <WorkforceItem label="Masons" count={plan.workforce.masons} />
            <WorkforceItem label="Helpers" count={plan.workforce.helpers} />
            <WorkforceItem label="Carpenters" count={plan.workforce.carpenters} />
            <WorkforceItem label="Steel Workers" count={plan.workforce.steelWorkers} />
            <WorkforceItem label="Electricians" count={plan.workforce.electricians} />
            <WorkforceItem label="Plumbers" count={plan.workforce.plumbers} />
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Optimization
          </h3>
          <ul className="space-y-4">
            {plan.optimizationSuggestions.map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" />
                <p className="text-indigo-50">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-emerald-900">Environmental Impact Estimation</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-2xl">
              <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Estimated Carbon Footprint</p>
              <p className="text-2xl font-bold text-slate-900">{plan.environmentalImpact.carbonFootprint}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl">
              <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Water Usage Estimation</p>
              <p className="text-2xl font-bold text-slate-900">{plan.environmentalImpact.waterUsage}</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-bold text-emerald-900">Sustainability Recommendations:</p>
            {plan.environmentalImpact.sustainabilityTips.map((tip, i) => (
              <div key={i} className="flex gap-2 text-sm text-emerald-800">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0" />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, subValue, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
    <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    <p className="text-xs text-slate-400 mt-1">{subValue}</p>
  </div>
);

const MaterialRow = ({ label, value, unit }: any) => (
  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
    <span className="text-slate-600 font-medium">{label}</span>
    <div className="text-right">
      <span className="font-bold text-slate-900">{value.toLocaleString()}</span>
      <span className="text-xs text-slate-400 ml-1">{unit}</span>
    </div>
  </div>
);

const WorkforceItem = ({ label, count }: any) => (
  <div className="p-4 bg-slate-50 rounded-2xl text-center">
    <p className="text-xs text-slate-500 font-bold uppercase mb-1">{label}</p>
    <p className="text-2xl font-bold text-indigo-600">{count}</p>
  </div>
);
