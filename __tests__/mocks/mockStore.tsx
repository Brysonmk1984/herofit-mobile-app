import { AppState } from "react-native";
import { AppAction } from "../../App/common/types";
import React from "react";
import { Context } from "@/store/Context";

export const store: AppState = {
  //dispatch: jest.fn(),
  isLoading: false,
  isSignedIn: false,
  userStatus: "new",
  hero: null,
  jwt: null,
  user: null,
  modalQueue: [],
};

export const StateProvider: React.FC = ({ children }) => {
  return <Context.Provider value={store}>{children}</Context.Provider>;
};
