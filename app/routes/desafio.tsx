import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { Route } from "./+types/desafio";
import { AuthorsHeader } from "../components/AuthorsHeader";
import {
  ChallengeOne,
  ChallengeTwo,
  ChallengeThree,
  ChallengeFour,
} from "../components/desafios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PDI - Desafios" },
    {
      name: "description",
      content: "Desafios de Processamento Digital de Imagens - Feevale.",
    },
  ];
}

const TABS = [
  { label: "Desafio 1", Component: ChallengeOne },
  { label: "Desafio 2", Component: ChallengeTwo },
  { label: "Desafio 3", Component: ChallengeThree },
  { label: "Desafio 4", Component: ChallengeFour },
];

export default function Desafio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const ActiveComponent = TABS[activeTab].Component;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <AuthorsHeader authorName="Pedro Henrique Knorst" />

      {/* Barra superior: voltar + título */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-800 bg-slate-900/60">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <h2 className="text-sm font-bold text-white">DESAFIOS</h2>
      </div>

      {/* Abas */}
      <div className="flex items-center gap-1 px-6 pt-4 border-b border-slate-800">
        {TABS.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 ${
              activeTab === index
                ? "text-white border-indigo-500 bg-slate-900/80"
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
