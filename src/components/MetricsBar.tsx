import React from 'react';
import { AGENCY_METRICS } from '../lib/data';
import { TrendingUp, Award, Users, CheckCircle2 } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  return (
    <section className="py-10 bg-white border-y border-[#c4c7c7]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Country Presence Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 text-xs font-semibold text-[#747878]">
          <span className="uppercase tracking-widest text-[10px]">Atuação Internacional:</span>
          <span className="bg-[#f1edec] px-3.5 py-1 rounded-full text-[#1c1b1b]">Brasil</span>
          <span className="bg-[#f1edec] px-3.5 py-1 rounded-full text-[#1c1b1b]">Angola</span>
          <span className="bg-[#f1edec] px-3.5 py-1 rounded-full text-[#1c1b1b]">Portugal &amp; Europa</span>
          <span className="bg-[#f1edec] px-3.5 py-1 rounded-full text-[#1c1b1b]">Estados Unidos</span>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-[#c4c7c7]/30">
          {AGENCY_METRICS.map((metric, idx) => (
            <div key={idx} className={`pt-4 lg:pt-0 ${idx > 0 ? 'lg:pl-6' : ''}`}>
              <div className="text-3xl sm:text-4xl font-black text-[#1c1b1b] font-display tracking-tight">
                {metric.value}
              </div>
              <div className="text-sm font-bold text-[#1c1b1b] mt-1">
                {metric.label}
              </div>
              <div className="text-xs text-[#747878] mt-0.5">
                {metric.sublabel}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
