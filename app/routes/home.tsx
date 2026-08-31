import { useState, useRef } from "react";
import type { Route } from "./+types/home";
import { AuthorsHeader } from "../components/AuthorsHeader";
import { Navbar } from "../components/Navbar";
import { ImageViewer } from "../components/ImageViewer";
import { AboutModal } from "../components/AboutModal";
import {
  TransladarModal,
  RotacionarModal,
  EspelharModal,
  RedimensionarModal,
  GrayscaleModal,
  PassaBaixaModal,
  PassaAltaModal,
  ThresholdModal,
  DilatacaoModal,
  ErosaoModal,
  AberturaModal,
  FechamentoModal,
  AfinamentoModal,
  DesafioModal,
} from "../components/modals";
import {
  PDIImage,
  transladar,
  rotacionar,
  espelhar,
  redimensionar,
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
  const authorName = "Pedro Henrique Knorst";

  // Estados únicos de imagem
  const [originalImage, setOriginalImage] = useState<PDIImage | null>(null);
  const [modifiedImage, setModifiedImage] = useState<PDIImage | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [lastOperationName, setLastOperationName] = useState<string | null>(null);

  // Estados de Modais
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Estados de Loading
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState<string>("Processando...");

  // Input invisível de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper para executar operações de forma assíncrona com loading
  const runOperation = (operationName: string, opFn: () => PDIImage | null) => {
    if (!originalImage) return;

    setIsProcessing(true);
    setProcessingText(`Aplicando ${operationName}...`);
    setLastOperationName(operationName);

    setTimeout(() => {
      try {
        const result = opFn();
        if (result) {
          setModifiedImage(result);
        }
      } catch (err) {
        console.error(`Erro ao executar ${operationName}:`, err);
      } finally {
        setIsProcessing(false);
      }
    }, 40);
  };

  // 1. Carregar arquivo
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
          setModifiedImage(pdi.clone());
          setFileName(file.name);
          setLastOperationName(null);
          setIsProcessing(false);
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

  // 2. Salvar / Download MANUAL
  const handleSalvarImagem = () => {
    if (!modifiedImage) return;
    const link = document.createElement("a");
    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "imagem";
    link.download = `${baseName}_modificada.png`;
    link.href = modifiedImage.toDataURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Sair / Limpar tela
  const handleSair = () => {
    if (
      originalImage &&
      !window.confirm("Deseja realmente limpar as imagens carregadas?")
    ) {
      return;
    }
    setOriginalImage(null);
    setModifiedImage(null);
    setFileName(null);
    setLastOperationName(null);
    setIsProcessing(false);
  };

  // =========================================================================
  // HANDLERS PARA ABRIR O MODAL DE CADA OPERAÇÃO
  // =========================================================================
  const openModal = (modalName: string) => {
    if (!originalImage) {
      alert("Por favor, abra uma imagem primeiro pelo menu Arquivo > Abrir imagem.");
      return;
    }
    setActiveModal(modalName);
  };

  const imageDimensions = originalImage
    ? { width: originalImage.getWidth(), height: originalImage.getHeight() }
    : null;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Input invisível de arquivo */}
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
        onAbrirImagem={handleOpenFilePicker}
        onSalvarImagem={handleSalvarImagem}
        onSobre={() => setIsAboutOpen(true)}
        onSair={handleSair}
        onTransladar={() => openModal("transladar")}
        onRotacionar={() => openModal("rotacionar")}
        onEspelhar={() => openModal("espelhar")}
        onRedimensionar={() => openModal("redimensionar")}
        onGrayscale={() => openModal("grayscale")}
        onPassaBaixa={() => openModal("passaBaixa")}
        onPassaAlta={() => openModal("passaAlta")}
        onThreshold={() => openModal("threshold")}
        onDilatacao={() => openModal("dilatacao")}
        onErosao={() => openModal("erosao")}
        onAbertura={() => openModal("abertura")}
        onFechamento={() => openModal("fechamento")}
        onAfinamento={() => openModal("afinamento")}
        onDesafio={() => openModal("desafio")}
      />

      {/* 3. Painel Principal Lado a Lado (Original vs Modificada) */}
      <ImageViewer
        originalImageSrc={originalImage?.toDataURL() ?? null}
        modifiedImageSrc={modifiedImage?.toDataURL() ?? null}
        imageDimensions={imageDimensions}
        fileName={fileName}
        lastOperationName={lastOperationName}
        isProcessing={isProcessing}
        processingText={processingText}
        onUploadImage={handleLoadImageFile}
        onTriggerFileInput={handleOpenFilePicker}
        onSaveImage={handleSalvarImagem}
      />

      {/* Modal Sobre */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        authorName={authorName}
      />

      {/* ========================================================================= */}
      {/* MODAIS DE CONFIGURAÇÃO DE CADA OPERAÇÃO */}
      {/* ========================================================================= */}
      <TransladarModal
        isOpen={activeModal === "transladar"}
        onClose={() => setActiveModal(null)}
        onApply={(dx, dy) => {
          runOperation("Transladar", () => transladar(originalImage, dx, dy));
        }}
      />

      <RotacionarModal
        isOpen={activeModal === "rotacionar"}
        onClose={() => setActiveModal(null)}
        onApply={(angle) => {
          runOperation("Rotacionar", () => rotacionar(originalImage, angle));
        }}
      />

      <EspelharModal
        isOpen={activeModal === "espelhar"}
        onClose={() => setActiveModal(null)}
        onApply={(axis: "horizontal" | "vertical") => {
          runOperation("Espelhar", () => espelhar(originalImage, axis));
        }}
      />

      <RedimensionarModal
        isOpen={activeModal === "redimensionar"}
        onClose={() => setActiveModal(null)}
        onApply={(sizex, sizey) => {
          runOperation("Redimensionar", () => redimensionar(originalImage, sizex, sizey));
        }}
      />

      <GrayscaleModal
        isOpen={activeModal === "grayscale"}
        onClose={() => setActiveModal(null)}
        onApply={() => {
          runOperation("Grayscale", () => grayscale(originalImage));
        }}
      />

      <PassaBaixaModal
        isOpen={activeModal === "passaBaixa"}
        onClose={() => setActiveModal(null)}
        onApply={() => {
          runOperation("Passa Baixa", () => passaBaixa(originalImage));
        }}
      />

      <PassaAltaModal
        isOpen={activeModal === "passaAlta"}
        onClose={() => setActiveModal(null)}
        onApply={() => {
          runOperation("Passa Alta", () => passaAlta(originalImage));
        }}
      />

      <ThresholdModal
        isOpen={activeModal === "threshold"}
        onClose={() => setActiveModal(null)}
        onApply={() => {
          runOperation("Threshold", () => threshold(originalImage));
        }}
      />

      <DilatacaoModal
        isOpen={activeModal === "dilatacao"}
        onClose={() => setActiveModal(null)}
        onApply={() => {
          runOperation("Dilatação", () => dilatacao(originalImage));
        }}
      />

      <ErosaoModal
        isOpen={activeModal === "erosao"}
        onClose={() => setActiveModal(null)}
        onApply={() => {
          runOperation("Erosão", () => erosao(originalImage));
        }}
      />

      <AberturaModal
        isOpen={activeModal === "abertura"}
        onClose={() => setActiveModal(null)}
        onApply={() => {
          runOperation("Abertura", () => abertura(originalImage));
        }}
      />

      <FechamentoModal
        isOpen={activeModal === "fechamento"}
        onClose={() => setActiveModal(null)}
        onApply={() => {
          runOperation("Fechamento", () => fechamento(originalImage));
        }}
      />

      <AfinamentoModal
        isOpen={activeModal === "afinamento"}
        onClose={() => setActiveModal(null)}
        onApply={() => {
          runOperation("Afinamento", () => afinamento(originalImage));
        }}
      />

      <DesafioModal
        isOpen={activeModal === "desafio"}
        onClose={() => setActiveModal(null)}
        onApply={() => {
          runOperation("DESAFIO", () => desafio(originalImage));
        }}
      />
    </div>
  );
}
