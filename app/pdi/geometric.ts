/**
 * Transformações Geométricas
 *
 * ATENÇÃO: Implemente a lógica matemática dos algoritmos aqui no próximo encontro.
 */

import { PDIImage, wrapPDIImage, createPDIImage } from "./helpers";

function transform(
  image: PDIImage,
  resultImage: PDIImage,
  kernel: number[][],
): void {
  for (let c = 0; c < image.getChannelCount(); c++) {
    for (let x = 0; x < image.getWidth(); x++) {
      for (let y = 0; y < image.getHeight(); y++) {
        applyKernel(image, resultImage, kernel, c, x, y);
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

  if (
    newX < image.getWidth() &&
    newY < image.getHeight() &&
    newX >= 0 &&
    newY >= 0
  ) {
    resultImage.set(channel, x, y, image.get(channel, Math.round(newX), Math.round(newY)));
  }
}

export function transladar(
  imageData?: ImageData | PDIImage | null,
  dx: number = 0,
  dy: number = 0,
): PDIImage | null {
  if (!imageData) {
    return null;
  }
  console.log("[PDI - Geométricas] transladar chamado", { dx, dy });

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
  if (!imageData) {
    return null;
  }

  console.log("[PDI - Geométricas] rotacionar chamado", { angleDegrees });

  function toRad(value: number) {
    return (value * Math.PI) / 180;
  }

  const image =
    imageData instanceof PDIImage ? imageData : wrapPDIImage(imageData);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());
  transform(image, resultImage, [
    [Math.cos(toRad(angleDegrees)), Math.sin(toRad(angleDegrees)), 0],
    [-Math.sin(toRad(angleDegrees)), Math.cos(toRad(angleDegrees)), 0],
    [0, 0, 1],
  ]);
  return resultImage || null;
}

export function espelhar(
  imageData?: ImageData | PDIImage | null,
  axis: "horizontal" | "vertical" = "horizontal",
): PDIImage | null {
  if (!imageData) {
    return null;
  }
  console.log("[PDI - Geométricas] espelhar chamado", { axis });

  const image =
    imageData instanceof PDIImage ? imageData : wrapPDIImage(imageData);

  const resultImage = createPDIImage(image.getWidth(), image.getHeight());

  const horizontalKernel = [
    [-1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  const verticalKernel = [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ];

  transform(
    image,
    resultImage,
    axis === "horizontal" ? horizontalKernel : verticalKernel,
  );

  return resultImage;
}

export function redimensionar(
  imageData?: ImageData | PDIImage | null,
  sizeX: number = 150,
  sizeY: number = 150,
): PDIImage | null {
  if (!imageData) {
    return null;
  }

  console.log("[PDI - Geométricas] redimensionar chamado", { sizeX, sizeY });

  const image =
    imageData instanceof PDIImage ? imageData : wrapPDIImage(imageData);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());

  const scaleX = sizeX / 100;
  const scaleY = sizeY / 100;

  transform(image, resultImage, [
    [1 / scaleX, 0, 0],
    [0, 1 / scaleY, 0],
    [0, 0, 1],
  ]);

  return resultImage;
}
