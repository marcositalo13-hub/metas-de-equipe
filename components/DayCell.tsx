"use client";

import { motion } from "framer-motion";
import { Meta } from "@/lib/types";
import { PESSOAS, getPessoa } from "@/lib/pessoas";
import { TIPO_META_COLORS } from "@/lib/tipos-meta";
import { formatDateKey, todayKey } from "@/lib/date-utils";
import Avatar from "./Avatar";

interface DayCellProps {
  date: Date;
  metasDoDia: Meta[];
  onClick: () => void;
  popping: boolean;
}

export default function DayCell({ date, metasDoDia, onClick, popping }: DayCellProps) {
  const key = formatDateKey(date);
  const isToday = key === todayKey();

  // Ordena os badges pela ordem fixa das pessoas, para não "pular" na tela.
  const badges = metasDoDia
    .map((m) => ({ meta: m, pessoa: getPessoa(m.pessoa) }))
    .filter((b) => b.pessoa)
    .sort(
      (a, b) =>
        PESSOAS.findIndex((p) => p.id === a.meta.pessoa) -
        PESSOAS.findIndex((p) => p.id === b.meta.pessoa)
    );

  return (
    <motion.button
      onClick={onClick}
      className={`relative flex flex-col items-start justify-start rounded-xl sm:rounded-2xl p-1 sm:p-2 min-h-[58px] sm:min-h-[86px] w-full text-left transition-colors overflow-hidden
        bg-white/10 hover:bg-white/20 border ${
          isToday ? "border-white/80" : "border-white/10"
        }`}
      animate={popping ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.5 }}
    >
      <span
        className={`text-[11px] sm:text-sm font-bold ${
          isToday ? "text-white" : "text-white/80"
        }`}
      >
        {date.getDate()}
      </span>
      <div className="flex flex-wrap gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
        {badges.slice(0, 6).map(({ meta, pessoa }) => (
          <div
            key={meta.id}
            title={`${pessoa!.nome} — ${meta.tipo}`}
            className="rounded-full"
            style={{
              boxShadow: `0 0 0 2px ${TIPO_META_COLORS[meta.tipo]}`,
            }}
          >
            <Avatar pessoa={pessoa!} size={18} />
          </div>
        ))}
        {badges.length > 6 && (
          <span className="text-[9px] sm:text-[10px] text-white/70 font-bold self-center">
            +{badges.length - 6}
          </span>
        )}
      </div>
    </motion.button>
  );
}
