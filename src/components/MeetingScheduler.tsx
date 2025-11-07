import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Phone, MessageSquare, CheckCircle, User, MapPin } from "lucide-react";
import { submitLead, trackCtaClick } from "@/lib/sdk";

interface MeetingData {
  name: string;
  email: string;
  phone: string;
  clinicName: string;
  clinicType: string;
  preferredDate: string;
  preferredTime: string;
  meetingType: string;
  goals: string;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

const meetingTypes = [
  { value: "presencial", label: "Presencial", icon: MapPin },
  { value: "video", label: "Videochamada", icon: MessageSquare },
  { value: "phone", label: "Telefone", icon: Phone }
];

interface MeetingSchedulerProps {
  sessionId?: string;
}

export const MeetingScheduler = ({ sessionId }: MeetingSchedulerProps) => {
  const [formData, setFormData] = useState<MeetingData>({
    name: "",
    email: "",
    phone: "",
    clinicName: "",
    clinicType: "",
    preferredDate: "",
    preferredTime: "",
    meetingType: "",
    goals: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof MeetingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Submit lead via SDK
      if (sessionId) {
        await submitLead({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          context: {
            clinicName: formData.clinicName,
            clinicType: formData.clinicType,
            preferredDate: formData.preferredDate,
            preferredTime: formData.preferredTime,
            meetingType: formData.meetingType,
            goals: formData.goals,
            source: 'meeting_scheduler'
          },
          ts: Date.now(),
          sessionId
        });
        
        // Track CTA click
        trackCtaClick(sessionId, 'meeting_scheduler_submit', {
          meetingType: formData.meetingType,
          clinicType: formData.clinicType
        });
      }
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
      setIsLoading(false);
      // Em caso de erro, ainda mostra sucesso para não travar UX
      setIsSubmitted(true);
    }
  };

  const isFormValid = () => {
    return formData.name && 
           formData.email && 
           formData.phone && 
           formData.clinicName &&
           formData.preferredDate &&
           formData.preferredTime &&
           formData.meetingType;
  };

  // Get next available dates (next 7 business days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow
    
    while (dates.length < 7) {
      // Skip weekends
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="step-card step-4 text-center animate-scale-in">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">
              Reunião Agendada com Sucesso!
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(formData.preferredDate).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formData.preferredTime}</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                {meetingTypes.find(type => type.value === formData.meetingType)?.icon && 
                  (() => {
                    const IconComponent = meetingTypes.find(type => type.value === formData.meetingType)!.icon;
                    return <IconComponent className="w-4 h-4" />;
                  })()
                }
                <span>{meetingTypes.find(type => type.value === formData.meetingType)?.label}</span>
              </div>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Próximos passos:</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Você receberá um email de confirmação</li>
                <li>• Nossa equipe entrará em contato 1 dia antes</li>
                <li>• Prepare as informações da sua clínica</li>
                <li>• Tenha suas metas de crescimento em mente</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-gradient-hero hover:opacity-90 text-primary-foreground"
                onClick={() => {
                  if (sessionId) {
                    trackCtaClick(sessionId, 'whatsapp_confirmation', { location: 'meeting_success' });
                  }
                  window.open('https://wa.me/5511999999999?text=Olá! Acabei de agendar uma reunião estratégica. Gostaria de confirmar os detalhes.', '_blank');
                }}
                aria-label="Confirmar agendamento via WhatsApp"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Confirmar no WhatsApp
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    clinicName: "",
                    clinicType: "",
                    preferredDate: "",
                    preferredTime: "",
                    meetingType: "",
                    goals: ""
                  });
                }}
                aria-label="Agendar nova reunião"
              >
                Agendar Outra Reunião
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-4 rounded-full text-step-4 font-medium mb-4">
          <Calendar className="w-4 h-4" />
          AGENDAR REUNIÃO
        </div>
        <h2 className="text-3xl font-bold mb-4">Vamos Conversar Sobre Sua Transformação</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Direto pelo WhatsApp do time comercial. Resposta rápida e prática.
        </p>
      </div>

      <Card className="step-card step-4 text-center">
        <CardContent className="py-8">
          <Button
            size="lg"
            className="bg-gradient-hero hover:opacity-90 text-primary-foreground px-10 py-6 text-lg"
            onClick={() => {
              if (sessionId) trackCtaClick(sessionId, 'meeting_whatsapp', { location: 'meeting_section' });
              const msg = 'Olá! Gostaria de agendar uma reunião comercial para discutir a proposta.';
              window.open(`https://wa.me/5511943334229?text=${encodeURIComponent(msg)}`, '_blank');
            }}
            aria-label="Agendar Reunião Comercial via WhatsApp"
          >
            <MessageSquare className="w-5 h-5 mr-2" /> Agendar Reunião Comercial via WhatsApp
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
