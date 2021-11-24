import { Dimensions } from "react-native";
interface ReturnType {
  deviceWidth: number;
  deviceHeight: number;
  deviceAspect: number;
  deviceAspectType: "long" | "medium" | "short";
}
const useAspectRatio = (): ReturnType => {
  const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
  const deviceAspect = deviceWidth / deviceHeight;
  const deviceAspectType = deviceHeight > deviceWidth * 1.8 ? "long" : deviceHeight > deviceWidth * 1.7 ? "medium" : "short";

  return {
    deviceWidth,
    deviceHeight,
    deviceAspect,
    deviceAspectType,
  };
};

export default useAspectRatio;
