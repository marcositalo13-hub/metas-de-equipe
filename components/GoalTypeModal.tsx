"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Meta, Pessoa, TipoMeta } from "@/lib/types";
import { TIPO_META_COLORS, TIPO_META_LABELS, TIPOS_META } from "@/lib/tipos-meta";
import Avatar from "./Avatar";
import TrashIcon from "./TrashIcon";

interface GoalTypeModalProps {
  aberto: boolean;
  pessoa: Pessoa;
  dateLabel: string;
  metasNoDia: Meta[];
  onAdd: (tipo: TipoMeta) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function GoalTypeModal({
  aberto,
  pessoa,
  dateLabel,
  metasNoDia,
  onAdd,
  onDelete,
  onClose,
}: GoalTypeModalProps) {
  // ID do registro cuja confirmação de exclusão está aberta (no máximo um).
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);

  function confirmarExclusao(id: string) {
    onDelete(id);
    setConfirmandoId(null);
  }

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
            {/* Cabeçalho */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar pessoa={pessoa} size={48} />
              <div>
                <p className="text-white font-black text-lg leading-tight">{pessoa.nome}</p>
                <p className="text-white/70 text-sm font-medium capitalize">{dateLabel}</p>
              </div>
            </div>

            {/* Botões de adicionar — sempre inserem um novo registro */}
            <p className="text-white/70 text-xs mb-2 font-medium">Adicionar marcação:</p>
            <div className="grid grid-cols-2 gap-3">
              {TIPOS_META.map((tipo) => {
                const cor = TIPO_META_COLORS[tipo];
                const count = metasNoDia.filter((m) => m.tipo === tipo).length;
                return (
                  <motion.button
                    key={tipo}
                    type="button"
                    onClick={() => onAdd(tipo)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    className="rounded-2xl py-4 flex flex-col items-center justify-center gap-1 font-black text-2xl text-white shadow-lg transition-all"
                    style={{
                      backgroundColor: `${cor}44`,
                      boxShadow: `0 0 0 2px ${cor}88 inset`,
                    }}
                  >
                    <span>{tipo}</span>
                    <span className="text-[11px] font-semibold opacity-80">
                      {TIPO_META_LABELS[tipo]}
                      {count > 0 && (
                        <span className="ml-1 font-black" style={{ color: cor }}>
                          ×{count}
                        </span>
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Lista de marcações existentes com exclusão individual */}
            {metasNoDia.length > 0 && (
              <div className="mt-4">
                <p className="text-white/70 text-xs mb-2 font-medium">
                  Marcações registradas ({metasNoDia.length}):
                </p>
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                  {metasNoDia.map((meta, idx) => {
                    const cor = TIPO_META_COLORS[meta.tipo];
                    const confirmando = confirmandoId === meta.id;
                    return (
                      <div
                        key={meta.id}
                        className="flex items-center justify-between rounded-xl px-3 py-2"
                        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                      >
                        {confirmando ? (
                          <div className="flex items-center justify-between w-full gap-2">
                            <span className="text-white/80 text-xs font-semibold">
                              Excluir marcação #{idx + 1}?
                            </span>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => confirmarExclusao(meta.id)}
                                className="px-2.5 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold transition-colors"
                              >
                                Excluir
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmandoId(null)}
                                className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span
                                className="rounded-full w-6 h-6 flex items-center justify-center text-xs font-black text-white"
                                style={{ backgroundColor: cor }}
                              >
                                {meta.tipo}
                              </span>
                              <span className="text-white/80 text-xs">
                                {TIPO_META_LABELS[meta.tipo]} #{idx + 1}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setConfirmandoId(meta.id)}
                              className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/50 text-red-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                              aria-label={`Excluir marcação ${meta.tipo} #${idx + 1}`}
                            >
                              <TrashIcon size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
