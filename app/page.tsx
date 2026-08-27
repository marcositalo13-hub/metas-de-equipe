"use client";

import { useEffect, useMemo, useState } from "react";
import type { RealtimePostgresChangesPayload, SupabaseClient } from "@supabase/supabase-js";
import confetti from "canvas-confetti";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { PESSOAS, getPessoa } from "@/lib/pessoas";
import { Meta, TipoMeta } from "@/lib/types";
import { TIPO_META_COLORS } from "@/lib/tipos-meta";
import { MESES } from "@/lib/date-utils";
import PersonSelector from "@/components/PersonSelector";
import Calendar from "@/components/Calendar";
import GoalTypeModal from "@/components/GoalTypeModal";
import ChartsSection from "@/components/ChartsSection";
import Ranking from "@/components/Ranking";
import SettingsIcon from "@/components/SettingsIcon";

const TIMEOUT_CARREGAMENTO_MS = 8000;
const MSG_ERRO_CARREGAMENTO = "Não foi possível carregar os dados. Verifique sua conexão.";

function dispararConfete(cor: string) {
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.6 },
    colors: [cor, "#ffffff", "#FFD54A"],
    scalar: 0.9,
  });
}

// Função "pura" (sem closures sobre estado do componente) para buscar as
// metas com timeout — chamada tanto no carregamento inicial quanto no botão
// "Tentar novamente". Fica fora do componente para não precisar de memoização
// manual (useCallback) nem disparar setState de forma síncrona dentro do efeito.
async function buscarMetas(
  supabase: SupabaseClient,
  onSucesso: (metas: Meta[]) => void,
  onErro: () => void,
  onFinalizado: () => void
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_CARREGAMENTO_MS);
  try {
    const { data, error } = await supabase
      .from("metas")
      .select("*")
      .abortSignal(controller.signal);
    if (error) throw error;
    onSucesso((data as Meta[]) ?? []);
  } catch {
    onErro();
  } finally {
    clearTimeout(timeoutId);
    onFinalizado();
  }
}

export default function Home() {
  const configurado = isSupabaseConfigured();

  const hoje = new Date();
  const [pessoaSelecionada, setPessoaSelecionada] = useState(PESSOAS[0].id);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(configurado);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [popPersonId, setPopPersonId] = useState<string | null>(null);
  const [popDayKey, setPopDayKey] = useState<string | null>(null);

  useEffect(() => {
    if (!configurado) return;
    const supabase = getSupabase();
    if (!supabase) return;
    buscarMetas(
      supabase,
      (dados) => setMetas(dados),
      () => setErroCarregamento(MSG_ERRO_CARREGAMENTO),
      () => setCarregando(false)
    );
  }, [configurado]);

  function tentarNovamenteCarregar() {
    const supabase = getSupabase();
    if (!supabase) return;
    setCarregando(true);
    setErroCarregamento(null);
    buscarMetas(
      supabase,
      (dados) => setMetas(dados),
      () => setErroCarregamento(MSG_ERRO_CARREGAMENTO),
      () => setCarregando(false)
    );
  }

  const anoAtualParaGraficos = hoje.getFullYear();

  const tiposMarcadosNoDia = useMemo(() => {
    if (!diaSelecionado) return [];
    return metas
      .filter((m) => m.pessoa === pessoaSelecionada && m.data === diaSelecionado)
      .map((m) => m.tipo);
  }, [metas, pessoaSelecionada, diaSelecionado]);

  async function handleToggle(tipo: TipoMeta) {
    if (!diaSelecionado) return;
    const supabase = getSupabase();
    if (!supabase) return;

    const existente = metas.find(
      (m) => m.pessoa === pessoaSelecionada && m.tipo === tipo && m.data === diaSelecionado
    );

    if (existente) {
      // Remove (toggle off)
      setMetas((prev) => prev.filter((m) => m.id !== existente.id));
      const { error } = await supabase.from("metas").delete().eq("id", existente.id);
      if (error) {
        setErroAcao(error.message);
        setMetas((prev) => [...prev, existente]);
      }
      return;
    }

    // Insere (toggle on)
    const otimista: Meta = {
      id: `tmp-${Date.now()}-${Math.random()}`,
      pessoa: pessoaSelecionada,
      tipo,
      data: diaSelecionado,
    };
    setMetas((prev) => [...prev, otimista]);
    dispararConfete(TIPO_META_COLORS[tipo]);
    setPopPersonId(pessoaSelecionada);
    setPopDayKey(diaSelecionado);
    setTimeout(() => {
      setPopPersonId(null);
      setPopDayKey(null);
    }, 650);

    const { data, error } = await supabase
      .from("metas")
      .insert({ pessoa: pessoaSelecionada, tipo, data: diaSelecionado })
      .select()
      .single();

    if (error) {
      setErroAcao(error.message);
      setMetas((prev) => prev.filter((m) => m.id !== otimista.id));
    } else if (data) {
      setMetas((prev) => prev.map((m) => (m.id === otimista.id ? (data as Meta) : m)));
    }
  }

  function irParaMesAnterior() {
    setMes((m) => {
      if (m === 0) {
        setAno((a) => a - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function irParaProximoMes() {
    setMes((m) => {
      if (m === 11) {
        setAno((a) => a + 1);
        return 0;
      }
      return m + 1;
    });
  }

  const dataLabelModal = diaSelecionado
    ? (() => {
        const [, m, d] = diaSelecionado.split("-").map(Number);
        return `${d} de ${MESES[m - 1]}`;
      })()
    : "";

  if (!configurado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700">
        <div className="max-w-lg w-full rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 text-center shadow-2xl">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <SettingsIcon size={30} />
            <h1 className="text-3xl font-black text-white">Configuração pendente</h1>
          </div>
          <p className="text-white/80 leading-relaxed">
            As variáveis <code className="bg-black/30 px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            e <code className="bg-black/30 px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> não
            foram definidas.
          </p>
          <p className="text-white/70 mt-3 text-sm">
            Preencha o arquivo <code className="bg-black/30 px-1.5 py-0.5 rounded">.env.local</code> na raiz
            do projeto com os valores do seu projeto Supabase e reinicie o servidor.
          </p>
        </div>
      </div>
    );
  }

  const pessoaAtual = getPessoa(pessoaSelecionada)!;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-800 via-purple-700 to-fuchsia-600 bg-fixed">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        <header className="text-center">
          <p className="text-white/90 text-lg sm:text-2xl font-semibold tracking-tight">
            Selecione quem está batendo a meta e marque no calendário
          </p>
        </header>

        {erroAcao && (
          <div className="rounded-2xl bg-red-500/20 border border-red-400/40 text-white px-4 py-3 text-sm">
            Ops, algo deu errado: {erroAcao}
          </div>
        )}

        <PersonSelector
          selecionado={pessoaSelecionada}
          onSelect={setPessoaSelecionada}
          popId={popPersonId}
        />

        <Calendar
          year={ano}
          month={mes}
          metas={metas}
          onPrevMonth={irParaMesAnterior}
          onNextMonth={irParaProximoMes}
          onDayClick={setDiaSelecionado}
          poppingKey={popDayKey}
        />

        {carregando ? (
          <div className="text-center text-white/70 py-8 font-medium">Carregando metas…</div>
        ) : erroCarregamento ? (
          <div className="w-full rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 sm:p-8 flex flex-col items-center gap-3 text-center">
            <p className="text-white font-semibold">{erroCarregamento}</p>
            <button
              onClick={tentarNovamenteCarregar}
              className="rounded-full px-5 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <Ranking metas={metas} ano={anoAtualParaGraficos} />
            <ChartsSection metas={metas} ano={anoAtualParaGraficos} />
          </>
        )}
      </div>

      {diaSelecionado && (
        <GoalTypeModal
          aberto={!!diaSelecionado}
          pessoa={pessoaAtual}
          dateLabel={dataLabelModal}
          tiposMarcados={tiposMarcadosNoDia}
          onToggle={handleToggle}
          onClose={() => setDiaSelecionado(null)}
        />
      )}
    </div>
  );
}
