/**
 * Desafio 4 — Contagem de círculos e quadrados.
 *
 * Ideia: todas as formas do tabuleiro são contornadas por linhas pretas.
 * Separando as linhas (preto) das regiões coloridas (branco), cada região
 * vira um componente conexo. Para cada região calculamos medidas de forma e
 * classificamos em círculo, quadrado ou outro.
 */

import { PDIImage } from "../helpers";
import { dilatacao } from "../morphology";
import {
  pintar,
  rotular,
  VIZINHOS,
  type Etapa,
  type Rotulacao,
} from "./rotulacao";

export type TipoForma = "circulo" | "quadrado";

export interface Forma {
  id: number;
  tipo: TipoForma;
  area: number;
  perimetro: number;
}

export interface ResultadoCirculos {
  etapas: Etapa[];
  formas: Forma[];
  circulos: number;
  quadrados: number;
}

/** Soma |ΔR|+|ΔG|+|ΔB| entre vizinhos acima disso = borda entre duas cores. */
const DIFERENCA_COR = 120;

/** Regiões menores que isso são ruído (cantinhos entre linhas). */
const AREA_MINIMA_FORMA = 300;

/** Largura/altura da caixa envolvente entre esses valores = forma "redonda ou quadrada". */
const PROPORCAO_MIN = 0.85;
const PROPORCAO_MAX = 1.18;

/**
 * Razão área / R², onde R = maior distância do centro até a borda:
 *   círculo  = π·R² / R²        ≈ 3,14
 *   quadrado = 2·R² / R²        = 2   (R = metade da diagonal; vale girado também)
 *   triângulo equilátero        ≈ 1,3
 */
const RAZAO_MIN_CIRCULO = 2.6;
const RAZAO_MIN_QUADRADO = 1.7;
const RAZAO_MAX_QUADRADO = 2.4;

const COR_CIRCULO = [239, 68, 68]; // vermelho
const COR_QUADRADO = [59, 130, 246]; // azul
const COR_OUTRO = [100, 116, 139]; // cinza

/** Medidas de uma região já preenchida (furos internos contam como parte dela). */
interface Medidas {
  area: number;
  perimetro: number;
  proporcao: number; // largura / altura da caixa envolvente
  razao: number; // área / R²
}

export function analisarCirculos(
  imagem: PDIImage,
  limiar: number = 90,
): ResultadoCirculos {
  const etapas: Etapa[] = [];

  etapas.push({
    titulo: "1. Original",
    descricao: "Imagem do tabuleiro.",
    imagem: imagem.clone(),
  });

  // 2. Separa as linhas pretas das regiões coloridas
  const linhas = mascaraDeLinhas(imagem, limiar);
  etapas.push({
    titulo: "2. Bordas",
    descricao: `Borda (preto) = max(R, G, B) < ${limiar} ou mudança brusca de cor. Usa o maior canal para que azul-escuro e roxo não virem linha.`,
    imagem: linhas,
  });

  // 2b. Engrossa as bordas (dilatação do preto) para fechar falhas de 1 px
  const regioesImg = dilatacao(linhas) ?? linhas;
  etapas.push({
    titulo: "3. Dilatação",
    descricao: "Engrossa as bordas para fechar falhas e as formas não vazarem para o fundo.",
    imagem: regioesImg,
  });

  // 3. Cada região branca (entre as linhas) é um componente conexo
  const regioes = rotular(regioesImg, 255);
  etapas.push({
    titulo: "4. Rotulação",
    descricao: "Cada região entre as linhas recebe um rótulo (cor).",
    imagem: regioes.image,
  });

  // 4. Mede e classifica cada região
  const tipos = regioes.components.map(() => null as TipoForma | null);
  const medidas: (Medidas | null)[] = regioes.components.map(() => null);
  const spans = calcularSpans(regioes);

  for (let r = 1; r < regioes.components.length; r++) {
    const comp = regioes.components[r];
    if (comp.tocaBorda || comp.area < AREA_MINIMA_FORMA) continue;

    medidas[r] = medir(spans[r]);
    tipos[r] = classificar(medidas[r]!);
  }

  // 5. Pinta a classificação sobre a imagem original
  const classificada = imagem.clone();
  for (let y = 0; y < imagem.getHeight(); y++) {
    for (let x = 0; x < imagem.getWidth(); x++) {
      const r = regioes.labels[y][x];
      if (r == 0 || !medidas[r]) continue;
      const tipo = tipos[r];
      pintar(
        classificada,
        x,
        y,
        tipo == "circulo" ? COR_CIRCULO : tipo == "quadrado" ? COR_QUADRADO : COR_OUTRO,
      );
    }
  }
  etapas.push({
    titulo: "5. Classificação",
    descricao: "Vermelho = círculo, azul = quadrado, cinza = outra forma.",
    imagem: classificada,
  });

  // 6. Monta a tabela só com círculos e quadrados
  const formas: Forma[] = [];
  for (let r = 1; r < regioes.components.length; r++) {
    const tipo = tipos[r];
    if (!tipo) continue;
    formas.push({
      id: formas.length + 1,
      tipo,
      area: medidas[r]!.area,
      perimetro: medidas[r]!.perimetro,
    });
  }

  return {
    etapas,
    formas,
    circulos: formas.filter((f) => f.tipo == "circulo").length,
    quadrados: formas.filter((f) => f.tipo == "quadrado").length,
  };
}

/**
 * Pixel vira borda (preto, 0) se:
 *  - for escuro em TODOS os canais (max(R,G,B) < limiar) → linha preta; ou
 *  - a cor mudar muito em relação ao vizinho da direita/de baixo → borda entre
 *    duas cores sem linha preta (ex.: círculo branco dentro do quadrado vermelho).
 * Todo o resto → branco (255).
 * A luminância não serve aqui: azul-escuro e roxo têm luminância baixa e
 * seriam confundidos com a linha preta.
 */
function mascaraDeLinhas(imagem: PDIImage, limiar: number): PDIImage {
  const width = imagem.getWidth();
  const height = imagem.getHeight();
  const result = imagem.clone();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const maior = Math.max(
        imagem.get(0, x, y),
        imagem.get(1, x, y),
        imagem.get(2, x, y),
      );
      const escuro = maior < limiar;

      let mudaCor = false;
      if (x + 1 < width) mudaCor ||= diferencaDeCor(imagem, x, y, x + 1, y) > DIFERENCA_COR;
      if (y + 1 < height) mudaCor ||= diferencaDeCor(imagem, x, y, x, y + 1) > DIFERENCA_COR;

      const valor = escuro || mudaCor ? 0 : 255;
      result.set(0, x, y, valor);
      result.set(1, x, y, valor);
      result.set(2, x, y, valor);
    }
  }

  return result;
}

/** Soma das diferenças absolutas de R, G e B entre dois pixels. */
function diferencaDeCor(
  imagem: PDIImage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  let soma = 0;
  for (let c = 0; c < 3; c++) {
    soma += Math.abs(imagem.get(c, x1, y1) - imagem.get(c, x2, y2));
  }
  return soma;
}

/** Faixa [xMin, xMax] ocupada pela região em cada linha y. */
interface Span {
  y: number;
  xMin: number;
  xMax: number;
}

/**
 * Para cada região, guarda o primeiro e o último x em cada linha.
 * Preencher de xMin a xMax "tapa" os furos de dentro da forma
 * (ex.: o círculo branco dentro do quadrado vermelho).
 * Funciona porque círculos e quadrados são formas convexas.
 */
function calcularSpans(regioes: Rotulacao): Span[][] {
  const spans: Span[][] = regioes.components.map(() => []);

  for (let y = 0; y < regioes.labels.length; y++) {
    const linha = regioes.labels[y];
    for (let x = 0; x < linha.length; x++) {
      const r = linha[x];
      if (r == 0) continue;

      const lista = spans[r];
      const ultimo = lista[lista.length - 1];
      if (ultimo && ultimo.y == y) {
        ultimo.xMax = x;
      } else {
        lista.push({ y, xMin: x, xMax: x });
      }
    }
  }

  return spans;
}

/** Área, perímetro, proporção e razão área/R² da forma preenchida. */
function medir(spans: Span[]): Medidas {
  // índice rápido: linha y → span
  const porLinha = new Map<number, Span>();
  for (const s of spans) porLinha.set(s.y, s);
  const dentro = (x: number, y: number) => {
    const s = porLinha.get(y);
    return !!s && x >= s.xMin && x <= s.xMax;
  };

  // área e centro
  let area = 0;
  let somaX = 0;
  let somaY = 0;
  let xMin = Infinity;
  let xMax = -Infinity;
  for (const s of spans) {
    const n = s.xMax - s.xMin + 1;
    area += n;
    somaX += ((s.xMin + s.xMax) / 2) * n;
    somaY += s.y * n;
    xMin = Math.min(xMin, s.xMin);
    xMax = Math.max(xMax, s.xMax);
  }
  const cx = somaX / area;
  const cy = somaY / area;

  // perímetro = pixels da forma com algum vizinho fora dela;
  // R = maior distância do centro até um pixel de borda
  let perimetro = 0;
  let maiorDist2 = 0;
  for (const s of spans) {
    for (let x = s.xMin; x <= s.xMax; x++) {
      const ehBorda = VIZINHOS.some(([dx, dy]) => !dentro(x + dx, s.y + dy));
      if (!ehBorda) continue;

      perimetro++;
      const d2 = (x - cx) ** 2 + (s.y - cy) ** 2;
      if (d2 > maiorDist2) maiorDist2 = d2;
    }
  }

  const largura = xMax - xMin + 1;
  const altura = spans.length;

  return {
    area,
    perimetro,
    proporcao: largura / altura,
    razao: area / maiorDist2,
  };
}

function classificar(m: Medidas): TipoForma | null {
  // círculo e quadrado têm caixa envolvente quadrada (largura ≈ altura)
  if (m.proporcao < PROPORCAO_MIN || m.proporcao > PROPORCAO_MAX) return null;

  if (m.razao >= RAZAO_MIN_CIRCULO) return "circulo";
  if (m.razao >= RAZAO_MIN_QUADRADO && m.razao <= RAZAO_MAX_QUADRADO)
    return "quadrado";
  return null;
}
