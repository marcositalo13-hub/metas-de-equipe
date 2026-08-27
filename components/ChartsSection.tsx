"use client";

import { Meta } from "@/lib/types";
import { PESSOAS } from "@/lib/pessoas";
import PersonChartGroup from "./PersonChartGroup";

interface ChartsSectionProps {
  metas: Meta[];
  ano: number;
}

export default function ChartsSection({ metas, ano }: ChartsSectionProps) {
  return (
    <div className="w-full rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-3 sm:p-5">
      <h2 className="text-white font-black text-lg sm:text-2xl mb-3 sm:mb-4 tracking-tight">
        Registros de {ano}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 items-start">
        {PESSOAS.map((pessoa) => (
          <div key={pessoa.id} className="min-w-0">
            <PersonChartGroup pessoa={pessoa} metas={metas} ano={ano} />
          </div>
        ))}
      </div>
    </div>
  );
}
