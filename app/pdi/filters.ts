/**
 * Filtros de Imagem
 *
 * ATENÇÃO: Nenhuma manipulação de imagem está implementada.
 * Implemente a lógica matemática dos algoritmos aqui no próximo encontro.
 */

export function grayscale(imageData?: ImageData | null): ImageData | null {
  console.log("[PDI - Filtros] grayscale chamado");
  // TODO: Implementar conversão para escala de cinza
  return imageData || null;
}

export function passaBaixa(imageData?: ImageData | null): ImageData | null {
  console.log("[PDI - Filtros] passaBaixa chamado");
  // TODO: Implementar filtro passa baixa (ex: filtro da média, gaussiano)
  return imageData || null;
}

export function passaAlta(imageData?: ImageData | null): ImageData | null {
  console.log("[PDI - Filtros] passaAlta chamado");
  // TODO: Implementar filtro passa alta (ex: realce de bordas, laplaciano, sobel)
  return imageData || null;
}

export function threshold(
  imageData?: ImageData | null,
  limiar: number = 128,
): ImageData | null {
  console.log("[PDI - Filtros] threshold chamado", { limiar });
  // TODO: Implementar limiarização / binarização de imagem
  return imageData || null;
}
