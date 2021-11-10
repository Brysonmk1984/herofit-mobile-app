import { registerRootComponent } from "expo";
import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import { StateProvider } from "./store";
import App from "./App";
import herofitTheme from "./styles/herofitTheme";
import "react-native-gesture-handler";

const Root = () => {
  const theme = extendTheme(herofitTheme);

  return (
    <NativeBaseProvider theme={theme} config={{ suppressColorAccessibilityWarning: true }}>
      <StateProvider>
        <App />
      </StateProvider>
    </NativeBaseProvider>
  );
};

registerRootComponent(Root);
