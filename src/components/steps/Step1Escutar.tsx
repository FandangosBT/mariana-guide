import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ClipboardList, Rocket, TrendingUp, CalendarDays, User, CheckCircle2, Target } from "lucide-react";
import { generateScreenshotPDF } from "@/utils/pdf-generator";
import { trackCtaClick, trackStepComplete } from "@/lib/sdk";

interface Step1EscutarProps {
  onNext: () => void;
  sessionId?: string;
}

const scannerData = {
  cliente: "Larissa Carvalho Business Growth",
  data: "Setembro/2025",
  consultoria: "Q7 Ops",
  contextoGeral:
    "A agência oferece serviços de marketing digital e mentoria premium, porém enfrenta dificuldades de centralização e organização: informações dispersas em WhatsApp, planilhas e documentos; ausência de página institucional (reduz credibilidade); receio de prospectar por medo de sobrecarga; e a necessidade de uma Área do Cliente para entregar mentorias com mais profissionalismo.",
  processos: {
    financeiro: [
      "Controle manual em planilhas (fluxo de caixa, contas a pagar/receber).",
      "Orçamentos feitos de forma pouco automatizada.",
      "Falta de relatórios consolidados para previsibilidade.",
    ],
    gestaoClientesLeads: [
      "Cadastros descentralizados (planilhas, WhatsApp, documentos).",
      "Gestão de senhas e acessos feita de forma improvisada.",
      "Leads chegam por diferentes canais sem CRM integrado.",
      "Área de clientes inexistente (mentoria entregue toda via WhatsApp).",
    ],
    contratosServicos: [
      "Contratos e faturas geridos manualmente.",
      "Serviços contratados não visíveis em um único painel.",
      "KPIs de campanhas acompanhados de forma fragmentada.",
    ],
    conteudoOperacao: [
      "Produção de conteúdo parcial, sem centralização de indicadores.",
      "KPIs manuais, sem integração em dashboards.",
      "Falta de painel único para visão estratégica.",
    ],
  },
  gargalos: [
    "Desperdício de tempo com múltiplos controles manuais.",
    "Perda de oportunidades: leads não organizados em pipeline.",
    "Falta de previsibilidade financeira: sem visão de fluxo de caixa em tempo real.",
    "Imagem comprometida: ausência de site institucional reduz credibilidade.",
    "Escalabilidade bloqueada: sem centralização, evita-se prospectar novos clientes.",
  ],
  alavancas: {
    curtoPrazo: [
      "BrandForge™ – Base Digital: página institucional + identidade digital profissional.",
      "OpsUnit – CRM Vivo + Financeiro Vivo: centralização de clientes, contratos, faturas e fluxo de caixa.",
      "Área do Cliente (OpsUnit): portal exclusivo para mentorias premium.",
    ],
    medioPrazo: [
      "OpsUnit – KPIs Automatizados: dashboards em tempo real para campanhas.",
      "OpsUnit – Contratos Digitais: gestão integrada e assinatura online.",
    ],
    longoPrazo: [
      "TimeOS™ – Painel Integrado: unificação total (financeiro, clientes, leads, contratos e KPIs).",
      "PrimeTailor™ – Personalizações Sob Medida: fluxos exclusivos quando necessário.",
    ],
  },
  jornada: {
    passo1:
      "BrandForge™ + CRM Vivo: Site institucional e base digital organizada; Cadastro único de clientes e leads.",
    passo2:
      "Financeiro Vivo + Área do Cliente: Fluxo de caixa automatizado; Portal exclusivo para entrega da mentoria.",
    passo3:
      "KPIs Automatizados + Contratos Digitais: Dashboards em tempo real; Contratos e faturas digitais.",
    passo4:
      "PrimeTailor™ – Personalizações Sob Medida (se necessário): Ajustes específicos aos fluxos da operação.",
    passoFinal:
      "TimeOS™ – Cockpit centralizado da agência. Escalabilidade segura com previsibilidade.",
  },
  ganhos: [
    "+40% de tempo liberado com centralização.",
    "Previsibilidade financeira em tempo real.",
    "Redução de erros e retrabalho.",
    "Profissionalização da entrega (área do cliente premium).",
    "Credibilidade com presença digital sólida (site institucional).",
    "Segurança para prospectar novos clientes sem medo de desorganização.",
  ],
  resumo:
    "Hoje você tem uma agência com potencial enorme, mas sem painel de controle. Nosso objetivo é forjar essa base digital, organizar contratos, finanças e clientes em um só lugar e criar uma área premium para suas mentorias. Assim, você terá clareza, previsibilidade e confiança para crescer sem perder o controle.",
};

export const Step1Escutar = ({ onNext, sessionId }: Step1EscutarProps) => {
  const generateScannerPDF = () => {
    if (sessionId) {
      trackCtaClick(sessionId, "scanner_pdf_download", { step: "Escutar" });
    }
    // Criar link para download do arquivo PDF
    const link = document.createElement('a');
    link.href = '/Scanner-Operacional-EPICO-Larissa-Carvalho-Business-Growth.pdf';
    link.download = 'Scanner-Operacional-EPICO-Larissa-Carvalho-Business-Growth.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNext = () => {
    if (sessionId) {
      trackStepComplete(sessionId, "Escutar", { scannerPreset: "LarissaCardosoBusinessGrowth" });
    }
    onNext();
  };

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-1 rounded-full text-step-1 font-medium mb-4">
            🟣 ETAPA 1
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-step-1 to-step-2 bg-clip-text text-transparent">
            ESCUTAR
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Scanner Operacional ÉPICO — diagnóstico visual e interativo, pronto para apresentação.
          </p>
        </header>

        {/* Ações Rápidas */}
        <div className="flex justify-center mb-6 gap-3">
          <Button variant="outline" onClick={generateScannerPDF} className="border-step-1 text-step-1">
            <FileText className="w-4 h-4 mr-2" /> Gerar PDF do Scanner
          </Button>
        </div>

        {/* Conteúdo (para screenshot) */}
        <div id="scanner-epico" className="max-w-5xl mx-auto space-y-6">
          {/* Cabeçalho do Relatório */}
          <Card className="step-card step-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-step-1" /> Scanner Operacional ÉPICO
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-step-1/10 text-step-1">Cliente: {scannerData.cliente}</Badge>
              <Badge variant="secondary" className="bg-step-1/10 text-step-1">Data: {scannerData.data}</Badge>
              <Badge variant="secondary" className="bg-step-1/10 text-step-1">Consultoria: {scannerData.consultoria}</Badge>
            </CardContent>
          </Card>

          <Accordion type="multiple" className="space-y-4">
            {/* 1. Contexto Geral */}
            <AccordionItem value="contexto" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-step-1" /> 1. Contexto Geral</div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="step-card step-1">
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{scannerData.contextoGeral}</p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Processos Atuais */}
            <AccordionItem value="processos" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-step-1" /> 2. Processos Atuais (Mapeamento)</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(scannerData.processos).map(([k, items]) => (
                    <Card key={k} className="step-card step-1">
                      <CardHeader>
                        <CardTitle className="text-base capitalize">{formatKey(k)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {(items as string[]).map((it, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-step-1 mt-0.5" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Gargalos Invisíveis */}
            <AccordionItem value="gargalos" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-step-1" /> 3. Gargalos Invisíveis (Impacto Real)</div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="step-card step-1">
                  <CardContent>
                    <ul className="space-y-2">
                      {scannerData.gargalos.map((it, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-step-1 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Alavancas Tecnológicas */}
            <AccordionItem value="alavancas" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><Rocket className="w-4 h-4 text-step-1" /> 4. Alavancas Tecnológicas (Oportunidades)</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="step-card step-1">
                    <CardHeader><CardTitle className="text-base">🎯 Curto Prazo</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {scannerData.alavancas.curtoPrazo.map((it, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-step-1 mt-0.5" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="step-card step-1">
                    <CardHeader><CardTitle className="text-base">🛠 Médio Prazo</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {scannerData.alavancas.medioPrazo.map((it, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-step-1 mt-0.5" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="step-card step-1">
                    <CardHeader><CardTitle className="text-base">🚀 Longo Prazo</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {scannerData.alavancas.longoPrazo.map((it, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-step-1 mt-0.5" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Jornada Recomendada */}
            <AccordionItem value="jornada" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><Badge variant="secondary" className="bg-step-1/20 text-step-1">Roadmap</Badge> 5. Jornada Recomendada</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["1️⃣ Piloto Operacional", scannerData.jornada.passo1],
                    ["2️⃣ Documentos", scannerData.jornada.passo2],
                    ["3️⃣ Estoque", scannerData.jornada.passo3],
                    ["4️⃣ Marketing", scannerData.jornada.passo4],
                  ].map(([title, text]) => (
                    <Card key={title as string} className="step-card step-1">
                      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-muted-foreground">{text as string}</p></CardContent>
                    </Card>
                  ))}
                  <Card className="step-card step-1 md:col-span-2">
                    <CardHeader><CardTitle className="text-base">5️⃣ Passo Final – TimeOS</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">{scannerData.jornada.passoFinal}</p></CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 6. Ganhos Esperados */}
            <AccordionItem value="ganhos" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-step-1" /> 6. Ganhos Esperados</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {scannerData.ganhos.map((g, idx) => (
                    <Card key={idx} className="step-card step-1">
                      <CardContent className="flex items-center gap-2 py-4">
                        <Target className="w-5 h-5 text-step-1" />
                        <span className="text-sm text-muted-foreground">{g}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 7. Resumo */}
            <AccordionItem value="resumo" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-step-1" /> 7. Resumo</div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="step-card step-1">
                  <CardContent>
                    <blockquote className="border-l-2 border-step-1 pl-4 text-muted-foreground italic">
                      “{scannerData.resumo}”
                    </blockquote>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button onClick={handleNext} size="lg" className="bg-step-1 hover:bg-step-1/90 text-primary-foreground font-semibold px-8 py-3 text-lg">
            Continuar
          </Button>
        </div>
      </div>
    </section>
  );
};

function formatKey(key: string) {
  switch (key) {
    case "financeiro":
      return "Financeiro";
    case "gestaoClientesLeads":
      return "Gestão de Clientes e Leads";
    case "contratosServicos":
      return "Contratos e Serviços";
    case "conteudoOperacao":
      return "Conteúdo & Operação";
    default:
      return key;
  }
}
