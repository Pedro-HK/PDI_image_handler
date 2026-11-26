/**
 * Rotulação de componentes conexos e utilitários compartilhados pelos desafios.
 */

import { PDIImage } from "../helpers";

export interface Etapa {
  titulo: string;
  descricao: string;
  imagem: PDIImage;
}

export interface Componente {
  area: number;
  tocaBorda: boolean;
  inicioX: number;
  inicioY: number;
}

export interface Rotulacao {
  /** components[rotulo] — a posição 0 não é usada (rótulo 0 = sem rótulo). */
  components: Componente[];
  labels: number[][];
  image: PDIImage;
}

export const VIZINHOS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function pintarRotulos(img: PDIImage, x: number, y: number, label: number) {
  const CORES = [
    [239, 68, 68],
    [34, 197, 94],
    [59, 130, 246],
    [234, 179, 8],
    [168, 85, 247],
    [236, 72, 153],
    [20, 184, 166],
    [249, 115, 22],
  ];
  const [r, g, b] = CORES[(label - 1) % CORES.length];
  img.set(0, x, y, r);
  img.set(1, x, y, g);
  img.set(2, x, y, b);
}

/**
 * TODO: percorrer a imagem binária; ao achar um pixel de porca ainda sem rótulo,
 * fazer busca (BFS/DFS) marcando todos os vizinhos conectados com o mesmo rótulo.
 * Pintar cada rótulo com uma cor diferente para visualizar.
 */
/**
 * Gera os deslocamentos (dx, dy) de todos os vizinhos dentro de um círculo de
 * raio `raio`. raio = 1 mantém os 4 vizinhos clássicos.
 */
function vizinhosNoRaio(raio: number): number[][] {
  if (raio <= 1) return VIZINHOS;

  const offsets: number[][] = [];
  for (let dy = -raio; dy <= raio; dy++) {
    for (let dx = -raio; dx <= raio; dx++) {
      if (dx == 0 && dy == 0) continue;
      if (dx * dx + dy * dy <= raio * raio) offsets.push([dx, dy]);
    }
  }
  return offsets;
}

/**
 * `raio` = distância máxima para considerar dois pixels "conectados".
 * Com raio > 1, pedaços da mesma porca separados por um reflexo fino
 * (até raio - 1 pixels de largura) recebem o mesmo rótulo.
 */
export function rotular(
  binaryImage: PDIImage,
  value: number,
  raio: number = 1,
): Rotulacao {
  const vizinhos = vizinhosNoRaio(raio);
  // Posição 0 vazia para que components[rotulo] bata com o rótulo (1, 2, 3...)
  const components: Componente[] = [
    { area: 0, tocaBorda: false, inicioX: 0, inicioY: 0 },
  ];

  const result = binaryImage.clone();

  const width = binaryImage.getWidth();
  const height = binaryImage.getHeight();

  const labels = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0),
  );

  let currentLabel = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = binaryImage.get(0, x, y);
      // verifica se o pixel atual é parte do objeto e ja ainda não foi marcado
      if (pixel == value && labels[y][x] == 0) {
        // cria um rotulo unico para o objeto a ser analisado
        currentLabel++;

        const componente: Componente = {
          area: 0,
          tocaBorda: false,
          inicioX: x,
          inicioY: y,
        };
        components.push(componente); // fica em components[currentLabel]

        labels[y][x] = currentLabel;

        pintarRotulos(result, x, y, currentLabel);

        // inicializa o monitoramento do objeto comparando seus vizinhos
        const objectTrack = [[x, y]];

        let begin = 0;

        while (begin < objectTrack.length) {
          const [currentX, currentY] = objectTrack[begin++];

          // conta cada pixel visitado e verifica se ele encosta na borda
          componente.area++;
          if (
            currentX == 0 ||
            currentY == 0 ||
            currentX == width - 1 ||
            currentY == height - 1
          ) {
            componente.tocaBorda = true;
          }

          for (const vizinho of vizinhos) {
            const nearX = currentX + vizinho[0];
            const nearY = currentY + vizinho[1];

            // evitar que saia da imagem
            if (0 <= nearY && nearY < height && 0 <= nearX && nearX < width) {
              // verifica se o vizinho ainda não foi marcado e é parte do objeto
              if (
                labels[nearY][nearX] == 0 &&
                binaryImage.get(0, nearX, nearY) == value
              ) {
                labels[nearY][nearX] = currentLabel;
                pintarRotulos(result, nearX, nearY, currentLabel);
                objectTrack.push([nearX, nearY]);
              }
            }
          }
        }
      }
    }
  }

  return { components, labels, image: result };
}

export function pintar(img: PDIImage, x: number, y: number, [r, g, b]: number[]) {
  img.set(0, x, y, r);
  img.set(1, x, y, g);
  img.set(2, x, y, b);
}
