/**
 * Utilitários e Helpers para Manipulação de Canais e Pixels em PDI.
 */

export function getChannelCount(
  image?: ImageData | PDIImage | null,
  ignoreAlpha: boolean = false
): number {
  if (!image) return 0;
  if ("getChannelCount" in image && typeof image.getChannelCount === "function") {
    return image.getChannelCount();
  }
  return ignoreAlpha ? 3 : 4;
}

export function getPixel(
  image: ImageData,
  channel: number,
  x: number,
  y: number
): number {
  if (x < 0 || x >= image.width || y < 0 || y >= image.height) {
    return 0;
  }
  const index = (y * image.width + x) * 4 + channel;
  return image.data[index] ?? 0;
}

export function setPixel(
  image: ImageData,
  channel: number,
  x: number,
  y: number,
  value: number
): void {
  if (x < 0 || x >= image.width || y < 0 || y >= image.height) {
    return;
  }
  const index = (y * image.width + x) * 4 + channel;
  image.data[index] = Math.min(255, Math.max(0, Math.round(value)));
}

/**
 * Classe utilitária PDIImage: encapsula ImageData e matriz de pixels
 */
export class PDIImage {
  public imageData: ImageData;
  public width: number;
  public height: number;
  public channelCount: number;
  private cachedDataUrl: string | null = null;

  constructor(
    imageDataOrWidth: ImageData | number,
    height?: number,
    channelCount: number = 4
  ) {
    if (typeof imageDataOrWidth === "number") {
      this.width = Math.max(1, Math.round(imageDataOrWidth));
      this.height = Math.max(1, Math.round(height || 1));
      this.channelCount = channelCount;
      this.imageData = new ImageData(this.width, this.height);

      // Preenche Alpha com 255 por padrão
      for (let i = 3; i < this.imageData.data.length; i += 4) {
        this.imageData.data[i] = 255;
      }
    } else {
      this.imageData = imageDataOrWidth;
      this.width = imageDataOrWidth.width;
      this.height = imageDataOrWidth.height;
      this.channelCount = channelCount;
    }
  }

  static fromImageElement(img: HTMLImageElement): PDIImage {
    if (typeof document === "undefined") {
      return new PDIImage(img.width || 1, img.height || 1);
    }
    const canvas = document.createElement("canvas");
    const width = img.naturalWidth || img.width || 1;
    const height = img.naturalHeight || img.height || 1;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      return new PDIImage(width, height);
    }
    ctx.drawImage(img, 0, 0);
    const rawData = ctx.getImageData(0, 0, width, height);
    return new PDIImage(rawData);
  }

  getChannelCount(): number {
    return this.channelCount;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  get(channel: number, x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return 0;
    }
    return this.imageData.data[(y * this.width + x) * 4 + channel] ?? 0;
  }

  set(channel: number, x: number, y: number, value: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }
    this.cachedDataUrl = null;
    this.imageData.data[(y * this.width + x) * 4 + channel] = Math.min(
      255,
      Math.max(0, Math.round(value))
    );
  }

  clone(): PDIImage {
    const copyData = new ImageData(
      new Uint8ClampedArray(this.imageData.data),
      this.width,
      this.height
    );
    return new PDIImage(copyData, undefined, this.channelCount);
  }

  toImageData(): ImageData {
    return this.imageData;
  }

  toDataURL(): string {
    if (this.cachedDataUrl) {
      return this.cachedDataUrl;
    }
    if (typeof document === "undefined") return "";
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.putImageData(this.imageData, 0, 0);
    this.cachedDataUrl = canvas.toDataURL("image/png");
    return this.cachedDataUrl;
  }
}

export function wrapPDIImage(
  imageData: ImageData,
  channelCount: number = 4
): PDIImage {
  return new PDIImage(imageData, undefined, channelCount);
}

export function createPDIImage(
  width: number,
  height: number,
  channelCount: number = 4
): PDIImage {
  return new PDIImage(width, height, channelCount);
}
