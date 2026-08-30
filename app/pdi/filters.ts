/**
 * Filtros de Imagem
 *
 * ATENÇÃO: Implemente a lógica matemática dos algoritmos aqui no próximo encontro.
 */

import { PDIImage, wrapPDIImage } from "./helpers";

export function grayscale(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Filtros] grayscale chamado");
  // TODO: Implementar conversão para escala de cinza
  if (!imageInput) return null;
  return imageInput instanceof PDIImage ? imageInput.clone() : wrapPDIImage(imageInput);
}

export function passaBaixa(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Filtros] passaBaixa chamado");
  // TODO: Implementar filtro passa baixa (ex: filtro da média, gaussiano)
  if (!imageInput) return null;
  return imageInput instanceof PDIImage ? imageInput.clone() : wrapPDIImage(imageInput);
}

export function passaAlta(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Filtros] passaAlta chamado");
  // TODO: Implementar filtro passa alta (ex: realce de bordas, laplaciano, sobel)
  if (!imageInput) return null;
  return imageInput instanceof PDIImage ? imageInput.clone() : wrapPDIImage(imageInput);
}

export function threshold(
  imageInput?: PDIImage | ImageData | null,
  limiar: number = 128
): PDIImage | null {
  console.log("[PDI - Filtros] threshold chamado", { limiar });
  // TODO: Implementar limiarização / binarização de imagem
  if (!imageInput) return null;
  return imageInput instanceof PDIImage ? imageInput.clone() : wrapPDIImage(imageInput);
}
