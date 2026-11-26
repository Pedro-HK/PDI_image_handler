import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { PDIImage } from "../../pdi";
import { analisarPorcas, type ResultadoPorcas } from "../../pdi/challenges/porcas";

/**
 * Desafio 1 — Controle de qualidade na metalúrgica.
 * Carrega a imagem como em home.tsx e mostra cada etapa do processamento.
 */
export function ChallengeOne() {
  const [originalImage, setOriginalImage] = useState<PDIImage | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [limiar, setLimiar] = useState(100);
  const [resultado, setResultado] = useState<ResultadoPorcas | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("Processando...");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = (image: PDIImage, limiarAtual: number) => {
    setIsProcessing(true);
    setProcessingText("Analisando porcas...");

    setTimeout(() => {
      try {
        setResultado(analisarPorcas(image, limiarAtual));
      } catch (err) {
        console.error("Erro ao analisar porcas:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 40);
  };

  const handleLoadImageFile = (file: File) => {
    setIsProcessing(true);
    setProcessingText("Carregando imagem...");

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const img = new Image();
        img.onload = () => {
          const pdi = PDIImage.fromImageElement(img);
          setOriginalImage(pdi);
          setFileName(file.name);
          runAnalysis(pdi, limiar);
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleLoadImageFile(files[0]);
    }
  };

  return (
    <div className="space-y-5">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/bmp,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div>
        <h2 className="text-base font-bold text-white">
          Desafio 1 — Controle de qualidade na metalúrgica
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Conta as porcas e calcula perímetro externo, perímetro interno e área
          do furo de cada uma.
        </p>
      </div>

      {/* Entrada + parâmetros */}
      <div className="flex flex-wrap items-end gap-4">
        <button
          type="button"
          onClick={handleOpenFilePicker}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          Abrir imagem
        </button>

        <div className="flex-1 min-w-48">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Limiar: <span className="text-indigo-400">{limiar}</span>
          </label>
          <input
            type="range"
            min="0"
            max="255"
            value={limiar}
            onChange={(e) => setLimiar(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        <button
          type="button"
          disabled={!originalImage || isProcessing}
          onClick={() => originalImage && runAnalysis(originalImage, limiar)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          Processar
        </button>
      </div>

      {fileName && <p className="text-xs text-slate-500">Arquivo: {fileName}</p>}

      {isProcessing && (
        <div className="flex items-center gap-2 text-xs text-indigo-300">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          {processingText}
        </div>
      )}

      {!originalImage && !isProcessing && (
        <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-xs text-slate-500 italic">
          Abra uma imagem de porcas para começar.
        </div>
      )}

      {/* Passo a passo */}
      {resultado && (
        <div className="grid gap-4 sm:grid-cols-2">
          {resultado.etapas.map((etapa) => (
            <div
              key={etapa.titulo}
              className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden"
            >
              <img
                src={etapa.imagem.toDataURL()}
                alt={etapa.titulo}
                className="w-full h-auto"
              />
              <div className="px-3 py-2">
                <div className="text-xs font-semibold text-white">{etapa.titulo}</div>
                <div className="text-[11px] text-slate-400">{etapa.descricao}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados */}
      {resultado && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white">
            Porcas encontradas: {resultado.porcas.length}
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-xs">
              <thead className="bg-slate-800/60 text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left">Porca</th>
                  <th className="px-3 py-2 text-right">Perímetro externo (px)</th>
                  <th className="px-3 py-2 text-right">Perímetro interno (px)</th>
                  <th className="px-3 py-2 text-right">Área do furo (px²)</th>
                </tr>
              </thead>
              <tbody>
                {resultado.porcas.map((p) => (
                  <tr key={p.id} className="border-t border-slate-800 text-slate-300">
                    <td className="px-3 py-2 font-semibold text-white">#{p.id}</td>
                    <td className="px-3 py-2 text-right">{p.perimetroExterno.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{p.perimetroInterno.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{p.areaFuro}</td>
                  </tr>
                ))}
                {resultado.porcas.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-3 text-center text-slate-500 italic">
                      Nenhuma medida ainda (implemente medirPorcas).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
