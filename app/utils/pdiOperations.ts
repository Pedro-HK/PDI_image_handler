/**
 * Módulo de Operações de Processamento Digital de Imagens (PDI)
 *
 * ATENÇÃO: Nenhuma manipulação de imagem está implementada aqui.
 * Este arquivo fornece a estrutura, tipagem e stubs para que você possa
 * implementar os algoritmos de transformação nos próximos encontros.
 */

export interface PDIOperationInfo {
  id: string;
  category: "arquivo" | "geometrica" | "filtro" | "morfologia" | "extracao";
  name: string;
  description: string;
}

export const PDI_OPERATIONS: Record<string, PDIOperationInfo> = {
  // Transformações Geométricas
  transladar: {
    id: "transladar",
    category: "geometrica",
    name: "Transladar",
    description:
      "Desloca a imagem horizontal e/ou verticalmente com base em parâmetros (dx, dy).",
  },
  rotacionar: {
    id: "rotacionar",
    category: "geometrica",
    name: "Rotacionar",
    description:
      "Aplica rotação angular (ex: 90°, 180°, 270° ou ângulo arbitrário em torno de um ponto).",
  },
  espelhar: {
    id: "espelhar",
    category: "geometrica",
    name: "Espelhar",
    description: "Espelha a imagem nos eixos horizontal ou vertical.",
  },
  aumentar: {
    id: "aumentar",
    category: "geometrica",
    name: "Aumentar (Escalar Up)",
    description:
      "Aumenta as dimensões da imagem através de interpolação (vizinho mais próximo, bilinear, etc.).",
  },
  diminuir: {
    id: "diminuir",
    category: "geometrica",
    name: "Diminuir (Escalar Down)",
    description:
      "Reduz as dimensões da imagem aplicando subamostragem ou interpolação.",
  },

  // Filtros
  grayscale: {
    id: "grayscale",
    category: "filtro",
    name: "Grayscale (Escala de Cinza)",
    description:
      "Converte a imagem colorida para escala de cinza (ex: média simples, luminância ponderada).",
  },
  passa_baixa: {
    id: "passa_baixa",
    category: "filtro",
    name: "Passa Baixa (Suavização)",
    description:
      "Aplica filtro de suavização/blur (ex: filtro da média, gaussiano, mediana).",
  },
  passa_alta: {
    id: "passa_alta",
    category: "filtro",
    name: "Passa Alta (Realce de Bordas)",
    description:
      "Aplica filtro de realce e detecção de bordas (ex: Laplaciano, Sobel, Prewitt, High-Boost).",
  },
  threshold: {
    id: "threshold",
    category: "filtro",
    name: "Threshold (Limiarização)",
    description:
      "Segmenta a imagem em binário (preto e branco) a partir de um valor de limiar T.",
  },

  // Morfologia Matemática
  dilatacao: {
    id: "dilatacao",
    category: "morfologia",
    name: "Dilatação",
    description:
      "Expande os limites dos objetos em primeiro plano usando um elemento estruturante.",
  },
  erosao: {
    id: "erosao",
    category: "morfologia",
    name: "Erosão",
    description:
      "Reduz ou desgasta os limites dos objetos em primeiro plano usando um elemento estruturante.",
  },
  abertura: {
    id: "abertura",
    category: "morfologia",
    name: "Abertura",
    description:
      "Aplica erosão seguida de dilatação para remover ruídos e saliências.",
  },
  fechamento: {
    id: "fechamento",
    category: "morfologia",
    name: "Fechamento",
    description:
      "Aplica dilatação seguida de erosão para preencher pequenos buracos e unir regiões.",
  },
  afinamento: {
    id: "afinamento",
    category: "morfologia",
    name: "Afinamento (Skeletonization/Thinning)",
    description:
      "Reduz as formas binárias a um esqueleto de espessura unitária.",
  },

  // Extração de Características
  desafio: {
    id: "desafio",
    category: "extracao",
    name: "DESAFIO",
    description:
      "Módulo de Extração de Características - Em definição pelo professor.",
  },
};

/**
 * Função de stub genérica para execução futura das técnicas.
 * NÃO manipula pixels no momento.
 */
export function executePDIOperationStub(
  operationId: string,
  sourceImageData?: ImageData | null,
): ImageData | null {
  // TODO: No próximo encontro, implementar os algoritmos de manipulação de ImageData aqui.
  console.log(
    `[PDI Stub] Operação acionada: ${operationId}. Nenhuma alteração aplicada.`,
  );
  return sourceImageData || null;
}
