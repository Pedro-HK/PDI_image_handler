/**
 * Morfologia Matemática
 *
 * ATENÇÃO: Implemente a lógica matemática dos algoritmos aqui no próximo encontro.
 */

import { PDIImage, wrapPDIImage } from "./helpers";

export function dilatacao(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Morfologia] dilatacao chamada");
  // TODO: Implementar operação de dilatação
  if (!imageInput) return null;
  return imageInput instanceof PDIImage ? imageInput.clone() : wrapPDIImage(imageInput);
}

export function erosao(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Morfologia] erosao chamada");
  // TODO: Implementar operação de erosão
  if (!imageInput) return null;
  return imageInput instanceof PDIImage ? imageInput.clone() : wrapPDIImage(imageInput);
}

export function abertura(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Morfologia] abertura chamada");
  // TODO: Implementar operação de abertura (erosão seguida de dilatação)
  if (!imageInput) return null;
  return imageInput instanceof PDIImage ? imageInput.clone() : wrapPDIImage(imageInput);
}

export function fechamento(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Morfologia] fechamento chamado");
  // TODO: Implementar operação de fechamento (dilatação seguida de erosão)
  if (!imageInput) return null;
  return imageInput instanceof PDIImage ? imageInput.clone() : wrapPDIImage(imageInput);
}

export function afinamento(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Morfologia] afinamento chamado");
  // TODO: Implementar afinamento (skeletonization / thinning)
  if (!imageInput) return null;
  return imageInput instanceof PDIImage ? imageInput.clone() : wrapPDIImage(imageInput);
}
