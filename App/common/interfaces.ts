interface IStore {
  isLoading : boolean;
  isSignedIn : boolean;
  newUser : boolean;
  hero : object | null;
  alerts : object[];
}

type linkOrConfirm = string | { text : string; cb : { () : void };}
interface IAlert{
  index: string;
  type : string;
  message : string;
  persist? : boolean;
  config? : linkOrConfirm;
}

interface IAction {
  type : string;
  payload : {
    user : object, hero : object, gameItems : [], latestBattle : object, isSignedIn : boolean, isLoading : boolean,
    newUser : boolean, alerts : IAlert[], indiciesForRemoval : string[]
  };
}

interface IUser {
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

interface IStats {
  //qp : number,
  //power: number,health: number,armor: number,recovery: number,fire: number,earth: number,water: number,air: number,aether: number,
  //qpPower: number,qpHealth: number,qpArmor: number,qpRecovery: number,qpFire: number,qpEarth: number,qpAir: number,qpWater: number,qpAether: number
  [stat:string] : number
}

export { IStore, IAlert, IAction, IUser, IStats };