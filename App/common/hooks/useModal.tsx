import { useContext } from "react";
import { GlobalStateContext } from "../../store";
import { AppAction } from "./types";

interface ModalToggle {
  openModal: (id: string) => string;
  closeModal: (id: string) => string;
}

export default function useModal(): ModalToggle {
  const { state, dispatch } = useContext(GlobalStateContext);

  function openModal(id: string) {
    dispatch({ type: "ADD MODAL", payload: { id } });
    return id;
  }

  function closeModal(id: string) {
    dispatch({ type: "REMOVE MODAL", payload: { id } });
    return id;
  }

  return { openModal, closeModal };
}
