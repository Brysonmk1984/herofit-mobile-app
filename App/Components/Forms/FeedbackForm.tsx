import React, { useContext, useEffect, useState } from "react";
import { View, VStack, FormControl, Input, TextArea, Button, Dropdown, Select, CheckIcon } from "native-base";
import HelperText from "../HelperText";
import Pane from "../Pane";
import { useDebouncedCallback } from "use-debounce/lib";

interface FeedbackFormProps {
  userEmail: string | null;
  formAction: ({ email, feedbackType, message }: { email: string; feedbackType: string; message: string }) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ userEmail, formAction }) => {
  const [email, setEmail] = useState(userEmail ?? null);
  const [feedbackType, setFeedbackType] = useState("General Comment");
  const [message, setMessage] = useState("");
  const [helperText, setHelperText] = useState<string | null>(null);
  const [formIsValid, setFormIsValid] = useState(false);

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

  function handleInputChange(text: string, updateFunction: React.Dispatch<React.SetStateAction<string>>) {
    updateFunction(text);
    debounced();
  }

  function handleFormAction() {
    setHelperText(null);
    setEmail(null);
    setFeedbackType("General Comment");
    setMessage(null);
    setFormIsValid(false);
    formAction({ email, feedbackType, message });
  }

  return (
    <View mb={5}>
      <Pane>
        <VStack space={3}>
          <FormControl>
            <Select
              selectedValue={feedbackType}
              minWidth={200}
              accessibilityLabel="Type of Feedback"
              onValueChange={itemValue => {
                setFeedbackType(itemValue);
              }}
              _selectedItem={{
                bg: "success.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt={1}
            >
              <Select.Item label="General Comment" value="General Comment" />
              <Select.Item label="Bug Report" value="Bug Report" />
              <Select.Item label="Question" value="Question" />
              <Select.Item label="Feature Request" value="Feature Request" />
              <Select.Item label="Other" value="Other" />
            </Select>
          </FormControl>
          <FormControl isRequired isInvalid={helperText === "Must be valid email address" ? true : false}>
            <FormControl.Label>Email</FormControl.Label>
            <Input isRequired onChangeText={text => handleInputChange(text, setEmail)} value={email} placeholder="Enter Email" shadow={1} />
          </FormControl>
          <FormControl isRequired isInvalid={helperText === "Message must be at least 10 characters" ? true : false}>
            <FormControl.Label>Message</FormControl.Label>
            <TextArea textAlignVertical="top" justifyContent="flex-start" placeholder="Enter Message" totalLines={5} onChangeText={text => handleInputChange(text, setMessage)} value={message} />
          </FormControl>
          {helperText && <HelperText type={formIsValid ? "success" : "error"} text={helperText} />}
          <Button disabled={!formIsValid} onPress={() => handleFormAction()}>
            Send Feedback
          </Button>
        </VStack>
      </Pane>
    </View>
  );
};

export default FeedbackForm;
