import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  FileText,
  Package,
  TrendingUp,
  Clock,
  DollarSign,
  Activity,
  MessageSquare,
  Settings,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Zap,
  Brain,
  BarChart3,
  Target,
  TrendingDown,
  ShoppingCart,
  Check,
  X,
  Calculator,
  Timer,
  Plus,
  Minus,
  CreditCard
} from "lucide-react";
import { trackWidgetInteraction, trackCtaClick } from "@/lib/sdk";
import { generateJourneyPDF } from "@/utils/pdf-generator";
import { useJourneyStore } from "@/lib/store";


// Debounce hook para atrasar o recálculo do orçamento
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const widgets = [
  {
    id: "agenda",
    titulo: "Taxa de Ocupação",
    valor: "92%",
    tendencia: "+15% a +25%",
    cor: "step-1",
    icon: Calendar,
    detalhes: "Aumento de ocupação com confirmação ativa, WhatsApp e overbooking controlado"
  },
  {
    id: "pacientes",
    titulo: "Pacientes Reativados",
    valor: "847",
    tendencia: "+300% a +500%",
    cor: "step-2", 
    icon: Users,
    detalhes: "Fluxos de reengajamento segmentados e playbooks (CRM Vivo)"
  },
  {
    id: "receita",
    titulo: "Receita Mensal",
    valor: "R$ 125k",
    tendencia: "+30% a +60%",
    cor: "step-3",
    icon: DollarSign,
    detalhes: "SEO técnico + conteúdo editorial e otimização contínua de funil"
  },
  {
    id: "estoque",
    titulo: "Eficiência Estoque",
    valor: "98.5%",
    tendencia: "-15% a -30%",
    cor: "step-4",
    icon: Package,
    detalhes: "Controle por lote, validade e mínimo reduz desperdício e ruptura"
  },
  {
    id: "satisfacao",
    titulo: "Satisfação dos Pacientes",
    valor: "4.9/5",
    tendencia: "+18%",
    cor: "step-5",
    icon: Activity,
    detalhes: "NPS alto com experiência otimizada ao longo da jornada"
  },
  {
    id: "comunicacao",
    titulo: "Resp. Automática",
    valor: "2.3 min",
    tendencia: "< 2 min",
    cor: "step-1",
    icon: MessageSquare,
    detalhes: "Respostas assistidas e templates; bots e integrações WhatsApp"
  }
];

const integracoes = [
  "OpsUnit Agenda",
  "OpsUnit CRM",
  "OpsUnit Estoque",
  "BrandForge Content",
  "TimeOS Central"
];

type ProdutoOrcamento = {
  id: string;
  nome: string;
  descricao: string;
  precoBase: number;
  economiaMensal?: number; // economia estimada mensal deste produto
  modulos: Array<{ id: string; nome: string; preco: number; obrigatorio: boolean; economiaMensal?: number }>;
  icon: typeof Calendar;
  cor: string;
  roiPrevisto: number;
  paybackMeses: number;
};

const orcamentoOptions: ProdutoOrcamento[] = [
  // 1) Financeiro + Agenda
  {
    id: "financeiro-gestao-contas-clientes",
    nome: "OpsUnit Controle Financeiro",
    descricao: "Unidade de inteligência responsável por automatizar e centralizar toda a gestão financeira do negócio — incluindo boletos, recebimentos, fluxo de caixa, repasses e despesas.",
    precoBase: 10008,
    economiaMensal: 1100,
    modulos: [],
    icon: DollarSign,
    cor: "green",
    roiPrevisto: 320,
    paybackMeses: 4
  },
  // 2) BrandForge + CRM
  {
    id: "brandforge-infraestrutura",
    nome: "BrandForge Base Digital + CRM Vivo",
    descricao: "Portal de imóveis e captação integrada ao CRM com pipeline e histórico de negociações",
    precoBase: 0,
    modulos: [
      { id: "portal-imoveis-crm", nome: "Portal de Imóveis + Captação (CRM)", preco: 3670, obrigatorio: false, economiaMensal: 700 },
      { id: "painel-origem-leads", nome: "Painel de Origem de Leads", preco: 2447, obrigatorio: false, economiaMensal: 700 }
    ],
    icon: Target,
    cor: "pink",
    roiPrevisto: 350,
    paybackMeses: 6
  },
  // 3) Contratos Digitais + Painel
  {
    id: "gestao-contratos",
    nome: "OpsUnit Operações",
    descricao: "Unidade de inteligência responsável por orquestrar toda a rotina operacional da empresa, integrando a gestão de contratos, imóveis, laudos, manutenções, correspondências e comunicados administrativos em um único sistema.",
    precoBase: 11520,
    economiaMensal: 800,
    modulos: [],
    icon: Settings,
    cor: "purple",
    roiPrevisto: 300,
    paybackMeses: 4
  },
  // Itens adicionais
  {
    id: "social-media-campanhas",
    nome: "OpsUnit Gestão de Social Media e Campanhas",
    descricao: "Gestão de conteúdo e campanhas com integração ao CRM e métricas",
    precoBase: 5508,
    economiaMensal: 1000,
    modulos: [],
    icon: BarChart3,
    cor: "orange",
    roiPrevisto: 280,
    paybackMeses: 5
  },
  {
    id: "timeos",
    nome: "TimeOS",
    descricao: "Sistema inteligente que centraliza todas as automações, métricas e integrações do negócio em um único ambiente. Com um agente de IA conectado ao WhatsApp e um painel web de KPIs em tempo real, transforme gestão em clareza, automação e controle total.",
    precoBase: 22760,
    economiaMensal: 1800,
    modulos: [],
    icon: MessageSquare,
    cor: "cyan",
    roiPrevisto: 450,
    paybackMeses: 4
  }
];

// Produtos que não devem aparecer no composer (ocultos da UI)
const HIDDEN_PRODUCT_IDS = new Set<string>(["social-media-campanhas"]);

interface Step5OtimizarProps {
  onComplete: () => void;
  sessionId?: string;
  headingTitle?: string;
  headingSubtitle?: string;
  showStepBadge?: boolean;
}

export const Step5Otimizar = ({ onComplete, sessionId, headingTitle, headingSubtitle, showStepBadge = true }: Step5OtimizarProps) => {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showOrcamento, setShowOrcamento] = useState(false);
  const [recommendedApplied, setRecommendedApplied] = useState(false);
  const [discountUntil, setDiscountUntil] = useState<number | null>(null);

  // Modelo de precificação: licença (padrão); preparado para assinatura futuramente
  const modeloPrecificacao: 'licenca' | 'assinatura' = 'licenca';

  // Estado do carrinho (persistente via Zustand)
  const carrinho = useJourneyStore(s => s.step5Data.cart);
  const cartToggleProduct = useJourneyStore(s => s.cartToggleProduct);
  const cartToggleModule = useJourneyStore(s => s.cartToggleModule);
  const cartClear = useJourneyStore(s => s.cartClear);

  // Estado debounced do carrinho (300ms)
  const debouncedCarrinho = useDebounce(carrinho, 300);

  // Receita/economia mensal estimada dinâmica com base nas seleções
  const calcularEconomiaMensal = (cartState = debouncedCarrinho) => {
    let economia = 0;
    Object.entries(cartState).forEach(([produtoId, config]) => {
      if (HIDDEN_PRODUCT_IDS.has(produtoId)) return;
      if (!config.selecionado) return;
      const produto = orcamentoOptions.find(p => p.id === produtoId);
      if (!produto) return;
      if (produto.economiaMensal) economia += produto.economiaMensal;
      produto.modulos.forEach(modulo => {
        if (config.modulos[modulo.id] && modulo.economiaMensal) economia += modulo.economiaMensal;
      });
    });
    return economia;
  };

  const receitaMensalEstimada = calcularEconomiaMensal(debouncedCarrinho);

  // Removido modo assinatura; seleção começa vazia e é personalizada pelo usuário

  const startSimulation = () => {
    setIsSimulating(!isSimulating);
  };



  // Funções do carrinho de compras
  const toggleProduto = (produtoId: string) => { cartToggleProduct(produtoId); };

  const toggleModulo = (produtoId: string, moduloId: string) => { cartToggleModule(produtoId, moduloId); };

  // Cálculo de custos totais (licença permanente)
  const calcularCustoTotal = (cartState = debouncedCarrinho) => {
    // Soma dos preços-base e módulos
    let total = 0;
    Object.entries(cartState).forEach(([produtoId, config]) => {
      if (HIDDEN_PRODUCT_IDS.has(produtoId)) return;
      if (config.selecionado) {
        const produto = orcamentoOptions.find(p => p.id === produtoId);
        if (produto) {
          total += produto.precoBase;
          produto.modulos.forEach(modulo => {
            if (config.modulos[modulo.id]) total += modulo.preco;
          });
        }
      }
    });
    return total;
  };

  // Cálculo de ROI (licença permanente)
  const calcularROI = (cartState = debouncedCarrinho, custoOverride?: number) => {
    const custoBase = typeof custoOverride === 'number' ? custoOverride : calcularCustoTotal(cartState);
    if (custoBase === 0) return { porcentagem: 0, paybackMeses: 0, retornoMensal: 0 };

    // Economia mensal baseada nas seleções do carrinho
    const economiaMensal = receitaMensalEstimada;
    const retornoMensal = economiaMensal;

    // Para licença permanente, custo é único
    const paybackMeses = Math.ceil(custoBase / economiaMensal);
    const roiAnual = ((retornoMensal * 12) / custoBase) * 100;

    return {
      porcentagem: Math.round(roiAnual),
      paybackMeses,
      retornoMensal: Math.round(retornoMensal)
    };
  };

  const custoTotal = calcularCustoTotal(debouncedCarrinho);
  const recommendedIds = ['financeiro-gestao-contas-clientes','gestao-contratos','timeos'];
  const hasAllRecommended = recommendedIds.every(id => !!carrinho[id]?.selecionado);
  const hasBrandforgeModulesSelected = Object.values(carrinho['brandforge-infraestrutura']?.modulos || {}).some(Boolean);
  const discount = (recommendedApplied && hasAllRecommended && !hasBrandforgeModulesSelected)
    ? Math.round(custoTotal * 0.13)
    : 0;
  useEffect(() => {
    if (hasBrandforgeModulesSelected && recommendedApplied) {
      // Ao selecionar subitens do BrandForge, remove o desconto de fidelização
      setRecommendedApplied(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasBrandforgeModulesSelected]);

  // Aplicação automática do desconto quando os três itens recomendados forem selecionados manualmente
  useEffect(() => {
    if (hasAllRecommended && !hasBrandforgeModulesSelected && !recommendedApplied) {
      setRecommendedApplied(true);
      const dt = new Date();
      dt.setDate(dt.getDate() + 10);
      setDiscountUntil(dt.getTime());
    }
  }, [hasAllRecommended, hasBrandforgeModulesSelected, recommendedApplied]);
  const custoConsiderado = Math.max(0, custoTotal - discount);
  const roiData = calcularROI(debouncedCarrinho, custoConsiderado);

  // Para o Step Card de ROI, investimento total é o investimento único
  const investimentoTotalAnual = custoConsiderado;
  const entrada30 = Math.round(investimentoTotalAnual * 0.30);
  const saldoAte = Math.max(0, investimentoTotalAnual - entrada30);
  const parcela6 = saldoAte > 0 ? Math.ceil(saldoAte / 6) : 0;

  // Insights estimados por módulo, baseados nas soluções propostas nas etapas anteriores
  const insightsPorModulo: Array<{
    id: string;
    titulo: string;
    icon: typeof Calendar;
    corIcone?: string;
    bullets: Array<{ label: string; value: string; detalhe?: string; tipo?: 'up' | 'down' | 'neutral' }>
  }> = [
    {
      id: 'controle-financeiro',
      titulo: 'OpsUnit Controle Financeiro',
      icon: DollarSign,
      corIcone: 'text-emerald-400',
      bullets: [
        { label: 'Fechamento de caixa', value: 'D+2', tipo: 'neutral', detalhe: 'conciliação e recebimentos com baixas automáticas' },
        { label: 'Inadimplência', value: '-15% a -30%', tipo: 'down', detalhe: 'alertas e cobranças automáticas' },
        { label: 'Tempo administrativo financeiro', value: '-20% a -40%', tipo: 'down', detalhe: 'automação de boletos, repasses e despesas' }
      ]
    },
    {
      id: 'brandforge-crm',
      titulo: 'BrandForge Base Digital + CRM Vivo',
      icon: Target,
      corIcone: 'text-pink-400',
      bullets: [
        { label: 'Leads inbound', value: '+30% a +60%', tipo: 'up', detalhe: 'portal de imóveis com captação integrada' },
        { label: 'Origem rastreada', value: '≥ 90%', tipo: 'neutral', detalhe: 'integração portal → CRM com tags' },
        { label: 'Ciclo comercial', value: '-20% a -40%', tipo: 'down', detalhe: 'pipeline e tarefas com SLAs' }
      ]
    },
    {
      id: 'ops-operacoes',
      titulo: 'OpsUnit Operações',
      icon: Settings,
      corIcone: 'text-indigo-400',
      bullets: [
        { label: 'Tempo p/ fechamento de contratos', value: '-30% a -50%', tipo: 'down', detalhe: 'templates e assinatura eletrônica' },
        { label: 'Gestão de rotina', value: 'Centralizada', tipo: 'neutral', detalhe: 'imóveis, laudos, manutenções, correspondências e comunicados' },
        { label: 'Erros operacionais', value: '-20% a -40%', tipo: 'down', detalhe: 'workflows digitais e auditoria' }
      ]
    }
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          {showStepBadge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-5 rounded-full text-step-5 font-medium mb-6">🔴 ETAPA 5</div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-step-5 to-step-1 bg-clip-text text-transparent">
            {headingTitle ?? 'OTIMIZAR'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {headingSubtitle ?? 'O Futuro Integrado: Veja como todos os sistemas trabalham juntos no TimeOS.'}
          </p>
        </header>


        {/* Resultados Projetados */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Impacto Esperado em 12 meses</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="step-card step-5 text-center animate-slide-up">
              <TrendingUp className="w-8 h-8 text-step-5 mx-auto mb-4" />
              <div className="text-3xl font-bold text-step-5 mb-2">+25% a +45%</div>
              <div className="text-sm text-muted-foreground">Aumento na receita</div>
            </div>
            <div className="step-card step-5 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Clock className="w-8 h-8 text-step-5 mx-auto mb-4" />
              <div className="text-3xl font-bold text-step-5 mb-2">-40% a -60%</div>
              <div className="text-sm text-muted-foreground">Redução em tarefas manuais</div>
            </div>
            <div className="step-card step-5 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Users className="w-8 h-8 text-step-5 mx-auto mb-4" />
              <div className="text-3xl font-bold text-step-5 mb-2">+60% a +120%</div>
              <div className="text-sm text-muted-foreground">Leads qualificados (MQLs)</div>
            </div>
          </div>

          {/* ROI Summary */}
          <div className="mt-8 step-card step-5 text-center animate-slide-up">
            <h4 className="text-xl font-bold mb-4">Retorno sobre Investimento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Investimento Inicial (licença)</div>
                <div className="text-2xl font-bold">R$ {investimentoTotalAnual.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Retorno Projetado</div>
                <div className="text-2xl font-bold text-step-5">R$ {(roiData.retornoMensal * 12).toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Economia mensal estimada: <span className="font-semibold text-foreground">R$ {receitaMensalEstimada.toLocaleString()}</span>
            </div>
            <div className="mt-4 p-4 bg-step-5/10 rounded-lg">
              <div className="text-lg font-bold text-step-5">ROI: {roiData.porcentagem}%</div>
              <div className="text-sm text-muted-foreground">Payback em {roiData.paybackMeses} meses</div>
            </div>
          </div>
        </div>

        {/* Insights Estimados por Módulo */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Insights Estimados por Módulo</h3>
            <p className="text-sm text-muted-foreground">Estimativas com base nas soluções propostas; podem variar conforme porte, mix de serviços e canais.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insightsPorModulo.map((modulo, idx) => (
              <div key={modulo.id} className="step-card step-5 p-6 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-step-5/10 flex items-center justify-center ${modulo.corIcone || ''}`}>
                    <modulo.icon className={`w-5 h-5 ${modulo.corIcone || 'text-step-5'}`} />
                  </div>
                  <h4 className="text-lg font-bold">{modulo.titulo}</h4>
                </div>
                <ul className="space-y-2">
                  {modulo.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {b.tipo === 'up' && <ArrowUp className="w-4 h-4 text-emerald-400 mt-0.5" />}
                      {b.tipo === 'down' && <ArrowDown className="w-4 h-4 text-rose-400 mt-0.5" />}
                      {(!b.tipo || b.tipo === 'neutral') && <BarChart3 className="w-4 h-4 text-step-5 mt-0.5" />}
                      <div>
                        <div className="text-sm font-medium">{b.label}: <span className="text-step-5 font-semibold">{b.value}</span></div>
                        {b.detalhe && <div className="text-xs text-muted-foreground">{b.detalhe}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Composição de Orçamento */}
        {showOrcamento && (
          <div className="max-w-7xl mx-auto mb-20">
            <Card className="bg-gradient-to-br from-slate-900/90 to-blue-900/90 border border-blue-400/30 backdrop-blur-sm">
              <CardHeader className="relative text-center pb-8">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white hover:bg-white/10"
                  onClick={() => setShowOrcamento(false)}
                  aria-label="Fechar composer de orçamento"
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-full text-green-300 mb-4">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm font-medium">COMPOSITOR DE ORÇAMENTO</span>
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  Personalize Sua Solução
                </CardTitle>
                <CardDescription className="text-blue-100/70 text-lg mb-6">
                  Selecione os módulos que fazem sentido para sua operação e veja o ROI em tempo real
                </CardDescription>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      cartClear();
                      ['financeiro-gestao-contas-clientes','gestao-contratos','timeos'].forEach((id) => {
                        cartToggleProduct(id);
                      });
                      setRecommendedApplied(true);
                      const dt = new Date();
                      dt.setDate(dt.getDate() + 10);
                      setDiscountUntil(dt.getTime());
                      if (sessionId) trackCtaClick(sessionId, 'selecao_recomendada', { ids: ['financeiro-gestao-contas-clientes','gestao-contratos','timeos'] }, 'Desejada');
                    }}
                  >
                    Seleção Recomendada
                  </Button>
                  {recommendedApplied && hasAllRecommended && !hasBrandforgeModulesSelected && (
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-500/15 border border-emerald-400/30 rounded-md">
                      <span className="text-emerald-300 text-sm font-medium">Desconto de fidelização aplicado: 13%</span>
                      {discountUntil && (
                        <span className="text-emerald-200 text-xs">Válido até {new Date(discountUntil).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  )}
                </div>
                {/* Disclaimer removido conforme solicitação */}

                {/* Modelo de Precificação: somente licença permanente */}

                {custoTotal > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full">
                    <span className="text-green-300 text-sm font-medium">Investimento Total:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-green-400 font-bold">R$ {custoConsiderado.toLocaleString()}</span>
                      {discount > 0 && (
                        <span className="text-white/70 line-through text-sm">R$ {custoTotal.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Produtos Disponíveis */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold text-white mb-4">Soluções Disponíveis</h4>

                    {orcamentoOptions.filter(p => !HIDDEN_PRODUCT_IDS.has(p.id)).map((produto) => {
                      const ProdutoIcon = produto.icon;
                      const isSelected = carrinho[produto.id]?.selecionado ?? false;

                      return (
                        <Card
                          key={produto.id}
                          className={`transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-500/20 border-blue-400/50 ring-2 ring-blue-400/30'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                          onClick={() => toggleProduto(produto.id)}
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${
                                  isSelected ? 'bg-blue-500/30' : 'bg-white/10'
                                }`}>
                                  <ProdutoIcon className={`w-6 h-6 ${
                                    isSelected ? 'text-blue-300' : 'text-white'
                                  }`} />
                                </div>
                                <div>
                                  <CardTitle className="text-white text-lg">{produto.nome}</CardTitle>
                                  <CardDescription className="text-blue-100/70">
                                    {produto.descricao}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-400">
                                  R$ {produto.precoBase.toLocaleString()}
                                </div>
                                <div className="text-sm text-green-300">investimento inicial</div>
                              </div>
                            </div>
                          </CardHeader>

                          {(isSelected || produto.id === 'brandforge-infraestrutura') && (
                            <CardContent className="pt-0">
                              <div className="space-y-3">
                                <h5 className="text-sm font-semibold text-white mb-3">Módulos Adicionais</h5>
                                {produto.modulos.map((modulo) => {
                                  const isModuloSelected = carrinho[produto.id]?.modulos?.[modulo.id] ?? false;

                                  return (
                                    <div
                                      key={modulo.id}
                                      className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                                        isModuloSelected
                                          ? 'bg-blue-500/20 border border-blue-400/30'
                                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleModulo(produto.id, modulo.id);
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                        {modulo.obrigatorio ? (
                                          <Check className="w-4 h-4 text-green-400" />
                                        ) : (
                                          <div className={`w-4 h-4 rounded border-2 ${
                                            isModuloSelected ? 'bg-blue-500 border-blue-500' : 'border-white/30'
                                          }`}>
                                            {isModuloSelected && <Check className="w-3 h-3 text-white m-0.5" />}
                                          </div>
                                        )}
                                        <div>
                                          <div className="text-white font-medium">{modulo.nome}</div>
                                          {modulo.obrigatorio && (
                                            <Badge className="bg-green-500/20 text-green-300 text-xs">
                                              Obrigatório
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-green-400 font-bold">
                                        +R$ {modulo.preco.toLocaleString()}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                  </div>

                  {/* Resumo do Orçamento */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold text-white mb-4">Resumo do Orçamento</h4>

                    {/* Resumo dos Produtos Selecionados */}
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          Produtos Selecionados
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Object.keys(carrinho).filter(id => !HIDDEN_PRODUCT_IDS.has(id) && carrinho[id]?.selecionado).length === 0 ? (
                          <p className="text-blue-100/70 text-center py-4">
                            Nenhum produto selecionado
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {Object.entries(carrinho)
                              .filter(([id, config]) => !HIDDEN_PRODUCT_IDS.has(id) && config.selecionado)
                              .map(([produtoId]) => {
                                const produto = orcamentoOptions.find(p => p.id === produtoId);
                                if (!produto) return null;

                                const modulosSelecionados = produto.modulos.filter(
                                  m => carrinho[produtoId]?.modulos?.[m.id]
                                );

                                // Preço base (licença permanente)
                                const precoBaseAjustado = produto.precoBase;

                                return (
                                  <div key={produtoId} className="p-3 bg-white/5 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="text-white font-medium">{produto.nome}</h5>
                                      <div className="text-right">
                                        <span className="text-green-400 font-bold">
                                          R$ {precoBaseAjustado.toLocaleString()}
                                        </span>
                                        
                                      </div>
                                    </div>
                                    {modulosSelecionados.length > 0 && (
                                      <div className="text-sm text-blue-100/70 space-y-1">
                                        {modulosSelecionados.map(modulo => {
                                          const precoModuloAjustado = modulo.preco;

                                          return (
                                            <div key={modulo.id} className="flex justify-between">
                                              <span>• {modulo.nome}</span>
                                              <div className="text-right">
                                                <span className="text-green-400">
                                                  +R$ {precoModuloAjustado.toLocaleString()}
                                                </span>
                                                
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Cálculo de ROI */}
                      <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-400/30">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-green-400" />
                            Calculadora de ROI Inteligente
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <span className="text-white">Investimento Total</span>
                                <div className="text-right flex items-baseline gap-2">
                                  <span className="text-green-400 font-bold text-xl">R$ {custoConsiderado.toLocaleString()}</span>
                                  {discount > 0 && (
                                    <span className="text-white/70 line-through text-sm">R$ {custoTotal.toLocaleString()}</span>
                                  )}
                                </div>
                              </div>

                              {custoTotal > 0 && (
                                <>
                                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    <span className="text-white">Economia Mensal Estimada</span>
                                    <span className="text-blue-400 font-bold">
                                      R$ {roiData.retornoMensal.toLocaleString()}
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    <span className="text-white flex items-center gap-2">
                                      <Timer className="w-4 h-4" />
                                      Payback
                                    </span>
                                    <span className="text-purple-400 font-bold">
                                      {roiData.paybackMeses} meses
                                    </span>
                                  </div>

                                  <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-400/30">
                                    <div className="text-center">
                                      <div className="text-3xl font-bold text-green-400 mb-1">
                                        {roiData.porcentagem}%
                                      </div>
                                      <div className="text-sm text-green-300">ROI Projetado (12 meses)</div>
                                    </div>
                                  </div>
                                </>
                              )}

                              <div className="text-xs text-blue-100/60 text-center">
                                * Cálculos baseados em economia de 30% nos custos operacionais (investimento único)
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Condições de Pagamento */}
                        <Card className="bg-white/5 border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-blue-300" />
                              Condições de Pagamento
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3 text-blue-100/80">
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span>Entrada</span>
                                <span className="font-semibold text-white">30%</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span>Saldo</span>
                                <span className="font-semibold text-white">até 6x no boleto, pix ou cartão</span>
                              </div>
                              {custoConsiderado > 0 && (
                                <div className="mt-1 text-sm text-blue-100/70">
                                  <div className="flex items-center justify-between">
                                    <span>Entrada estimada (30%)</span>
                                    <span className="text-green-300 font-medium">R$ {entrada30.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Saldo em até 6x</span>
                                    <span className="text-green-300 font-medium">R$ {saldoAte.toLocaleString()} ({parcela6.toLocaleString()} / mês)</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setShowOrcamento(false);
                            cartClear();
                          }}
                          variant="outline"
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Voltar
                        </Button>
                        <Button
                          onClick={() => cartClear()}
                          variant="outline"
                          className="border-red-400/30 text-red-300 hover:bg-red-500/10"
                          disabled={custoTotal === 0}
                        >
                          Limpar Carrinho
                        </Button>
                      </div>
                      <Button
                        onClick={() => {
                          // Build WhatsApp message with cart summary
                          const selections = Object.entries(carrinho)
                            .filter(([, cfg]) => cfg.selecionado)
                            .map(([id]) => orcamentoOptions.find(p => p.id === id)?.nome || id)
                            .map(nome => `- ${nome}`)
                            .join('%0A');
                          const totalStr = custoConsiderado.toLocaleString();
                          const msgParts = [
                            `Olá, gostaria de solicitar uma proposta detalhada:`,
                            `Investimento Total: R$ ${totalStr}`,
                            ...(discount > 0 ? [`(Com desconto de fidelização 13%${discountUntil ? `, válido até ${new Date(discountUntil).toLocaleDateString('pt-BR')}` : ''})`] : []),
                            `Produtos:`,
                            selections
                          ];
                          const msg = msgParts.join('%0A');
                          window.open(`https://wa.me/5511943334229?text=${encodeURIComponent(msg)}`, '_blank');
                          // Track action
                          if (sessionId) {
                            trackCtaClick(sessionId, 'solicitar_proposta', { step: 'Otimizar' });
                          }
                          // Complete the step
                          onComplete();
                        }}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3"
                        disabled={custoTotal === 0}
                      >
                        Solicitar Proposta Detalhada
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

                  {/* CTA Final - Futurista e Premium */}
                  {!showOrcamento && (
                    <div className="max-w-4xl mx-auto text-center">
                      <div>
                        <h4 className="text-3xl font-bold text-white mb-4">
                          Pronto para Transformar sua Operação?
                        </h4>
                        <p className="text-xl text-blue-100/80 mb-8">
                          Esta não é apenas uma proposta. É o futuro do seu negócio sendo construído agora mesmo.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button
                          onClick={() => {
                            setShowOrcamento(true);
                            if (sessionId) trackCtaClick(sessionId, "customizar_orcamento", { step: "Otimizar" });
                          }}
                          size="lg"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-4 text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 glow-effect"
                          aria-label="Personalizar orçamento com suas necessidades específicas"
                        >
                          <ShoppingCart className="w-6 h-6 mr-3" />
                          Customizar Orçamento
                        </Button>
                        <Button
                          onClick={() => {
                            if (sessionId) trackCtaClick(sessionId, "agendar_conversa_estrategica", { step: "Otimizar" });
                            onComplete();
                          }}
                          size="lg"
                          variant="outline"
                          className="px-8 py-4 text-lg"
                        >
                          agendar conversa estratégica para implementar soluções
                        </Button>

                      </div>
                    </div>
                  )}

  </div>
</section>
);
};
