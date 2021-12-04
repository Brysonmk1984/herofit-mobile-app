import { useContext } from "react";
import { GlobalStateContext } from "../../store";
import { clearJwtInLocalStorage } from "../jwtModule";
import useInventory from "./useInventory";

function useSignOut(): { signOut: () => void } {
  const { state, dispatch } = useContext(GlobalStateContext);

  function signOut() {
    clearJwtInLocalStorage();
    dispatch({ type: "SET ISSIGNEDIN", payload: { isSignedIn: false } });
  }

  return { signOut };
}

export default useSignOut;
