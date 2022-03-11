import React from "react";
import SignIn from "../SignIn";
import { render } from "@testing-library/react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { AuthStackParamList, AuthStackProps } from "../../../common/types-navigator";
import { StackNavigationProp } from "@react-navigation/stack";
import PaneActionButton from "../../../Components/PaneActionButton";
import { NativeBaseProvider } from "native-base";

type NavigationPropAlias = NavigationProp<{}>;

describe("SignIn Component", () => {
  let navigation = { dispatch: jest.fn() } as unknown as StackNavigationProp<AuthStackParamList, "SignIn">;
  let route = {} as unknown as RouteProp<AuthStackParamList, "SignIn">;

  const props = { navigation, route };

  // it("Should Render", () => {
  //   const { getByText } = render(<SignIn {...props} />);

  //   expect(1).toBe(1);
  //   //expect(getByText(/Let's Go!/i)).toBeTruthy();
  // });

  // it("Test SignIn Button", () => {
  //   const inset = {
  //     frame: { x: 0, y: 0, width: 0, height: 0 },
  //     insets: { top: 0, left: 0, right: 0, bottom: 0 },
  //   };
  //   const component = (
  //     <NativeBaseProvider initialWindowMetrics={inset}>
  //       <PaneActionButton text="Let's Go!" action={() => undefined} />
  //     </NativeBaseProvider>
  //   );
  //   const { getByDisplayValue } = render(component);

  //   expect(getByDisplayValue("Let's Go!")).toBeTruthy();
  // });
});
