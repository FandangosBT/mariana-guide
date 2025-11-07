import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, AlertTriangle, FileText, Clock, DollarSign, TrendingDown, Building2, Quote } from "lucide-react";
import { trackCtaClick } from "@/lib/sdk";
import { useJourneyStore } from "@/lib/store";

interface StepAtualProps {
  onNext: () => void;
  sessionId?: string;
}

// Meta do lead (scanner.md)
const META = {
  cliente: 'Mariana Gomes Imóveis',
  data: 'Novembro/2025',
  consultoria: 'Q7 Ops',
  segmento: 'Imobiliária',
};

// Categorias baseadas em scanner.md e gargalos.md
const AREAS = [
  {
    id: "financeiro",
    title: "Financeiro & Repasses",
    impacto: 92,
    esforco: 45,
    bullets: [
      "Registros manuais; sem recibos automáticos",
      "Sem conciliação e visão de fluxo de caixa",
      "Dificuldade no cálculo de comissões",
    ],
  },
  {
    id: "crm",
    title: "Imóveis & Clientes (CRM)",
    impacto: 88,
    esforco: 50,
    bullets: [
      "Registros em papel/planilhas, sem padronização",
      "Ausência de CRM (leads, propostas, status)",
      "Falta de histórico centralizado e reativações",
    ],
  },
  {
    id: "agenda",
    title: "Agenda & Operação",
    impacto: 85,
    esforco: 50,
    bullets: [
      "Agendamentos dispersos (WhatsApp/cadernos)",
      "Confirmações manuais e dependência da proprietária",
      "Sem rotina automatizada de visitas",
    ],
  },
  {
    id: "governanca",
    title: "Governança & Delegação",
    impacto: 80,
    esforco: 55,
    bullets: [
      "Decisões concentradas e processos não padronizados",
      "Ausência de relatórios de performance",
      "Operação vulnerável a imprevistos",
    ],
  },
  {
    id: "captacao",
    title: "Captação & Relacionamento",
    impacto: 78,
    esforco: 50,
    bullets: [
      "Leads desorganizados; sem CRM ativo",
      "Follow-up e pós-venda manuais",
      "Baixa previsibilidade de vendas/locações",
    ],
  },
  {
    id: "dados",
    title: "Visão Estratégica & Dados",
    impacto: 75,
    esforco: 35,
    bullets: [
      "Decisões por percepção; sem indicadores",
      "Sem relatórios de locações, vendas e inadimplência",
      "Ausência de painéis em tempo real",
    ],
  },
];

export const StepAtual = ({ onNext, sessionId }: StepAtualProps) => {
  const setStep1Baseline = useJourneyStore(s => s.setStep1Baseline);
  const [highlightArea, setHighlightArea] = useState<string | null>(null);
  const [wasteHours, setWasteHours] = useState<number>(40);
  const [hourlyCost, setHourlyCost] = useState<number>(120);
  const onDownloadScanner = () => {
    if (sessionId) trackCtaClick(sessionId, "scanner_pdf_download", undefined, "Atual");
    const link = document.createElement('a');
    link.href = '/Scanner-Operacional-EPICO-Mariana-Gomes-Imoveis.pdf';
    link.download = 'Scanner-Operacional-EPICO-Mariana-Gomes-Imoveis.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDownloadMapa = () => {
    if (sessionId) trackCtaClick(sessionId, "gargalos_pdf_download", undefined, "Atual");
    const link = document.createElement('a');
    link.href = '/Mapa-de-Gargalos-Invisiveis-Mariana-Gomes-Imoveis.pdf';
    link.download = 'Mapa-de-Gargalos-Invisiveis-Mariana-Gomes-Imoveis.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToScanner = (areaId: string) => {
    const el = document.getElementById(`scanner-${areaId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightArea(areaId);
    }
  };

  useEffect(() => {
    if (!highlightArea) return;
    const t = setTimeout(() => setHighlightArea(null), 2000);
    return () => clearTimeout(t);
  }, [highlightArea]);

  // Matriz: pré-calcular posições e um pequeno deslocamento vertical para rótulos, reduzindo sobreposição
  const points = AREAS.map((a) => {
    const leftP = Math.min(88, Math.max(12, a.esforco));
    const topP = Math.min(88, Math.max(12, 100 - a.impacto));
    return { ...a, leftP, topP };
  });
  const offsetSeq = [-36, -18, 0, 18, 36, 54];
  const offsetXSeq = [-24, 24, -12, 12, -36, 36];
  const labelOffset: Record<string, number> = {};
  const labelOffsetX: Record<string, number> = {};
  points
    .slice()
    .sort((a, b) => a.leftP - b.leftP)
    .forEach((p, i) => {
      labelOffset[p.id] = offsetSeq[i % offsetSeq.length];
      labelOffsetX[p.id] = offsetXSeq[i % offsetXSeq.length];
    });

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-1 rounded-full text-step-1 font-medium mb-4">
            🟣 PASSO 1
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-step-1 to-step-2 bg-clip-text text-transparent">
            Situação Atual
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Evidenciamos desperdícios e oportunidades: onde o tempo e a receita estão escapando na rotina do seu negócio.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-step-1/10 text-step-1"><Building2 className="w-3 h-3 mr-1" /> Cliente: {META.cliente}</Badge>
            <Badge variant="secondary" className="bg-step-1/10 text-step-1">Data: {META.data}</Badge>
            <Badge variant="secondary" className="bg-step-1/10 text-step-1">Consultoria: {META.consultoria}</Badge>
            <Badge variant="secondary" className="bg-step-1/10 text-step-1">Segmento: {META.segmento}</Badge>
          </div>
        </header>

        {/* Baseline */}
        <div className="max-w-5xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="step-card step-1 text-center">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-center gap-2"><Clock className="w-5 h-5 text-step-1" /> Horas Manuais/Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-step-1 mb-1">40–60h</div>
              <CardDescription>Retrabalho e controles dispersos</CardDescription>
            </CardContent>
          </Card>
          <Card className="step-card step-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-center gap-2"><DollarSign className="w-5 h-5 text-step-1" /> Horas improdutivas/mês</CardTitle>
              <CardDescription className="text-center">Conversor simples para estimar perdas sem métricas financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <Label htmlFor="waste-hours" className="text-xs text-muted-foreground">Horas improdutivas</Label>
                  <Input
                    id="waste-hours"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    value={wasteHours}
                    onChange={(e) => setWasteHours(Number(e.target.value || 0))}
                    aria-label="Horas improdutivas no mês"
                  />
                </div>
                <div>
                  <Label htmlFor="hourly-cost" className="text-xs text-muted-foreground">Custo/hora (R$)</Label>
                  <Input
                    id="hourly-cost"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={10}
                    value={hourlyCost}
                    onChange={(e) => setHourlyCost(Number(e.target.value || 0))}
                    aria-label="Custo por hora em reais"
                  />
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Perda estimada/mês</div>
                <div className="text-2xl font-bold text-step-1">
                  R$ {(Math.max(0, wasteHours) * Math.max(0, hourlyCost)).toLocaleString('pt-BR')}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="step-card step-1 text-center">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-center gap-2"><TrendingDown className="w-5 h-5 text-step-1" /> Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-step-1 mb-1">-15% a -25%</div>
              <CardDescription>Falta de pipeline, SLAs e playbooks</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Scanner Resumido */}
        <Card className="step-card step-1 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-step-1" /> Scanner Operacional — Dores e Processos</CardTitle>
            <CardDescription>Visão resumida por área para discussão</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AREAS.map((a) => (
                <div
                  key={a.id}
                  id={`scanner-${a.id}`}
                  className={`p-4 rounded-xl border bg-card/70 transition-shadow ${
                    highlightArea === a.id ? 'border-2 border-step-1 shadow-lg' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{a.title}</div>
                    <Badge variant="secondary" className="bg-step-1/10 text-step-1">
                      Impacto
                    </Badge>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {a.bullets.map((b,i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2 items-start">
                        <AlertTriangle className="w-4 h-4 text-step-1 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Impacto</div>
                      <Progress value={a.impacto} className="h-2" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Esforço</div>
                      <Progress value={a.esforco} className="h-2 bg-muted [&>div]:bg-step-1/70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Metáfora do diagnóstico */}
        <Card className="step-card step-1 mb-8">
          <CardContent className="pt-6 text-muted-foreground leading-relaxed">
            <div className="flex items-start gap-2">
              <Quote className="w-4 h-4 text-step-1 mt-1" />
              <p>
                “A imobiliária funciona como um arquivo em gavetas diferentes — o que deveria estar em um painel digital unificado, hoje está espalhado em papéis e cadernos.”
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Heatmap/Matriz simplificada */}
        <Card className="step-card step-1 mb-8">
          <CardHeader>
            <CardTitle>Matriz Impacto × Esforço</CardTitle>
            <CardDescription>Ganhos rápidos no quadrante superior esquerdo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 md:h-72 rounded-xl border border-border overflow-hidden bg-card/70">
              {/* Eixos */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border" />
              <div className="absolute left-2 top-2 text-[10px] uppercase tracking-wide text-muted-foreground">Impacto</div>
              <div className="absolute right-2 bottom-2 text-[10px] uppercase tracking-wide text-muted-foreground">Esforço</div>
              {/* Pontos + rótulos com deslocamento para reduzir sobreposição */}
              {points.map((p) => {
                const left = p.leftP + '%';
                const top = p.topP + '%';
                const offset = labelOffset[p.id] ?? 0;
                const offsetX = labelOffsetX[p.id] ?? 0;
                return (
                  <div key={p.id} className="absolute" style={{ left, top }}>
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      <div className="w-2.5 h-2.5 rounded-full bg-step-1 border border-step-1/50 shadow-sm" />
                      {/* Leader lines */}
                      <div
                        className="absolute bg-step-1/30"
                        style={{ left: '50%', top: offset < 0 ? offset : 0, width: 1, height: Math.abs(offset) }}
                      />
                      <div
                        className="absolute bg-step-1/30"
                        style={{ left: `calc(50% + ${offsetX < 0 ? offsetX : 0}px)`, top: offset, width: Math.abs(offsetX), height: 1 }}
                      />
                      <div
                        className="absolute left-1/2 top-0 z-10 pointer-events-auto cursor-pointer"
                        style={{ transform: `translate(calc(-50% + ${offsetX}px), ${offset}px)` }}
                        role="button"
                        tabIndex={0}
                        onClick={() => scrollToScanner(p.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToScanner(p.id); }}
                      >
                        <div
                          className="text-[11px] sm:text-xs px-2 py-1 rounded-full border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-step-1/40 text-step-1 whitespace-nowrap shadow cursor-default"
                          title={`${p.title} — Impacto ${p.impacto}% · Esforço ${p.esforco}%`}
                        >
                          {p.title}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={onDownloadScanner} className="border-step-1 text-step-1">
            <FileText className="w-4 h-4 mr-2" /> Baixar Scanner
          </Button>
          <Button variant="outline" onClick={onDownloadMapa} className="border-step-1 text-step-1">
            <FileText className="w-4 h-4 mr-2" /> Baixar Mapa
          </Button>
          <Button
            onClick={() => {
              setStep1Baseline({
                manualHoursRange: '40–60h/mês',
                monthlyLossRange: 'R$ 8–15k/mês',
                conversionRange: '-15% a -25%'
              });
              onNext();
            }}
            className="bg-step-1 hover:bg-step-1/90 text-primary-foreground font-semibold px-8"
            aria-label="Avançar para o Plano"
          >
            Avançar para o Plano
          </Button>
        </div>

      </div>
    </section>
  );
};
