/**
 * Filtros de Imagem
 *
 * ATENÇÃO: Implemente a lógica matemática dos algoritmos aqui no próximo encontro.
 */

import { createPDIImage, PDIImage, wrapPDIImage } from "./helpers";

function transform(
  image: PDIImage,
  resultImage: PDIImage,
  brightness: number = 0,
  contrast: number = 1,
  grayscale: boolean = false,
): void {
  for (let c = 0; c < image.getChannelCount(); c++) {
    for (let x = 0; x < image.getWidth(); x++) {
      for (let y = 0; y < image.getHeight(); y++) {
        applyFilter(
          image,
          resultImage,
          c,
          x,
          y,
          brightness,
          contrast,
          grayscale,
        );
      }
    }
  }
}

function convulseBaixa(
  kernel: number[][],
  image: PDIImage,
  resultImage: PDIImage,
  calcConvulse: (z: number) => number,
) {
  for (let c = 0; c < image.getChannelCount(); c++) {
    for (let x = 1; x < image.getWidth(); x++) {
      for (let y = 1; y < image.getHeight(); y++) {
        let z = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const pixelValue = image.get(c, x + i - 1, y + j - 1);
            z += kernel[i][j] * pixelValue;
          }
        }

        let newValue = calcConvulse(z);

        if (newValue < 0) newValue = 0;
        if (newValue > 255) newValue = 255;

        resultImage.set(c, x, y, newValue);
      }
    }
  }
  return resultImage;
}

function convulseAltaSobel(
  kernelY: number[][],
  kernelX: number[][],
  image: PDIImage,
  resultImage: PDIImage,
  threshold: number = 0,
) {
  for (let c = 0; c < image.getChannelCount(); c++) {
    for (let x = 1; x < image.getWidth(); x++) {
      for (let y = 1; y < image.getHeight(); y++) {
        let gx = 0;
        let gy = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const pixelValue = image.get(c, x + i - 1, y + j - 1);
            gx += kernelY[i][j] * pixelValue;
            gy += kernelX[i][j] * pixelValue;
          }
        }

        let g = Math.sqrt(gx * gx + gy * gy);

        let newValue = 0;

        if (g > threshold) newValue = 255;

        resultImage.set(c, x, y, newValue);
      }
    }
  }
  return resultImage;
}

function convulseAltaRobinson(
  mask1: number[][],
  mask2: number[][],
  mask3: number[][],
  mask4: number[][],
  mask5: number[][],
  mask6: number[][],
  mask7: number[][],
  mask8: number[][],
  image: PDIImage,
  resultImage: PDIImage,
  threshold: number = 0,
) {
  for (let c = 0; c < image.getChannelCount(); c++) {
    for (let x = 1; x < image.getWidth(); x++) {
      for (let y = 1; y < image.getHeight(); y++) {
        let gm1 = 0;
        let gm2 = 0;
        let gm3 = 0;
        let gm4 = 0;
        let gm5 = 0;
        let gm6 = 0;
        let gm7 = 0;
        let gm8 = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const pixelValue = image.get(c, x + i - 1, y + j - 1);
            gm1 += mask1[i][j] * pixelValue;
            gm2 += mask2[i][j] * pixelValue;
            gm3 += mask3[i][j] * pixelValue;
            gm4 += mask4[i][j] * pixelValue;
            gm5 += mask5[i][j] * pixelValue;
            gm6 += mask6[i][j] * pixelValue;
            gm7 += mask7[i][j] * pixelValue;
            gm8 += mask8[i][j] * pixelValue;
          }
        }

        let g = gm1;

        if (gm2 > g) g = gm2;
        if (gm3 > g) g = gm3;
        if (gm4 > g) g = gm4;
        if (gm5 > g) g = gm5;
        if (gm6 > g) g = gm6;
        if (gm7 > g) g = gm7;
        if (gm8 > g) g = gm8;

        let newValue = 0;

        if (g > threshold) newValue = 255;

        resultImage.set(c, x, y, newValue);
      }
    }
  }
  return resultImage;
}

function applyFilter(
  image: PDIImage,
  resultImage: PDIImage,
  channel: number,
  x: number,
  y: number,
  brightness: number,
  contrast: number,
  grayscale: boolean = false,
) {
  const pixelValue = image.get(channel, x, y);

  let value = contrast * pixelValue + brightness;

  if (grayscale) {
    const red = image.get(0, x, y);
    const green = image.get(1, x, y);
    const blue = image.get(2, x, y);
    value = 0.2125 * red + 0.7154 * green + 0.0721 * blue;
  }

  resultImage.set(channel, x, y, value);
}

export function grayscale(
  imageData?: PDIImage | ImageData | null,
): PDIImage | null {
  console.log("[PDI - Filtros] grayscale chamado");
  if (!imageData) return null;

  const image =
    imageData instanceof PDIImage ? imageData : wrapPDIImage(imageData);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());

  transform(image, resultImage, 0, 1, true);

  return resultImage;
}

export function brilho(
  imageData?: ImageData | PDIImage | null,
  level: number = 0,
): PDIImage | null {
  console.log("[PDI - Filtros] brilho chamado");
  if (!imageData) return null;

  const image =
    imageData instanceof PDIImage ? imageData : wrapPDIImage(imageData);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());

  transform(image, resultImage, level);

  return resultImage;
}

export function contraste(
  imageData?: ImageData | PDIImage | null,
  level: number = 1,
): PDIImage | null {
  console.log("[PDI - Filtros] contraste chamado");
  if (!imageData) return null;

  const image =
    imageData instanceof PDIImage ? imageData : wrapPDIImage(imageData);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());

  transform(image, resultImage, 0, level);

  return resultImage;
}

export function passaBaixa(
  imageData?: PDIImage | ImageData | null,
  methodType: "gaussian" | "average" = "gaussian",
): PDIImage | null {
  console.log("[PDI - Filtros] passaBaixa chamado");
  if (!imageData) return null;

  const image =
    imageData instanceof PDIImage ? imageData : wrapPDIImage(imageData);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());

  let kernel = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1],
  ];

  if (methodType === "average") {
    kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
  }

  const calcConvulseGaussiano = (z: number) => z / 16;

  const calcConvulseMedia = (z: number) => z / 9;

  const calcConvulse =
    methodType === "gaussian" ? calcConvulseGaussiano : calcConvulseMedia;

  convulseBaixa(kernel, image, resultImage, calcConvulse);

  return resultImage;
}

export function passaAlta(
  imageData?: PDIImage | ImageData | null,
  methodType: "sobel" | "robinson" = "sobel",
  threshold: number = 128,
): PDIImage | null {
  console.log("[PDI - Filtros] passaAlta chamado");
  if (!imageData) return null;

  const image =
    imageData instanceof PDIImage ? imageData : wrapPDIImage(imageData);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());

  if (methodType === "sobel") {
    const kernelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];

    const kernelY = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1],
    ];

    convulseAltaSobel(kernelY, kernelX, image, resultImage, threshold);
  } else {
    const kernel1 = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];

    const kernel2 = [
      [0, 1, 2],
      [-1, 0, 1],
      [-2, -1, 0],
    ];

    const kernel3 = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1],
    ];

    const kernel4 = [
      [2, 1, 0],
      [1, 0, -1],
      [0, -1, -2],
    ];

    const kernel5 = [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1],
    ];

    const kernel6 = [
      [0, -1, -2],
      [1, 0, -1],
      [2, 1, 0],
    ];

    const kernel7 = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ];

    const kernel8 = [
      [-2, -1, 0],
      [-1, 0, 1],
      [0, 1, 2],
    ];

    convulseAltaRobinson(
      kernel1,
      kernel2,
      kernel3,
      kernel4,
      kernel5,
      kernel6,
      kernel7,
      kernel8,
      image,
      resultImage,
      threshold,
    );
  }

  return resultImage;
}
