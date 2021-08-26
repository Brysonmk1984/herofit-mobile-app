
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HeroChoice, Hero, CharacterName, StartingElementalPower, CharacterAlias, SelectedHero, HeroWithStats, DefaultHeroProperties } from './types';

/*
REACT NAVIGATOR TYPES
*/

// PARAM LISTS - If I pass props to the screens, they need to be added here
type RootStackParamList = {
  App : undefined,
  Auth : undefined
};

type MainDrawerParamList = {
  Home : undefined
  HomeWrapperScreen : undefined
  Profile : undefined
  Ranking : undefined
  Campaign : undefined
  Inventory : undefined
  Items : undefined
  Feedback : undefined
  Settings : undefined
  Loading : undefined
  SpendQP : undefined
};

type AuthStackParamList = {
  SignIn: undefined
  Register: undefined
  SelectHeroHowTo: undefined
  SelectHero: {
    heroList : HeroChoice[]
  }
  HeroDetails: {
    selectedHero : HeroChoice
  }
  FinalizeHeroSelection: {
    selectedHero : SelectedHero,
    alias : CharacterAlias
    colors : [string, string]
  }
  SpendQP: {
    hero : SelectedHero & { name : string }
  }
};

interface AuthStackProps <T extends keyof AuthStackParamList> {
  navigation: StackNavigationProp<AuthStackParamList, T>
  route : RouteProp<AuthStackParamList, T>
}

interface MainDrawerProps <T extends keyof MainDrawerParamList> {
  navigation: StackNavigationProp<MainDrawerParamList, T>
  route : RouteProp<MainDrawerParamList, T>
}

interface RootStackProps <T extends keyof RootStackParamList> {
  navigation: StackNavigationProp<RootStackParamList, T>
  route : RouteProp<RootStackParamList, T>
}

export { AuthStackParamList, MainDrawerParamList, RootStackParamList, AuthStackProps, MainDrawerProps, RootStackProps }
