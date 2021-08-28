type ActionType = 'TOGGLE LOADING' | 'SET EXISTING USER INIT DATA' | 'SET ISSIGNEDIN' | 'SET NEW USER' | 'SET HERO' | 'SET USER' | 'SET ALERTS' | 'RESET DEFAULTS' | 'REMOVE ALERTS';

interface ToggleLoadingAction {
  type: 'TOGGLE LOADING', payload: { isLoading: boolean }
}
interface SetExistingUserInitDataAction {
  type: 'SET EXISTING USER INIT DATA', payload: { user : User, hero : Hero, gameItems : Item, latestBattle : any, isSignedIn : boolean }
}
interface SetIsSignedInAction {
  type : 'SET ISSIGNEDIN', payload : { isSignedIn : boolean }
}
interface SetNewUserAction {
  type: 'SET NEW USER', payload: { newUser: boolean }
}
interface SetHeroAction {
  type: 'SET HERO', payload: { hero : Hero | (HeroWithStats & DefaultHeroProperties) }
}
interface SetUserAction {
  type: 'SET USER', payload: { user: User, isSignedIn : boolean}
}
interface SetAlertsAction {
  type: 'SET ALERTS', payload: { alerts : SnackBarAlertWithIndex[]}
}
interface ResetDefaultsAction {
  type: 'RESET DEFAULTS'
}
interface RemoveAlertsAction {
  type: 'REMOVE ALERTS', payload: { indiciesForRemoval : string[] }
}

// Same as ShoppingListAction in example
type AppAction = ToggleLoadingAction | SetExistingUserInitDataAction | SetIsSignedInAction | SetNewUserAction | SetHeroAction | SetUserAction | SetAlertsAction | ResetDefaultsAction  | RemoveAlertsAction;
type AppDispatch = (action: AppAction) => void

type Payload = {
  user : object, hero : object, gameItems : [], latestBattle : object, isSignedIn : boolean, isLoading : boolean,
  newUser : boolean, alerts : SnackBarAlert[], indiciesForRemoval : string[]
};

interface Action<Payload = {}> {
    type: ActionType;
    payload: Payload;
}
interface InitialAppState {
  jwt: string | null,
  isSignedIn: boolean
  isLoading : boolean;
  newUser : boolean;
  hero : Hero | (HeroWithStats & DefaultHeroProperties) | null;
  alerts : SnackBarAlertWithIndex[];
  user : User | null;
}

interface Store {
  state: InitialAppState
  dispatch: <Payload = {}>(action: Action<Payload>) => void
}

type linkOrConfirm = string | { text : string; cb : { () : void };}
interface SnackBarAlert{
  type : string;
  message : string;
  persist? : boolean;
  config? : linkOrConfirm;
}
type SnackBarAlertWithIndex = SnackBarAlert & { index : string };


interface User {
    id : number,
    createdAt : string,
    username : string,
    email : string,
    firstName : string,
    isFake : boolean,
    latestActivityUpdate : string,
    stravaAccessToken : string,
    stravaAccessTokenExpiration : number,
    stravaRefreshToken : string,
    featurePreferenceSubmitted : boolean,
    seenLatestPatch : boolean,
    hash : string,
    salt : string,
    active : boolean,
    emailCode : string,
    dataSrcId : string,
    emailMarketingOptIn : boolean,
    updatedAt : string
}

interface Stats {
  qp : number,
  power: number,health: number,armor: number,recovery: number,fire: number,earth: number,water: number,air: number,aether: number,
  qpPower: number,qpHealth: number,qpArmor: number,qpRecovery: number,qpFire: number,qpEarth: number,qpAir: number,qpWater: number,qpAether: number
  //[stat:string] : number
}

// Named Hero, character types
// uses properties from HeroChoice
interface HeroTemplate{
  name : string
  character : CharacterName
}

type StatusType = 'Rested' | 'Recovering' | 'Knocked Out' | 'Infected'

// Defaults for user's new Hero
interface DefaultHeroProperties {
  status : StatusType, statusFade: number, equipped: [], goToBattle: boolean, restedEnough: boolean, healthRegenRate: number, photonTokens: number, activityXP: number, battleXP: number, thisLevelStartXp: number, 
  nextLevelStartXp: number, battleDkos: number, battleDraws: number, battleLosses: number, battleWins: number, maxHealth: number, hasBeenUpgraded: boolean 
}

  interface HeroWithStats extends DefaultHeroProperties, HeroTemplate {
  power: number,health: number, armor: number,recovery: number,fire: number,earth: number,water: number,air: number,aether: number,
  qpPower: number,qpHealth: number,qpArmor: number,qpRecovery: number,qpFire: number,qpEarth: number,qpAir: number,qpWater: number,qpAether: number,
}

type ExistingHeroPropertiesAsUnion = "owner" | "id" | "character" | "createdAt" | "updatedAt" | "userId"

interface ExistingHeroProperties {
  owner : string, id : number, character : string, createdAt : string, updatedAt : string, userId : string,
}

// A user's Hero that includes the final DB fields not directly related to the game
type Hero = ExistingHeroProperties & HeroWithStats;

interface ItemInstance {
  equipped : boolean,
  itemID : number
}

interface Item extends ItemInstance {
  action: string,
  activityRestriction: string | null,
  class: string | null,
  createdAt: string,
  description: string,
  dropRate: number | null,
  effects: Effect[],
  exhaustible: boolean
  icon: string
  id: number
  levelRestriction: number | null
  lore: string | null,
  name: string,
  ptCost: number | null
  type: 'skin' | 'title' | 'pet' | 'consumable' | 'codex'
  updatedAt: string
}

interface Effect{
  name : string,
  type : string,
  description : string
}

type Stat = 'Power' | 'Health' | 'Armor' | 'Recovery' |  'Fire' | 'Earth' | 'Air' | 'Water' | 'Aether'


interface StartingElementalPower { fire : number, earth : number, water : number, air : number }

type CharacterName = "Compost Creature" | "Wilhelm the Wild" | "Repete" | "Filtron Five" | "Solar Celeste" | "Empath Aurelia" | "Boulder Bro" | "Chrono Guy" | "Timber Terror" | "Natural Ninja"
type CharacterAlias = "Compost Creature" | "Wildspeaker" | "Scavenger Robot" | "Filtron Five" | "Solar Warrior" | "Empath" | "Boulder Bro" | "Chrono Guy" | "Timber Terror" | "Natural Ninja"

// HeroChoice is used for hero selection, where as Hero is used to represent the user's Hero
interface HeroChoice {
  active : boolean
  character : CharacterName
  alias : CharacterAlias
  elms : StartingElementalPower
  skills : string[]
  ultimate : string,
  colors : string[],
  image : string,
  description : string,
  history : string
}

// Hero object received going into FinalizeHeroSelection from HeroDetails
type SelectedHero = StartingElementalPower & {  character : CharacterName }

type SpiritFoes = 'wraith' | 'specter' | 'apparition' | 'banshee' | 'poltergeist' | 'phantasm' | 'shade' | 'phantom' | 'shadow-self'
type ElementalFoes = 'gusty rascal' | 'rock skipper' | 'flame fiend' | 'splash artist' | 'wheezing jinn' | 'granite golem' | 'burning jinn' | 'cyclonic siren' | 'storming oni' | 'hulking aggro crag' | 'scorching archfiend' | 'high priestess of the tides'
type TitanFoes = 'plaguebringer'

type FoeTypes = SpiritFoes | ElementalFoes | TitanFoes;

interface FoeClasses{
  spirits : SpiritFoes[]
  elementals : ElementalFoes[]
  titans : TitanFoes[]
}



export { Action, AppDispatch, InitialAppState, AppAction, Store, SnackBarAlert, SnackBarAlertWithIndex, User, Stats, Hero, ExistingHeroPropertiesAsUnion, ExistingHeroProperties, HeroTemplate, StartingElementalPower, SelectedHero, DefaultHeroProperties, HeroWithStats, ItemInstance, Item, Stat, HeroChoice, CharacterName, CharacterAlias, FoeTypes, FoeClasses };