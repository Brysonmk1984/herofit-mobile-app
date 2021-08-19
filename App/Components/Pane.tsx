import React from 'react';
import { View } from "native-base";
import { IViewProps } from 'native-base/lib/typescript/components/basic/View/types';

interface PaneProps {
  children : React.ReactNode,
  mb? : number,
  lore? : boolean
}

// interface IViewWithVariant extends React.ForwardRefExoticComponent<IViewProps & React.RefAttributes<unknown>> {
//   variant : 'string'
// }



const Pane: React.FC<PaneProps> = ({ children, mb = 0, lore }) => {
    return (
      <View variant={ lore ? 'lorePane' : 'pane' } px={2} mx={3} mb={mb}>
        { children }
      </View>
    );
}

export default Pane;