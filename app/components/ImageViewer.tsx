import React, { useState } from "react";
import {
  UploadCloud,
  ImageIcon,
  Maximize,
  Sparkles,
  ArrowRight,
  Download,
  Loader2,
} from "lucide-react";

interface ImageViewerProps {
  originalImageSrc: string | null;
  modifiedImageSrc: string | null;
  imageDimensions: { width: number; height: number } | null;
  fileName: string | null;
  lastOperationName: string | null;
  isProcessing?: boolean;
  processingText?: string;
  onUploadImage: (file: File) => void;
  onTriggerFileInput: () => void;
  onSaveImage?: () => void;
}

export function ImageViewer({
  originalImageSrc,
  modifiedImageSrc,
  imageDimensions,
  fileName,
  lastOperationName,
  isProcessing = false,
  processingText = "Processando imagem...",
  onUploadImage,
  onTriggerFileInput,
  onSaveImage,
}: ImageViewerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fitMode, setFitMode] = useState<"contain" | "original">("contain");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onUploadImage(file);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-4 gap-4 overflow-hidden">
      {/* Viewport Control Bar */}
      <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-300">Visualização:</span>
          <button
            onClick={() => setFitMode(fitMode === "contain" ? "original" : "contain")}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded border border-slate-700/80 transition-colors cursor-pointer"
          >
            <Maximize className="w-3.5 h-3.5" />
            {fitMode === "contain" ? "Ajustar à Tela (Fit)" : "Tamanho Real (100%)"}
          </button>

          {isProcessing && (
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-950/80 border border-indigo-700/60 rounded-md text-indigo-300 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span className="font-medium text-xs">{processingText}</span>
            </div>
          )}
        </div>

        {fileName && imageDimensions && (
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-3 py-1 rounded text-slate-300">
            <span className="truncate max-w-xs" title={fileName}>
              <strong>Arquivo:</strong> {fileName}
            </span>
            <span className="text-slate-500">|</span>
            <span>
              <strong>Resolução:</strong> {imageDimensions.width} &times; {imageDimensions.height} px
            </span>
          </div>
        )}
      </div>

      {/* Main Split Panels */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        {/* Left Panel: Imagem Original */}
        <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-200">
                Imagem Original
              </h3>
            </div>
            {originalImageSrc && (
              <span className="text-[11px] bg-blue-950/60 text-blue-300 px-2 py-0.5 rounded border border-blue-800/40 font-medium">
                Entrada
              </span>
            )}
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 flex items-center justify-center p-4 relative overflow-auto transition-colors ${
              isDragging ? "bg-indigo-950/20 border-2 border-dashed border-indigo-500" : ""
            }`}
          >
            {originalImageSrc ? (
              <img
                src={originalImageSrc}
                alt="Imagem Original"
                className={`max-w-full rounded shadow-md transition-all ${
                  fitMode === "contain"
                    ? "max-h-[calc(100vh-280px)] object-contain"
                    : "object-none"
                }`}
              />
            ) : (
              <div className="text-center p-8 max-w-sm flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                  <UploadCloud className="w-8 h-8 text-indigo-400" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  Nenhuma imagem carregada
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Arraste e solte uma imagem aqui ou utilize o botão abaixo para abrir do seu computador.
                </p>
                <button
                  type="button"
                  onClick={onTriggerFileInput}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  Selecionar Imagem
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Imagem Modificada */}
        <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg relative">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-200">
                Imagem Modificada
              </h3>
              {lastOperationName && !isProcessing && (
                <span className="text-[11px] bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40 font-medium">
                  {lastOperationName}
                </span>
              )}
            </div>

            {modifiedImageSrc && onSaveImage && !isProcessing && (
              <button
                type="button"
                onClick={onSaveImage}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-medium rounded shadow transition-colors cursor-pointer"
                title="Salvar/Baixar Imagem Modificada"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Salvar Imagem</span>
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center p-4 relative overflow-auto">
            {/* Loading Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 z-20 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center gap-3 animate-in fade-in duration-150">
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <Sparkles className="w-6 h-6 text-indigo-400 absolute" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-100">{processingText}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Processando matriz de pixels...</p>
                </div>
              </div>
            )}

            {modifiedImageSrc ? (
              <img
                src={modifiedImageSrc}
                alt="Imagem Modificada"
                className={`max-w-full rounded shadow-md transition-all ${
                  fitMode === "contain"
                    ? "max-h-[calc(100vh-280px)] object-contain"
                    : "object-none"
                }`}
              />
            ) : (
              <div className="text-center p-8 max-w-sm flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                  <Sparkles className="w-8 h-8 text-emerald-400/70" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  Aguardando Processamento
                </h4>
                <p className="text-xs text-slate-400 mb-2">
                  Selecione uma transformação ou filtro no menu superior para visualizar o resultado aqui.
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span>Original</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>Transformações / Filtros</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
