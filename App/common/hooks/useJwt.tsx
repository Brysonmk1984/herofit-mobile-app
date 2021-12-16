import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../../store";
import debugErrors from "../debugErrors";
import { getJwtInLocalStorage } from "../jwtModule";

export default function useJwt(): [string | null] {
  const { state, dispatch } = useContext(GlobalStateContext);
  const jwt = state.jwt;
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      async function getJwt() {
        try {
          const jwt = await getJwtInLocalStorage();
          dispatch({ type: "SET JWT", payload: { jwt } });
        } catch (error) {
          debugErrors(error);
        }
      }
      getJwt();
    }

    return () => {
      isMounted = false;
    };
  }, []);
  return [jwt];
}
