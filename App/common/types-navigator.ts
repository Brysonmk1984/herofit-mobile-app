/*
REACT NAVIGATOR TYPES
*/

// PARAM LISTS - If I pass props to the screens, they need to be added here
type RootStackParamList = {
  App : undefined,
  Auth : undefined
};

type SidebarDrawerParamList = {
  Home : undefined
  HomeWrapperScreen : undefined
  Profile : undefined
  Ranking : undefined
  Campaign : undefined
  Inventory : undefined
  Items : undefined
  Feedback : undefined
  Settings : undefined
};

type HomeWrapperStackParamList = {
  Home : undefined
};

type WalkthroughStackParamList = {};

type AuthStackParamList = {
  SignIn: undefined
  Register: undefined
  SelectHeroHowTo: undefined
  SelectHero: undefined
  HeroDetails: undefined
  FinalizeHeroSelection: undefined
  SpendQP: undefined
};

export { RootStackParamList, SidebarDrawerParamList, HomeWrapperStackParamList, WalkthroughStackParamList, AuthStackParamList }
