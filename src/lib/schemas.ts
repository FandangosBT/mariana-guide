import { z } from "zod";

export const SessionStartSchema = z.object({
  sessionId: z.string().uuid(),
  device: z.string().min(1),
  userAgent: z.string().min(1),
  startAt: z.number().int().nonnegative(),
  consent: z.boolean().optional().default(false),
});

export const SessionEndSchema = z.object({
  sessionId: z.string().uuid(),
  endAt: z.number().int().nonnegative(),
});

export const EventPayloadSchema = z.object({
  sessionId: z.string().uuid(),
  // Aceita passos antigos e novos (compatibilidade retroativa)
  step: z.enum(["Escutar", "Processar", "Identificar", "Criar", "Otimizar", "Geral", "Atual", "Desejada"]).default("Geral"),
  action: z.string().min(1).max(64),
  metadata: z.record(z.any()).optional().default({}),
  ts: z.number().int().nonnegative(),
});

export const LeadPayloadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(8).max(32).optional(),
  context: z.record(z.any()).optional().default({}),
  ts: z.number().int().nonnegative(),
  sessionId: z.string().uuid().optional(),
});

export type SessionStart = z.infer<typeof SessionStartSchema>;
export type SessionEnd = z.infer<typeof SessionEndSchema>;
export type EventPayload = z.infer<typeof EventPayloadSchema>;
export type LeadPayload = z.infer<typeof LeadPayloadSchema>;

export const EventPayloadArraySchema = z.array(EventPayloadSchema).min(1).max(50);
export type EventPayloadArray = z.infer<typeof EventPayloadArraySchema>;
