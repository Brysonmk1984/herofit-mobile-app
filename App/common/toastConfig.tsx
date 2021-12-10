import React from "react";
import { View, Text } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import herofitTheme from "../styles/herofitTheme";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";

const { colors, fonts } = herofitTheme;

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "white", backgroundColor: colors.base.successLight, opacity: 0.9, width: "76%", height: "auto", paddingHorizontal: 2 }}
      contentContainerStyle={{ paddingLeft: 8, paddingVertical: 8, paddingRight: 2 }}
      text1Style={{
        fontSize: 24,
        fontFamily: fonts.heading,
        color: "white",
      }}
      text2Style={{
        marginTop: 1,
        fontSize: 14,
        color: "white",
      }}
      text2NumberOfLines={4}
      renderLeadingIcon={() => (
        <View style={{ paddingLeft: 3, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ paddingVertical: 8 }}>
            <Ionicons name="md-checkmark-circle" size={24} color="white" />
          </Text>
        </View>
      )}
    />
  ),
  info: props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "white", backgroundColor: colors.base.infoLight, opacity: 0.9, width: "76%", height: "auto", paddingHorizontal: 2 }}
      contentContainerStyle={{ paddingLeft: 8, paddingVertical: 8, paddingRight: 2 }}
      text1Style={{
        fontSize: 24,
        fontFamily: fonts.heading,
        color: "white",
      }}
      text2Style={{
        marginTop: 1,
        fontSize: 14,
        color: "white",
      }}
      text2NumberOfLines={4}
      renderLeadingIcon={() => (
        <View style={{ paddingLeft: 3, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ paddingVertical: 8 }}>
            <MaterialIcons name="info" size={24} color="white" />
          </Text>
        </View>
      )}
    />
  ),

  error: props => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "white", backgroundColor: colors.base.errorLight, opacity: 0.9, width: "76%", height: "auto", paddingHorizontal: 2 }}
      contentContainerStyle={{ paddingLeft: 8, paddingVertical: 8, paddingRight: 2 }}
      text1Style={{
        fontSize: 24,
        fontFamily: fonts.heading,
        color: "white",
      }}
      text2Style={{
        marginTop: 1,
        fontSize: 14,
        color: "white",
      }}
      text2NumberOfLines={4}
      renderLeadingIcon={() => (
        <View style={{ paddingLeft: 3, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ paddingVertical: 8 }}>
            <MaterialIcons name="error" size={24} color="white" />
          </Text>
        </View>
      )}
    />
  ),
  caution: props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "white", backgroundColor: colors.base.cautionLight, opacity: 0.9, width: "76%", height: "auto", paddingHorizontal: 2 }}
      contentContainerStyle={{ paddingLeft: 8, paddingVertical: 8, paddingRight: 2 }}
      text1Style={{
        fontSize: 24,
        fontFamily: fonts.heading,
        color: "white",
      }}
      text2Style={{
        marginTop: 1,
        fontSize: 14,
        color: "white",
      }}
      text2NumberOfLines={4}
      renderLeadingIcon={() => (
        <View style={{ paddingLeft: 3, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ paddingVertical: 8 }}>
            <Ionicons name="md-warning-sharp" size={24} color="white" />
          </Text>
        </View>
      )}
    />
  ),
};

export default toastConfig;
