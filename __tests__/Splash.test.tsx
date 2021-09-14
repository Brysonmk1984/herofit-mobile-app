import { NavigationContainer } from "@react-navigation/native";
import { render, fireEvent } from "@testing-library/react-native";
import React, { useContext } from "react";
import RootStackScreen from "../App/Navigator";
import { Splash } from "../App/Screens";
import { GlobalStateContext } from "../App/store";

describe("Testing react navigation", () => {
  it("should contains the header and subheader", async () => {
    const component = (
      <NavigationContainer>
        <RootStackScreen isSignedIn={true} />
      </NavigationContainer>
    );

    const { findByText, findAllByText } = render(component);

    const header = await findByText("HeroFot");
    const subheader = await findByText("The Fitness Tracking Game");

    expect(header).toBeTruthy();
    expect(subheader).toBeTruthy();
  });

  // test('clicking on one item takes you to the details screen', async () => {
  //   const component = (
  //     <NavigationContainer>
  //       <AppNavigator />
  //     </NavigationContainer>
  //   );

  //   const { findByText } = render(component);
  //   const toClick = await findByText('Item number 5');

  //   fireEvent(toClick, 'press');
  //   const newHeader = await findByText('Showing details for 5');
  //   const newBody = await findByText('the number you have chosen is 5');

  //   expect(newHeader).toBeTruthy();
  //   expect(newBody).toBeTruthy();
  // });
});
