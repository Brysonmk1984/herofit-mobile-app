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
  type: 'SET HERO', payload: { hero : Hero }
}
interface SetUserAction {
  type: 'SET USER', payload: { user: User}
}
interface SetAlertsAction {
  type: 'SET ALERTS', payload: { alerts : SnackBarAlert[]}
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
  hero : Hero | null;
  alerts : SnackBarAlert[];
  user : User | null;
}

interface Store {
  state: InitialAppState
  dispatch: <Payload = {}>(action: Action<Payload>) => void
}

type linkOrConfirm = string | { text : string; cb : { () : void };}
interface SnackBarAlert{
  index: string;
  type : string;
  message : string;
  persist? : boolean;
  config? : linkOrConfirm;
}


interface User {
    id : number,
    createdAt : string,
    username : string,
    email : string,
    firstName : string,
    lastName : string,
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
  //qp : number,
  //power: number,health: number,armor: number,recovery: number,fire: number,earth: number,water: number,air: number,aether: number,
  //qpPower: number,qpHealth: number,qpArmor: number,qpRecovery: number,qpFire: number,qpEarth: number,qpAir: number,qpWater: number,qpAether: number
  [stat:string] : number
}

interface InitialHero {
  name : string, status: string, statusFade : number,
  equipped : ItemInstance[], goToBattle : boolean, restedEnough : boolean, healthRegenRate : number, photonTokens : string, 
  activityXP : number, battleXP : number, thisLevelStartXp : number, nextLevelStartXp : number,
  battleDkos: number, battleDraws: number, battleLosses: number, battleWins: number,
  power: number,health: number, maxHealth : string, armor: number,recovery: number,fire: number,earth: number,water: number,air: number,aether: number,
  qpPower: number,qpHealth: number,qpArmor: number,qpRecovery: number,qpFire: number,qpEarth: number,qpAir: number,qpWater: number,qpAether: number,
  hasBeenUpgraded : boolean,
}

interface Hero extends InitialHero {
  owner : string, id : number, character : string, createdAt : string, updatedAt : string, userId : string
}

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
  type: string
  updatedAt: string
}

interface Effect{
  name : string,
  type : string,
  description : string
}

type Stat = 'Power' | 'Health' | 'Armor' | 'Recovery' |  'Fire' | 'Earth' | 'Air' | 'Water' | 'Aether'


export { Action, AppDispatch, InitialAppState, AppAction, Store, SnackBarAlert, User, Stats, Hero, InitialHero, ItemInstance, Item, Stat };