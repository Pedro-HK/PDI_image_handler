/**
 * Desafio 1 — Controle de qualidade na metalúrgica.
 *
 * Pipeline:
 *  1. Tons de cinza (luminância).
 *  2. Mapa de textura (passa-alta): energia local de (cinza − média 3x3).
 *     Gradientes suaves (sombra no fundo do furo) dão ~0; metal escovado dá > 10.
 *  3. Segmentação: metal = escuro (limiar de brilho, Otsu) OU áspero (limiar de textura).
 *     Só o brilho não basta: os reflexos do metal são tão claros quanto o fundo.
 *     A textura recupera esses reflexos, que são ásperos, enquanto o fundo é liso.
 *  4. Morfologia binária: abertura (remove ruído) + fechamento (preenche falhas)
 *     + erosão que compensa o "vazamento" da janela de textura na borda.
 *  5. Rotulação de componentes conexos do objeto (vizinhança-8) => porcas.
 *  6. Rotulação do fundo (vizinhança-4): componentes que não tocam a borda => furos.
 *  7. Rastreamento de contorno (Moore) + código de cadeia => perímetros.
 *  8. Contagem de pixels => áreas.
 *
 * Este módulo não depende do DOM: recebe qualquer objeto com { data, width, height }
 * no formato RGBA (ImageData ou PDIImage.imageData).
 */

export interface RGBAImage {
  data: Uint8ClampedArray | Uint8Array;
  width: number;
  height: number;
}

export interface Ponto {
  x: number;
  y: number;
}

export interface Porca {
  /** Número da porca (1..N), ordenado por linha e depois por coluna. */
  id: number;
  /** Área do corpo metálico da porca (sem o furo), em pixels. */
  area: number;
  perimetroExterno: number;
  perimetroInterno: number;
  areaFuro: number;
  /** false quando nenhum furo foi encontrado (porca defeituosa). */
  temFuro: boolean;
  centroide: Ponto;
  caixa: { x0: number; y0: number; x1: number; y1: number };
  contornoExterno: Ponto[];
  contornoInterno: Ponto[];
}

export interface OpcoesPorcas {
  /** Limiar de brilho (0..255): pixel mais escuro que isso é metal. Se omitido, usa Otsu. */
  limiar?: number;
  /** Limiar do mapa de textura: pixel mais áspero que isso é metal. Padrão 5. */
  limiarTextura?: number;
  /** Iterações de abertura 3x3 (remove ruído). */
  abertura?: number;
  /** Iterações de fechamento 3x3 (preenche reflexos/falhas). */
  fechamento?: number;
  /** Área mínima de uma porca, em fração da imagem. */
  areaMinimaRelativa?: number;
  /** Um furo menor que esta fração da área da porca é considerado ruído. */
  furoMinimoRelativo?: number;
}

export interface ResultadoPorcas {
  /** Limiar de brilho usado (Otsu ou manual). */
  limiar: number;
  limiarTextura: number;
  largura: number;
  altura: number;
  /** Mapa de textura (mesma escala do limiar). */
  textura: Float32Array;
  /** Máscara binária final (1 = porca) após a morfologia. */
  mascara: Uint8Array;
  porcas: Porca[];
}

// Vizinhança-8 no sentido anti-horário (eixo y para baixo):
// 0=E, 1=NE, 2=N, 3=NO, 4=O, 5=SO, 6=S, 7=SE
const DX = [1, 1, 0, -1, -1, -1, 0, 1];
const DY = [0, -1, -1, -1, 0, 1, 1, 1];

/**
 * Quantos pixels a textura "vaza" além da borda real: 1 da média 3x3 do
 * passa-alta + 2 da janela 5x5 da energia.
 */
const VAZAMENTO_TEXTURA = 3;
export function analisarPorcas(
  imagem: RGBAImage,
  opcoes: OpcoesPorcas = {},
): ResultadoPorcas {
  const { width, height } = imagem;
  const total = width * height;

  // 1. Tons de cinza
  const cinza = toGray(imagem);

  // 2. Mapa de textura
  const textura = highPassTexture(cinza, width, height);

  // 3. Segmentação: escuro (limiar de brilho) OU texturizado (limiar de textura)
  const limiar = opcoes.limiar ?? otsu(cinza);
  const limiarTextura = opcoes.limiarTextura ?? 5;
  let mascara: Uint8Array = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    mascara[i] = cinza[i] <= limiar || textura[i] > limiarTextura ? 1 : 0;
  }

  // 4. Morfologia
  const nAbertura = opcoes.abertura ?? 1;
  const nFechamento = opcoes.fechamento ?? 2;
  for (let i = 0; i < nAbertura; i++) mascara = erode(mascara, width, height);
  for (let i = 0; i < nAbertura; i++) mascara = dilate(mascara, width, height);
  for (let i = 0; i < nFechamento; i++) mascara = dilate(mascara, width, height);
  for (let i = 0; i < nFechamento; i++) mascara = erode(mascara, width, height);
  for (let i = 0; i < VAZAMENTO_TEXTURA; i++) mascara = erode(mascara, width, height);

  // 5. Componentes do objeto (8-conexo) => candidatas a porca
  const areaMinima = Math.max(
    20,
    Math.round(total * (opcoes.areaMinimaRelativa ?? 0.002)),
  );
  const objetos = label(mascara, width, height, 1, true);
  const rotuloPorca = objetos.labels;
  const ehPorca = new Uint8Array(objetos.count + 1);
  for (let l = 1; l <= objetos.count; l++) {
    if (objetos.areas[l] >= areaMinima) ehPorca[l] = 1;
  }
  // Remove ruídos pequenos da máscara
  for (let i = 0; i < total; i++) {
    const l = rotuloPorca[i];
    if (l > 0 && !ehPorca[l]) {
      mascara[i] = 0;
      rotuloPorca[i] = 0;
    }
  }

  // 5. Componentes do fundo (4-conexo). Os que não tocam a borda são furos.
  const fundo = label(mascara, width, height, 0, false);
  const donoDoFuro = new Int32Array(fundo.count + 1); // rótulo da porca que envolve o furo
  for (let f = 1; f <= fundo.count; f++) {
    if (fundo.tocaBorda[f]) continue;
    // Qualquer vizinho de objeto do pixel inicial pertence à porca que o envolve.
    donoDoFuro[f] = vizinhoObjeto(fundo.inicio[f], rotuloPorca, width, height);
  }

  // Área "preenchida" de cada porca (corpo + todos os furos)
  const areaPreenchida = new Float64Array(objetos.count + 1);
  for (let l = 1; l <= objetos.count; l++) areaPreenchida[l] = objetos.areas[l];
  for (let f = 1; f <= fundo.count; f++) {
    if (donoDoFuro[f] > 0) areaPreenchida[donoDoFuro[f]] += fundo.areas[f];
  }

  // Furo principal = maior furo de cada porca (os demais são reflexos/ruído)
  const furoPrincipal = new Int32Array(objetos.count + 1);
  for (let f = 1; f <= fundo.count; f++) {
    const dono = donoDoFuro[f];
    if (dono === 0) continue;
    const atual = furoPrincipal[dono];
    if (atual === 0 || fundo.areas[f] > fundo.areas[atual]) furoPrincipal[dono] = f;
  }
  const furoMinimo = opcoes.furoMinimoRelativo ?? 0.01;
  for (let l = 1; l <= objetos.count; l++) {
    const f = furoPrincipal[l];
    if (f > 0 && fundo.areas[f] < areaPreenchida[l] * furoMinimo) furoPrincipal[l] = 0;
  }

  // 6/7. Medidas de cada porca
  const porcas: Porca[] = [];
  for (let l = 1; l <= objetos.count; l++) {
    if (!ehPorca[l]) continue;

    const f = furoPrincipal[l];
    const areaFuro = f > 0 ? fundo.areas[f] : 0;

    // Contorno externo: porca preenchida (corpo + qualquer furo dela)
    const externo = traceContour(objetos.inicio[l], width, height, (i) => {
      if (rotuloPorca[i] === l) return true;
      const fl = fundo.labels[i];
      return fl > 0 && donoDoFuro[fl] === l;
    });

    // Contorno interno: borda do furo principal
    const interno =
      f > 0
        ? traceContour(fundo.inicio[f], width, height, (i) => fundo.labels[i] === f)
        : { pontos: [], perimetro: 0 };

    porcas.push({
      id: 0,
      area: areaPreenchida[l] - areaFuro,
      perimetroExterno: externo.perimetro,
      perimetroInterno: interno.perimetro,
      areaFuro,
      temFuro: f > 0,
      centroide: {
        x: objetos.somaX[l] / objetos.areas[l],
        y: objetos.somaY[l] / objetos.areas[l],
      },
      caixa: objetos.caixas[l],
      contornoExterno: externo.pontos,
      contornoInterno: interno.pontos,
    });
  }

  numerar(porcas);

  return {
    limiar,
    limiarTextura,
    largura: width,
    altura: height,
    textura,
    mascara,
    porcas,
  };
}

// ---------------------------------------------------------------------------
// Etapas auxiliares
// ---------------------------------------------------------------------------

function toGray(imagem: RGBAImage): Uint8Array {
  const { data, width, height } = imagem;
  const cinza = new Uint8Array(width * height);
  for (let i = 0; i < cinza.length; i++) {
    const p = i * 4;
    cinza[i] = Math.round(
      0.2125 * data[p] + 0.7154 * data[p + 1] + 0.0721 * data[p + 2],
    );
  }
  return cinza;
}

/** Limiar de Otsu: maximiza a variância entre as classes objeto/fundo. */
export function otsu(cinza: Uint8Array): number {
  const hist = new Float64Array(256);
  for (let i = 0; i < cinza.length; i++) hist[cinza[i]]++;

  const total = cinza.length;
  let somaTotal = 0;
  for (let t = 0; t < 256; t++) somaTotal += t * hist[t];

  let somaFundo = 0;
  let pesoFundo = 0;
  let melhorVariancia = -1;
  let melhorLimiar = 128;

  for (let t = 0; t < 256; t++) {
    pesoFundo += hist[t];
    if (pesoFundo === 0) continue;
    const pesoObjeto = total - pesoFundo;
    if (pesoObjeto === 0) break;

    somaFundo += t * hist[t];
    const media0 = somaFundo / pesoFundo;
    const media1 = (somaTotal - somaFundo) / pesoObjeto;
    const variancia = pesoFundo * pesoObjeto * (media0 - media1) ** 2;

    if (variancia > melhorVariancia) {
      melhorVariancia = variancia;
      melhorLimiar = t;
    }
  }
  return melhorLimiar;
}

/**
 * Textura passa-alta: raiz da média 5x5 de (cinza − média 3x3)².
 * Gradientes suaves (sombras, fundo visto pelo furo) dão ~0;
 * a superfície escovada do metal dá valores altos.
 */
function highPassTexture(cinza: Uint8Array, w: number, h: number): Float32Array {
  const g = Float32Array.from(cinza);
  const media = boxMean(g, w, h, 1);
  const residuo2 = new Float32Array(w * h);
  for (let i = 0; i < residuo2.length; i++) residuo2[i] = (g[i] - media[i]) ** 2;
  const energia = boxMean(residuo2, w, h, 2);
  for (let i = 0; i < energia.length; i++) energia[i] = Math.sqrt(energia[i]);
  return energia;
}

/** Média em janela (2r+1)x(2r+1) usando imagem integral (borda: janela truncada). */
function boxMean(src: Float32Array, w: number, h: number, r: number): Float32Array {
  const W = w + 1;
  const soma = new Float64Array(W * (h + 1));
  for (let y = 0; y < h; y++) {
    let linha = 0;
    for (let x = 0; x < w; x++) {
      linha += src[y * w + x];
      soma[(y + 1) * W + x + 1] = soma[y * W + x + 1] + linha;
    }
  }

  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const ya = Math.max(0, y - r);
    const yb = Math.min(h, y + r + 1);
    for (let x = 0; x < w; x++) {
      const xa = Math.max(0, x - r);
      const xb = Math.min(w, x + r + 1);
      const s = soma[yb * W + xb] - soma[ya * W + xb] - soma[yb * W + xa] + soma[ya * W + xa];
      out[y * w + x] = s / ((yb - ya) * (xb - xa));
    }
  }
  return out;
}

function erode(src: Uint8Array, w: number, h: number): Uint8Array {
  const out = new Uint8Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 1;
      for (let dy = -1; dy <= 1 && v; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h || !src[ny * w + nx]) {
            v = 0;
            break;
          }
        }
      }
      out[y * w + x] = v;
    }
  }
  return out;
}

function dilate(src: Uint8Array, w: number, h: number): Uint8Array {
  const out = new Uint8Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let dy = -1; dy <= 1 && !v; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h && src[ny * w + nx]) {
            v = 1;
            break;
          }
        }
      }
      out[y * w + x] = v;
    }
  }
  return out;
}

interface Rotulacao {
  labels: Int32Array;
  count: number;
  /** Índices indexados pelo rótulo (posição 0 não usada). */
  areas: number[];
  inicio: number[]; // primeiro pixel na varredura (canto superior esquerdo)
  tocaBorda: boolean[];
  somaX: number[];
  somaY: number[];
  caixas: { x0: number; y0: number; x1: number; y1: number }[];
}

/** Rotulação de componentes conexos por busca em largura (iterativa). */
function label(
  mascara: Uint8Array,
  w: number,
  h: number,
  valor: 0 | 1,
  oitoConexo: boolean,
): Rotulacao {
  const labels = new Int32Array(w * h);
  const fila = new Int32Array(w * h);
  const r: Rotulacao = {
    labels,
    count: 0,
    areas: [0],
    inicio: [0],
    tocaBorda: [false],
    somaX: [0],
    somaY: [0],
    caixas: [{ x0: 0, y0: 0, x1: 0, y1: 0 }],
  };

  const vizinhos = oitoConexo ? [0, 1, 2, 3, 4, 5, 6, 7] : [0, 2, 4, 6];

  for (let s = 0; s < w * h; s++) {
    if (mascara[s] !== valor || labels[s] !== 0) continue;

    const l = ++r.count;
    let area = 0;
    let somaX = 0;
    let somaY = 0;
    let borda = false;
    let x0 = w, y0 = h, x1 = 0, y1 = 0;

    let ini = 0;
    let fim = 0;
    fila[fim++] = s;
    labels[s] = l;

    while (ini < fim) {
      const p = fila[ini++];
      const x = p % w;
      const y = (p - x) / w;
      area++;
      somaX += x;
      somaY += y;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) borda = true;

      for (const d of vizinhos) {
        const nx = x + DX[d];
        const ny = y + DY[d];
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
        const n = ny * w + nx;
        if (mascara[n] === valor && labels[n] === 0) {
          labels[n] = l;
          fila[fim++] = n;
        }
      }
    }

    r.areas.push(area);
    r.inicio.push(s);
    r.tocaBorda.push(borda);
    r.somaX.push(somaX);
    r.somaY.push(somaY);
    r.caixas.push({ x0, y0, x1, y1 });
  }

  return r;
}

function vizinhoObjeto(p: number, rotulos: Int32Array, w: number, h: number): number {
  const x = p % w;
  const y = (p - x) / w;
  for (let d = 0; d < 8; d++) {
    const nx = x + DX[d];
    const ny = y + DY[d];
    if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
    const l = rotulos[ny * w + nx];
    if (l > 0) return l;
  }
  return 0;
}

/**
 * Rastreamento de contorno de Moore (vizinhança-8) a partir do pixel
 * superior-esquerdo da região. O perímetro é calculado pelo código de cadeia:
 * passos retos (direção par) valem 1, diagonais (ímpar) valem √2.
 */
function traceContour(
  inicio: number,
  w: number,
  h: number,
  naRegiao: (i: number) => boolean,
): { pontos: Ponto[]; perimetro: number } {
  const dentro = (x: number, y: number) =>
    x >= 0 && x < w && y >= 0 && y < h && naRegiao(y * w + x);

  const x0 = inicio % w;
  const y0 = (inicio - x0) / w;
  const pontos: Ponto[] = [{ x: x0, y: y0 }];
  const passos: number[] = [];

  let x = x0;
  let y = y0;
  let dir = 7;
  const limite = 4 * w * h;

  for (let iter = 0; iter < limite; iter++) {
    // Começa a busca a partir do vizinho "atrás" da última direção.
    const busca = dir % 2 === 0 ? (dir + 7) % 8 : (dir + 6) % 8;
    let achou = -1;
    for (let k = 0; k < 8; k++) {
      const d = (busca + k) % 8;
      if (dentro(x + DX[d], y + DY[d])) {
        achou = d;
        break;
      }
    }
    if (achou < 0) break; // região de um único pixel

    dir = achou;
    x += DX[dir];
    y += DY[dir];
    passos.push(dir);
    pontos.push({ x, y });

    // Critério de parada: voltou a P0 e o próximo seria P1 => sequência P0,P1 repetida.
    const n = pontos.length;
    if (
      n >= 4 &&
      pontos[n - 1].x === pontos[1].x &&
      pontos[n - 1].y === pontos[1].y &&
      pontos[n - 2].x === x0 &&
      pontos[n - 2].y === y0
    ) {
      pontos.length = n - 2;
      passos.length = passos.length - 1;
      break;
    }
  }

  let perimetro = 0;
  for (const d of passos) perimetro += d % 2 === 0 ? 1 : Math.SQRT2;
  return { pontos, perimetro };
}

/** Numera as porcas por linhas (de cima para baixo) e colunas (da esquerda para a direita). */
function numerar(porcas: Porca[]): void {
  if (porcas.length === 0) return;
  const alturaMedia =
    porcas.reduce((s, p) => s + (p.caixa.y1 - p.caixa.y0 + 1), 0) / porcas.length;

  porcas.sort((a, b) => a.centroide.y - b.centroide.y);

  const linhas: Porca[][] = [];
  for (const p of porcas) {
    const linha = linhas[linhas.length - 1];
    if (linha && Math.abs(p.centroide.y - linha[0].centroide.y) < alturaMedia / 2) {
      linha.push(p);
    } else {
      linhas.push([p]);
    }
  }

  let id = 1;
  porcas.length = 0;
  for (const linha of linhas) {
    linha.sort((a, b) => a.centroide.x - b.centroide.x);
    for (const p of linha) {
      p.id = id++;
      porcas.push(p);
    }
  }
}
