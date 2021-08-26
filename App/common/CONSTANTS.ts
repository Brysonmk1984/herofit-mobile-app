import { DefaultHeroProperties, ExistingHeroProperties } from './types';

const DEFAULT_HERO_PROPERTIES : DefaultHeroProperties = { status: 'Rested', statusFade: 0, equipped: [], goToBattle: false, restedEnough: true, healthRegenRate: 4, photonTokens: 0, activityXP: 0, battleXP: 0, thisLevelStartXp: 0, nextLevelStartXp: 67, battleDkos: 0, battleDraws: 0, battleLosses: 0, battleWins: 0, maxHealth: 100, hasBeenUpgraded: false };

const EXISTING_HERO_PROPERTIES : (keyof ExistingHeroProperties)[] = ["owner", "id", "character", "createdAt", "updatedAt", "userId"];

export {
  DEFAULT_HERO_PROPERTIES, EXISTING_HERO_PROPERTIES
}