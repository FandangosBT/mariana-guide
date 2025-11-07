import { useState, useEffect } from "react";
import { StepAtual } from "@/components/steps/StepAtual";
import { StepDesejada } from "@/components/steps/StepDesejada";
import { StepNavigation } from "@/components/StepNavigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MessageSquare, Phone, LogOut } from "lucide-react";
import { startSession, endSession, trackCtaClick } from "@/lib/sdk";
import { useJourneyStore } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 2;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { logout } = useAuth();
  const resetJourney = useJourneyStore(s => s.resetJourney);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeJourney = () => {
    setIsComplete(true);
  };

  // Smooth scroll behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Session management: start on mount, end on unmount
  useEffect(() => {
    const id = (window.crypto && 'randomUUID' in window.crypto) ? window.crypto.randomUUID() : `${Date.now()}-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16);
    });
    setSessionId(id);
    startSession({ sessionId: id, device: "web", userAgent: navigator.userAgent, consent: false }).catch(() => {});
    return () => {
      endSession({ sessionId: id }).catch(() => {});
    };
  }, []);

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-2xl mx-auto px-6 animate-fade-in">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
              <MessageSquare className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Jornada Concluída!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Agora você viu o potencial completo de transformação da sua clínica. 
              Vamos conversar sobre como implementar essa visão?
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-hero hover:opacity-90 text-primary-foreground font-semibold px-8 py-4 text-lg glow-effect transition-transform duration-base ease-q7 hover:scale-105 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => { if (sessionId) { trackCtaClick(sessionId, 'cta_whatsapp_conversation', { location: 'completion_screen' }); } window.open('https://wa.me/5511943334229?text=Olá! Completei a jornada consultiva e gostaria de agendar uma conversa sobre transformação digital para meu negócio.', '_blank'); }}
              aria-label="Agendar conversa via WhatsApp"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Agendar Conversa
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsComplete(false)}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Revisar jornada completa novamente"
            >
              Revisar a Jornada
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background/20 backdrop-blur-[2px] relative">
      {/* Navigation */}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={previousStep}
        onNext={nextStep}
        canGoNext={true}
        onStepSelect={(i) => setCurrentStep(i)}
      />

      {/* Theme Toggle e Logout */}
      <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-40 animate-fade-in">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { resetJourney(); setIsComplete(false); setCurrentStep(0); }}
            className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
          >
            Resetar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              // O ProtectedRoute vai redirecionar automaticamente para /login
            }}
            className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Floating Contact */}
      <div className="fixed bottom-8 right-8 z-40 animate-fade-in">
        <Button
          size="sm"
          className="bg-gradient-hero hover:opacity-90 text-primary-foreground shadow-elegant rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
          onClick={() => { if (sessionId) { trackCtaClick(sessionId, 'whatsapp_floating', { location: 'floating_button' }); } window.open('https://wa.me/5511943334229?text=Olá! Estou explorando a jornada consultiva e gostaria de conversar sobre transformação digital para meu negócio.', '_blank'); }}
          aria-label="Entrar em contato via WhatsApp"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
      </div>

      {/* Steps (2 etapas) */}
      {currentStep === 0 && <StepAtual onNext={nextStep} sessionId={sessionId ?? undefined} />} 
      {currentStep === 1 && <StepDesejada onComplete={completeJourney} sessionId={sessionId ?? undefined} />}
    </main>
  );
};

export default Index;
