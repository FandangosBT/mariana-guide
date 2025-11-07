import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { trackPdfGenerateStart, trackPdfGenerateSuccess, trackPdfGenerateError } from '@/lib/sdk';
import { ESPEC_TEC } from '@/content/espec-tec';

export interface JorneyData {
  step1: {
    problems: string[];
    impacts: string[];
  };
  step2: {
    bottlenecks: string[];
    losses: string;
  };
  step3: {
    solutions: string[];
    benefits: string[];
  };
  step4: {
    integrations: string[];
    features: string[];
  };
  step5: {
    roi: string;
    projections: {
      revenue: string;
      efficiency: string;
      patients: string;
    };
  };
}

export const generateJourneyPDF = async (sessionId?: string): Promise<void> => {
  const startTs = Date.now();
  const sectionsIncluded = ['SituacaoAtual', 'SituacaoDesejada', 'InvestimentoROI'];
  try {
    await trackPdfGenerateStart(sessionId, 'journey', sectionsIncluded);
  } catch {}

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(139, 92, 246);
    pdf.text('Jornada Consultiva — Antes e Depois', margin, 30);
    
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Análise em 2 Etapas (Atual → Desejada)', margin, 40);

    // Current date
    pdf.setFontSize(10);
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, 50);

    let yPosition = 70;

    // Etapa 1: Situação Atual (Antes)
    pdf.setFontSize(16);
    pdf.setTextColor(139, 92, 246);
    pdf.text('1. Situação Atual (Antes)', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const atualContent = [
      '• Desperdício de 40–60h/mês com tarefas manuais',
      '• Perdas financeiras (R$ 8k–15k/mês) por retrabalho e inadimplência',
      '• Conversão baixa por falta de pipeline/SLAs (−15% a −25%)',
      '• Indicadores dispersos e pouca previsibilidade',
    ];
    atualContent.forEach(item => { pdf.text(item, margin + 5, yPosition); yPosition += 8; });

    yPosition += 10;

    // Check space
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 30;
    }

    // Etapa 2: Situação Desejada (Depois)
    pdf.setFontSize(16);
    pdf.setTextColor(239, 68, 68);
    pdf.text('2. Situação Desejada (Depois)', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const desejadaContent = [
      '• Receita: +25% a +45% em 12 meses',
      '• Eficiência: −40% a −60% de tarefas manuais',
      '• Satisfação: NPS em alta com portal do cliente e SLAs',
      '• Visibilidade: KPIs em tempo real e cockpit integrado'
    ];
    desejadaContent.forEach(item => { pdf.text(item, margin + 5, yPosition); yPosition += 8; });

    yPosition += 20;

    // Investment Summary
    pdf.setFillColor(239, 68, 68, 0.1);
    pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 40, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(239, 68, 68);
    pdf.text('Investimento & ROI (Resumo)', margin + 5, yPosition + 10);
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Investimento Inicial (estimado): ver Composer de Orçamento', margin + 5, yPosition + 20);
    pdf.text('Projeções: ROI anual e payback conforme seleção de módulos', margin + 5, yPosition + 28);

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('TimeOS - Transformação Digital para Clínicas', margin, pageHeight - 15);
    pdf.text('Entre em contato: (11) 99999-9999', pageWidth - margin - 60, pageHeight - 15);

    // Save the PDF
    pdf.save('jornada-transformacao-digital.pdf');

    const endTs = Date.now();
    const pages = (pdf as any)?.getNumberOfPages ? (pdf as any).getNumberOfPages() : 1;
    try { await trackPdfGenerateSuccess(sessionId, 'journey', pages, sectionsIncluded); } catch {}
  } catch (error) {
    const endTs = Date.now();
    try { await trackPdfGenerateError(sessionId, 'journey', (error as Error)?.message); } catch {}
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao gerar o arquivo PDF');
  }
};

export const generateScreenshotPDF = async (elementId: string, sessionId?: string): Promise<void> => {
  const startTs = Date.now();
  try { await trackPdfGenerateStart(sessionId, 'screenshot', [elementId]); } catch {}

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento não encontrado');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      allowTaint: true,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf: any = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    if (typeof pdf.addImage === 'function') {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    } else {
      // Fallback suave para ambientes de teste sem addImage
      pdf.setFontSize?.(12);
      pdf.setTextColor?.(100, 100, 100);
      pdf.text?.('Resumo do cockpit (imagem omitida no ambiente de teste)', 10, 20);
    }

    pdf.save('resumo-cockpit.pdf');

    const endTs = Date.now();
    const pages = (pdf as any)?.getNumberOfPages ? (pdf as any).getNumberOfPages() : 1;
    try { await trackPdfGenerateSuccess(sessionId, 'screenshot', pages, [elementId]); } catch {}
  } catch (error) {
    const endTs = Date.now();
    try { await trackPdfGenerateError(sessionId, 'screenshot', (error as Error)?.message); } catch {}
    console.error('Erro ao gerar PDF:', error);
    if (error instanceof Error && error.message === 'Elemento não encontrado') {
      throw error;
    }
    throw new Error('Falha ao gerar o arquivo PDF');
  }
};

export const generateTechPDF = async (sessionId?: string): Promise<void> => {
  try {
    await trackPdfGenerateStart(sessionId, 'journey', ['FichaTecnica']);
  } catch {}

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 15;
    let y = 25;

    pdf.setFontSize(20);
    pdf.setTextColor(31, 41, 55);
    pdf.text('Ficha Técnica — Mariana Imóveis', margin, y);
    y += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Versão: ${ESPEC_TEC.meta.versao}  •  Consultoria: ${ESPEC_TEC.meta.consultoria}`, margin, y);
    y += 10;

    const blocks = [
      ESPEC_TEC.backendSupabase,
      ESPEC_TEC.frontendVercel,
      ESPEC_TEC.storageSupabase,
      ESPEC_TEC.sslFrontend,
      ESPEC_TEC.securityBackend,
      ESPEC_TEC.contingencyVPS,
      ESPEC_TEC.supportMaint,
    ];

    const addSection = (title: string, specs?: string[], limitacoes?: string[], traducao?: string) => {
      pdf.setFontSize(13);
      pdf.setTextColor(79, 70, 229);
      pdf.text(title, margin, y);
      y += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      if (specs && specs.length) {
        specs.forEach((s) => {
          if (y > 275) { pdf.addPage(); y = 20; }
          pdf.text(`• ${s}`, margin + 2, y);
          y += 5;
        });
      }
      if (limitacoes && limitacoes.length) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.setTextColor(71, 85, 105);
        pdf.text(`Limitações: ${limitacoes.join(' • ')}`, margin + 2, y);
        y += 6;
      }
      if (traducao) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.setTextColor(100, 116, 139);
        pdf.text(`“${traducao}”`, margin + 2, y);
        y += 6;
      }
      y += 3;
    };

    blocks.forEach((b: any) => addSection(b.title, b.specs, b.limitacoes, b.traducao));

    if (y > 260) { pdf.addPage(); y = 20; }
    pdf.setFontSize(12);
    pdf.setTextColor(79, 70, 229);
    pdf.text('Resumo para a Cliente', margin, y);
    y += 6;
    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.text(ESPEC_TEC.pitch, margin, y, { maxWidth: 180 });

    pdf.save('ficha-tecnica.pdf');

    try {
      await trackPdfGenerateSuccess(sessionId, 'journey', (pdf as any)?.getNumberOfPages?.() ?? 1, ['FichaTecnica']);
    } catch {}
  } catch (error) {
    try { await trackPdfGenerateError(sessionId, 'journey', (error as Error)?.message); } catch {}
    console.error('Erro ao gerar PDF técnico:', error);
    throw new Error('Falha ao gerar o arquivo PDF da ficha técnica');
  }
};
