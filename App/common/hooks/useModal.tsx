import { useContext } from "react";
import { GlobalStateContext } from "../../store";

interface ModalToggle {
  openModal: (id: string, delay?: number) => Promise<string>;
  closeModal: (id: string, delay?: number) => Promise<string>;
}

export default function useModal(): ModalToggle {
  const { state, dispatch } = useContext(GlobalStateContext);

  function openModal(id: string, delay?: number): Promise<string> {
    setTimeout(() => {
      dispatch({ type: "ADD MODAL", payload: { id } });
      return id;
    }, delay);
  }

  function closeModal(id: string, delay?: number): Promise<string> {
    setTimeout(() => {
      dispatch({ type: "REMOVE MODAL", payload: { id } });
      return id;
    }, delay);
  }

  return { openModal, closeModal };
}
