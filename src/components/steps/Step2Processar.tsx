import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, CalendarDays, FileSignature, Package, MessageSquare, Megaphone, AlertTriangle, Link2 } from "lucide-react";
import { generateScreenshotPDF } from "@/utils/pdf-generator";
import { trackHover, trackClick, trackStepComplete, trackCtaClick } from "@/lib/sdk";

interface Step2ProcessarProps {
  onNext: () => void;
  sessionId?: string;
}

const META = {
  lead: "Larissa Carvalho Business Growth",
  data: "Setembro/2025",
  consultoria: "Q7 Ops",
};

type CategoryId =
  | "financeiro"
  | "gestaoClientesLeads"
  | "contratosServicos"
  | "areaClienteMentoria"
  | "kpisOperacao"
  | "presencaDigital";

const CATEGORIES: Array<{
  id: CategoryId;
  icon: typeof CalendarDays;
  title: string;
  bullets: string[];
  impacto: string;
  impactoScore: number; // 0-100
  esforcoScore: number; // 0-100 (quanto menor, melhor)
}> = [
  {
    id: "financeiro",
    icon: FileText,
    title: "Financeiro & Fluxo de Caixa",
    bullets: [
      "Controle em planilhas manuais, sem dashboards consolidados.",
      "Orçamentos refeitos várias vezes, sem padronização.",
      "Ausência de relatórios automáticos de contas a pagar/receber.",
    ],
    impacto:
      "Falta de previsibilidade financeira, insegurança em investimentos e risco de erro nos cálculos.",
    impactoScore: 95,
    esforcoScore: 45,
  },
  {
    id: "gestaoClientesLeads",
    icon: MessageSquare,
    title: "Gestão de Clientes & Leads",
    bullets: [
      "Cadastros dispersos (WhatsApp, planilhas, anotações).",
      "Sem pipeline organizado para leads.",
      "Gestão de senhas e acessos feita de forma improvisada.",
    ],
    impacto:
      "Perda de oportunidades, retrabalho e baixa escalabilidade.",
    impactoScore: 85,
    esforcoScore: 50,
  },
  {
    id: "contratosServicos",
    icon: FileSignature,
    title: "Contratos & Serviços",
    bullets: [
      "Contratos assinados manualmente, sem centralização.",
      "Serviços contratados não ficam visíveis em um painel único.",
      "Gestão de faturas sem automação.",
    ],
    impacto:
      "Atraso em fechamentos, riscos jurídicos e falhas na entrega.",
    impactoScore: 80,
    esforcoScore: 55,
  },
  {
    id: "areaClienteMentoria",
    icon: Package,
    title: "Área de Clientes & Entrega da Mentoria",
    bullets: [
      "Entrega da mentoria premium feita via WhatsApp.",
      "Ausência de portal exclusivo para clientes.",
      "Materiais e documentos compartilhados de forma improvisada.",
    ],
    impacto:
      "Percepção de falta de profissionalismo, risco de perda de informações e dificuldade em escalar mentorias.",
    impactoScore: 88,
    esforcoScore: 50,
  },
  {
    id: "kpisOperacao",
    icon: Megaphone,
    title: "KPIs de Campanhas & Operação",
    bullets: [
      "Indicadores acompanhados manualmente.",
      "Sem dashboards integrados para visão em tempo real.",
      "Baixa previsibilidade dos resultados de marketing.",
    ],
    impacto:
      "Decisões baseadas em achismo, pouca clareza sobre ROI e risco de campanhas ineficientes.",
    impactoScore: 78,
    esforcoScore: 60,
  },
  {
    id: "presencaDigital",
    icon: CalendarDays,
    title: "Presença Digital Institucional",
    bullets: [
      "Agência não possui página institucional.",
      "Presença digital fragmentada.",
      "Dificuldade de transmitir autoridade a novos clientes.",
    ],
    impacto:
      "Barreiras para prospectar e redução de credibilidade.",
    impactoScore: 75,
    esforcoScore: 35,
  },
];



// Conexões entre categorias correlatas
const RELATED: Record<CategoryId, CategoryId[]> = {
  financeiro: ["contratosServicos", "kpisOperacao"],
  gestaoClientesLeads: ["presencaDigital", "areaClienteMentoria", "contratosServicos"],
  contratosServicos: ["financeiro", "gestaoClientesLeads", "areaClienteMentoria"],
  areaClienteMentoria: ["gestaoClientesLeads", "contratosServicos", "presencaDigital"],
  kpisOperacao: ["presencaDigital", "financeiro"],
  presencaDigital: ["gestaoClientesLeads", "kpisOperacao", "areaClienteMentoria"],
};


export const Step2Processar = ({ onNext, sessionId }: Step2ProcessarProps) => {
  const hoveredRef = useRef<Record<string, number>>({});
  const [active, setActive] = useState<CategoryId | null>(null);

  const onCardEnter = (id: CategoryId) => {
    setActive(id);
    if (sessionId) trackHover(sessionId, "Processar", id);
    hoveredRef.current[id] = (hoveredRef.current[id] || 0) + 1;
  };

  const onCardLeave = () => setActive(null);

  const onCardClick = (id: CategoryId) => {
    if (sessionId) trackClick(sessionId, "Processar", id);
  };

  const handleGeneratePdf = () => {
    if (sessionId) {
      trackCtaClick(sessionId, "gargalos_pdf_download", { step: "Processar" });
    }
    // Criar link para download do arquivo PDF
    const link = document.createElement('a');
    link.href = '/Mapa-de-Gargalos-Invisiveis-Larissa-Carvalho-Business-Growth.pdf';
    link.download = 'Mapa-de-Gargalos-Invisiveis-Larissa-Carvalho-Business-Growth.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNext = () => {
    if (sessionId) {
      const hovered = Object.keys(hoveredRef.current);
      trackStepComplete(sessionId, "Processar", { hovered });
    }
    onNext();
  };

  const isConnected = (id: CategoryId) => {
    if (!active) return false;
    return active === id || (RELATED[active] || []).includes(id);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-2 rounded-full text-step-2 font-medium mb-4">
            🔵 ETAPA 2
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-step-2 to-step-3 bg-clip-text text-transparent">
            PROCESSAR
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Mapa de Gargalos Invisíveis — onde a operação perde eficiência sem você perceber.
          </p>
        </header>

        {/* Meta + Ações */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Badge variant="secondary" className="bg-step-2/10 text-step-2">Lead: {META.lead}</Badge>
          <Badge variant="secondary" className="bg-step-2/10 text-step-2">Data: {META.data}</Badge>
          <Badge variant="secondary" className="bg-step-2/10 text-step-2">Consultoria: {META.consultoria}</Badge>
          <Button variant="outline" onClick={handleGeneratePdf} className="border-step-2 text-step-2">
            <FileText className="w-4 h-4 mr-2" /> Gerar PDF do Mapa
          </Button>
        </div>

        {/* Contexto Geral */}
        <div className="max-w-4xl mx-auto mb-6">
          <Card className="step-card step-2">
            <CardContent className="pt-6 text-muted-foreground leading-relaxed">
              A agência possui grande potencial de crescimento, mas a operação depende de processos manuais, informações dispersas e ausência de infraestrutura digital mínima. Durante a conversa, emergiram gargalos não imediatamente visíveis, mas que comprometem eficiência, previsibilidade e escala.
            </CardContent>
          </Card>
        </div>

        {/* Mapa */}
        <div id="gargalos-mapa" className="relative max-w-6xl mx-auto">
          {/* Matriz Impacto x Esforço */}
          <div className="mb-6">
            <Card className="step-card step-2">
              <CardHeader>
                <CardTitle className="text-lg">Matriz Impacto x Esforço</CardTitle>
                <CardDescription>Priorize visualmente: alto impacto e baixo esforço primeiro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 rounded-xl border border-border overflow-hidden bg-card/70">
                  {/* Eixos */}
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border" />
                  {/* Labels dos eixos */}
                  <div className="absolute left-2 top-2 text-[10px] text-muted-foreground">Impacto (↑ melhor)</div>
                  <div className="absolute right-2 bottom-2 text-[10px] text-muted-foreground">Esforço (→ maior)</div>
                  {/* Quadrantes */}
                  <div className="absolute left-8 top-8 text-[10px] font-medium text-step-2 z-10">Ganhos Rápidos</div>
                  <div className="absolute right-8 top-8 text-[10px] font-medium text-muted-foreground z-10">Projetos Estratégicos</div>
                  <div className="absolute left-8 bottom-8 text-[10px] font-medium text-muted-foreground z-10">Baixa Prioridade</div>
                  <div className="absolute right-8 bottom-8 text-[10px] font-medium text-muted-foreground z-10">Reavaliar</div>

                  {/* Pontos */}
                  {CATEGORIES.map((cat) => {
                    const left = `${Math.min(95, Math.max(5, cat.esforcoScore))}%`;
                    const top = `${Math.min(95, Math.max(5, 100 - cat.impactoScore))}%`;
                    const connected = isConnected(cat.id);
                    return (
                      <button
                        key={`pt-${cat.id}`}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-2 py-1 rounded-full border text-[10px] transition-transform duration-fast ease-q7 ${
                          connected ? "bg-step-2/20 border-step-2 text-step-2" : "bg-muted/50 border-border text-muted-foreground"
                        }`}
                        style={{ left, top }}
                        onMouseEnter={() => onCardEnter(cat.id)}
                        onMouseLeave={onCardLeave}
                        onClick={() => onCardClick(cat.id)}
                        aria-label={`Ponto da matriz: ${cat.title}`}
                      >
                        <span className={`inline-block w-2 h-2 rounded-full ${connected ? "bg-step-2" : "bg-muted-foreground/60"}`} />
                        <span className="whitespace-nowrap">{cat.title}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, index) => {
              const Icon = cat.icon;
              const connected = isConnected(cat.id);
              return (
                <Card
                  key={cat.id}
                  className={`step-card step-2 animate-scale-in cursor-pointer transition-transform duration-base ease-q7 ${
                    connected ? "ring-2 ring-step-2 shadow-elegant" : "hover:shadow-elegant"
                  } ${active && !connected ? "opacity-80" : ""}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                  onMouseEnter={() => onCardEnter(cat.id)}
                  onMouseLeave={onCardLeave}
                  onClick={() => onCardClick(cat.id)}
                  aria-label={`Gargalo: ${cat.title}`}
                  role="button"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-step-2/15 rounded-xl">
                        <Icon className="w-6 h-6 text-step-2" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{cat.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">Gargalos invisíveis</CardDescription>
                      </div>
                      {connected && active !== cat.id && (
                        <div className="ml-auto inline-flex items-center gap-1 text-xs text-step-2">
                          <Link2 className="w-3 h-3" /> Relacionado a {formatTitle(active!)}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {cat.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="w-4 h-4 text-step-2 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Régua Impacto x Esforço */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">Impacto</div>
                        <Progress value={cat.impactoScore} className="h-2" />
                        <div className="text-[10px] text-muted-foreground mt-1">Alto é melhor</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">Esforço</div>
                        <Progress value={cat.esforcoScore} className="h-2 bg-muted [&>div]:bg-step-2/70" />
                        <div className="text-[10px] text-muted-foreground mt-1">Baixo é melhor</div>
                      </div>
                    </div>

                    {/* Impacto resumido */}
                    <div className="p-3 rounded-lg bg-step-2/10 border border-step-2/20 mt-4">
                      <div className="text-xs font-medium text-step-2 mb-1">Impacto</div>
                      <div className="text-sm text-muted-foreground">{cat.impacto}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Conclusão e Oportunidades */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="step-card step-2">
            <CardHeader>
              <CardTitle>Conclusão e Oportunidades</CardTitle>
              <CardDescription>Oportunidade de evolução modular</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p className="mb-4">
                A agência está presa em rotinas manuais, duplicidade de processos e falta de clareza estratégica. Esses gargalos invisíveis afetam diretamente a credibilidade, a eficiência operacional e a capacidade de escalar clientes e mentorias.
              </p>
              <ul className="space-y-2">
                <li>• Passo inicial: BrandForge (site institucional + CRM básico) + OpsUnit – Financeiro Vivo (impacto imediato, organização de clientes e previsibilidade financeira).</li>
                <li>• Expansão natural: Área do Cliente Premium + KPIs Automatizados (profissionalização da entrega e clareza em resultados).</li>
                <li>• Médio prazo: Contratos Digitais Integrados + Funil de Leads (eficiência comercial + menos retrabalho).</li>
                <li>• Longo prazo: TimeOS (painel centralizado para controle total da operação).</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button
            onClick={handleNext}
            size="lg"
            className="bg-step-2 hover:bg-step-2/90 text-primary-foreground font-semibold px-8 py-3 text-lg glow-effect transition-transform duration-base ease-q7 hover:scale-105 focus:ring-2 focus:ring-step-2 focus:ring-offset-2"
            aria-label="Identificar soluções para os gargalos mapeados"
          >
            Vamos identificar as soluções
          </Button>
        </div>
      </div>
    </section>
  );
};

function formatTitle(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)?.title ?? id;
}
