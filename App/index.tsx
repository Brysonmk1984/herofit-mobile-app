import { registerRootComponent } from 'expo';
import React, { useContext, useEffect } from 'react';
import { store } from './store';
import { StateProvider } from './store';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Home, SignIn, SignUp } from './Screens';
import App  from './App';


const Root = () => {

  return (
    <StateProvider>
      <App />
    </StateProvider>
  );
}

registerRootComponent(Root);