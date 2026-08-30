import React from "react";
import { User, Sparkles } from "lucide-react";

interface AuthorsHeaderProps {
  authorName?: string;
}

export function AuthorsHeader({ authorName = "Pedro Henrique Knorst" }: AuthorsHeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Project Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-inner flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Processamento Digital de Imagens
              <span className="text-xs bg-indigo-500/20 text-indigo-300 font-medium px-2 py-0.5 rounded border border-indigo-500/30">
                PDI
              </span>
            </h1>
            <p className="text-xs text-slate-400">Manipulador de Imagens - Feevale</p>
          </div>
        </div>

        {/* Author Display (Static) */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/70 px-3.5 py-1.5 rounded-lg shadow-sm">
          <User className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0">
            Autor:
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-slate-100 bg-slate-700/70 px-2.5 py-0.5 rounded border border-slate-600/50">
            {authorName}
          </span>
        </div>
      </div>
    </header>
  );
}
