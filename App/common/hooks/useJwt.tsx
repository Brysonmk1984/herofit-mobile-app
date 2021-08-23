import { useState } from "react";
import { getJwtInLocalStorage } from '../jwtModule';

export default function useJwt(){
  const [ jwt, setJwt ] = useState(null);
 
  async function getJwt(){
    const jwt = await getJwtInLocalStorage();
    setJwt(jwt);
  }
  getJwt();

  return [ jwt ];
}