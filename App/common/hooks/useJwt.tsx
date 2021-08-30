import axios from "axios";
import { useEffect, useState } from "react";
import debugErrors from "../debugErrors";
import { getJwtInLocalStorage } from "../jwtModule";

export default function useJwt(): [boolean, React.Dispatch<any>] | [string, React.Dispatch<any>] {
  const [jwt, setJwt] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      async function getJwt() {
        try {
          const jwt = await getJwtInLocalStorage();
          setJwt(jwt);
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
  return [jwt, setJwt];
}
