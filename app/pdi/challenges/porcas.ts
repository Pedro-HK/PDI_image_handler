/**
 * Desafio 1 — Controle de qualidade na metalúrgica (ESBOÇO).
 *
 * Cada etapa gera uma PDIImage que é mostrada na tela, em ordem,
 * para visualizar passo a passo como a lógica foi construída.
 */

import { PDIImage } from "../helpers";
import { grayscale } from "../filters";
import {
  pintar,
  rotular,
  VIZINHOS,
  type Etapa,
  type Rotulacao,
} from "./rotulacao";
import { abertura, dilatacao, erosao } from "../morphology";

export type { Etapa };

export interface Porca {
  id: number;
  perimetroExterno: number;
  perimetroInterno: number;
  areaFuro: number;
}

export interface ResultadoPorcas {
  etapas: Etapa[];
  porcas: Porca[];
}

/** Componentes de porca menores que isso são ruído. */
const AREA_MINIMA_PORCA = 500;

/** Regiões brancas dentro da porca menores que isso são manchas, não furos. */
const AREA_MINIMA_FURO = 100;

/** Acima disso a região é irregular demais para ser um furo (círculo ≈ 1). */
const CIRCULARIDADE_MAXIMA = 2;

/** Raio de busca da rotulação das porcas (1 = só os 4 vizinhos). */
const RAIO_BUSCA_PORCA = 4;

/** Desvio padrão local acima disso = textura de metal. */
const LIMIAR_DESVIO = 12;

export function analisarPorcas(
  imagem: PDIImage,
  limiar: number = 100,
): ResultadoPorcas {
  const etapas: Etapa[] = [];

  etapas.push({
    titulo: "1. Original",
    descricao: "Imagem de entrada.",
    imagem: imagem.clone(),
  });

  // 2. Tons de cinza
  const cinza = grayscale(imagem) ?? imagem.clone();
  etapas.push({
    titulo: "2. Tons de cinza",
    descricao: "Converte para luminância.",
    imagem: cinza,
  });

  // 3. Máscara por textura: escuro OU texturizado = porca (preto), liso e claro = fundo (branco)
  const binaria = mascaraPorTextura(cinza, limiar, LIMIAR_DESVIO);
  etapas.push({
    titulo: "3. Máscara por textura",
    descricao: `Porca = cinza < ${limiar} ou desvio padrão 3x3 > ${LIMIAR_DESVIO}. Fundo e sombra são lisos.`,
    imagem: binaria,
  });

  // 4. Morfologia: abertura remove ruído; dilatar 2x + erodir 2x fecha reflexos maiores
  // (repetir fechamento() não adianta: o resultado é o mesmo)
  let limpa = abertura(binaria) ?? binaria.clone();
  limpa = dilatacao(dilatacao(limpa))!;
  limpa = erosao(erosao(limpa))!;
  etapas.push({
    titulo: "4. Abertura + Fechamento 2x",
    descricao: "Remove ruídos e preenche reflexos do metal.",
    imagem: limpa,
  });

  // 5. Rotulação de componentes conexos: pretos = porcas, brancos = fundo + furos
  // raio 4: pedaços da porca a até 3 px de distância (reflexo no meio) viram um só objeto
  const porcasRot = rotular(limpa, 0, RAIO_BUSCA_PORCA);
  const fundoRot = rotular(limpa, 255);
  etapas.push({
    titulo: "5. Rotulação",
    descricao: "Cada componente conexo preto é uma porca.",
    imagem: porcasRot.image,
  });

  // 6. Furos: regiões de fundo que não tocam a borda da imagem
  const donoDoFuro = encontrarDonos(porcasRot, fundoRot);
  const furoPrincipal = escolherFuros(porcasRot, fundoRot, donoDoFuro);
  const furos = encontrarFuros(limpa, fundoRot, furoPrincipal);
  etapas.push({
    titulo: "6. Furos",
    descricao: "Fundo cercado pela porca = furo (em vermelho).",
    imagem: furos,
  });

  // 7. Contornos externo e interno
  const contornos = desenharContornos(
    imagem,
    porcasRot,
    fundoRot,
    furoPrincipal,
  );
  etapas.push({
    titulo: "7. Contornos",
    descricao: "Verde = borda externa, vermelho = borda do furo.",
    imagem: contornos,
  });

  // 8. Medidas de cada porca
  const porcas = medirPorcas(porcasRot, fundoRot, furoPrincipal);

  return { etapas, porcas };
}

/** Uma porca de verdade (e não um pontinho de ruído). */
function ehPorca(porcasRot: Rotulacao, p: number): boolean {
  return p > 0 && porcasRot.components[p].area >= AREA_MINIMA_PORCA;
}

/**
 * Para cada furo (componente de fundo que não toca a borda), descobre a porca
 * que o envolve. O primeiro pixel do furo na varredura tem logo acima dele
 * um pixel da porca dona.
 * Retorna donoDoFuro[rotuloFundo] = rotuloPorca (0 = não é furo).
 */
function encontrarDonos(porcasRot: Rotulacao, fundoRot: Rotulacao): number[] {
  const donoDoFuro = fundoRot.components.map(() => 0);

  for (let f = 1; f < fundoRot.components.length; f++) {
    const furo = fundoRot.components[f];
    if (furo.tocaBorda) continue;
    donoDoFuro[f] = porcasRot.labels[furo.inicioY - 1][furo.inicioX];
  }

  return donoDoFuro;
}

/**
 * Perímetro de cada componente de fundo: nº de pixels dele que têm algum
 * vizinho (4-conexo) fora do componente.
 * Retorna perimetro[rotuloFundo].
 */
function perimetroDoFundo(fundoRot: Rotulacao): number[] {
  const perimetro = fundoRot.components.map(() => 0);
  const height = fundoRot.labels.length;
  const width = fundoRot.labels[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const f = fundoRot.labels[y][x];
      if (f == 0) continue;

      for (const [dx, dy] of VIZINHOS) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx < 0 ||
          ny < 0 ||
          nx >= width ||
          ny >= height ||
          fundoRot.labels[ny][nx] != f
        ) {
          perimetro[f]++;
          break; // conta o pixel uma vez só
        }
      }
    }
  }

  return perimetro;
}

/**
 * Circularidade = perímetro² / (4π · área).
 * ~1 para um círculo; cresce para formas compridas/irregulares (reflexos).
 */
function circularidade(perimetro: number, area: number): number {
  return (perimetro * perimetro) / (4 * Math.PI * area);
}

/**
 * Reflexos claros dentro da porca também viram "furos". Descarta os que são
 * pequenos demais (manchas) ou irregulares demais (reflexos compridos) e,
 * dos que sobram, fica só o maior de cada porca.
 * Retorna furoPrincipal[rotuloPorca] = rotuloFundo (0 = porca sem furo).
 */
function escolherFuros(
  porcasRot: Rotulacao,
  fundoRot: Rotulacao,
  donoDoFuro: number[],
): number[] {
  const furoPrincipal = porcasRot.components.map(() => 0);
  const perimetro = perimetroDoFundo(fundoRot);

  for (let f = 1; f < fundoRot.components.length; f++) {
    const dono = donoDoFuro[f];
    if (!ehPorca(porcasRot, dono)) continue;

    const area = fundoRot.components[f].area;
    if (area < AREA_MINIMA_FURO) continue; // mancha pequena
    if (circularidade(perimetro[f], area) > CIRCULARIDADE_MAXIMA) continue; // reflexo irregular

    const atual = furoPrincipal[dono];
    if (
      atual == 0 ||
      fundoRot.components[f].area > fundoRot.components[atual].area
    ) {
      furoPrincipal[dono] = f;
    }
  }

  return furoPrincipal;
}

/** Diz se o rótulo de fundo f é o furo principal de alguma porca. */
function ehFuroPrincipal(furoPrincipal: number[], f: number): boolean {
  return f > 0 && furoPrincipal.includes(f);
}

/**
 * Classifica a borda do pixel (x, y) de uma porca olhando os 4 vizinhos:
 *  - vizinho fora da imagem ou fundo que toca a borda => borda externa
 *  - vizinho que é o furo principal                   => borda interna
 */
function tipoDeBorda(
  x: number,
  y: number,
  fundoRot: Rotulacao,
  furoPrincipal: number[],
): { externa: boolean; interna: boolean } {
  const height = fundoRot.labels.length;
  const width = fundoRot.labels[0].length;
  let externa = false;
  let interna = false;

  for (const [dx, dy] of VIZINHOS) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
      externa = true;
      continue;
    }

    const f = fundoRot.labels[ny][nx];
    if (f == 0) continue; // vizinho também é porca

    if (fundoRot.components[f].tocaBorda) externa = true;
    else if (ehFuroPrincipal(furoPrincipal, f)) interna = true;
  }

  return { externa, interna };
}

/**
 * Pinta de vermelho os furos principais sobre a imagem binária.
 * (Fundo que toca a borda = fundo de verdade; o que não toca = furo.)
 */
function encontrarFuros(
  binaria: PDIImage,
  fundoRot: Rotulacao,
  furoPrincipal: number[],
): PDIImage {
  const result = binaria.clone();

  for (let y = 0; y < binaria.getHeight(); y++) {
    for (let x = 0; x < binaria.getWidth(); x++) {
      if (ehFuroPrincipal(furoPrincipal, fundoRot.labels[y][x])) {
        pintar(result, x, y, [239, 68, 68]);
      }
    }
  }

  return result;
}

/** Marca sobre a imagem original: verde = borda externa, vermelho = borda do furo. */
function desenharContornos(
  original: PDIImage,
  porcasRot: Rotulacao,
  fundoRot: Rotulacao,
  furoPrincipal: number[],
): PDIImage {
  const result = original.clone();

  for (let y = 0; y < original.getHeight(); y++) {
    for (let x = 0; x < original.getWidth(); x++) {
      if (!ehPorca(porcasRot, porcasRot.labels[y][x])) continue;

      const { externa, interna } = tipoDeBorda(x, y, fundoRot, furoPrincipal);
      if (externa) pintar(result, x, y, [34, 197, 94]);
      if (interna) pintar(result, x, y, [239, 68, 68]);
    }
  }

  return result;
}

/**
 * Para cada porca:
 *  - perímetro externo = nº de pixels de borda externa
 *  - perímetro interno = nº de pixels de borda do furo
 *  - área do furo = nº de pixels do furo principal
 */
function medirPorcas(
  porcasRot: Rotulacao,
  fundoRot: Rotulacao,
  furoPrincipal: number[],
): Porca[] {
  const perimetroExterno = porcasRot.components.map(() => 0);
  const perimetroInterno = porcasRot.components.map(() => 0);

  for (let y = 0; y < porcasRot.labels.length; y++) {
    for (let x = 0; x < porcasRot.labels[0].length; x++) {
      const p = porcasRot.labels[y][x];
      if (!ehPorca(porcasRot, p)) continue;

      const { externa, interna } = tipoDeBorda(x, y, fundoRot, furoPrincipal);
      if (externa) perimetroExterno[p]++;
      if (interna) perimetroInterno[p]++;
    }
  }

  // Monta o resultado numerando só as porcas de verdade (1, 2, 3...)
  const porcas: Porca[] = [];
  for (let p = 1; p < porcasRot.components.length; p++) {
    if (!ehPorca(porcasRot, p)) continue;

    const f = furoPrincipal[p];
    porcas.push({
      id: porcas.length + 1,
      perimetroExterno: perimetroExterno[p],
      perimetroInterno: perimetroInterno[p],
      areaFuro: f > 0 ? fundoRot.components[f].area : 0,
    });
  }

  return porcas;
}

/**
 * Máscara por textura: o fundo é liso (desvio padrão baixo) e o metal é
 * texturizado (desvio alto), mesmo onde tem reflexo claro.
 * Pixel é porca (0) se for escuro OU texturizado; senão é fundo (255).
 */
function mascaraPorTextura(
  cinza: PDIImage,
  limiarEscuro: number = 100,
  limiarDesvio: number = 12,
  raio: number = 1, // raio 1 = janela 3x3
): PDIImage {
  const width = cinza.getWidth();
  const height = cinza.getHeight();
  const result = cinza.clone();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let soma = 0;
      let somaQuadrados = 0;
      let n = 0;

      // percorre a janela em volta do pixel
      for (let dy = -raio; dy <= raio; dy++) {
        for (let dx = -raio; dx <= raio; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

          const v = cinza.get(0, nx, ny);
          soma += v;
          somaQuadrados += v * v;
          n++;
        }
      }

      const media = soma / n;
      const variancia = somaQuadrados / n - media * media;
      const desvio = Math.sqrt(Math.max(0, variancia)); // max evita -0.0000001 por arredondamento

      const escuro = cinza.get(0, x, y) < limiarEscuro;
      const texturizado = desvio > limiarDesvio;
      const valor = escuro || texturizado ? 0 : 255;

      result.set(0, x, y, valor);
      result.set(1, x, y, valor);
      result.set(2, x, y, valor);
    }
  }

  return result;
}
