import React from 'react';
import { Blueprint } from '../types';
import { Layout, Ruler, Box } from 'lucide-react';

interface Props {
  blueprints: Blueprint[];
}

export const BlueprintView: React.FC<Props> = ({ blueprints }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Layout className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Architectural Layout Suggestions</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {blueprints.map((floor, idx) => (
          <div key={idx} className="bg-[#0f172a] rounded-3xl p-8 border border-indigo-500/30 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="relative z-10">
              <div className="text-center mb-8 border-b border-indigo-500/30 pb-6">
                <h4 className="text-indigo-400 font-bold tracking-[0.2em] uppercase text-sm">{floor.floor}</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {floor.rooms.map((room, ridx) => (
                  <div key={ridx} className="border border-indigo-400/40 p-5 rounded-2xl bg-indigo-900/20 hover:bg-indigo-900/40 transition-all group/room">
                    <div className="flex items-center gap-2 mb-2">
                      <Box className="w-4 h-4 text-indigo-400" />
                      <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">{room.name}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-mono text-lg font-bold">{room.dim}</p>
                      <Ruler className="w-4 h-4 text-indigo-500 opacity-0 group-hover/room:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-indigo-500/30 flex justify-between items-center text-[10px] text-indigo-400 font-mono">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  Scale: 1/100
                </span>
                <span className="flex items-center gap-1">
                  BuildAI Pro Generated
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
