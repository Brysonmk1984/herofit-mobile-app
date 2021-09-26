import { useEffect, useRef } from "react";

const useDidMount = () => {
  const didMountRef = useRef(false);
  useEffect(() => {
    didMountRef.current = true;
  }, []);
  return { mounted: didMountRef.current };
};

export default useDidMount;
