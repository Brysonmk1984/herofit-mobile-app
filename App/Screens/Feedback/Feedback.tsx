import React from "react";
import { ScrollView } from "native-base";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { MainStackProps } from "../../common/types-navigator";
import FeedbackForm from "./FeedbackForm";
import { Header } from "../../Components/CustomComponents";

const Feedback: React.FC<MainStackProps<"Feedback">> = ({ route }) => {
  return (
    <ScreenContainer screenName={route.name}>
      <ScrollView>
        <Header text="Feedback" />
        <FeedbackForm />
      </ScrollView>
    </ScreenContainer>
  );
};

export default Feedback;
