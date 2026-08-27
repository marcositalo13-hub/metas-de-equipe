"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { PESSOAS } from "@/lib/pessoas";
import { getSupabase, BUCKET_FOTOS, nomeArquivoFoto } from "@/lib/supabase";
import { bumpFotoVersion } from "@/lib/foto-store";
import { comprimirImagem } from "@/lib/comprimir-imagem";
import Avatar from "./Avatar";
import CameraIcon from "./CameraIcon";
import SpinnerIcon from "./SpinnerIcon";

interface PersonSelectorProps {
  selecionado: string;
  onSelect: (id: string) => void;
  popId: string | null;
}

export default function PersonSelector({
  selecionado,
  onSelect,
  popId,
}: PersonSelectorProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [enviandoId, setEnviandoId] = useState<string | null>(null);
  const [erroUpload, setErroUpload] = useState<string | null>(null);

  async function enviarFoto(pessoaId: string, file: File | undefined) {
    if (!file) return;
    const supabase = getSupabase();
    if (!supabase) {
      setErroUpload("Supabase não configurado — não é possível salvar a foto.");
      return;
    }

    setErroUpload(null);
    setEnviandoId(pessoaId);
    try {
      const imagem = await comprimirImagem(file);
      const { error } = await supabase.storage
        .from(BUCKET_FOTOS)
        .upload(nomeArquivoFoto(pessoaId), imagem, {
          upsert: true,
          contentType: "image/jpeg",
        });
      if (error) throw error;
      // Avisa todos os <Avatar> dessa pessoa na tela para buscar a foto nova.
      bumpFotoVersion(pessoaId);
    } catch {
      setErroUpload("Não foi possível enviar a foto. A anterior foi mantida.");
    } finally {
      setEnviandoId(null);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-end justify-center gap-4 sm:gap-8 py-4">
        {PESSOAS.map((pessoa) => {
          const ativo = pessoa.id === selecionado;
          const enviando = enviandoId === pessoa.id;

          return (
            <motion.div
              key={pessoa.id}
              className="flex flex-col items-center gap-2"
              animate={{
                scale: ativo ? 1 : 0.82,
                opacity: ativo ? 1 : 0.55,
              }}
              whileHover={{ scale: ativo ? 1.05 : 0.9, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="relative rounded-full p-1"
                animate={
                  ativo
                    ? {
                        boxShadow: [
                          "0 0 0 4px rgba(255,255,255,0.9), 0 0 24px 4px rgba(168,85,247,0.7)",
                          "0 0 0 4px rgba(255,255,255,0.9), 0 0 34px 8px rgba(236,72,153,0.7)",
                          "0 0 0 4px rgba(255,255,255,0.9), 0 0 24px 4px rgba(168,85,247,0.7)",
                        ],
                      }
                    : { boxShadow: "0 0 0 0px rgba(255,255,255,0)" }
                }
                transition={
                  ativo
                    ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 }
                }
              >
                <motion.div
                  className="relative"
                  animate={popId === pessoa.id ? { scale: [1, 1.35, 0.95, 1.1, 1] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {/* Selecionar a pessoa: clique no avatar */}
                  <button
                    type="button"
                    onClick={() => onSelect(pessoa.id)}
                    className="block rounded-full focus:outline-none"
                    aria-label={`Selecionar ${pessoa.nome}`}
                  >
                    <Avatar pessoa={pessoa} size={ativo ? 96 : 72} />
                  </button>

                  {/* Trocar a foto: botão de câmera sobreposto, canto inferior direito */}
                  <button
                    type="button"
                    onClick={() => inputRefs.current[pessoa.id]?.click()}
                    disabled={enviando}
                    className="absolute bottom-0 right-0 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-purple-700 flex items-center justify-center shadow-md border-2 border-purple-700/10 transition-transform hover:scale-110 active:scale-95 disabled:opacity-70"
                    aria-label={`Trocar foto de ${pessoa.nome}`}
                  >
                    {enviando ? <SpinnerIcon size={12} /> : <CameraIcon size={13} />}
                  </button>

                  <input
                    ref={(el) => {
                      inputRefs.current[pessoa.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      enviarFoto(pessoa.id, file);
                    }}
                  />
                </motion.div>
              </motion.div>

              <button
                type="button"
                onClick={() => onSelect(pessoa.id)}
                className={`font-extrabold tracking-wide drop-shadow-sm transition-all focus:outline-none ${
                  ativo ? "text-white text-lg sm:text-xl" : "text-white/70 text-sm sm:text-base"
                }`}
              >
                {pessoa.nome}
              </button>
            </motion.div>
          );
        })}
      </div>

      {erroUpload && (
        <p className="text-red-100 text-xs font-semibold bg-red-500/25 border border-red-400/40 rounded-full px-3 py-1">
          {erroUpload}
        </p>
      )}
    </div>
  );
}
