import React, { ReactChild, ReactComponentElement, ReactElement } from "react";

interface PressableWrapperProps {
  isPressable: boolean;
  wrapper: (children: ReactChild | ReactChild[]) => ReactElement;
  children: ReactChild | ReactChild[];
}

const PressableWrapper = ({ isPressable, wrapper, children }: PressableWrapperProps) => {
  return isPressable ? wrapper(children) : children;
};

export default PressableWrapper;
