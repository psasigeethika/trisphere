import React from 'react';
import { ProjectPlan } from '../types';
import { History as HistoryIcon, ArrowRight, Calendar } from 'lucide-react';

interface Props {
  history: ProjectPlan[];
  onSelect: (plan: ProjectPlan) => void;
}

export const History: React.FC<Props> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
          <HistoryIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Project History</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item)}
            className="text-left p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {new Date(item.timestamp!).toLocaleDateString()}
              </span>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{item.inputs.location || 'Untitled Project'}</h4>
            <p className="text-xs text-slate-500 mb-4">
              {item.inputs.plotArea} {item.inputs.unit} • {item.inputs.floors} Floors
            </p>
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
              View Report
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
