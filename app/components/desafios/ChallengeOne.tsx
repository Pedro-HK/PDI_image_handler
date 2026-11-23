import React from "react";
import { Upload } from "lucide-react";
import { analisarPorcas, type ResultadoPorcas, type Ponto } from "../../pdi/porcas";

/**
 * Desafio 1 — Controle de qualidade na metalúrgica.
 * Conta as porcas, mede perímetro externo, perímetro interno e área do furo.
 * A lógica de PDI fica em app/pdi/porcas.ts; aqui só há entrada, desenho e tabela.
 */

const EXEMPLOS = [
  { label: "Exemplo 1", src: "/desafios/porcas-1.jpeg" },
  { label: "Exemplo 2", src: "/desafios/porcas-2.jpeg" },
];

type Visao = "resultado" | "mascara" | "textura";

const COR_EXTERNO = "#22c55e";
const COR_INTERNO = "#ef4444";
const COR_DESTAQUE = "#facc15";

export function ChallengeOne() {
  const [imagem, setImagem] = React.useState<ImageData | null>(null);
  const [limiarAuto, setLimiarAuto] = React.useState(true);
  const [limiar, setLimiar] = React.useState(148);
  const [limiarTextura, setLimiarTextura] = React.useState(5);
  const [visao, setVisao] = React.useState<Visao>("resultado");
  const [destaque, setDestaque] = React.useState<number | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const carregar = React.useCallback((src: string) => {
    setErro(null);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      setImagem(ctx.getImageData(0, 0, canvas.width, canvas.height));
      setDestaque(null);
    };
    img.onerror = () => setErro("Não foi possível carregar a imagem.");
    img.src = src;
  }, []);

  React.useEffect(() => {
    carregar(EXEMPLOS[0].src);
  }, [carregar]);

  const handleArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => carregar(e.target?.result as string);
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const resultado = React.useMemo<ResultadoPorcas | null>(() => {
    if (!imagem) return null;
    return analisarPorcas(imagem, {
      limiar: limiarAuto ? undefined : limiar,
      limiarTextura,
    });
  }, [imagem, limiarAuto, limiar, limiarTextura]);

  // Mostra o limiar calculado pelo Otsu no slider enquanto estiver no automático.
  React.useEffect(() => {
    if (resultado && limiarAuto) setLimiar(resultado.limiar);
  }, [resultado, limiarAuto]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagem || !resultado) return;
    desenhar(canvas, imagem, resultado, visao, destaque);
  }, [imagem, resultado, visao, destaque]);

  const porcas = resultado?.porcas ?? [];
  const semFuro = porcas.filter((p) => !p.temFuro).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-white">
          Desafio 1 — Controle de qualidade na metalúrgica
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Identifica e conta as porcas, calcula o perímetro externo de cada porca,
          o perímetro interno e a área de cada furo. Metal = pixel escuro
          (limiar de brilho) <em>ou</em> áspero (textura passa-alta, que recupera
          os reflexos do metal). Depois: abertura/fechamento, rotulação de
          componentes conexos, rastreamento de contorno (Moore) e código de cadeia.
        </p>
      </div>

      {/* Entrada */}
      <div className="flex flex-wrap items-center gap-2">
        {EXEMPLOS.map((ex) => (
          <button
            key={ex.src}
            type="button"
            onClick={() => carregar(ex.src)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            {ex.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          Carregar imagem
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/bmp,image/webp"
          onChange={handleArquivo}
          className="hidden"
        />
      </div>

      {/* Parâmetros */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Limiar de brilho: <span className="text-indigo-400">{limiar}</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={limiarAuto}
                onChange={(e) => setLimiarAuto(e.target.checked)}
                className="accent-indigo-500"
              />
              Automático (Otsu)
            </label>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={limiar}
            disabled={limiarAuto}
            onChange={(e) => setLimiar(Number(e.target.value))}
            className="w-full accent-indigo-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Limiar de textura: <span className="text-indigo-400">{limiarTextura}</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={limiarTextura}
            onChange={(e) => setLimiarTextura(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {erro && <p className="text-xs text-red-400">{erro}</p>}

      {/* Visualização */}
      {imagem && resultado && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1">
              {(
                [
                  ["resultado", "Resultado"],
                  ["mascara", "Máscara binária"],
                  ["textura", "Mapa de textura"],
                ] as [Visao, string][]
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisao(v)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    visao === v
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5" style={{ background: COR_EXTERNO }} />
                Externo
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5" style={{ background: COR_INTERNO }} />
                Interno
              </span>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-lg border border-slate-800 bg-slate-950"
          />

          {/* Resumo */}
          <div className="flex flex-wrap gap-3">
            <Stat label="Porcas encontradas" value={String(porcas.length)} />
            <Stat
              label="Sem furo (defeito)"
              value={String(semFuro)}
              alerta={semFuro > 0}
            />
            <Stat
              label="Imagem"
              value={`${resultado.largura} × ${resultado.altura}`}
            />
          </div>

          {/* Tabela */}
          {porcas.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-xs">
                <thead className="bg-slate-800/60 text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Porca</th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Perímetro externo (px)
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Perímetro interno (px)
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Área do furo (px²)
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {porcas.map((p) => (
                    <tr
                      key={p.id}
                      onMouseEnter={() => setDestaque(p.id)}
                      onMouseLeave={() => setDestaque(null)}
                      className={`border-t border-slate-800 tabular-nums transition-colors ${
                        destaque === p.id ? "bg-slate-800/80" : ""
                      }`}
                    >
                      <td className="px-3 py-2 font-semibold text-white">#{p.id}</td>
                      <td className="px-3 py-2 text-right text-slate-300">
                        {p.perimetroExterno.toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-300">
                        {p.temFuro ? p.perimetroInterno.toFixed(1) : "—"}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-300">
                        {p.temFuro ? p.areaFuro : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {p.temFuro ? (
                          <span className="text-emerald-400">OK</span>
                        ) : (
                          <span className="text-red-400">Furo não encontrado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Nenhuma porca encontrada. Ajuste os limiares.
            </p>
          )}
          <p className="text-[11px] text-slate-500">
            Perímetros pelo código de cadeia (passo reto = 1, diagonal = √2). O furo
            é a região passante, onde o fundo aparece através da porca.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  alerta = false,
}: {
  label: string;
  value: string;
  alerta?: boolean;
}) {
  return (
    <div className="flex-1 min-w-30 rounded-lg bg-slate-800/50 border border-slate-800 px-3 py-2">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div
        className={`text-lg font-bold tabular-nums ${alerta ? "text-red-400" : "text-white"}`}
      >
        {value}
      </div>
    </div>
  );
}

function desenhar(
  canvas: HTMLCanvasElement,
  imagem: ImageData,
  resultado: ResultadoPorcas,
  visao: Visao,
  destaque: number | null,
) {
  const { width, height } = imagem;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (visao === "resultado") {
    ctx.putImageData(imagem, 0, 0);
  } else {
    const out = ctx.createImageData(width, height);
    for (let i = 0; i < width * height; i++) {
      const v =
        visao === "mascara"
          ? resultado.mascara[i]
            ? 255
            : 0
          : Math.min(255, resultado.textura[i] * 8);
      out.data[i * 4] = v;
      out.data[i * 4 + 1] = v;
      out.data[i * 4 + 2] = v;
      out.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(out, 0, 0);
  }

  // Espessuras proporcionais ao tamanho da imagem
  const escala = Math.max(1, Math.min(width, height) / 400);

  for (const p of resultado.porcas) {
    const ativo = destaque === p.id;
    tracar(ctx, p.contornoExterno, ativo ? COR_DESTAQUE : COR_EXTERNO, (ativo ? 3 : 1.5) * escala);
    tracar(ctx, p.contornoInterno, ativo ? COR_DESTAQUE : COR_INTERNO, (ativo ? 3 : 1.5) * escala);
  }

  // Rótulos no centroide da porca (cai sobre o furo)
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${Math.round(11 * escala)}px sans-serif`;
  for (const p of resultado.porcas) {
    const r = 10 * escala;
    ctx.beginPath();
    ctx.arc(p.centroide.x, p.centroide.y, r, 0, Math.PI * 2);
    ctx.fillStyle = destaque === p.id ? COR_DESTAQUE : "rgba(15, 23, 42, 0.85)";
    ctx.fill();
    ctx.fillStyle = destaque === p.id ? "#0f172a" : "#ffffff";
    ctx.fillText(String(p.id), p.centroide.x, p.centroide.y + 0.5);
  }
}

function tracar(ctx: CanvasRenderingContext2D, pontos: Ponto[], cor: string, espessura: number) {
  if (pontos.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pontos[0].x + 0.5, pontos[0].y + 0.5);
  for (let i = 1; i < pontos.length; i++) ctx.lineTo(pontos[i].x + 0.5, pontos[i].y + 0.5);
  ctx.closePath();
  ctx.strokeStyle = cor;
  ctx.lineWidth = espessura;
  ctx.lineJoin = "round";
  ctx.stroke();
}
