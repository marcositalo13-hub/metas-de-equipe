"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Meta } from "@/lib/types";
import { buildMonthMatrix, DIAS_SEMANA, formatDateKey, MESES } from "@/lib/date-utils";
import DayCell from "./DayCell";

interface CalendarProps {
  year: number;
  month: number; // 0-11
  metas: Meta[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (dateKey: string) => void;
  poppingKey: string | null;
}

export default function Calendar({
  year,
  month,
  metas,
  onPrevMonth,
  onNextMonth,
  onDayClick,
  poppingKey,
}: CalendarProps) {
  const weeks = buildMonthMatrix(year, month);

  const metasPorDia = new Map<string, Meta[]>();
  for (const m of metas) {
    const arr = metasPorDia.get(m.data) ?? [];
    arr.push(m);
    metasPorDia.set(m.data, arr);
  }

  return (
    <div className="w-full rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-3 sm:p-5 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onPrevMonth}
          className="rounded-full w-10 h-10 flex items-center justify-center bg-white/15 hover:bg-white/30 text-white text-xl font-bold transition-all hover:scale-110 active:scale-95"
          aria-label="Mês anterior"
        >
          ‹
        </button>
        <AnimatePresence mode="wait">
          <motion.h2
            key={`${year}-${month}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="text-white font-black text-lg sm:text-2xl tracking-tight"
          >
            {MESES[month]} <span className="text-white/60">{year}</span>
          </motion.h2>
        </AnimatePresence>
        <button
          onClick={onNextMonth}
          className="rounded-full w-10 h-10 flex items-center justify-center bg-white/15 hover:bg-white/30 text-white text-xl font-bold transition-all hover:scale-110 active:scale-95"
          aria-label="Próximo mês"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
        {DIAS_SEMANA.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] sm:text-xs font-bold text-white/60 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
        {weeks.flatMap((week, wi) =>
          week.map((date, di) => {
            if (!date) return <div key={`${wi}-${di}`} />;
            const key = formatDateKey(date);
            return (
              <DayCell
                key={key}
                date={date}
                metasDoDia={metasPorDia.get(key) ?? []}
                onClick={() => onDayClick(key)}
                popping={poppingKey === key}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
