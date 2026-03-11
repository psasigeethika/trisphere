import React from 'react';
import { ScheduleItem } from '../types';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  schedule: ScheduleItem[];
}

export const Timeline: React.FC<Props> = ({ schedule }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Phase-wise Construction Schedule</h2>
      </div>

      <div className="space-y-8">
        {schedule.map((item, idx) => (
          <div key={idx} className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-sm font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                {item.week}
              </div>
              {idx !== schedule.length - 1 && (
                <div className="w-0.5 h-full bg-slate-100 group-hover:bg-indigo-100 transition-colors" />
              )}
            </div>
            <div className="pb-8 flex-1">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-xl font-bold text-slate-900">Week {item.week}: {item.phase}</h4>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  Planned
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.activities.map((act, aidx) => (
                  <div key={aidx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {act}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
