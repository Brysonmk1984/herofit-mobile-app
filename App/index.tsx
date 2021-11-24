import { registerRootComponent } from "expo";
import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import { StateProvider } from "./store";
import App from "./App";
import herofitTheme from "./styles/herofitTheme";
import "react-native-gesture-handler";
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "https://051e343d956b42e3bb7286f93ffe965d@o1077292.ingest.sentry.io/6080100",
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

// Access any @sentry/react-native exports via:
//Sentry.Native.*;

// Access any @sentry/browser exports via:
//Sentry.Browser.*;

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
