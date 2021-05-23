import { registerRootComponent } from 'expo';
import React from 'react';
import { StateProvider } from './store';
import App  from './App';


const Root = () => {

  return (
    <StateProvider>
      <App />
    </StateProvider>
  );
}

registerRootComponent(Root);