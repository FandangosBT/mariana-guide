import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepDesejada } from "./StepDesejada";
import { vi } from "vitest";

vi.mock("@/lib/sdk", () => ({ trackCtaClick: vi.fn() }));

describe("StepDesejada", () => {
  const user = userEvent.setup();
  const onComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("não exibe mais o CTA de Baixar Jornada (PDF)", async () => {
    render(<StepDesejada onComplete={onComplete} sessionId="test-session-id" />);
    const btn = screen.queryByRole("button", { name: /baixar jornada \(pdf\)/i });
    expect(btn).toBeNull();
  });
});
