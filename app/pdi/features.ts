/**
 * Extração de Características
 *
 * ATENÇÃO: Implemente a lógica matemática do desafio aqui no próximo encontro.
 */

import { PDIImage, wrapPDIImage } from "./helpers";

export function desafio(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Extração] desafio chamado");
  // TODO: Implementar técnica de extração de características (DESAFIO a definir pelo professor)
  if (!imageInput) return null;
  return imageInput instanceof PDIImage ? imageInput.clone() : wrapPDIImage(imageInput);
}
