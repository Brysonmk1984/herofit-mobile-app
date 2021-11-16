import React from "react";
import { View } from "native-base";
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";

interface PaneProps {
  children: React.ReactNode;
  mb?: number;
  mt?: number;
  variant?: string;
}

// interface IViewWithVariant extends React.ForwardRefExoticComponent<IViewProps & React.RefAttributes<unknown>> {
//   variant : 'string'
// }

const Pane: React.FC<PaneProps> = ({ children, mb = 0, mt = 0, variant = "pane" }) => {
  return (
    <View variant={variant} mt={mt} px={2} mx={3} mb={mb}>
      {children}
    </View>
  );
};

export default Pane;
