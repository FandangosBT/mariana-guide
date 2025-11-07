import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Index from '../pages/Index';
import { AuthProvider } from '@/hooks/use-auth';

// Mock do SDK
vi.mock('@/lib/sdk', () => ({
  startSession: vi.fn().mockResolvedValue({ ok: true }),
  endSession: vi.fn().mockResolvedValue({ ok: true }),
  trackEvent: vi.fn().mockResolvedValue({ ok: true }),
  trackExpand: vi.fn().mockResolvedValue({ ok: true }),
  trackCollapse: vi.fn().mockResolvedValue({ ok: true }),
  trackSelect: vi.fn().mockResolvedValue({ ok: true }),
  trackStepComplete: vi.fn().mockResolvedValue({ ok: true }),
  trackHover: vi.fn().mockResolvedValue({ ok: true }),
  trackClick: vi.fn().mockResolvedValue({ ok: true }),
  trackDwell: vi.fn().mockResolvedValue({ ok: true }),
  trackTooltipShown: vi.fn().mockResolvedValue({ ok: true }),
  trackFlip: vi.fn().mockResolvedValue({ ok: true }),
  trackFavorite: vi.fn().mockResolvedValue({ ok: true }),
  trackTagToggle: vi.fn().mockResolvedValue({ ok: true }),
  trackPilotSelect: vi.fn().mockResolvedValue({ ok: true }),
  trackPilotRecommendedSeen: vi.fn().mockResolvedValue({ ok: true }),
  trackWidgetInteraction: vi.fn().mockResolvedValue({ ok: true }),
  trackCtaClick: vi.fn().mockResolvedValue({ ok: true }),
  submitLead: vi.fn().mockResolvedValue({ ok: true }),
  getSolutions: vi.fn().mockResolvedValue({
    ok: true,
    data: [
      { id: 'sol-1', title: 'Solução 1', category: 'Test', tags: ['test'] },
    ],
  }),
  getPilots: vi.fn().mockResolvedValue({
    ok: true,
    data: [
      { id: 'pil-1', title: 'Piloto 1', focus: 'Test', durationWeeks: 4, recommended: true },
    ],
  }),
  getKpis: vi.fn().mockResolvedValue({
    ok: true,
    data: { demo: true, widgets: [] },
  }),
}));

// Mock do PDF generator
vi.mock('@/utils/pdf-generator', () => ({
  generateJourneyPDF: vi.fn().mockResolvedValue(undefined),
}));

// Mock do router
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
}));

describe('Journey Flow Integration (2 etapas)', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completa fluxo 1→2 com tracking', async () => {
    render(
      <AuthProvider>
        <Index />
      </AuthProvider>
    );

    // Passo 1: Situação Atual
    await waitFor(() => {
      expect(screen.getByText('Situação Atual')).toBeInTheDocument();
    });

    // Avança para o plano
    const nextButton = screen.getByRole('button', { name: /avançar para o plano/i });
    await user.click(nextButton);

    // Passo 2: Situação Desejada
    await waitFor(() => {
      expect(screen.getByText('Situação Desejada')).toBeInTheDocument();
    });

    // Abre o compositor de orçamento
    const customizeBtn = screen.getByRole('button', { name: /personalizar orçamento/i });
    await user.click(customizeBtn);

    // Seleciona um produto
    const product = await screen.findByText('OpsUnit Controle Financeiro');
    await user.click(product);

    // Solicita proposta detalhada (CTA final)
    const proposalBtn = await screen.findByRole('button', { name: /solicitar proposta detalhada/i });
    await user.click(proposalBtn);

    // Verifica se chegou na tela de conclusão
    await waitFor(() => {
      expect(screen.getByText('Jornada Concluída!')).toBeInTheDocument();
    });
  });

  it('gera PDF no Passo 2', async () => {
    render(
      <AuthProvider>
        <Index />
      </AuthProvider>
    );

    // Vai para Passo 2
    const nextButton = await screen.findByRole('button', { name: /avançar para o plano/i });
    await user.click(nextButton);

    // Clica no botão de PDF
    const pdfButton = await screen.findByRole('button', { name: /baixar jornada \(pdf\)/i });
    await user.click(pdfButton);

    // Verifica se PDF foi gerado
    const { generateJourneyPDF } = await import('@/utils/pdf-generator');
    expect(generateJourneyPDF).toHaveBeenCalled();
  });

  it('mantém estado entre etapas', async () => {
    render(
      <AuthProvider>
        <Index />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Situação Atual')).toBeInTheDocument();
    });

    const nextButton2 = screen.getByRole('button', { name: /avançar para o plano/i });
    await user.click(nextButton2);

    await waitFor(() => {
      expect(screen.getByText('Situação Desejada')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /voltar/i });
    await user.click(backButton);

    // Verifica se voltou para Step 1
    await waitFor(() => {
      expect(screen.getByText('Situação Atual')).toBeInTheDocument();
    });
  });
});
