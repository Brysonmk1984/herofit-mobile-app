import React from "react";
import { ScrollView } from "native-base";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { MainStackProps } from "../../common/types-navigator";
import FeedbackForm from "./FeedbackForm";
import { Header } from "../../Components/CustomComponents";
import KeyboardScrollView from "../../Components/KeyboardScrollView";

const Feedback: React.FC<MainStackProps<"Feedback">> = ({ route }) => {
  return (
    <ScreenContainer screenName={route.name}>
      <KeyboardScrollView extraScroll={150}>
        <Header text="Feedback" />
        <FeedbackForm />
      </KeyboardScrollView>
    </ScreenContainer>
  );
};

export default Feedback;
