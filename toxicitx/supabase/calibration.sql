-- ============================================================================
-- ToxicitX — Requêtes de calibrage du scoring
-- À lancer une fois qu'on a assez de réponses réelles dans `responses`.
-- Objectif : vérifier que les 6 niveaux sont réellement répartis, et non
-- concentrés sur un seul (typiquement « Tendue »).
-- ============================================================================

-- 1) Répartition actuelle des niveaux (combien de réponses par niveau 1..6).
select level_global, count(*) as n,
       round(100.0 * count(*) / sum(count(*)) over (), 1) as pct
from public.responses
group by level_global
order by level_global;

-- 2) Percentiles du score global : base pour poser des seuils par quantiles.
--    Ex. viser ~ des paliers réguliers (p16/p33/p50/p66/p83).
select
  round(percentile_cont(0.16) within group (order by score_global)::numeric, 1) as p16,
  round(percentile_cont(0.33) within group (order by score_global)::numeric, 1) as p33,
  round(percentile_cont(0.50) within group (order by score_global)::numeric, 1) as p50,
  round(percentile_cont(0.66) within group (order by score_global)::numeric, 1) as p66,
  round(percentile_cont(0.83) within group (order by score_global)::numeric, 1) as p83,
  count(*) as n
from public.responses;

-- 3) Moyennes par axe (pour repérer un axe systématiquement plus haut/bas).
select
  round(avg(score_ascendante), 1)  as moy_ascendante,
  round(avg(score_descendante), 1) as moy_descendante,
  round(avg(score_laterale), 1)    as moy_laterale
from public.responses;
