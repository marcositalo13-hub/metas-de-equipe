"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pessoa, TipoMeta } from "@/lib/types";
import { TIPO_META_COLORS, TIPO_META_LABELS, TIPOS_META } from "@/lib/tipos-meta";
import Avatar from "./Avatar";
import CheckIcon from "./CheckIcon";

interface GoalTypeModalProps {
  aberto: boolean;
  pessoa: Pessoa;
  dateLabel: string;
  tiposMarcados: TipoMeta[];
  onToggle: (tipo: TipoMeta) => void;
  onClose: () => void;
}

export default function GoalTypeModal({
  aberto,
  pessoa,
  dateLabel,
  tiposMarcados,
  onToggle,
  onClose,
}: GoalTypeModalProps) {
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-indigo-600/90 to-purple-700/90 border border-white/25 shadow-2xl p-6 backdrop-blur-2xl"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-1">
              <Avatar pessoa={pessoa} size={48} />
              <div>
                <p className="text-white font-black text-lg leading-tight">{pessoa.nome}</p>
                <p className="text-white/70 text-sm font-medium capitalize">{dateLabel}</p>
              </div>
            </div>

            <p className="text-white/80 text-xs mt-3 mb-3">
              Toque para marcar. Toque de novo para remover.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {TIPOS_META.map((tipo) => {
                const marcado = tiposMarcados.includes(tipo);
                return (
                  <motion.button
                    key={tipo}
                    onClick={() => onToggle(tipo)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="rounded-2xl py-6 flex flex-col items-center justify-center gap-1 font-black text-2xl text-white shadow-lg transition-all"
                    style={{
                      backgroundColor: marcado
                        ? TIPO_META_COLORS[tipo]
                        : `${TIPO_META_COLORS[tipo]}33`,
                      boxShadow: marcado
                        ? `0 0 0 3px white, 0 8px 20px ${TIPO_META_COLORS[tipo]}88`
                        : `0 0 0 2px ${TIPO_META_COLORS[tipo]}55 inset`,
                    }}
                  >
                    <span>{tipo}</span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold opacity-90">
                      {marcado && <CheckIcon size={11} />}
                      {marcado ? "batida" : TIPO_META_LABELS[tipo]}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full text-center text-white/70 hover:text-white text-sm font-semibold transition-colors"
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
