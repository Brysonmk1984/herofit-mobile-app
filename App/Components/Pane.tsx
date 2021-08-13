import React from 'react';
import { View } from "native-base";
import { IViewProps } from 'native-base/lib/typescript/components/basic/View/types';

interface PaneProps {
  children : React.ReactNode
}

// interface IViewWithVariant extends React.ForwardRefExoticComponent<IViewProps & React.RefAttributes<unknown>> {
//   variant : 'string'
// }



const Pane: React.FC<PaneProps> = ({ children }) => {
    return (
      <View variant="pane" mx={5}>
        { children }
      </View>
    );
}

export default Pane;