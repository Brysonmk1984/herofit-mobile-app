import { ActionFeedbackType } from "../types";
import useAspectRatio from "./useAspectRatio";
import Toast from "react-native-toast-message";
import * as WebBrowser from "expo-web-browser";

const useGlobalToast = () => {
  const { deviceAspectType } = useAspectRatio();
  const isLongPhone = deviceAspectType === "long";

  function _determineBottomOffset(offset: number | "default", isLongPhone: boolean) {
    if (isLongPhone) {
      if (offset === "default") {
        return 50;
      } else {
        return offset * 1.2;
      }
    } else {
      if (offset === "default") {
        return 25;
      } else {
        return offset;
      }
    }
  }

  return {
    addToast: (type: ActionFeedbackType, message: string, duration = 2200, offset: number | "default" = "default", link?: string, persist: boolean = false) => {
      const bottomOffset = _determineBottomOffset(offset, isLongPhone);

      return Toast.show({
        type,
        text1: type.toUpperCase(),
        text2: message,
        autoHide: persist ? false : true,
        visibilityTime: duration,
        bottomOffset,
        onPress: () => {
          link ? WebBrowser.openBrowserAsync(link) : Toast.hide();
        },
        props: {
          hasLink: link ? true : false,
        },
      });
    },
  };
};

export default useGlobalToast;
