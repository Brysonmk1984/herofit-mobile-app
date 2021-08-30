import { useContext } from "react";
import randomToken from "random-token";
import { GlobalStateContext } from "../store";
import { AppAction } from "./types";

export function openModal(id: string, dispatch: React.Dispatch<AppAction>) {
  dispatch({ type: "ADD MODAL", payload: { id } });

  return id;
}

export function closeModal(id: string, dispatch: React.Dispatch<AppAction>) {
  dispatch({ type: "REMOVE MODAL", payload: { id } });
  return id;
}
