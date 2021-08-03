/*
REACT NAVIGATOR TYPES
*/

// PARAM LISTS - If I pass props to the screens, they need to be added here
type SelectHeroStackParamList = {
  SelectHeroHowTo: undefined
  SelectHero: undefined
  HeroDetails: undefined
  FinalizeHeroSelection: undefined
  SpendQP: undefined
};

type RootStackParamList = {
  App : undefined,
  Auth : undefined
};

type SidebarDrawerParamList = {
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
  SelectHero: undefined
  SignIn: undefined
  Register: undefined
};

export { SelectHeroStackParamList, RootStackParamList, SidebarDrawerParamList, HomeWrapperStackParamList, WalkthroughStackParamList, AuthStackParamList }
