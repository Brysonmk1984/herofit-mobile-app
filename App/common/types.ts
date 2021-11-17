import { Battle } from "./types-battle";

type Pluralize<T extends string> = `${T}s`;

type ActionType = "TOGGLE LOADING" | "SET EXISTING USER INIT DATA" | "SET ISSIGNEDIN" | "SET NEW USER" | "SET HERO" | "SET USER" | "RESET DEFAULTS" | "POST UPGRADE" | "SEEN BATTLE REPORT" | "UPDATE INVENTORY" | "UPDATE EQUIPPED" | "UPDATE LATEST BATTLE" | "SET INITIAL HOMESCREEN LOAD";

interface ToggleLoadingAction {
  type: "TOGGLE LOADING";
  payload: { isLoading: boolean };
}
interface SetExistingUserInitDataAction {
  type: "SET EXISTING USER INIT DATA";
  payload: { user: User; hero: Hero; latestSavedActivities: Activity[]; latestSavedActivityDate: string | null; latestBattle: Battle; isSignedIn: boolean; allGameItems: Item[] };
}
interface SetIsSignedInAction {
  type: "SET ISSIGNEDIN";
  payload: { isSignedIn: boolean };
}
interface SetUserStatusAction {
  type: "SET USER STATUS";
  payload: { userStatus: UserStatus };
}
interface SetHeroAction {
  type: "SET HERO";
  payload: { hero: Hero | (HeroWithStats & DefaultHeroProperties) };
}
interface SetUserAction {
  type: "SET USER";
  payload: { user: User; isSignedIn?: boolean };
}
interface ResetDefaultsAction {
  type: "RESET DEFAULTS";
}
interface AddModalAction {
  type: "ADD MODAL";
  payload: { id: string };
}
interface RemoveModalAction {
  type: "REMOVE MODAL";
  payload: { id: string };
}
interface PostUpgradeAction {
  type: "POST UPGRADE";
  payload: { hero: Hero; latestSavedActivities: Activity[]; latestSavedActivityDate: moment.Moment };
}
interface SeenBattleReportAction {
  type: "SEEN BATTLE REPORT";
  payload: { latestBattle: Battle };
}
interface UpdateInventoryAction {
  type: "UPDATE INVENTORY";
  payload: { inventory: { pets: Item[]; consumables: Item[]; skins: Item[]; titles: Item[]; codices: Item[] } };
}
interface UpdateEquippedAction {
  type: "UPDATE EQUIPPED";
  payload: {
    equipped: {
      pet: Item | null;
      skin: Item | null;
      title: Item | null;
    };
  };
}
interface UpdateLatestBattleAction {
  type: "UPDATE LATEST BATTLE";
  payload: { latestBattle: Battle };
}
interface SetInitialHomescreenLoad {
  type: "SET INITIAL HOMESCREEN LOAD";
  payload: { initialHomescreenLoad: boolean };
}

// Same as ShoppingListAction in example
type AppAction = ToggleLoadingAction | SetExistingUserInitDataAction | SetIsSignedInAction | SetUserStatusAction | SetHeroAction | SetUserAction | ResetDefaultsAction | AddModalAction | RemoveModalAction | PostUpgradeAction | SeenBattleReportAction | UpdateInventoryAction | UpdateEquippedAction | UpdateLatestBattleAction | SetInitialHomescreenLoad;
type AppDispatch = (action: AppAction) => void;

interface Action<Payload = {}> {
  type: ActionType;
  payload: Payload;
}

type UserStatus = "new" | "unconfirmed" | "active";
interface Activity {
  activityDate: string;
  averageSpeed: number;
  duration: number;
  distance: number;
  elevationGain: number;
  id: number;
  maxSpeed: number;
  source: string;
  type: string;
}

interface InitialAppState {
  jwt: string | null;
  isSignedIn: boolean;
  isLoading: boolean;
  userStatus: UserStatus;
  user: User | null;
  hero: Hero | (HeroWithStats & DefaultHeroProperties) | null;
  latestSavedActivities: Activity[];
  latestSavedActivityDate: string | null;
  latestBattle: Battle | null;
  modalQueue: string[];
  allGameItems: Item[];
  inventory: {
    skins: Item[];
    pets: Item[];
    titles: Item[];
    consumables: Item[];
    codices: Item[];
  };
  equipped: {
    skin: Item | null;
    pet: Item | null;
    title: Item | null;
  };
  initialHomescreenLoad: boolean;
}

interface Store {
  state: InitialAppState;
  dispatch: <Payload = {}>(action: Action<Payload>) => void;
}

interface User {
  id: number;
  createdAt: string;
  username: string;
  email: string;
  firstName: string;
  isFake: boolean;
  latestActivityUpdate: string;
  stravaAccessToken: string;
  stravaAccessTokenExpiration: number;
  stravaRefreshToken: string;
  featurePreferenceSubmitted: boolean;
  seenLatestPatch: boolean;
  hash: string;
  salt: string;
  active: boolean;
  emailCode: string;
  dataSrcId: string;
  emailMarketingOptIn: boolean;
  updatedAt: string;
}

interface Stats {
  qp: number;
  power: number;
  health: number;
  armor: number;
  recovery: number;
  fire: number;
  earth: number;
  water: number;
  air: number;
  aether: number;
  qpPower: number;
  qpHealth: number;
  qpArmor: number;
  qpRecovery: number;
  qpFire: number;
  qpEarth: number;
  qpAir: number;
  qpWater: number;
  qpAether: number;
  //[stat:string] : number
}

// Named Hero, character types
// uses properties from HeroChoice
interface HeroTemplate {
  name: string;
  character: CharacterName;
  alias: CharacterAlias;
  colors: [string, string];
}

type HeroStatus = "Rested" | "Recovering" | "Knocked Out" | "Infected";
// Defaults for user's new Hero
interface DefaultHeroProperties {
  status: HeroStatus;
  statusFade: number;
  equipped: Item[];
  goToBattle: boolean;
  restedEnough: boolean;
  healthRegenRate: number;
  photonTokens: number;
  activityXP: number;
  battleXP: number;
  level: number;
  albedo: number | null;
  thisLevelStartXp: number;
  nextLevelStartXp: number;
  battleDkos: number;
  battleDraws: number;
  battleLosses: number;
  battleWins: number;
  maxHealth: number;
  hasBeenUpgraded: boolean;
}

interface HeroWithStats extends DefaultHeroProperties, HeroTemplate {
  power: number;
  health: number;
  armor: number;
  recovery: number;
  fire: number;
  earth: number;
  water: number;
  air: number;
  aether: number;
  qp: number;
  qpPower: number;
  qpHealth: number;
  qpArmor: number;
  qpRecovery: number;
  qpFire: number;
  qpEarth: number;
  qpAir: number;
  qpWater: number;
  qpAether: number;
}

type ExistingHeroPropertiesAsUnion = "owner" | "id" | "character" | "createdAt" | "updatedAt" | "userId";

interface ExistingHeroProperties {
  owner: string;
  id: number;
  character: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// A user's Hero that includes the final DB fields not directly related to the game
type Hero = ExistingHeroProperties & HeroWithStats;

// ITEM TYPES
type ServerItemType = "skin" | "title" | "pet" | "consumable" | "codex";
type ServerInventoryCategories = {
  [T in Pluralize<Exclude<ServerItemType, "codex">> | "codices"]: Item[];
};
type EquippableItemType = Exclude<ServerItemType, "consumable" | "codex">;

interface ItemInstance {
  equipped: boolean;
  itemID: number;
}

interface Item extends ItemInstance {
  action: string;
  activityRestriction: string | null;
  class: string | null;
  createdAt: string;
  description: string;
  dropRate: number | null;
  effects: Effect[];
  exhaustible: boolean;
  icon: string;
  id: number;
  levelRestriction: number | null;
  lore: string | null;
  name: string;
  ptCost: number | null;
  type: ServerItemType;
  updatedAt: string;
  count?: number;
}

type ItemWithOwnership = Item & { owned: boolean };
type BattleInstantItem = "Storm Crow Bone Chimes" | "Smoldering Skull Torch" | "Petrified Power Totem" | "Wave-Swept Battle Conch" | "Plague Token" | "Obsidian Mirror";

interface Effect {
  name: string;
  type: string;
  description: string;
}

type Stat = "Power" | "Health" | "Armor" | "Recovery" | "Fire" | "Earth" | "Air" | "Water" | "Aether";
type Extends<T, U extends T> = U;
type PrimaryElement = Extends<Stat, "Fire" | "Earth" | "Air" | "Water">;
type EveryElement = Extends<Stat, "Fire" | "Earth" | "Air" | "Water" | "Aether">;
interface StartingElementalPower {
  fire: number;
  earth: number;
  water: number;
  air: number;
}

type CharacterName = "Compost Creature" | "Wilhelm the Wild" | "Repete" | "Filtron Five" | "Solar Celeste" | "Empath Aurelia" | "Boulder Bro" | "Chrono Guy" | "Timber Terror" | "Natural Ninja";
type CharacterAlias = "Compost Creature" | "Wildspeaker" | "Scavenger Robot" | "Filtron Five" | "Solar Warrior" | "Empath" | "Boulder Bro" | "Chrono Guy" | "Timber Terror" | "Natural Ninja";

// HeroChoice is used for hero selection, where as Hero is used to represent the user's Hero
interface HeroChoice {
  active: boolean;
  character: CharacterName;
  alias: CharacterAlias;
  elms: StartingElementalPower;
  skills: string[];
  ultimate: string;
  colors: string[];
  image: string;
  description: string;
  history: string;
}

// Hero object received going into from HeroDetails
type SelectedHero = StartingElementalPower & { character: CharacterName };

type SpiritFoe = "Wraith" | "Specter" | "Apparition" | "Banshee" | "Poltergeist" | "Phantasm" | "Shade" | "Phantom" | "Shadow-Self";
type ElementalFoe = "Gusty Rascal" | "Rock Skipper" | "Flame Fiend" | "Splash Artist" | "Wheezing Jinn" | "Granite Golem" | "Burning Jinn" | "Cyclonic Siren" | "Storming Oni" | "Hulking Aggro Crag" | "Scorching Archfiend" | "High Priestess of the Tides";
type TitanFoe = "Plaguebringer";

type FoeType = SpiritFoe | ElementalFoe | TitanFoe;

interface FoeAbility {
  effect: string;
  name: string;
  type: string;
}
type FoeClass = "Elementals" | "Spirits" | "Titans";
interface Foe {
  ability: FoeAbility;
  air: number;
  armor: number;
  class: FoeClass;
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
  foe?: string[];
  reward?: {
    type: string;
    name: string;
  };
  levelRequirement?: number;
  itemSummonOnly?: boolean;
}

interface AllFoes {
  Spirits: Foe[];
  Elementals: Foe[];
  Titans: Foe[];
}

type Tint = "fire_tint" | "earth_tint" | "water_tint" | "air_tint" | "banshee_tint" | "poltergeist_tint" | "specter_tint" | "wraith_tint" | "phantom_tint" | "phantasm_tint" | "shade_tint" | "apparition_tint";
type UniqueImageSkin = "shadow_self" | "ascended_self" | "gale_force" | "fire_brand" | "earth_shaker" | "tide_caller";
type SkinLcUnderscoreName = UniqueImageSkin | Tint;
type SkinName = "Fire Tint" | "Earth Tint" | "Water Tint" | "Air Tint" | "Banshee Tint" | "Poltergeist Tint" | "Specter Tint" | "Wraith Tint" | "Phantom Tint" | "Phantasm Tint" | "Shade Tint" | "Apparition Tint" | "Shadow Self" | "Ascended Self" | "Gale Force" | "Fire Brand" | "Earth Shaker" | "Tide Caller";
type ZodiacSign = "Capricorn" | "Aquarius" | "Pisces" | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo" | "Libra" | "Scorpio" | "Sagittarius";

type TabType = "Consumables" | "Costumes" | "Pets" | "Codex" | "Titles";
type TabColors = {
  [T in TabType]: [string, string];
};

type ActionFeedbackType = "info" | "caution" | "error" | "success";

export { Action, AppDispatch, InitialAppState, AppAction, Store, User, UserStatus, Activity, Stats, Hero, ExistingHeroPropertiesAsUnion, ExistingHeroProperties, StartingElementalPower, SelectedHero, HeroStatus, DefaultHeroProperties, HeroWithStats, ItemInstance, Item, ItemWithOwnership, BattleInstantItem, ServerItemType, ServerInventoryCategories, EquippableItemType, Effect, Stat, PrimaryElement, EveryElement, HeroChoice, CharacterName, CharacterAlias, FoeAbility, FoeType, AllFoes, SkinLcUnderscoreName, SkinName, Tint, Foe, FoeClass, ZodiacSign, TabType, TabColors, ActionFeedbackType };
