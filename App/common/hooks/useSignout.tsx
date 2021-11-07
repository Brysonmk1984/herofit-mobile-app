import { useContext } from "react";
import { GlobalStateContext } from "../../store";
import { clearJwtInLocalStorage } from "../jwtModule";

function useSignOut(): { signOut: () => void } {
  const { state, dispatch } = useContext(GlobalStateContext);
  function signOut() {
    clearJwtInLocalStorage();
    dispatch({ type: "SET ISSIGNEDIN", payload: { isSignedIn: false } });
  }

  return { signOut };
}

export default useSignOut;
