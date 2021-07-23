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

interface Action {
  type : string;
  payload : object;
}



export { IStore, IAlert, Action };