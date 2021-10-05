import { registerRootComponent } from "expo";
import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import { StateProvider } from "./store";
import App from "./App";
import herofitTheme from "./styles/herofitTheme";
import { ToastTest } from "./Screens/ToastTest";

const Root = () => {
  const theme = extendTheme(herofitTheme);

  return (
    <NativeBaseProvider theme={theme}>
      <StateProvider>
        {/* <ToastTest /> */}
        <App />
      </StateProvider>
    </NativeBaseProvider>
  );
};

registerRootComponent(Root);
