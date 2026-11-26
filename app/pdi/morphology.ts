/**
 * Morfologia Matemática
 *
 * ATENÇÃO: Implemente a lógica matemática dos algoritmos aqui no próximo encontro.
 */

import { PDIImage, wrapPDIImage, createPDIImage } from "./helpers";

type Morph = "dilatacao" | "erosao";

function transform(image: PDIImage, resultImage: PDIImage, operation: Morph): void {
  for (let c = 0; c < image.getChannelCount(); c++) {
    for (let x = 0; x < image.getWidth(); x++) {
      for (let y = 0; y < image.getHeight(); y++) {
        applyMorphology(image, resultImage, operation, c, x, y);
      }
    }
  }
}

function applyMorphology(
  image: PDIImage,
  resultImage: PDIImage,
  operation: Morph,
  channel: number,
  x: number,
  y: number,
): void {
  let value = operation === "dilatacao" ? 255 : 0

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const nx = x + i
      const ny = y + j
      // ignora vizinhos fora da imagem (get() devolveria 0 e criaria uma moldura preta)
      if (nx < 0 || ny < 0 || nx >= image.getWidth() || ny >= image.getHeight()) continue

      let currentPixel = image.get(channel, nx, ny)

      if (operation === "dilatacao") {
        value = Math.min(value, currentPixel)
        continue
      }
      value = Math.max(value, currentPixel)
    }
  }

  resultImage.set(channel, x, y, value)
}

export function dilatacao(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Morfologia] dilatacao chamada");
  if (!imageInput) return null;

  const image =
    imageInput instanceof PDIImage ? imageInput : wrapPDIImage(imageInput);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());

  transform(image, resultImage, "dilatacao");

  return resultImage;
}

export function erosao(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Morfologia] erosao chamada");
  if (!imageInput) return null;

  const image =
    imageInput instanceof PDIImage ? imageInput : wrapPDIImage(imageInput);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());

  transform(image, resultImage, "erosao");

  return resultImage;
}

export function abertura(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Morfologia] abertura chamada")

  const image = erosao(imageInput)

  return dilatacao(image)
}

export function fechamento(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Morfologia] fechamento chamado");

  const image = dilatacao(imageInput)

  return erosao(image)
}

export function afinamento(
  imageInput?: PDIImage | ImageData | null
): PDIImage | null {
  console.log("[PDI - Morfologia] afinamento chamado");
  if (!imageInput) return null;

  const image =
    imageInput instanceof PDIImage ? imageInput : wrapPDIImage(imageInput);
  const resultImage = createPDIImage(image.getWidth(), image.getHeight());

  thin(image, resultImage);

  return resultImage;
}

// Afinamento Zhang-Suen
function thin(image: PDIImage, resultImage: PDIImage): void {
  const width = image.getWidth();
  const height = image.getHeight();

  // Objeto (pixel escuro) = 1, fundo (claro) = 0.
  const fg = toBinary(image, width, height);

  // Repete os dois sub-passos até nada mais ser removido.
  let changed = true;
  while (changed) {
    const first = thinningPass(fg, width, height, 0);
    const second = thinningPass(fg, width, height, 1);
    changed = first || second;
  }

  // Esqueleto em preto sobre fundo branco.
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const value = fg[y * width + x] === 1 ? 0 : 255;
      resultImage.set(0, x, y, value);
      resultImage.set(1, x, y, value);
      resultImage.set(2, x, y, value);
    }
  }
}

function toBinary(image: PDIImage, width: number, height: number): Uint8Array {
  const fg = new Uint8Array(width * height);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const luminance =
        0.2125 * image.get(0, x, y) +
        0.7154 * image.get(1, x, y) +
        0.0721 * image.get(2, x, y);
      fg[y * width + x] = luminance < 128 ? 1 : 0;
    }
  }
  return fg;
}

function getBit(
  fg: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number
): number {
  if (x < 0 || x >= width || y < 0 || y >= height) return 0;
  return fg[y * width + x];
}

// Vizinhos P2..P9 no sentido horário a partir do norte.
function neighbors(
  fg: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number
): number[] {
  return [
    getBit(fg, width, height, x, y - 1), // P2
    getBit(fg, width, height, x + 1, y - 1), // P3
    getBit(fg, width, height, x + 1, y), // P4
    getBit(fg, width, height, x + 1, y + 1), // P5
    getBit(fg, width, height, x, y + 1), // P6
    getBit(fg, width, height, x - 1, y + 1), // P7
    getBit(fg, width, height, x - 1, y), // P8
    getBit(fg, width, height, x - 1, y - 1), // P9
  ];
}

// Número de transições 0 -> 1 na sequência P2,P3,...,P9,P2.
function countTransitions(n: number[]): number {
  let count = 0;
  for (let i = 0; i < n.length; i++) {
    if (n[i] === 0 && n[(i + 1) % n.length] === 1) count++;
  }
  return count;
}

function shouldRemove(n: number[], step: number): boolean {
  const [p2, p3, p4, p5, p6, p7, p8, p9] = n;

  const b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
  if (b < 2 || b > 6) return false;
  if (countTransitions(n) !== 1) return false;

  if (step === 0) {
    return p2 * p4 * p6 === 0 && p4 * p6 * p8 === 0;
  }
  return p2 * p4 * p8 === 0 && p2 * p6 * p8 === 0;
}

// Um sub-passo do Zhang-Suen; retorna true se algum pixel foi removido.
function thinningPass(
  fg: Uint8Array,
  width: number,
  height: number,
  step: number
): boolean {
  const toRemove: number[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (getBit(fg, width, height, x, y) !== 1) continue;
      if (shouldRemove(neighbors(fg, width, height, x, y), step)) {
        toRemove.push(y * width + x);
      }
    }
  }
  for (const idx of toRemove) fg[idx] = 0;
  return toRemove.length > 0;
}
