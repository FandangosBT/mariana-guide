import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Server, Globe, HardDrive, ShieldCheck, Lock, Database, LifeBuoy, FileText } from 'lucide-react';
import { ESPEC_TEC } from '@/content/espec-tec';
import { trackCtaClick, trackExpand, trackCollapse } from '@/lib/sdk';

type Props = { sessionId?: string };

export function TechAppendix({ sessionId }: Props) {
  const sections = [
    { id: 'backend', icon: Database, title: ESPEC_TEC.backendSupabase.title, body: ESPEC_TEC.backendSupabase },
    { id: 'frontend', icon: Globe, title: ESPEC_TEC.frontendVercel.title, body: ESPEC_TEC.frontendVercel },
    { id: 'storage', icon: HardDrive, title: ESPEC_TEC.storageSupabase.title, body: ESPEC_TEC.storageSupabase },
    { id: 'ssl', icon: Lock, title: ESPEC_TEC.sslFrontend.title, body: ESPEC_TEC.sslFrontend },
    { id: 'security', icon: ShieldCheck, title: ESPEC_TEC.securityBackend.title, body: ESPEC_TEC.securityBackend },
    { id: 'contingency', icon: Server, title: ESPEC_TEC.contingencyVPS.title, body: ESPEC_TEC.contingencyVPS },
    { id: 'support', icon: LifeBuoy, title: ESPEC_TEC.supportMaint.title, body: ESPEC_TEC.supportMaint },
  ];

  const onDownload = () => {
    if (sessionId) trackCtaClick(sessionId, 'download_tech_pdf', { location: 'tech_appendix' }, 'Desejada');
    const link = document.createElement('a');
    link.href = '/Descritivo-Tecnico-Operacional-Mariana-Gomes-Imoveis.pdf';
    link.download = 'Descritivo-Tecnico-Operacional-Mariana-Gomes-Imoveis.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDownloadScaling = () => {
    if (sessionId) trackCtaClick(sessionId, 'download_scaling_report_pdf', { location: 'tech_appendix' }, 'Desejada');
    const link = document.createElement('a');
    link.href = '/Limitacoes-Tecnicas-e-Opcoes-de-Evolucao-de-Infraestrutura.pdf';
    link.download = 'Limitacoes-Tecnicas-e-Opcoes-de-Evolucao-de-Infraestrutura.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto mb-14">
      <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ficha Técnica (Infra • Segurança • Contingência)</CardTitle>
          <CardDescription>Arquitetura leve, modular e segura — com plano de contingência</CardDescription>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Badge variant="secondary">{ESPEC_TEC.meta.versao}</Badge>
            <Badge variant="secondary">{ESPEC_TEC.meta.consultoria}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-3">
            {sections.map(({ id, icon: Icon, title, body }) => (
              <AccordionItem key={id} value={id} className="border-border/60 rounded-lg">
                <AccordionTrigger onClick={() => sessionId && trackExpand(sessionId, 'Desejada', `tech_${id}`)}>
                  <div className="flex items-center gap-2"><Icon className="w-4 h-4" /> {title}</div>
                </AccordionTrigger>
                <AccordionContent onClick={() => sessionId && trackCollapse(sessionId, 'Desejada', `tech_${id}`)}>
                  {('specs' in body && Array.isArray((body as any).specs)) && (
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-3">
                      {(body as any).specs.map((s: string) => (<li key={s}>{s}</li>))}
                    </ul>
                  )}
                  {('limitacoes' in body && Array.isArray((body as any).limitacoes)) && (
                    <div className="text-xs text-muted-foreground mb-2">
                      <span className="font-medium">Limitações:</span> {(body as any).limitacoes.join(' • ')}
                    </div>
                  )}
                  {('traducao' in body && (body as any).traducao) && (
                    <div className="text-sm italic text-muted-foreground">“{(body as any).traducao}”</div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-6 space-y-3">
            <Button onClick={onDownload} variant="outline">
              <FileText className="w-4 h-4 mr-2" /> Baixar Ficha Técnica
            </Button>
            <div>
              <Button onClick={onDownloadScaling} variant="outline">
                <FileText className="w-4 h-4 mr-2" /> Baixar Relatório de Capacidade & Escalonamento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
