import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step5Otimizar } from './Step5Otimizar';
import { vi } from 'vitest';

// Mock do SDK
vi.mock('@/lib/sdk', () => ({
  trackWidgetInteraction: vi.fn(),
  trackCtaClick: vi.fn(),
}));

// Mock do PDF generator
vi.mock('@/utils/pdf-generator', () => ({
  generateJourneyPDF: vi.fn(),
}));

describe('Step5Otimizar', () => {
  const mockOnComplete = vi.fn();
  const mockSessionId = 'test-session-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('abre composer, seleciona produto e exibe resumo', async () => {
    const user = userEvent.setup();
    render(<Step5Otimizar onComplete={mockOnComplete} sessionId={mockSessionId} />);

    // Abre o compositor de orçamento
    const customizeBtn = screen.getByRole('button', { name: /personalizar orçamento/i });
    await user.click(customizeBtn);

    // Seleciona um produto
    const product = await screen.findByText('BrandForge Base Digital + CRM Vivo');
    await user.click(product);

    // Resumo do orçamento
    expect(await screen.findByText('Resumo do Orçamento')).toBeInTheDocument();
    expect(screen.getByText('BrandForge Base Digital + CRM Vivo')).toBeInTheDocument();
  });

  // PDF é testado no StepDesejada

  it('chama onComplete ao finalizar jornada', async () => {
    const user = userEvent.setup();
    render(<Step5Otimizar onComplete={mockOnComplete} sessionId={mockSessionId} />);

    const finishButton = screen.getByRole('button', { name: /agendar conversa estratégica para implementar soluções/i });
    expect(finishButton).toBeInTheDocument();

    await user.click(finishButton);
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('CTA WhatsApp envia resumo e faz tracking', async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null as any);
    const { trackCtaClick } = await import('@/lib/sdk');

    render(<Step5Otimizar onComplete={mockOnComplete} sessionId={mockSessionId} />);

    const customizeBtn = screen.getByRole('button', { name: /personalizar orçamento/i });
    await user.click(customizeBtn);
    const product = await screen.findByText('BrandForge Base Digital + CRM Vivo');
    await user.click(product);
    const proposalBtn = await screen.findByRole('button', { name: /solicitar proposta detalhada/i });
    await user.click(proposalBtn);

    expect(openSpy).toHaveBeenCalled();
    expect(trackCtaClick).toHaveBeenCalled();

    openSpy.mockRestore();
  });

  it('funciona sem sessionId (composer)', async () => {
    const user = userEvent.setup();
    render(<Step5Otimizar onComplete={mockOnComplete} />);

    const customizeBtn = screen.getByRole('button', { name: /personalizar orçamento/i });
    await user.click(customizeBtn);
    const product = await screen.findByText('OpsUnit CRM Vivo');
    await user.click(product);
    const proposalBtn = await screen.findByRole('button', { name: /solicitar proposta detalhada/i });
    expect(proposalBtn).toBeEnabled();
  });
});
