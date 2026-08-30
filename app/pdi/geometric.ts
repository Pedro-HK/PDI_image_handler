/**
 * Transformações Geométricas
 *
 * ATENÇÃO: Nenhuma manipulação de imagem está implementada.
 * Implemente a lógica matemática dos algoritmos aqui no próximo encontro.
 */

export function transladar(
  imageData?: ImageData | null,
  dx: number = 0,
  dy: number = 0,
): ImageData | null {
  console.log("[PDI - Geométricas] transladar chamado", { dx, dy });

  function transform(image, resultImage, kernel) {
    for (var c = 0; c < image.getChannelCount(); c++) {
      for (var x = 0; x < image.getWidth(); x++) {
        for (var y = 0; y < image.getHeight(); y++) {
          applyKernel(image, resultImage, kernel, c, x, y, image.get(c, x, y));
        }
      }
    }
  }

  function applyKernel(image, resultImage, kernel, channel, x, y, value) {
    var halfX = image.getWidth() / 2;
    var halfY = image.getHeight() / 2;
    var tmpX = x - halfX;
    var tmpY = y - halfY;
    var newX = Math.round(
      tmpX * kernel[0][0] + tmpY * kernel[0][1] + 1 * kernel[0][2],
    );
    var newY = Math.round(
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

  var image = imageData;
  var resultImage = new ImageData(image.getWidth(), image.getHeight());
  var x = 100;
  var y = 50;
  transform(image, resultImage, [
    [1, 0, -x],
    [0, 1, -y],
    [0, 0, 1],
  ]);
  return resultImage || null;
}

export function rotacionar(
  imageData?: ImageData | null,
  angleDegrees: number = 90,
): ImageData | null {
  console.log("[PDI - Geométricas] rotacionar chamado", { angleDegrees });
  // TODO: Implementar algoritmo de rotação de imagem
  return imageData || null;
}

export function espelhar(
  imageData?: ImageData | null,
  axis: "horizontal" | "vertical" = "horizontal",
): ImageData | null {
  console.log("[PDI - Geométricas] espelhar chamado", { axis });
  // TODO: Implementar algoritmo de espelhamento de imagem
  return imageData || null;
}

export function aumentar(
  imageData?: ImageData | null,
  scaleFactor: number = 1.5,
): ImageData | null {
  console.log("[PDI - Geométricas] aumentar chamado", { scaleFactor });
  // TODO: Implementar algoritmo de ampliação/escala up de imagem
  return imageData || null;
}

export function diminuir(
  imageData?: ImageData | null,
  scaleFactor: number = 0.5,
): ImageData | null {
  console.log("[PDI - Geométricas] diminuir chamado", { scaleFactor });
  // TODO: Implementar algoritmo de redução/escala down de imagem
  return imageData || null;
}
