import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Heart, Layers, Server, Shield, Rocket, Tag, Database, Boxes, FileText } from "lucide-react";
import { trackFavorite, trackFlip, trackTagToggle, trackStepComplete, trackCtaClick } from "@/lib/sdk";


interface ModuleItem {
  id: string;
  title: string;
  objetivo: string;
  fluxos: Array<{ id: string; title: string; bullets: string[] }>;
  entregaveis: string[];
  stackMinima: string[];
  kpis: string[];
  tags: string[];
}

interface Step3IdentificarProps {
  onNext: () => void;
  sessionId?: string;
}

const BLUEPRINT = {
  cliente: "Proposta Demo – Mentorias Premium",
  consultoria: "Q7 Ops",
  objetivo:
    "Entregar um blueprint enxuto, validável em campo em ~90 dias por módulo, com foco em baixo risco, alto impacto e evolução natural para TimeOS.",
  principios: ["Leve", "Modular", "Integrável", "Reversível"],
  camadas: {
    interface:
      "Interface & Painéis (Web App) – Next.js/React + Tailwind → dashboards e formulários (leads, pipeline, contratos, faturas, portal de clientes)",
    orquestracao:
      "Orquestração & Agentes – n8n/Make/Zapier (MVP) para fluxos simples; workers em Node.js/TS para lógicas críticas",
    integracoes:
      "Integrações – WhatsApp (Meta Cloud API), Assinatura eletrônica (Clicksign/DocuSign), Gateway de Pagamentos (Asaas, Pagar.me), Google Calendar; planilhas apenas no MVP quando necessário",
    dados: "Dados – PostgreSQL + Redis (filas/cache) + Storage (S3/Backblaze)",
    seguranca:
      "Segurança & LGPD – Auth.js, perfis (admin/consultor/financeiro), trilhas de auditoria, retenção/consentimento",
    deploy: "Deploy – Docker em VPS com backups diários",
  },
  conexao: {
    a: [
      "Cenário A (APIs nativas): WhatsApp Cloud, Clicksign/DocuSign, Gateway de Pagamentos, Google Calendar",
    ],
    b: [
      "Cenário B (sem API): ingestão CSV/planilha no MVP",
      "Automação leve via n8n/Make",
      "Calendário via ICS/iCal quando necessário",
    ],
  },
};

const MODULES: ModuleItem[] = [
  {
    id: "financeiro_crm",
    title: "OpsUnit Financeiro Vivo + CRM Vivo (MVP ~90 dias)",
    objetivo:
      "Unificar leads e clientes; integrar proposta → contrato → fatura com baixa automática; garantir previsibilidade de caixa e dashboards em tempo real.",
    fluxos: [
      { id: "A", title: "Pipeline de Leads", bullets: [
        "Lead captado (site, bio IG, WhatsApp) → pipeline CRM",
      ]},
      { id: "B", title: "Proposta → Contrato → Fatura", bullets: [
        "Proposta digital vinculada ao card → contrato assinado online → fatura emitida",
      ]},
      { id: "C", title: "Conciliação de Recebíveis", bullets: [
        "Cartão, Pix, boleto com baixa automática",
      ]},
      { id: "D", title: "Alertas", bullets: [
        "Inadimplência e vencimentos (WhatsApp/E-mail)",
      ]},
    ],
    entregaveis: [
      "Painel Financeiro (AP/AR, fluxo de caixa, inadimplência)",
      "Painel Comercial (pipeline, conversão, ticket médio)",
      "Integrações: WhatsApp Cloud, Clicksign/DocuSign, gateway de pagamentos",
    ],
    stackMinima: [
      "Next.js (painéis)",
      "Node.js/TS (serviços)",
      "n8n (gatilhos)",
      "Postgres",
      "Redis",
      "Clicksign",
      "Gateway pagamentos",
    ],
    kpis: [
      "100% propostas → contrato → fatura",
      "Fechamento de caixa em D+2",
      "+20% taxa de conversão",
      "Inadimplência monitorada em D+7/D+30",
    ],
    tags: ["financeiro", "crm", "contratos", "faturas", "whatsapp"],
  },
  {
    id: "area_cliente",
    title: "Área do Cliente (Mentoria Premium) (MVP ~90 dias)",
    objetivo:
      "Portal exclusivo para mentorados com clareza de agenda, trilhas, entregáveis e checkpoints; tirar operação do WhatsApp e criar experiência premium escalável.",
    fluxos: [
      { id: "A", title: "Onboarding", bullets: [
        "Automático após pagamento",
      ]},
      { id: "B", title: "Gestão da Mentoria", bullets: [
        "Upload de materiais, agenda de sessões, registro de tarefas/conclusões",
      ]},
      { id: "C", title: "Feedback/NPS", bullets: [
        "NPS/feedback pós-sessão direto no portal",
      ]},
    ],
    entregaveis: [
      "Portal web por cliente (acesso individual)",
      "Trilhas digitais de mentoria com progresso",
      "Checklists e tarefas vinculadas",
    ],
    stackMinima: [
      "Next.js (portal)",
      "Node.js/TS (trilhas/tarefas)",
      "Postgres",
      "S3 (materiais)",
      "n8n (notificações)",
    ],
    kpis: [
      "≥ 80% sessões registradas no portal",
      "NPS ≥ 70",
      "-40% tempo em organização manual",
    ],
    tags: ["mentoria", "portal", "nps", "trilhas"],
  },
  {
    id: "brandforge",
    title: "BrandForge (Presença Digital) (MVP ~90 dias)",
    objetivo:
      "Criar autoridade digital com site institucional enxuto e CTAs de captação; integrar leads direto ao CRM com tags de origem.",
    fluxos: [
      { id: "A", title: "LP → CRM", bullets: [
        "Landing page com formulário → CRM",
      ]},
      { id: "B", title: "CTA c/ Tracking", bullets: [
        "Call‑to‑Action para WhatsApp com tracking",
      ]},
      { id: "C", title: "Conteúdos", bullets: [
        "Biblioteca de conteúdos básicos para captação",
      ]},
    ],
    entregaveis: [
      "Site 1.0 (institucional + formulário)",
      "Integração com CRM Vivo",
      "Painel de leads por origem",
    ],
    stackMinima: [
      "Next.js",
      "Postgres",
      "API CRM",
      "Meta Pixel",
    ],
    kpis: [
      "+30% leads inbound via site",
      "≥ 90% leads com origem rastreada",
    ],
    tags: ["presenca_digital", "lp", "crm", "pixel"],
  },
];

const DATA_MODEL = {
  tabelas: [
    "Lead",
    "Cliente",
    "Proposta",
    "Contrato",
    "Fatura",
    "SessãoMentoria",
    "Trilha",
    "Tarefa",
    "Usuário",
    "Perfil",
    "AuditLog",
  ],
  rels: [
    "Cliente 1‑N Proposta/Contrato/Fatura/SessãoMentoria",
    "Trilha 1‑N Tarefa",
  ],
  padroes: [
    "UUID",
    "timestamps",
    "soft‑delete",
    "versionamento de templates",
    "encrypt at rest (campos sensíveis)",
    "masking na UI",
  ],
};

const SECURITY = {
  bases: ["Execução de contrato", "Legítimo interesse (transparência)"],
  controles: [
    "Perfis de acesso (admin/consultor/financeiro)",
    "2FA opcional",
    "TLS",
    "Backup diário + retenção 30 dias",
    "Logs imutáveis (WORM) para contratos",
  ],
  privacidade: ["Consentimento/opt‑out em comunicações WhatsApp/E‑mail"],
};

const DEPLOY = {
  infra: ["VPS 2–4 vCPU / 4–8 GB RAM", "Docker", "Nginx", "Let’s Encrypt"],
  cicd: ["GitHub Actions"],
  observability: ["Uptime Kuma/Healthchecks", "Logs e métricas básicas"],
};

const ROADMAP = [
  "Cockpit único integrando Comercial + Financeiro + Entrega",
  "SSO, Data Lake leve (Supabase + dbt)",
  "Recomendações inteligentes (agenda, cobrança, upsell)",
  "Comando via WhatsApp para consultas rápidas",
];

const CRITERIA = [
  "Financeiro + CRM: 100% propostas → contrato → fatura; fechamento de caixa D+2; inadimplência controlada",
  "Área do Cliente: ≥ 80% sessões registradas no portal; NPS ≥ 70",
  "BrandForge: ≥ 30% leads inbound pelo site; ≥ 90% origem rastreada",
];

export const Step3Identificar = ({ onNext, sessionId }: Step3IdentificarProps) => {
  const selectedTagsRef = useRef<Record<string, boolean>>({});
  const favoritesRef = useRef<Record<string, boolean>>({});
  const flippedRef = useRef<Record<string, number>>({});

  const categories = useMemo(() => [
    "Financeiro",
    "CRM",
    "Mentoria",
    "Presença Digital",
    "Dados",
    "Governança",
  ], []);

  const toggleFavorite = (id: string) => {
    favoritesRef.current[id] = !favoritesRef.current[id];
    if (sessionId) trackFavorite(sessionId, id, !!favoritesRef.current[id]);
  };

  const flipCard = (id: string) => {
    const count = (flippedRef.current[id] || 0) + 1;
    flippedRef.current[id] = count;
    const to = count % 2 === 1 ? 'back' : 'front';
    if (sessionId) trackFlip(sessionId, id, to);
  };

  const toggleTag = (id: string, tag: string) => {
    const key = `${id}:${tag}`;
    selectedTagsRef.current[key] = !selectedTagsRef.current[key];
    if (sessionId) trackTagToggle(sessionId, id, tag, !!selectedTagsRef.current[key]);
  };



  const handleNext = () => {
    if (sessionId) {
      const favs = Object.keys(favoritesRef.current).filter(k=>favoritesRef.current[k]);
      const tags = Object.keys(selectedTagsRef.current).filter(k=>selectedTagsRef.current[k]);
      trackStepComplete(sessionId, "Identificar", { favorites: favs, tags });
    }
    onNext();
  };

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-3 rounded-full text-step-3 font-medium mb-6">
            🟢 ETAPA 3
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-step-3 to-step-4 bg-clip-text text-transparent">
            IDENTIFICAR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Arquitetura leve + módulos MVP integráveis aos sistemas atuais da operação de mentorias premium.
          </p>
        </header>

        {/* Filtros por Categoria */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map(cat => (
              <Badge key={cat} variant="secondary" className="cursor-pointer">
                <Layers className="w-3 h-3 mr-1" /> {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* Arquitetura */}
        <Card className="step-card step-3 mb-10 bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2"><Layers className="w-5 h-5 text-step-3" /> Arquitetura Leve + Stack de Automação Mínima</CardTitle>
            <CardDescription>Princípios técnicos + integração com sistema atual para implementação sem ruptura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-step-3/10 text-step-3">Cliente: {BLUEPRINT.cliente}</Badge>
              <Badge variant="secondary" className="bg-step-3/10 text-step-3">Consultoria: {BLUEPRINT.consultoria}</Badge>
              <Badge variant="secondary" className="bg-step-3/10 text-step-3">Objetivo: ~90 dias/módulo</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{BLUEPRINT.objetivo}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Princípios</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {BLUEPRINT.principios.map((p) => (<li key={p}>{p}</li>))}
                </ul>
                <h3 className="text-sm font-semibold text-foreground mt-4 mb-2 flex items-center gap-2"><Server className="w-4 h-4 text-step-3" /> Camadas</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>{BLUEPRINT.camadas.interface}</li>
                  <li>{BLUEPRINT.camadas.orquestracao}</li>
                  <li>{BLUEPRINT.camadas.integracoes}</li>
                  <li>{BLUEPRINT.camadas.dados}</li>
                  <li>{BLUEPRINT.camadas.seguranca}</li>
                  <li>{BLUEPRINT.camadas.deploy}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-step-3" />
                  Conexão com sistemas atuais
                </h3>

                {/* Cenário A */}
                <div className="mb-4 p-4 rounded-xl border-2 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm font-semibold text-green-700 dark:text-green-400">Cenário A: APIs nativas</div>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                    {BLUEPRINT.conexao.a.map((c) => (
                      <li key={c} className="leading-relaxed">{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Cenário B */}
                <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="text-sm font-semibold text-amber-700 dark:text-amber-400">Cenário B: Sem API</div>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                    {BLUEPRINT.conexao.b.map((c) => (
                      <li key={c} className="leading-relaxed">{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destaque da Integração */}
        <Card className="step-card bg-gradient-to-r from-step-3/10 to-step-4/10 border-step-3/30 mb-10">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-step-3">🎯 Diferencial Competitivo</h3>
              <p className="text-muted-foreground">
                <strong>Sem ruptura dos sistemas atuais.</strong> Implementação gradual que se integra ao que já funciona,
                garantindo continuidade dos processos enquanto adiciona automação inteligente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Conexão por Módulo */}
        <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300 mb-10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><FileText className="w-5 h-5 text-step-3" /> Integração por Módulo</CardTitle>
            <CardDescription>Como cada solução se conecta aos sistemas atuais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">Financeiro + CRM Vivo</h4>
                  <p className="text-sm text-muted-foreground">
                    Proposta → contrato → fatura; conciliação com baixa automática; alertas de inadimplência.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">Área do Cliente</h4>
                  <p className="text-sm text-muted-foreground">
                    Onboarding após pagamento; sessões, trilhas e tarefas integradas ao CRM.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-pink-50/50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800">
                  <h4 className="text-sm font-semibold text-pink-700 dark:text-pink-400 mb-2">BrandForge (Presença Digital)</h4>
                  <p className="text-sm text-muted-foreground">
                    LP → CRM com origem; CTA WhatsApp com tracking; painel por origem.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">Integrações & Pagamentos</h4>
                  <p className="text-sm text-muted-foreground">
                    WhatsApp Cloud, Clicksign/DocuSign, Google Calendar e gateways (Asaas/Pagar.me).
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MODULES.map((mod) => (
            <Card key={mod.id} className="p-4 group bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300 hover:scale-[1.01]">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Boxes className="w-4 h-4 text-step-3" /> {mod.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{mod.objetivo}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="icon" variant="ghost" aria-label="Favoritar"
                    onClick={() => toggleFavorite(mod.id)}
                  >
                    <Heart className={`w-5 h-5 ${favoritesRef.current[mod.id] ? 'text-red-500 fill-red-500' : ''}`} />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Salvar para revisar"
                    onClick={() => toggleFavorite(mod.id)}
                  >
                    <Bookmark className={`w-5 h-5 ${favoritesRef.current[mod.id] ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              {mod.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {mod.tags.map(tag => (
                    <span key={`${mod.id}-${tag}`} className="tag-pill step-3 cursor-pointer"
                      onClick={() => toggleTag(mod.id, tag)}
                      role="button" aria-label={`Tag ${tag}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Fluxos (Swimlanes) */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Layers className="w-3 h-3 text-step-3" />
                  Fluxos (swimlanes)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto">
                  {mod.fluxos.map(f => (
                    <div key={f.id} className="p-3 rounded-lg bg-muted/30 overflow-hidden">
                      <div className="text-xs font-semibold mb-1 line-clamp-1">{f.id}) {f.title}</div>
                      <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1 max-h-20 overflow-y-auto pr-1">
                        {f.bullets.map(b => (<li key={b} className="truncate">{b}</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frente e Verso */}
              <div className="mt-4">
                <div className="relative [perspective:1200px] overflow-hidden rounded-xl">
                  <div
                    className="absolute inset-0 rounded-lg bg-card/80 supports-[backdrop-filter]:backdrop-blur border border-border/60 p-4 [backface-visibility:hidden] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] transition-transform duration-500"
                  >
                    <div className="text-sm font-medium mb-3">Entregáveis</div>
                    <Button size="sm" variant="secondary" className="mt-3" onClick={() => flipCard(mod.id)}>
                      Ver entregáveis
                    </Button>
                  </div>
                  <div
                    className="absolute inset-0 rounded-lg bg-muted/80 supports-[backdrop-filter]:backdrop-blur border border-border/60 p-4 [backface-visibility:hidden] [transform-style:preserve-3d] [transform:rotateY(180deg)] group-hover:[transform:rotateY(0deg)] transition-transform duration-500 overflow-y-auto"
                  >
                    <div className="text-sm font-medium mb-3">Entregáveis</div>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                      {mod.entregaveis.map(e => (<li key={e}>{e}</li>))}
                    </ul>
                    <Button size="sm" variant="outline" className="mt-4" onClick={() => flipCard(mod.id)}>
                      Voltar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Secções adicionais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database className="w-4 h-4 text-step-3" /> Dados & Modelo de Informação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Tabelas principais</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DATA_MODEL.tabelas.map(t => (<li key={t}>{t}</li>))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">Relacionamentos</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DATA_MODEL.rels.map(r => (<li key={r}>{r}</li>))}
                  </ul>
                  <div className="font-medium mt-3 mb-1">Padrões</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DATA_MODEL.padroes.map(p => (<li key={p}>{p}</li>))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4 text-step-3" /> Segurança, LGPD e Governança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Bases legais</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {SECURITY.bases.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                  <div className="font-medium mt-3 mb-1">Privacidade</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {SECURITY.privacidade.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">Controles</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {SECURITY.controles.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Server className="w-4 h-4 text-step-3" /> Deploy & Observability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Infra</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DEPLOY.infra.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">CI/CD</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DEPLOY.cicd.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">Observability</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DEPLOY.observability.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Rocket className="w-4 h-4 text-step-3" /> Roadmap de Evolução para TimeOS</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {ROADMAP.map(x => (<li key={x}>{x}</li>))}
              </ul>
            </CardContent>
          </Card>

          <Card className="step-card lg:col-span-2 bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layers className="w-4 h-4 text-step-3" /> Critérios de Aceite por Módulo (MVP)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {CRITERIA.map(x => (<li key={x}>{x}</li>))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Badge variant="secondary" className="bg-step-3/10 text-step-3">Cliente: {BLUEPRINT.cliente}</Badge>
          <Badge variant="secondary" className="bg-step-3/10 text-step-3">Data: Setembro/2025</Badge>
          <Badge variant="secondary" className="bg-step-3/10 text-step-3">Consultoria: {BLUEPRINT.consultoria}</Badge>

        </div>

        <div className="text-center mt-10">
          <Button
            onClick={() => { if (sessionId) { trackStepComplete(sessionId, "Identificar", { favorites: Object.keys(favoritesRef.current).filter(k=>favoritesRef.current[k]), tags: Object.keys(selectedTagsRef.current).filter(k=>selectedTagsRef.current[k]) }); } onNext(); }}
            size="lg"
            className="bg-step-3 hover:bg-step-3/90 text-primary-foreground font-semibold px-8 py-3 text-lg"
          >
            Avançar para criação do plano
          </Button>
        </div>
      </div>
    </section>
  );
};
