"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Meta, Pessoa, TipoMeta } from "@/lib/types";
import { TIPO_META_COLORS, TIPO_META_LABELS } from "@/lib/tipos-meta";
import { MESES_ABREV } from "@/lib/date-utils";
import Avatar from "./Avatar";

interface PersonChartGroupProps {
  pessoa: Pessoa;
  metas: Meta[];
  ano: number;
}

function buildMonthlyData(metas: Meta[], pessoaId: string, tipo: TipoMeta, ano: number) {
  const counts = new Array(12).fill(0);
  for (const m of metas) {
    if (m.pessoa !== pessoaId || m.tipo !== tipo) continue;
    const [y, mo] = m.data.split("-").map(Number);
    if (y !== ano) continue;
    counts[mo - 1]++;
  }
  return MESES_ABREV.map((mes, i) => ({ mes, total: counts[i] }));
}

function MiniChart({
  tipo,
  pessoa,
  metas,
  ano,
}: {
  tipo: TipoMeta;
  pessoa: Pessoa;
  metas: Meta[];
  ano: number;
}) {
  const data = buildMonthlyData(metas, pessoa.id, tipo, ano);
  const totalAno = data.reduce((acc, d) => acc + d.total, 0);
  const cor = TIPO_META_COLORS[tipo];

  return (
    <div className="min-w-0 w-full rounded-2xl bg-white/10 border border-white/15 p-3 sm:p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2 gap-2">
        <span
          className="text-white font-bold text-sm truncate"
          style={{ color: cor }}
        >
          {TIPO_META_LABELS[tipo]}
        </span>
        <div className="text-right leading-none shrink-0">
          <div className="text-2xl sm:text-3xl font-black text-white">{totalAno}</div>
          <div className="text-[10px] text-white/60 font-medium">em {ano}</div>
        </div>
      </div>
      <div className="relative w-full h-32 sm:h-40 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={22}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.08)" }}
              contentStyle={{
                background: "rgba(30,20,60,0.95)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 12,
                color: "white",
                fontSize: 12,
              }}
              wrapperStyle={{ zIndex: 20, pointerEvents: "none" }}
            />
            <Bar dataKey="total" fill={cor} radius={[6, 6, 0, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function PersonChartGroup({ pessoa, metas, ano }: PersonChartGroupProps) {
  return (
    <div className="min-w-0 rounded-3xl bg-white/5 border border-white/15 p-3 sm:p-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar pessoa={pessoa} size={40} />
        <h3 className="text-white font-black text-lg sm:text-xl">{pessoa.nome}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MiniChart tipo="M" pessoa={pessoa} metas={metas} ano={ano} />
        <MiniChart tipo="S" pessoa={pessoa} metas={metas} ano={ano} />
      </div>
    </div>
  );
}
