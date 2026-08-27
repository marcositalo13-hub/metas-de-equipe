import { Pessoa } from "./types";

// Pessoas fixas da equipe — definidas em código, sem tabela de usuários no banco.
export const PESSOAS: Pessoa[] = [
  {
    id: "marcos",
    nome: "Marcos",
    placeholder: "/fotos/placeholder-marcos.svg",
    iniciais: "MA",
    corGradiente: ["#7C3AED", "#4F46E5"],
  },
  {
    id: "amanda",
    nome: "Amanda",
    placeholder: "/fotos/placeholder-amanda.svg",
    iniciais: "AM",
    corGradiente: ["#EC4899", "#8B5CF6"],
  },
  {
    id: "geovana",
    nome: "Geovana",
    placeholder: "/fotos/placeholder-geovana.svg",
    iniciais: "GE",
    corGradiente: ["#06B6D4", "#3B82F6"],
  },
];

export function getPessoa(id: string): Pessoa | undefined {
  return PESSOAS.find((p) => p.id === id);
}
