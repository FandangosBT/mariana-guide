import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles, TrendingUp, Clock, Users } from "lucide-react";
import { Step4Criar } from "@/components/steps/Step4Criar";
import { Step5Otimizar } from "@/components/steps/Step5Otimizar";
import { MeetingScheduler } from "@/components/MeetingScheduler";
// removed journey PDF download CTA per request
import { TechAppendix } from "@/components/TechAppendix";

interface StepDesejadaProps {
  onComplete: () => void;
  sessionId?: string;
}

export const StepDesejada = ({ onComplete, sessionId }: StepDesejadaProps) => {
  const scrollToOrcamento = useCallback(() => {
    const el = document.getElementById('desejada-orcamento');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-5 rounded-full text-step-5 font-medium mb-4">
            🔴 PASSO 2
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-step-5 to-step-1 bg-clip-text text-transparent">
            Situação Desejada
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A vida após as automações: mais receita, menos tarefas manuais e clientes mais satisfeitos.
          </p>
        </header>

        {/* CTA de jornada removido */}

        {/* Antes vs. Depois */}
        <div className="max-w-6xl mx-auto mb-12">
          <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Antes vs. Depois</CardTitle>
              <CardDescription className="text-center">Contraste claro entre a situação atual e a desejada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-semibold mb-2">Antes (Situação Atual)</div>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Registros manuais; sem recibos automáticos</li>
                    <li>Leads e propostas sem CRM centralizado</li>
                    <li>Agenda dispersa; confirmações manuais</li>
                    <li>KPIs dispersos; baixa previsibilidade</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Depois (Situação Desejada)</div>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>OpsUnit Controle Financeiro: boletos, recebimentos, fluxo de caixa, repasses e despesas</li>
                    <li>BrandForge + CRM Vivo: captação e funil com histórico</li>
                    <li>KPIs em tempo real e cockpit integrado (TimeOS)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Narrativa: Vida após automação */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="step-card step-5 text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2"><TrendingUp className="w-5 h-5 text-step-5" /> Receita</CardTitle>
              <CardDescription>Horizonte de 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-step-5">+25% a +45%</div>
            </CardContent>
          </Card>
          <Card className="step-card step-5 text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2"><Clock className="w-5 h-5 text-step-5" /> Eficiência</CardTitle>
              <CardDescription>Automação de rotina</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-step-5">-40% a -60%</div>
            </CardContent>
          </Card>
          <Card className="step-card step-5 text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2"><Users className="w-5 h-5 text-step-5" /> Satisfação</CardTitle>
              <CardDescription>Experiência do cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-step-5">NPS ↑</div>
            </CardContent>
          </Card>
        </div>

        {/* Roadmap (reuso do Step4) com onNext rolando para orçamento */}
        <div className="mb-14">
          <Card className="step-card step-4 text-center mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center"><Rocket className="w-5 h-5 text-step-4" /> Roadmap de Implementação</CardTitle>
              <CardDescription>60–90 dias com entregas semanais</CardDescription>
            </CardHeader>
          </Card>
          <Step4Criar onNext={scrollToOrcamento} sessionId={sessionId} />
        </div>

        {/* Removida Calculadora ROI standalone (mantida no Orçamento & ROI) */}

        {/* Apêndice Técnico */}
        <TechAppendix sessionId={sessionId} />

        {/* Orçamento Interativo + CTA concluir (reuso Step5) */}
        <div id="desejada-orcamento" className="mb-14">
          <Step5Otimizar
            onComplete={onComplete}
            sessionId={sessionId}
            headingTitle="Orçamento & ROI"
            headingSubtitle="Personalize sua solução e visualize o retorno em tempo real"
            showStepBadge={false}
          />
        </div>

        {/* Agendamento */}
        <div className="max-w-6xl mx-auto">
          <Card className="step-card step-4 text-center mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center"><Rocket className="w-5 h-5 text-step-4" /> Agendar Conversa Estratégica</CardTitle>
              <CardDescription>Planeje o kickoff do seu projeto</CardDescription>
            </CardHeader>
          </Card>
          <MeetingScheduler sessionId={sessionId} />
          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Voltar ao topo</Button>
          </div>
        </div>

      </div>
    </section>
  );
};
