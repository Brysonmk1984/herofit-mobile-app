import { registerRootComponent } from "expo";
import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import { StateProvider } from "./store";
import App from "./App";
import herofitTheme from "./styles/herofitTheme";

const Root = () => {
  const theme = extendTheme(herofitTheme);

  return (
    <NativeBaseProvider theme={theme}>
      <StateProvider>
        <App />
      </StateProvider>
    </NativeBaseProvider>
  );
};

registerRootComponent(Root);
