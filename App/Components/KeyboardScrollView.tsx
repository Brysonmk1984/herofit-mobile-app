import { View } from "native-base";
import React, { ReactChild, useMemo } from "react";
import { Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useAspectRatio from "../common/hooks/useAspectRatio";

interface KeyboardScrollViewProps {
  children: ReactChild | ReactChild[];
  extraScroll?: number | undefined;
}

const KeyboardScrollView: React.FC<KeyboardScrollViewProps> = ({ children, extraScroll = 0 }) => {
  const { deviceWidth, deviceHeight, deviceAspectType } = useMemo(() => useAspectRatio(), []);
  const isAndroid = Platform.OS === "android";
  const isLongPhone = deviceAspectType === "long";
  const isShortPhone = Platform.OS === "android";

  return (
    <View flex={isLongPhone ? 1 : 0}>
      <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={isAndroid ? 200 : 100} extraScrollHeight={isShortPhone && isAndroid ? extraScroll : Math.floor(extraScroll / 4)}>
        {children}
      </KeyboardAwareScrollView>
    </View>
  );
};
export default KeyboardScrollView;
