import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, Target, CheckCircle, ArrowRight, CheckCircle2, Circle, FileText, Filter, UserCheck, DollarSign, Settings } from "lucide-react";
import { getPilots, trackPilotRecommendedSeen, trackPilotSelect, trackStepComplete, trackCtaClick } from "@/lib/sdk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";


type IconType = typeof Calendar;

const defaultPilotos: Array<{
  id: string;
  titulo: string;
  foco: string;
  icone: IconType;
  duracao?: string;
  escopo?: string[];
  metas?: string[];
  cronograma?: { title: string; window: string }[];
  recomendado: boolean;
  posicao?: { left: string };
}> = [
  // Módulo 1 — OpsUnit Controle Financeiro
  {
    id: "mod-financeiro-crm",
    titulo: "OpsUnit Controle Financeiro",
    foco: "Automatização e centralização da gestão financeira: boletos, recebimentos, fluxo de caixa, repasses e despesas.",
    icone: DollarSign as unknown as IconType,
    duracao: "30 dias",
    escopo: [
      "Painel Financeiro (AP/AR, fluxo de caixa, repasses, despesas)",
      "Automação de boletos e recebimentos",
      "Conciliação e baixa automática",
      "Integrações: pagamentos e assinatura eletrônica",
    ],
    metas: [
      "Fechamento de caixa D+2",
      "-20% a -40% tempo administrativo financeiro",
      "Risco de erro reduzido em repasses",
    ],
    cronograma: [
      { title: "Acessos, centros de custo e pipelines", window: "Dias 1–5" },
      { title: "Boletos, recebimentos e conciliação (integrações)", window: "Dias 6–15" },
      { title: "Repasses e despesas (automação)", window: "Dias 16–24" },
      { title: "Dashboards e treinamento", window: "Dias 25–30" },
    ],
    recomendado: true,
    posicao: { left: "10%" },
  },

  // Módulo 2 — BrandForge Base Digital + CRM Vivo
  {
    id: "mod-area-cliente",
    titulo: "BrandForge Base Digital + CRM Vivo",
    foco: "Portal de imóveis e captação integrada ao CRM com funil e histórico de negociações.",
    icone: Target as unknown as IconType,
    duracao: "30 dias",
    escopo: [
      "Site/portal com imóveis e formulário",
      "Integração leads → CRM e qualificação",
      "Pipeline de propostas e status",
      "Painel de origem de leads",
    ],
    metas: [
      "+30% leads inbound pelo portal",
      "≥ 90% leads rastreados",
      "Histórico centralizado por cliente",
    ],
    cronograma: [
      { title: "Portal e catálogo (estrutura e conteúdo)", window: "Dias 1–7" },
      { title: "Integração leads → CRM + tags", window: "Dias 8–15" },
      { title: "Pipeline e dashboards", window: "Dias 16–22" },
      { title: "Go‑live e ajustes", window: "Dias 23–30" },
    ],
    recomendado: true,
    posicao: { left: "40%" },
  },

  // Módulo 3 — OpsUnit Operações
  {
    id: "mod-brandforge",
    titulo: "OpsUnit Operações",
    foco: "Orquestra a rotina operacional: contratos, imóveis, laudos, manutenções, correspondências e comunicados em um único sistema.",
    icone: Settings as unknown as IconType,
    duracao: "25 dias",
    escopo: [
      "Gestão de contratos com assinatura eletrônica",
      "Cadastro de imóveis, laudos e manutenções",
      "Comunicados e correspondências administrativas",
    ],
    metas: [
      "Padronização operacional e menor retrabalho",
      "Tempo de fechamento -30% a -50%",
    ],
    cronograma: [
      { title: "Workflows operacionais e contratos", window: "Dias 1–8" },
      { title: "Imóveis, laudos e manutenções", window: "Dias 9–17" },
      { title: "Comunicados e correspondências", window: "Dias 18–25" },
    ],
    recomendado: true,
    posicao: { left: "70%" },
  },
];

interface Step4CriarProps {
  onNext: () => void;
  sessionId?: string;
}

export const Step4Criar = ({ onNext, sessionId }: Step4CriarProps) => {
  const [selectedPiloto, setSelectedPiloto] = useState<string | null>(null);
  const [pilotos, setPilotos] = useState(defaultPilotos);
  const recommendedSeenRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    getPilots()
      .then(({ data }) => {
        if (!mounted || !Array.isArray(data)) return;
        // Mapear estrutura da API para nossa UI
        const mapped = data.map((p, idx) => ({
          id: p.id,
          titulo: p.title,
          foco: p.focus,
          icone: [Calendar, Users, CheckCircle, Target][idx % 4] as IconType,
          duracao: p.durationWeeks ? `${p.durationWeeks} semanas` : undefined,
          recomendado: p.recommended,
          posicao: { left: `${10 + idx * 25}%` }
        }));
        // Mantém os módulos planejados e adiciona sugestões vindas do backend
        setPilotos([...defaultPilotos, ...mapped]);
      })
      .catch(() => { /* mantém fallback */ })
      .finally(() => { /* no-op */ });
    return () => { mounted = false; };
  }, []);

  const roadmapItems = useMemo(() => {
    // Auxiliar para extrair tarefas do cronograma dos pilotos definidos no header
    const getTasks = (pilotId: string, max: number = 4) => {
      const cronograma = defaultPilotos.find((p) => p.id === pilotId)?.cronograma;
      return (cronograma?.map((c) => c.title).slice(0, max)) ?? [];
    };

    return [
      {
        title: "Kickoff & Arquitetura Leve",
        description:
          "Infra mínima, acessos e templates. Conexão com software atual (APIs/CSV/ICS)",
        status: "completed" as const,
        window: "Semanas 1-2",
        progress: 100,
        tasks: [
          "Acessos e ambientes",
          "Templates e mensagens",
          "Definição de KPIs MVP",
        ],
      },
      {
        title: "Módulo 1 — OpsUnit Controle Financeiro (alto impacto/baixo esforço)",
        description: "Boletos, recebimentos, fluxo de caixa, repasses e despesas",
        status: "in-progress" as const,
        window: "Semanas 3-6",
        progress: 60,
        tasks: getTasks("mod-financeiro-crm"),
      },
      {
        title: "Módulo 2 — Base Digital + CRM Vivo (alto impacto/médio esforço)",
        description:
          "Portal de imóveis, captação e funil com histórico",
        status: "upcoming" as const,
        window: "Semanas 7-10",
        progress: 0,
        tasks: getTasks("mod-area-cliente"),
      },
      {
        title: "Módulo 3 — OpsUnit Operações (médio impacto/baixo esforço)",
        description: "Orquestração operacional: contratos, imóveis, laudos, manutenções e comunicados",
        status: "upcoming" as const,
        window: "Semanas 11-13",
        progress: 0,
        tasks: getTasks("mod-brandforge"),
      },
    ];
  }, [selectedPiloto, pilotos]);

  const getStatusColor = (status: "completed" | "in-progress" | "upcoming") => {
    switch (status) {
      case "completed": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "in-progress": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: "completed" | "in-progress" | "upcoming") => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "in-progress": return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };



  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6" id="criar-roadmap">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-4 rounded-full text-step-4 font-medium mb-6">
            🟠 ETAPA 4
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-step-4 to-step-5 bg-clip-text text-transparent">
            CRIAR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Plano de 60–90 dias com entregas semanais, baixo risco e alto impacto.
          </p>
        </header>

        {/* Pilotos (Grid responsivo sem scroll horizontal) */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="relative">
            {/* Pilotos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pilotos.map((piloto, index) => {
                const Icon = piloto.icone;
                const isSelected = selectedPiloto === piloto.id;
                
                return (
                  <div
                    key={piloto.id}
                    className="relative flex flex-col items-center cursor-pointer group animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 0.1}s`
                    }}
                    onMouseEnter={() => {
                      setSelectedPiloto(piloto.id);
                      if (sessionId && piloto.recomendado && !recommendedSeenRef.current[piloto.id]) {
                        recommendedSeenRef.current[piloto.id] = true;
                        trackPilotRecommendedSeen(sessionId, piloto.id);
                      }
                    }}
                    onMouseLeave={() => setSelectedPiloto(null)}
                    onClick={() => {
                      setSelectedPiloto(piloto.id);
                      if (sessionId) trackPilotSelect(sessionId, piloto.id);
                    }}
                  >
                    {/* Indicador */}
                    <div className={`w-6 h-6 rounded-full border-4 border-step-4 bg-background transition-transform duration-base ease-q7 group-hover:scale-110 ${
                      piloto.recomendado ? 'motion-safe:animate-glow-pulse' : ''
                    } ${isSelected ? 'scale-110 bg-step-4' : ''}`} />
                    
                    {/* Badge Recomendado */}
                    {piloto.recomendado && (
                      <Badge className="absolute -top-8 bg-step-4 text-primary-foreground text-xs px-2 py-1">
                        Recomendado
                      </Badge>
                    )}

                    {/* Card do Piloto */}
                    <div className={`mt-4 w-full step-card step-4 transition-transform duration-base ease-q7 ${
                      isSelected ? 'scale-[1.01] shadow-elegant' : ''
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-step-4/20 rounded-xl">
                          <Icon className="w-6 h-6 text-step-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-base leading-tight truncate" title={piloto.titulo}>{piloto.titulo}</h3>
                          <p className="text-xs text-step-4 truncate" title={piloto.foco}>{piloto.foco}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Prazo de Entrega */}
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Prazo: {piloto.duracao ?? '—'}</span>
                        </div>

                        {/* Escopo (visível no hover/seleção) */}
                        {isSelected && piloto.escopo?.length ? (
                          <div className="animate-fade-in">
                            <h4 className="font-medium text-step-4 mb-2">Escopo:</h4>
                            <ul className="space-y-1">
                              {piloto.escopo.map((item, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-step-4" />
                                  {item}
                                </li>
                              ))}
                            </ul>

                            {piloto.metas?.length ? (
                              <>
                                <h4 className="font-medium text-step-4 mb-2 mt-4">Metas:</h4>
                                <ul className="space-y-1">
                                  {piloto.metas.map((meta, i) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                      <Target className="w-3 h-3 text-step-4" />
                                      {meta}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : null}

                            {piloto.cronograma?.length ? (
                              <>
                                <h4 className="font-medium text-step-4 mb-2 mt-4">Plano de ação (cronograma):</h4>
                                <ul className="space-y-1">
                                  {piloto.cronograma.map((c, i) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                      <Clock className="w-3 h-3 text-step-4" />
                                      <span className="font-medium text-foreground">{c.window}</span>
                                      <span>— {c.title}</span>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Roadmap de 90 dias */}
        <div className="max-w-5xl mx-auto mb-12">
          {roadmapItems.map((item, idx) => (
            <Card key={idx} className="mb-6 hover:shadow-elegant transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant="secondary" className={getStatusColor(item.status)}>
                      {item.status === 'completed' ? 'Concluído' : item.status === 'in-progress' ? 'Em andamento' : 'Próximo'}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{item.window}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Progress value={item.progress} className="h-2" />
                  <span className="text-xs text-muted-foreground w-10 text-right">{item.progress}%</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {item.tasks.map((t) => (
                    <div key={t} className="text-sm text-muted-foreground flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumo da Estratégia */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="step-card step-4 text-center animate-slide-up">
            <h3 className="text-xl font-bold mb-4">Estratégia Recomendada</h3>
            <p className="text-muted-foreground mb-6">
              Começar com <strong>Financeiro + CRM</strong>, seguido de <strong>Área do Cliente</strong> e <strong>BrandForge</strong> obedece a matriz Impacto × Esforço do diagnóstico
              e maximiza o retorno nas primeiras semanas.
            </p>
            <div className="flex justify-center">
              <div className="p-6 bg-step-4/10 rounded-lg">
                <div className="text-3xl font-bold text-step-4 mb-2">~75 dias</div>
                <div className="text-base text-muted-foreground">Previsão total (3 módulos)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="text-center animate-slide-up flex flex-col items-center gap-3">

          <Button 
            onClick={() => { if (sessionId) { trackStepComplete(sessionId, "Criar", { selectedPilot: selectedPiloto }); } onNext(); }}
            size="lg"
            className="bg-step-4 hover:bg-step-4/90 text-primary-foreground font-semibold px-8 py-3 text-lg glow-effect transition-transform duration-base ease-q7"
          >
            Ver o futuro completo
          </Button>
        </div>
      </div>
    </section>
  );
};
