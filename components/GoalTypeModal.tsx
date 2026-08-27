"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pessoa, TipoMeta } from "@/lib/types";
import { TIPO_META_COLORS, TIPO_META_LABELS, TIPOS_META } from "@/lib/tipos-meta";
import Avatar from "./Avatar";
import CheckIcon from "./CheckIcon";
import TrashIcon from "./TrashIcon";

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
  // Tipo (M/S) para o qual a confirmação de exclusão está aberta neste
  // instante — no máximo um por vez. Reseta sozinho porque o modal desmonta
  // ao fechar (ver app/page.tsx: `{diaSelecionado && <GoalTypeModal .../>}`).
  const [confirmandoExclusao, setConfirmandoExclusao] = useState<TipoMeta | null>(null);

  function pedirExclusao(tipo: TipoMeta) {
    setConfirmandoExclusao(tipo);
  }

  function confirmarExclusao(tipo: TipoMeta) {
    onToggle(tipo);
    setConfirmandoExclusao(null);
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
            <div className="flex items-center gap-3 mb-1">
              <Avatar pessoa={pessoa} size={48} />
              <div>
                <p className="text-white font-black text-lg leading-tight">{pessoa.nome}</p>
                <p className="text-white/70 text-sm font-medium capitalize">{dateLabel}</p>
              </div>
            </div>

            <p className="text-white/80 text-xs mt-3 mb-3">
              Toque para marcar. Já marcada: toque no ícone de lixeira para excluir.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {TIPOS_META.map((tipo) => {
                const marcado = tiposMarcados.includes(tipo);
                const confirmando = confirmandoExclusao === tipo;
                const cor = TIPO_META_COLORS[tipo];

                return (
                  <div key={tipo} className="relative">
                    {confirmando ? (
                      // Estado de confirmação: substitui o card, com botões
                      // "Excluir" / "Cancelar" em área de toque própria —
                      // nunca a mesma área do botão de marcar/desmarcar.
                      <div
                        className="rounded-2xl py-4 px-2 flex flex-col items-center justify-center gap-2 text-white shadow-lg h-full"
                        style={{ backgroundColor: "rgba(127, 29, 29, 0.92)", boxShadow: "0 0 0 2px rgba(248,113,113,0.6)" }}
                      >
                        <p className="text-[11px] font-bold text-center leading-tight">
                          Excluir esta marcação {tipo}?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => confirmarExclusao(tipo)}
                            className="px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold transition-colors"
                          >
                            Excluir
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmandoExclusao(null)}
                            className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <motion.button
                          type="button"
                          // Marcar só faz algo quando ainda não está marcada —
                          // remover agora é só pelo ícone de lixeira (com
                          // confirmação), então essa área de toque nunca
                          // exclui nada por engano.
                          onClick={() => {
                            if (!marcado) onToggle(tipo);
                          }}
                          whileHover={{ scale: marcado ? 1 : 1.06 }}
                          whileTap={{ scale: marcado ? 1 : 0.94 }}
                          className="w-full rounded-2xl py-6 flex flex-col items-center justify-center gap-1 font-black text-2xl text-white shadow-lg transition-all"
                          style={{
                            backgroundColor: marcado ? cor : `${cor}33`,
                            boxShadow: marcado
                              ? `0 0 0 3px white, 0 8px 20px ${cor}88`
                              : `0 0 0 2px ${cor}55 inset`,
                            cursor: marcado ? "default" : "pointer",
                          }}
                        >
                          <span>{tipo}</span>
                          <span className="flex items-center gap-1 text-[11px] font-semibold opacity-90">
                            {marcado && <CheckIcon size={11} />}
                            {marcado ? "batida" : TIPO_META_LABELS[tipo]}
                          </span>
                        </motion.button>

                        {marcado && (
                          <button
                            type="button"
                            onClick={() => pedirExclusao(tipo)}
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md border-2 border-white/85 transition-transform hover:scale-110 active:scale-95"
                            aria-label={`Excluir marcação ${tipo} de ${pessoa.nome}`}
                          >
                            <TrashIcon size={13} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
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
