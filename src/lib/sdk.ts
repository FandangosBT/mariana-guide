import { EventPayload, EventPayloadSchema, LeadPayload, LeadPayloadSchema, SessionEnd, SessionEndSchema, SessionStart, SessionStartSchema } from "./schemas";
import { logStructured } from "./logging";

const API_BASE = "/api"; // Vercel/Vite proxy para serverless na raiz

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function postJson<T>(path: string, body: unknown, opts: { retries?: number } = {}): Promise<T> {
  const { retries = 2 } = opts;
  let attempt = 0;
  let lastErr: unknown;
  while (attempt <= retries) {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        // retry on 5xx
        if (res.status >= 500 && res.status < 600 && attempt < retries) {
          attempt++;
          await sleep(200 * attempt);
          continue;
        }
        throw new Error(`Request failed ${res.status}: ${text}`);
      }
      return res.json();
    } catch (e) {
      lastErr = e;
      attempt++;
      if (attempt > retries) break;
      await sleep(200 * attempt);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Request failed");
}

export async function startSession(input: Omit<SessionStart, "startAt"> & { startAt?: number }) {
  const payload: SessionStart = SessionStartSchema.parse({
    startAt: input.startAt ?? Date.now(),
    ...input,
  });
  logStructured("info", "session_start", { sessionId: payload.sessionId });
  return postJson<{ ok: boolean }>("/events", {
    sessionId: payload.sessionId,
    step: "Geral",
    action: "session_start",
    metadata: { device: payload.device, userAgent: payload.userAgent, consent: payload.consent },
    ts: payload.startAt,
  });
}

export async function endSession(input: Omit<SessionEnd, "endAt"> & { endAt?: number }) {
  const payload: SessionEnd = SessionEndSchema.parse({
    endAt: input.endAt ?? Date.now(),
    ...input,
  });
  logStructured("info", "session_end", { sessionId: payload.sessionId });
  return postJson<{ ok: boolean }>("/events", {
    sessionId: payload.sessionId,
    step: "Geral",
    action: "session_end",
    metadata: {},
    ts: payload.endAt,
  });
}

export async function trackEvent(input: EventPayload) {
  const payload = EventPayloadSchema.parse(input);
  logStructured("debug", "track_event", { sessionId: payload.sessionId, action: payload.action, step: payload.step });
  return postJson<{ ok: boolean }>("/events", payload, { retries: 2 });
}

export async function trackEventsBatch(inputs: EventPayload[]) {
  const payloads = inputs.map((i) => EventPayloadSchema.parse(i));
  logStructured("debug", "track_events_batch", { count: payloads.length });
  return postJson<{ ok: boolean; count: number }>("/events", payloads, { retries: 2 });
}

export async function submitLead(input: LeadPayload) {
  const payload = LeadPayloadSchema.parse(input);
  logStructured("info", "submit_lead", { sessionId: payload.sessionId, email: payload.email });
  return postJson<{ ok: boolean }>("/leads", payload);
}

export async function getSolutions() {
  try {
    const res = await fetch(`${API_BASE}/solutions`, { method: 'GET' });
    if (!res.ok) throw new Error(`GET /solutions failed: ${res.status}`);
    const json = await res.json();
    return json as { ok: boolean; ts: number; data: Array<{ id: string; title: string; category: string; tags: string[]; demo: true }> };
  } catch (err) {
    if (import.meta.env?.DEV) {
      const fallback = [
        { id: "sol-ops-01", title: "Agendamento Inteligente", category: "Operações", tags: ["alto_impacto", "fluxo"], demo: true },
        { id: "sol-eng-02", title: "Integração com EMR", category: "Engenharia", tags: ["integração"], demo: true },
        { id: "sol-mkt-03", title: "Lembretes Automáticos", category: "Marketing", tags: ["reativação"], demo: true },
        { id: "sol-ops-04", title: "Fila Dinâmica", category: "Operações", tags: ["eficiência"], demo: true },
        { id: "sol-clin-05", title: "Protocolos Guiados", category: "Clínico", tags: ["qualidade"], demo: true },
        { id: "sol-data-06", title: "Painel de Insights", category: "Dados", tags: ["visibilidade"], demo: true },
      ];
      return { ok: true, ts: Date.now(), data: fallback };
    }
    throw err;
  }
}
export async function getPilots() {
  const res = await fetch(`${API_BASE}/pilots`, { method: 'GET' });
  if (!res.ok) throw new Error(`GET /pilots failed: ${res.status}`);
  const json = await res.json();
  return json as { ok: boolean; ts: number; data: Array<{ id: string; title: string; focus: string; durationWeeks: number; recommended: boolean; demo: true }> };
}
export async function getKpis() {
  const res = await fetch(`${API_BASE}/kpis`, { method: 'GET' });
  if (!res.ok) throw new Error(`GET /kpis failed: ${res.status}`);
  const json = await res.json();
  return json as { ok: boolean; ts: number; data: { demo: true; widgets: Array<{ id: string; name: string; value: number; unit: string; trend: number; period: string }> } };
}

// -------------------------
// Wrappers de Tracking por etapa/ação
// -------------------------
export type StepType =
  | "Escutar" | "Processar" | "Identificar" | "Criar" | "Otimizar"
  | "Atual" | "Desejada"
  | "Geral";

function nowTs() {
  return Date.now();
}

function clampId(id: string, max = 64) {
  return (id ?? "").toString().slice(0, max);
}

function normalizeStep(step: StepType): "Atual" | "Desejada" | "Geral" {
  switch (step) {
    case "Escutar":
    case "Processar":
    case "Atual":
      return "Atual";
    case "Identificar":
    case "Criar":
    case "Otimizar":
    case "Desejada":
      return "Desejada";
    case "Geral":
    default:
      return "Geral";
  }
}

// Escutar – expand/collapse/select e conclusão do passo
export function trackExpand(sessionId: string, step: StepType, itemId: string) {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "expand", metadata: { id: clampId(itemId) }, ts: nowTs() });
}
export function trackCollapse(sessionId: string, step: StepType, itemId: string) {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "collapse", metadata: { id: clampId(itemId) }, ts: nowTs() });
}
export function trackSelect(sessionId: string, step: StepType, itemId: string, selected: boolean = true) {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "select", metadata: { id: clampId(itemId), selected }, ts: nowTs() });
}
export function trackStepComplete(sessionId: string, step: Exclude<StepType, "Geral">, details?: Record<string, unknown>) {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "step_complete", metadata: { ...(details ?? {}) }, ts: nowTs() });
}

// Processar – hover/click/dwell/tooltip
export function trackHover(sessionId: string, step: StepType, targetId: string, durationMs?: number) {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "hover", metadata: { id: clampId(targetId), durationMs }, ts: nowTs() });
}
export function trackClick(sessionId: string, step: StepType, targetId: string) {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "click", metadata: { id: clampId(targetId) }, ts: nowTs() });
}
export function trackDwell(sessionId: string, step: StepType, targetId: string, durationMs: number) {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "dwell", metadata: { id: clampId(targetId), durationMs }, ts: nowTs() });
}
export function trackTooltipShown(sessionId: string, step: StepType, tooltipId: string) {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "tooltip_shown", metadata: { id: clampId(tooltipId) }, ts: nowTs() });
}

// Identificar – flips/favoritos/tags
export function trackFlip(sessionId: string, itemId: string, flippedTo: "front" | "back", step: StepType = "Identificar") {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "flip", metadata: { id: clampId(itemId), to: flippedTo }, ts: nowTs() });
}
export function trackFavorite(sessionId: string, itemId: string, favorite: boolean, step: StepType = "Identificar") {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "favorite_toggle", metadata: { id: clampId(itemId), favorite }, ts: nowTs() });
}
export function trackTagToggle(sessionId: string, itemId: string, tag: string, added: boolean, step: StepType = "Identificar") {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "tag_toggle", metadata: { id: clampId(itemId), tag: clampId(tag), added }, ts: nowTs() });
}

// Criar – seleção de piloto e "recomendado" visto
export function trackPilotSelect(sessionId: string, pilotId: string, step: StepType = "Criar") {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "pilot_select", metadata: { id: clampId(pilotId) }, ts: nowTs() });
}
export function trackPilotRecommendedSeen(sessionId: string, pilotId: string, step: StepType = "Criar") {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "pilot_recommended_seen", metadata: { id: clampId(pilotId) }, ts: nowTs() });
}

// Otimizar – interações de cockpit/widgets
export function trackWidgetInteraction(sessionId: string, widgetId: string, interaction: "open" | "close" | "filter" | "drilldown" | "refresh", extra?: Record<string, unknown>, step: StepType = "Otimizar") {
  return trackEvent({ sessionId, step, action: `widget_${interaction}`.slice(0, 64), metadata: { id: clampId(widgetId), ...(extra ?? {}) }, ts: nowTs() });
}

// Extras – CTA, Scheduler, PDF
export function trackCtaClick(sessionId: string, ctaId: string, context?: Record<string, unknown>, step: StepType = "Geral") {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "cta_click", metadata: { id: clampId(ctaId), ...(context ?? {}) }, ts: nowTs() });
}
export function trackSchedulerOpen(sessionId: string, provider: "Calendly" | "Outlook" | "Google" | string, url?: string, step: StepType = "Geral") {
  return trackEvent({ sessionId, step: normalizeStep(step), action: "scheduler_open", metadata: { provider: clampId(provider), url }, ts: nowTs() });
}
export function trackPdfGenerateStart(sessionId: string | undefined, kind: "journey" | "screenshot", sectionsIncluded?: string[]) {
  if (!sessionId) return Promise.resolve({ ok: true });
  return trackEvent({ sessionId, step: normalizeStep("Otimizar" as StepType), action: "pdf_generate_start", metadata: { kind, sectionsIncluded }, ts: nowTs() });
}
export function trackPdfGenerateSuccess(sessionId: string | undefined, kind: "journey" | "screenshot", pages?: number, sectionsIncluded?: string[]) {
  if (!sessionId) return Promise.resolve({ ok: true });
  return trackEvent({ sessionId, step: normalizeStep("Otimizar" as StepType), action: "pdf_generate_success", metadata: { kind, pages, sectionsIncluded }, ts: nowTs() });
}
export function trackPdfGenerateError(sessionId: string | undefined, kind: "journey" | "screenshot", message?: string) {
  if (!sessionId) return Promise.resolve({ ok: true });
  return trackEvent({ sessionId, step: normalizeStep("Otimizar" as StepType), action: "pdf_generate_error", metadata: { kind, message }, ts: nowTs() });
}
