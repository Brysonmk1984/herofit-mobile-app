type ActionType = 'TOGGLE LOADING' | 'SET USER' | 'SET NEW USER';

interface Action<Payload = {}> {
    type: ActionType
    payload: Payload
}

interface Store {
  state: {
    jwt: string,
    isSignedIn: boolean
    isLoading : boolean;
    newUser : boolean;
    hero : object | null;
    alerts : object[];
  }
  dispatch: <Payload = {}>(action: Action<Payload>) => void
}

// interface Store {
  // jwt: string,
  // isSignedIn: boolean
  // isLoading : boolean;
// }

// interface Action {
//   type : string;
//   payload : {
//     user : object, hero : object, gameItems : [], latestBattle : object, isSignedIn : boolean, isLoading : boolean,
//     newUser : boolean, alerts : SnackBarAlert[], indiciesForRemoval : string[]
//   };
// }

type linkOrConfirm = string | { text : string; cb : { () : void };}
interface SnackBarAlert{
  index: string;
  type : string;
  message : string;
  persist? : boolean;
  config? : linkOrConfirm;
}

interface Action {
  type : string;
  payload : {
    user : object, hero : object, gameItems : [], latestBattle : object, isSignedIn : boolean, isLoading : boolean,
    newUser : boolean, alerts : SnackBarAlert[], indiciesForRemoval : string[]
  };
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

interface Hero {
  name : string, status: string, statusFade : number,
  equipped : ItemInstance[], goToBattle : boolean, restedEnough : boolean, healthRegenRate : number, photonTokens : string, 
  activityXP : number, battleXP : number, thisLevelStartXp : number, nextLevelStartXp : number,
  battleDkos: number, battleDraws: number, battleLosses: number, battleWins: number,
  power: number,health: number, maxHealth : string, armor: number,recovery: number,fire: number,earth: number,water: number,air: number,aether: number,
  qpPower: number,qpHealth: number,qpArmor: number,qpRecovery: number,qpFire: number,qpEarth: number,qpAir: number,qpWater: number,qpAether: number,
  hasBeenUpgraded : boolean, owner : string, id : number, character : string, createdAt : string, updatedAt : string, userId : string
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

export { Action, Store, SnackBarAlert, User, Stats, Hero, ItemInstance, Item };