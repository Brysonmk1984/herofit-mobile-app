import { NavigatorScreenParams, RouteProp, CompositeScreenProps } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HeroChoice, Hero, CharacterName, StartingElementalPower, CharacterAlias, SelectedHero, HeroWithStats, DefaultHeroProperties, UserStatus, Activity, Foe, Item, Stat } from "./types";
import { Battle, BattleDetailOnly } from "./types-battle";

/*
REACT NAVIGATOR TYPES
*/
type AuthStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  ForgotPassword: {
    verifyPassword?: string;
  };
  Register: NavigatorScreenParams<MainStackParamList["Home"]>;
  AboutGame: undefined;
  SelectHero: {
    heroList: HeroChoice[];
  };
  HeroDetails: {
    selectedHero: HeroChoice;
  };
  SpendQP: {
    hero: SelectedHero & { name: string };
  };
};

type MainStackParamList = {
  Home: {
    newManualActivity?: Activity;
    fetchStravaManually?: boolean;
    clearActivities?: boolean;
    postBattleReportAwards?: string[];
  };
  SpendQP: undefined;
  Activity: {
    isStravaUser: boolean;
  };
  AwaitingBattle: {
    foe: Foe;
    rewards: Item[] | null;
    character: CharacterName;
    isInstant: boolean;
  };
  BattleReport: {
    battleReport: Battle | null;
  };
  BattleReportOutcome: {
    battleReport: Battle | null;
  };
  BattleReportDetail: {
    battleReport: BattleDetailOnly;
  };
  BattleReportRounds: {
    battleReport: BattleDetailOnly;
  };
  Adversaries: undefined;
  Feedback: undefined;
  Settings: undefined;
};

interface AuthStackProps<T extends keyof AuthStackParamList> {
  navigation: StackNavigationProp<AuthStackParamList, T>;
  route: RouteProp<AuthStackParamList, T>;
}

interface MainStackProps<T extends keyof MainStackParamList> {
  navigation: StackNavigationProp<MainStackParamList, T>;
  route: RouteProp<MainStackParamList, T>;
}

export { AuthStackParamList, MainStackParamList, AuthStackProps, MainStackProps };
