import React, { useContext } from "react";
import { ScrollView } from "native-base";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import { updateAlerts } from "../common/alerts";
import debugErrors from "../common/debugErrors";
import { GlobalStateContext } from "../store";
import { emailContactForm } from "../api/email";
import { MainDrawerProps } from "../common/types-navigator";
import FeedbackForm from "../Components/Forms/FeedbackForm";
import { Header } from "../Components/CustomComponents";

const Feedback: React.FC<MainDrawerProps<"Feedback">> = ({ route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);

  // // Handle submit of form: send form data to back end, which handles sending the email logic
  async function handleSubmit(body: { email: string; feedbackType: string; message: string }) {
    const { email, feedbackType, message } = body;
    const accountInfo = { username: state.user.username, firstName: state.user.firstName, email: state.user.email };

    try {
      await emailContactForm({ email, feedbackType, message, accountInfo });
      updateAlerts([{ type: "success", message: "Message sent! We will get back to you shortly!" }], state, dispatch);
    } catch (error) {
      // Error sending Form Message
      const errorMessage = debugErrors(error, state.user);
      updateAlerts([{ type: "error", message: `${errorMessage}` }], state, dispatch);
    }
  }

  return (
    <ScreenContainer screenName={route.name}>
      <ScrollView>
        <Header text="Feedback" />
        <FeedbackForm userEmail={state.user?.email || null} formAction={body => handleSubmit(body)} />
      </ScrollView>
    </ScreenContainer>
  );
};

export default Feedback;
