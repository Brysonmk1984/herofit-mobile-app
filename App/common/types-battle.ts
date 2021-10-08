import { CharacterName, Item, HeroStatus, FoeType, Hero, PrimaryElement, ZodiacSign } from "./types";

type BattleOutcome = "Avatar Wins" | "Foe Wins" | "Draw" | "Double KO";
interface BattleElementStats {
  air: number;
  earth: number;
  fire: number;
  water: number;
  total: number;
}
interface BattleElementalProcs {
  air: {
    evaded: boolean;
  };
  earth: {
    thornsDamageToAttacker: number;
    thornsFactor: string;
  };
  fire: {
    critChance: number;
    critDamage: number;
  };
  water: {
    amountHealed: number;
    healingFactor: string;
  };
}
interface BattleRound {
  aggressor: "Foe" | "Avatar";
  aggressorHealthLeft: number;
  defender: "Foe" | "Avatar";
  defenderHealthLeft: number;
  elementalDamageDealt: BattleElementStats;
  elementalProcs: BattleElementalProcs;
  elementalReduction: BattleElementStats;
  physicalDamageDealt: number;
  physicalReduction: number;
  turn: number;
}
interface BattleBRA {
  activityXP: number;
  aether: number;
  air: number;
  armor: number;
  battleDkos: number;
  battleDraws: number;
  battleLosses: number;
  battleWins: number;
  battleXP: number;
  character: CharacterName;
  earth: number;
  equipped: Item[];
  fire: number;
  health: number;
  id: number;
  maxHealth: number;
  name: string;
  owner: string;
  photonTokens: number;
  power: number;
  qp: number;
  status: HeroStatus;
  statusFade: number;
  water: number;
}
interface BattleBRF {
  ability: {
    effect: string;
    name: string;
    type: "prebattle" | "postbattle";
  };
  air: number;
  armor: number;
  class: "Elementals" | "Spirits" | "Titans";
  difficulty: number;
  earth: number;
  fire: number;
  health: number;
  name: string;
  power: number;
  ptBounty: number;
  type: FoeType;
  water: number;
  xpBounty: number;
}
interface BattleFoe {
  ability: {
    effect: string;
    name: string;
    type: "prebattle" | "postbattle";
  };
  air: number;
  armor: number;
  class: "Elementals" | "Spirits" | "Titans";
  difficulty: number;
  earth: number;
  fire: number;
  health: number;
  name: string;
  power: number;
  ptBounty: number;
  type: FoeType;
  water: number;
  xpBounty: number;
}

interface Battle {
  aElmDamage: BattleElementStats;
  aElmReduction: BattleElementStats;
  aHealthRemaining: number;
  aPhyDamage: number;
  aPhyReduction: number;
  aStatus: HeroStatus;
  avatar: Hero;
  avatarID: number;
  avatarName: string;
  bra: BattleBRA;
  brf: BattleBRF;
  createdAt: Date;
  effects: string[] | null;
  fElmDamage: BattleElementStats;
  fElmReduction: BattleElementStats;
  fHealthRemaining: number;
  fPhyDamage: number;
  fPhyReduction: number;
  foe: BattleFoe;
  foeType: FoeType;
  id: number;
  outcome: BattleOutcome;
  owner: string;
  postBattleActions: string[];
  ptGain: number;
  roundBreakdown: BattleRound[];
  scenario: number;
  seasonalBonusElement: {
    element: PrimaryElement;
    sign: ZodiacSign;
  };
  seenReport: boolean;
  updatedAt: Date;
  xpGain: number;
}

export { Battle, BattleFoe, BattleBRF, BattleBRA, BattleRound, BattleElementalProcs, BattleElementStats, BattleOutcome };
