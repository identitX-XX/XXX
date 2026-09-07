"use client";

import { supabase } from "./supabaseBrowser";
import { score } from "./scoring";
import { QUESTIONS, PROFILES } from "@/content";
import type { Answers, Axis, OnboardingContext } from "@/types";

export interface SubmitResult {
  ok: boolean;
  reason?: "not-configured" | "error";
  message?: string;
}

/**
 * Envoie une réponse ANONYME dans la table `responses`.
 * Aucune donnée identifiante : uniquement un id de session aléatoire,
 * le contexte non identifiant, les réponses et les scores calculés.
 */
export async function submitResponse(opts: {
  sessionId: string;
  answers: Answers;
  context: OnboardingContext;
  orgCode?: string | null;
  teamCode?: string | null;
}): Promise<SubmitResult> {
  if (!supabase) return { ok: false, reason: "not-configured" };

  const r = score(opts.answers, QUESTIONS, PROFILES);
  const byAxis = Object.fromEntries(r.axes.map((a) => [a.axis, a])) as Record<
    Axis,
    { score: number; level: number }
  >;

  const row = {
    session_id: opts.sessionId,
    org_code: opts.orgCode ?? null,
    team_code: opts.teamCode ?? null,
    context: opts.context,
    answers: opts.answers,
    score_global: r.global,
    level_global: r.level,
    score_ascendante: byAxis.ascendante.score,
    score_descendante: byAxis.descendante.score,
    score_laterale: byAxis.laterale.score,
    level_ascendante: byAxis.ascendante.level,
    level_descendante: byAxis.descendante.level,
    level_laterale: byAxis.laterale.level,
    profiles: r.profiles.map((p) => p.id),
  };

  const { error } = await supabase.from("responses").insert(row);
  if (error) return { ok: false, reason: "error", message: error.message };
  return { ok: true };
}

export interface Aggregate {
  n: number;
  avg_global: number;
  avg_ascendante: number;
  avg_descendante: number;
  avg_laterale: number;
}

/**
 * Agrégat par organisation (seuil de 5, appliqué côté base).
 * Renvoie `null` quand le seuil n'est pas atteint : rien à afficher (anonymat).
 */
export async function fetchOrgAggregate(
  orgCode: string
): Promise<{ ok: boolean; data: Aggregate | null; reason?: string }> {
  if (!supabase) return { ok: false, data: null, reason: "not-configured" };
  const { data, error } = await supabase.rpc("org_aggregate", {
    p_org_code: orgCode,
  });
  if (error) return { ok: false, data: null, reason: error.message };
  const row = Array.isArray(data) ? data[0] : data;
  return { ok: true, data: (row as Aggregate) ?? null };
}

/** Agrégat par équipe (seuil renforcé de 10). */
export async function fetchTeamAggregate(
  orgCode: string,
  teamCode: string
): Promise<{ ok: boolean; data: Aggregate | null; reason?: string }> {
  if (!supabase) return { ok: false, data: null, reason: "not-configured" };
  const { data, error } = await supabase.rpc("team_aggregate", {
    p_org_code: orgCode,
    p_team_code: teamCode,
  });
  if (error) return { ok: false, data: null, reason: error.message };
  const row = Array.isArray(data) ? data[0] : data;
  return { ok: true, data: (row as Aggregate) ?? null };
}
