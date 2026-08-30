import { useState, useRef, useEffect } from "react";
import type { Route } from "./+types/home";
import { AuthorsHeader } from "../components/AuthorsHeader";
import { Navbar } from "../components/Navbar";
import { ImageViewer } from "../components/ImageViewer";
import { AboutModal } from "../components/AboutModal";
import {
  transladar,
  rotacionar,
  espelhar,
  aumentar,
  diminuir,
  grayscale,
  passaBaixa,
  passaAlta,
  threshold,
  dilatacao,
  erosao,
  abertura,
  fechamento,
  afinamento,
  desafio,
} from "../pdi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PDI - Manipulador de Imagens" },
    {
      name: "description",
      content:
        "Interface para Processamento Digital de Imagens - Feevale. Visualização lado a lado (Original vs Modificada).",
    },
  ];
}

export default function Home() {
  // Nome do autor
  const authorName = "Pedro Henrique Knorst";

  // Estados das Imagens
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [modifiedImageSrc, setModifiedImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Status visual da última opção selecionada (apenas informativo na tela)
  const [lastOperationName, setLastOperationName] = useState<string | null>(null);

  // Modal Sobre
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Input de arquivo invisível para o sistema de arquivos do computador
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar imagem
  const handleLoadImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          setOriginalImageSrc(result);
          setModifiedImageSrc(result);
          setFileName(file.name);
          setLastOperationName(null);
        };
        img.src = result;
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

  // =========================================================================
  // FUNÇÕES ESPECÍFICAS DE CADA OPÇÃO DOS MENUS
  // Importadas de "app/pdi/" para que você possa implementar sua lógica lá.
  // =========================================================================

  // --- 1. MENU ARQUIVO ---
  const handleAbrirImagem = () => {
    console.log("Ação: Abrir Imagem");
    handleOpenFilePicker();
  };

  const handleSalvarImagem = () => {
    console.log("Ação: Salvar Imagem");
    if (!modifiedImageSrc) return;
    const link = document.createElement("a");
    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "imagem";
    link.download = `${baseName}_modificada.png`;
    link.href = modifiedImageSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSobre = () => {
    console.log("Ação: Sobre");
    setIsAboutOpen(true);
  };

  const handleSair = () => {
    console.log("Ação: Sair");
    if (
      originalImageSrc &&
      !window.confirm("Deseja realmente limpar as imagens carregadas?")
    ) {
      return;
    }
    setOriginalImageSrc(null);
    setModifiedImageSrc(null);
    setFileName(null);
    setImageDimensions(null);
    setLastOperationName(null);
  };

  // --- 2. MENU TRANSFORMAÇÕES GEOMÉTRICAS ---
  const handleTransladar = () => {
    setLastOperationName("Transladar");
    transladar();
  };

  const handleRotacionar = () => {
    setLastOperationName("Rotacionar");
    rotacionar();
  };

  const handleEspelhar = () => {
    setLastOperationName("Espelhar");
    espelhar();
  };

  const handleAumentar = () => {
    setLastOperationName("Aumentar");
    aumentar();
  };

  const handleDiminuir = () => {
    setLastOperationName("Diminuir");
    diminuir();
  };

  // --- 3. MENU FILTROS ---
  const handleGrayscale = () => {
    setLastOperationName("Grayscale");
    grayscale();
  };

  const handlePassaBaixa = () => {
    setLastOperationName("Passa Baixa");
    passaBaixa();
  };

  const handlePassaAlta = () => {
    setLastOperationName("Passa Alta");
    passaAlta();
  };

  const handleThreshold = () => {
    setLastOperationName("Threshold");
    threshold();
  };

  // --- 4. MENU MORFOLOGIA MATEMÁTICA ---
  const handleDilatacao = () => {
    setLastOperationName("Dilatação");
    dilatacao();
  };

  const handleErosao = () => {
    setLastOperationName("Erosão");
    erosao();
  };

  const handleAbertura = () => {
    setLastOperationName("Abertura");
    abertura();
  };

  const handleFechamento = () => {
    setLastOperationName("Fechamento");
    fechamento();
  };

  const handleAfinamento = () => {
    setLastOperationName("Afinamento");
    afinamento();
  };

  // --- 5. MENU EXTRAÇÃO DE CARACTERÍSTICAS ---
  const handleDesafio = () => {
    setLastOperationName("DESAFIO");
    desafio();
  };

  // Atalhos de teclado (Ctrl+O, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "o") {
        e.preventDefault();
        handleAbrirImagem();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (modifiedImageSrc) {
          handleSalvarImagem();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modifiedImageSrc]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/bmp,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* 1. Cabeçalho Superior com Nome do Autor */}
      <AuthorsHeader authorName={authorName} />

      {/* 2. Barra de Menus com Dropdowns */}
      <Navbar
        onAbrirImagem={handleAbrirImagem}
        onSalvarImagem={handleSalvarImagem}
        onSobre={handleSobre}
        onSair={handleSair}
        onTransladar={handleTransladar}
        onRotacionar={handleRotacionar}
        onEspelhar={handleEspelhar}
        onAumentar={handleAumentar}
        onDiminuir={handleDiminuir}
        onGrayscale={handleGrayscale}
        onPassaBaixa={handlePassaBaixa}
        onPassaAlta={handlePassaAlta}
        onThreshold={handleThreshold}
        onDilatacao={handleDilatacao}
        onErosao={handleErosao}
        onAbertura={handleAbertura}
        onFechamento={handleFechamento}
        onAfinamento={handleAfinamento}
        onDesafio={handleDesafio}
      />

      {/* 3. Painel Principal Lado a Lado (Original vs Modificada) */}
      <ImageViewer
        originalImageSrc={originalImageSrc}
        modifiedImageSrc={modifiedImageSrc}
        imageDimensions={imageDimensions}
        fileName={fileName}
        lastOperationName={lastOperationName}
        onUploadImage={handleLoadImageFile}
        onTriggerFileInput={handleOpenFilePicker}
      />

      {/* Modal Sobre */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        authorName={authorName}
      />
    </div>
  );
}
