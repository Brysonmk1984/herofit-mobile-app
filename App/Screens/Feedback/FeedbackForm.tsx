import React, { useContext, useEffect, useState } from "react";
import { View, VStack, FormControl, Input, TextArea, Button, Dropdown, Select, CheckIcon } from "native-base";
import HelperText from "../../Components/HelperText";
import Pane from "../../Components/Pane";
import { useDebouncedCallback } from "use-debounce/lib";
import debugErrors from "../../common/debugErrors";
import { emailContactForm } from "../../api/email";
import { GlobalStateContext } from "../../store";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import LoadingInPane from "../../Components/LoadingInPane";

interface FeedbackFormProps {
  postSubmitAction?: (data?: any) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ postSubmitAction }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [email, setEmail] = useState(state?.user.email ?? null);
  const [feedbackType, setFeedbackType] = useState("General Comment");
  const [message, setMessage] = useState(null);
  const [helperText, setHelperText] = useState<string | null>(null);
  const [formIsValid, setFormIsValid] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { addToast } = useGlobalToast();

  const debounced = useDebouncedCallback(() => {
    if (email?.includes("@")) {
      if (message?.length >= 10) {
        setHelperText(null);
        return setFormIsValid(true);
      } else {
        if (message?.length) {
          setHelperText("Message must be at least 10 characters");
          return setFormIsValid(false);
        }
        setHelperText(null);
      }
    } else {
      setHelperText("Must be valid email address");
    }
    setFormIsValid(false);
  }, 500);

  function _handleInputChange(text: string, updateFunction: React.Dispatch<React.SetStateAction<string>>) {
    updateFunction(text);
    debounced();
  }

  function _resetForm() {
    setHelperText(null);
    setFeedbackType("General Comment");
    setMessage(null);
    setFormIsValid(false);
    setIsSending(false);
  }

  // // Handle submit of form: send form data to back end, which handles sending the email logic
  async function _handleSubmit(body: { email: string; feedbackType: string; message: string }) {
    const { email, feedbackType, message } = body;
    const accountInfo = { username: state.user.username, firstName: state.user.firstName, email: state.user.email };
    setIsSending(true);
    try {
      await emailContactForm({ email, feedbackType, message, accountInfo });
      addToast("success", "Message sent! We will get back to you shortly!");
      _resetForm();
    } catch (error) {
      // Error sending Form Message
      const errorMessage = debugErrors(error, state.user);
      setIsSending(false);
      addToast("error", errorMessage);
    }
  }

  return (
    <View mb={5}>
      <Pane>
        <VStack space={3}>
          <FormControl>
            <Select
              selectedValue={feedbackType}
              accessibilityLabel="Type of Feedback"
              onValueChange={itemValue => {
                setFeedbackType(itemValue);
              }}
              _selectedItem={{
                bgColor: "success.600",
                endIcon: <CheckIcon size={5} />,
              }}
              _item={{
                bgColor: "primary.100",
                width: "96%",
                alignSelf: "center",
              }}
              mt={1}
            >
              <Select.Item label="General Comment" value="General Comment" my={1} />
              <Select.Item label="Bug Report" value="Bug Report" my={1} />
              <Select.Item label="Question" value="Question" my={1} />
              <Select.Item label="Feature Request" value="Feature Request" my={1} />
              <Select.Item label="Other" value="Other" my={1} />
            </Select>
          </FormControl>
          <FormControl isRequired isInvalid={helperText === "Must be valid email address" ? true : false}>
            <FormControl.Label>Email</FormControl.Label>
            <Input isRequired onChangeText={text => _handleInputChange(text, setEmail)} value={email} placeholder="Enter Email" shadow={1} />
          </FormControl>
          <FormControl isRequired isInvalid={helperText === "Message must be at least 10 characters" ? true : false}>
            <FormControl.Label>Message</FormControl.Label>
            <TextArea textAlignVertical="top" justifyContent="flex-start" placeholder="Enter Message" totalLines={5} onChangeText={text => _handleInputChange(text, setMessage)} value={message} />
          </FormControl>
          {helperText && <HelperText type={formIsValid ? "success" : "error"} text={helperText} />}
          {isSending && <LoadingInPane text="Sending Feedback" />}
          <Button disabled={!formIsValid || isSending} onPress={() => _handleSubmit({ email, feedbackType, message })}>
            Send Feedback
          </Button>
        </VStack>
      </Pane>
    </View>
  );
};

export default FeedbackForm;
