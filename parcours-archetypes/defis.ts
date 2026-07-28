// parcours-archetypes/defis.ts
// La BANQUE de micro-défis. Chaque archétype ne portait qu'un seul défi (dans
// archetypes.ts) : répété dès qu'il revenait. Ici, plusieurs défis par archétype,
// tous taillés sur son « lest » (ce dont il doit se délester pour atteindre sa
// force). nouveauteDuJour les combine au défi d'origine et les fait TOURNER par
// jour — un défi frais à chaque passage. Registre : une micro-action concrète
// (≈ 2 min) suivie d'une observation, jamais une injonction.

import { ArchetypeKey } from "./types";

export const DEFIS_BANQUE: Record<ArchetypeKey, string[]> = {
  explorateur: [
    "Aujourd'hui, reprends une chose laissée à mi-chemin et donne-lui dix minutes de plus, sans en commencer aucune autre. Observe ce qui se révèle quand tu restes là où l'inédit s'était épuisé.",
    "Choisis un lieu que tu crois connaître par cœur — ta rue, ta cuisine, ton trajet. Pendant deux minutes, cherches-y un détail jamais remarqué. Note ce que le familier avait encore à t'apprendre.",
    "Repère une envie de partir — changer de sujet, de projet, de pièce. Reste trois minutes de plus. Observe ce que le mouvement t'aurait fait éviter.",
    "Approfondis une seule conversation aujourd'hui au lieu d'en ouvrir trois. Avant de dire « et après ? », demande-toi « et plus profond ? ». Observe la différence entre l'ampleur et la profondeur.",
  ],
  sage: [
    "Dis une chose ressentie avant de l'avoir entièrement comprise. Une phrase suffit. Observe ce qui se passe quand l'expérience précède l'explication.",
    "Prends une décision mineure en trente secondes, sans peser le pour et le contre. Observe si le monde s'écroule — ou si la clarté vient parfois après l'acte.",
    "Pose aujourd'hui une question dont tu ignores vraiment la réponse, et résiste à l'envie d'y répondre à sa place. Observe ce que l'inconnu partagé ouvre.",
    "Face à une émotion confuse, renonce deux minutes à l'analyser : nomme-la simplement, sans la résoudre. Observe ce qui s'apaise quand tu cesses d'exiger de comprendre.",
  ],
  createur: [
    "Montre aujourd'hui une chose inachevée à une personne — un brouillon, une idée, une esquisse. Observe ce qui vit quand l'imparfait quitte l'abri de ta tête.",
    "Fixe-toi dix minutes pour finir, pas pour parfaire. Livre au signal, tel quel. Observe ce que ta valeur devient quand elle cesse de dépendre du résultat.",
    "Crée une petite chose que personne ne verra jamais, juste pour le plaisir de la faire. Observe ce que devient ton élan quand le regard des autres n'est plus l'enjeu.",
    "Laisse une trace publique d'un travail en cours plutôt que d'attendre le chef-d'œuvre. Observe ce que le partage imparfait déclenche que la perfection cachée n'obtient jamais.",
  ],
  rebelle: [
    "Aujourd'hui, dis oui à une bonne idée qui ne vient pas de toi, et fais-la tienne. Observe ce que devient ta liberté quand elle cesse d'être une réaction.",
    "Repère un « non » que tu allais lancer par principe. Écoute d'abord jusqu'au bout. Observe ce qui reste de ton refus une fois la chose vraiment entendue.",
    "Construis une petite chose que tu défends, au lieu de dénoncer une chose que tu combats. Observe où va ton énergie quand elle bâtit plutôt qu'elle s'oppose.",
    "Choisis une règle que tu suis sans y croire et demande-toi ce qu'elle protège. Garde-la ou change-la — mais par conviction, pas par automatisme. Observe la différence.",
  ],
  protecteur: [
    "Aujourd'hui, laisse quelqu'un se débrouiller seul avec une difficulté qu'il peut gérer, et occupe-toi de toi à la place. Observe ce que ta retenue lui rend de sa propre force.",
    "Dis « non » à une demande, sans te justifier par une longue explication. Observe ce que ce « non » libère — chez toi, et chez l'autre.",
    "Repère un fardeau que tu portes et qui n'est pas le tien. Repose-le, mentalement, deux minutes. Observe ce qui change dans ton corps quand tu cesses de tout tenir.",
    "Offre-toi un soin que tu donnerais spontanément à quelqu'un d'autre. Observe la culpabilité si elle vient — puis ce qu'il reste quand elle passe.",
  ],
  amoureux: [
    "Aujourd'hui, exprime une préférence qui te distingue du groupe, calmement. Observe que le lien vrai supporte ta différence — et que tu existes davantage dedans.",
    "Dis un désaccord léger sans l'adoucir pour plaire. Observe ce qui se passe quand tu gardes ta forme au lieu de te fondre.",
    "Repère un « oui » que tu allais donner pour être aimé·e. Prends trois secondes avant de répondre. Observe ce que tu veux vraiment, sous le besoin d'approbation.",
    "Reçois un compliment sans le renvoyer ni le minimiser : dis simplement merci. Observe l'inconfort, puis ce qui s'installe quand tu laisses ta valeur exister.",
  ],
  batisseur: [
    "Aujourd'hui, change une seule habitude que tu défendais comme une règle. Observe que la solidité qui s'adapte tient mieux que celle qui se fige.",
    "Devant un imprévu qui bouscule ton plan, adapte la structure au réel plutôt que l'inverse. Observe ce qu'une fondation vivante rend possible qu'un mur ne rend pas.",
    "Laisse une tâche « à 90 % » et passe à la suite sans la border parfaitement. Observe ce que ton besoin de contrôle cherchait vraiment à rassurer.",
    "Accueille aujourd'hui une idée qui contredit ta méthode, et teste-la deux minutes en pensée. Observe la peur du changement — puis ce qu'elle protégeait.",
  ],
  guerisseur: [
    "Aujourd'hui, passe en premier pour une chose, une seule. Observe la gêne — puis ce que ta source retrouve quand elle cesse de se vider.",
    "Quand on te demande de l'aide alors que tu es à bout, réponds : « pas maintenant, je me recharge ». Observe que prendre soin de toi n'abandonne personne.",
    "Repère une émotion qui n'est pas la tienne mais que tu as absorbée. Rends-la, mentalement, à qui elle appartient. Observe l'espace qui revient.",
    "Accorde-toi dix minutes sans utilité pour personne — juste pour toi. Observe ce que devient ta présence aux autres une fois la coupe un peu remplie.",
  ],
  joueur: [
    "Aujourd'hui, tiens une conversation sérieuse jusqu'au bout, sans dégainer de blague. Observe ce que ta légèreté vaut de plus quand tu sais aussi être là pour de vrai.",
    "Repère une vanne prête à désamorcer un moment qui te touche. Laisse le moment exister, nu. Observe ce que l'humour t'aurait fait éviter.",
    "Nomme aujourd'hui une chose grave que tu portes, à voix haute ou par écrit, sans la rendre drôle. Observe ce que la vérité pèse — et ce qu'elle libère.",
    "Engage-toi sur une petite chose au lieu de garder toutes tes options ouvertes. Observe ce que la fidélité à un choix offre que la disponibilité permanente ne donne pas.",
  ],
  passeur: [
    "Aujourd'hui, revendique une chose que tu as faite, sans la minimiser. Observe qu'exister ne trahit pas ta générosité — ça la rend visible.",
    "Nomme ta part dans un projet salué, simplement, au lieu de laisser filer. Observe ce que ça change de passer sans t'annuler.",
    "Reçois un remerciement sans le rediriger vers un autre. Observe l'envie de t'effacer — puis ce qui se passe quand tu restes.",
    "Fais aujourd'hui une chose pour toi seul·e, pas pour faire grandir quelqu'un d'autre. Observe ce que ta lumière devient quand elle n'éclaire pas d'abord les autres.",
  ],
  reveur: [
    "Aujourd'hui, fais le plus petit pas réel vers un rêve — imparfait, modeste, concret. Observe qu'un rêve touché du doigt vaut mieux que mille rêves parfaits.",
    "Prends une idée que tu idéalises et confronte-la deux minutes au réel : une contrainte, un premier geste. Observe ce que l'incarnation abîme — et ce qu'elle rend vivant.",
    "Repère l'attente du « moment parfait » pour te lancer. Lance-toi maintenant, en plus petit. Observe ce que le réel, même modeste, avait à t'offrir que l'attente refusait.",
    "Transforme un rêve en une seule action visible aujourd'hui, si minuscule soit-elle. Observe ce qui se déplace quand le possible accepte de devenir réel.",
  ],
  metamorphe: [
    "Aujourd'hui, engage-toi sur une chose pour les trente prochains jours. Observe la peur de te fixer — puis ce que rester assez longtemps permet enfin de récolter.",
    "Repère l'envie de tout changer alors qu'une voie commence à te réussir. Reste, et déploie-toi dedans. Observe qu'on peut se transformer sans fuir.",
    "Nomme une identité qui se dessine en toi, au lieu de la fuir dès qu'elle se précise. Observe ce que tu deviens quand tu acceptes d'être saisi·e un moment.",
    "Termine aujourd'hui quelque chose que tu aurais quitté avant la fin. Observe ce que la constance récolte que le mouvement perpétuel disperse.",
  ],
};

// La rotation : à un jour donné, le défi de cet archétype est puisé dans le
// pool [défi d'origine, …banque]. L'index dépend du jour → il tourne, sans
// jamais répéter deux fois de suite le même quand l'archétype revient.
export function defiDuJour(n: number, archKey: ArchetypeKey, defiOrigine: string): string {
  const pool = [defiOrigine, ...(DEFIS_BANQUE[archKey] ?? [])];
  if (pool.length === 0) return defiOrigine;
  const idx = Math.floor((n - 1) / 2) % pool.length; // le défi paraît ~1 jour/2
  return pool[idx];
}
