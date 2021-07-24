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



export { IStore, IAlert, IAction };