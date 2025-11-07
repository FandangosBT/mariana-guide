import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext?: boolean;
  onStepSelect?: (index: number) => void;
}

const stepColors = [
  "bg-step-1",
  "bg-step-2", 
  "bg-step-3",
  "bg-step-4",
  "bg-step-5"
];

export const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext,
  canGoNext = true,
  onStepSelect,
}: StepNavigationProps) => {
  return (
    <nav className="step-nav" aria-label="Navegação entre etapas" role="navigation">
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 disabled:hover:scale-100 focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Voltar para etapa anterior"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>

        <div className="flex items-center gap-2" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`progress-dot relative transition-all duration-300 before:content-[''] before:absolute before:-inset-4 before:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                i === currentStep 
                  ? `active ${stepColors[i]} motion-safe:animate-glow-pulse` 
                  : i < currentStep 
                    ? "bg-muted-foreground scale-90" 
                    : "bg-muted scale-75"
              }`}
              aria-label={`Etapa ${i + 1}${i === currentStep ? ' - atual' : i < currentStep ? ' - concluída' : ' - pendente'}`}
              aria-current={i === currentStep ? "step" : undefined}
              role="button"
              tabIndex={0}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          disabled={currentStep === totalSteps - 1 || !canGoNext}
          className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 disabled:hover:scale-100 focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Avançar para próxima etapa"
        >
          Avançar
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="text-xs text-muted-foreground mt-2 text-center" aria-live="polite">
        Etapa {currentStep + 1} de {totalSteps}
      </div>
    </nav>
  );
};
