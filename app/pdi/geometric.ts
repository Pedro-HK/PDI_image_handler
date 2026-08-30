/**
 * Transformações Geométricas
 *
 * ATENÇÃO: Implemente a lógica matemática dos algoritmos aqui no próximo encontro.
 */

import { PDIImage, wrapPDIImage, createPDIImage } from "./helpers";

export function transladar(
  imageData?: ImageData | PDIImage | null,
  dx: number = 0,
  dy: number = 0,
): PDIImage | null {
  if (!imageData) {
    return null;
  }
  console.log("[PDI - Geométricas] transladar chamado", { dx, dy });

  function transform(
    image: PDIImage,
    resultImage: PDIImage,
    kernel: number[][],
  ): void {
    for (let c = 0; c < image.getChannelCount(); c++) {
      for (let x = 0; x < image.getWidth(); x++) {
        for (let y = 0; y < image.getHeight(); y++) {
          applyKernel(image, resultImage, kernel, c, x, y, image.get(c, x, y));
        }
      }
    }
  }

  function applyKernel(
    image: PDIImage,
    resultImage: PDIImage,
    kernel: number[][],
    channel: number,
    x: number,
    y: number,
    value: number,
  ) {
    let halfX = image.getWidth() / 2;
    let halfY = image.getHeight() / 2;
    let tmpX = x - halfX;
    let tmpY = y - halfY;
    let newX = Math.round(
      tmpX * kernel[0][0] + tmpY * kernel[0][1] + 1 * kernel[0][2],
    );
    let newY = Math.round(
      tmpX * kernel[1][0] + tmpY * kernel[1][1] + 1 * kernel[1][2],
    );
    newX += halfX;
    newY += halfY;
    // Pixel position is right
    if (
      newX < image.getWidth() &&
      newY < image.getHeight() &&
      newX >= 0 &&
      newY >= 0
    ) {
      resultImage.set(channel, x, y, image.get(channel, newX, newY));
    }
  }

  const image =
    imageData instanceof PDIImage ? imageData : wrapPDIImage(imageData);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());
  transform(image, resultImage, [
    [1, 0, -dx],
    [0, 1, -dy],
    [0, 0, 1],
  ]);
  return resultImage || null;
}

export function rotacionar(
  imageData?: ImageData | PDIImage | null,
  angleDegrees: number = 90,
): PDIImage | null {
  console.log("[PDI - Geométricas] rotacionar chamado", { angleDegrees });
  // TODO: Implementar algoritmo de rotação de imagem
  return null;
}

export function espelhar(
  imageData?: ImageData | PDIImage | null,
  axis: "horizontal" | "vertical" = "horizontal",
): PDIImage | null {
  console.log("[PDI - Geométricas] espelhar chamado", { axis });
  // TODO: Implementar algoritmo de espelhamento de imagem
  return null;
}

export function aumentar(
  imageData?: ImageData | PDIImage | null,
  scaleFactor: number = 1.5,
): PDIImage | null {
  console.log("[PDI - Geométricas] aumentar chamado", { scaleFactor });
  // TODO: Implementar algoritmo de ampliação/escala up de imagem
  return null;
}

export function diminuir(
  imageData?: ImageData | PDIImage | null,
  scaleFactor: number = 0.5,
): PDIImage | null {
  console.log("[PDI - Geométricas] diminuir chamado", { scaleFactor });
  // TODO: Implementar algoritmo de redução/escala down de imagem
  return null;
}
