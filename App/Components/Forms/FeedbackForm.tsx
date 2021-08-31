import React, { useEffect, useState } from "react";
import { View, VStack, FormControl, Input, TextArea, Button } from "native-base";
import HelperText from "../HelperText";
import Pane from "../Pane";
import { useDebouncedCallback } from "use-debounce/lib";

interface FeedbackFormProps {
  formAction: ({ email, message }: { email: string; message: string }) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ formAction }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [helperText, setHelperText] = useState<string | null>(null);
  const [formIsValid, setFormIsValid] = useState(false);

  const debounced = useDebouncedCallback(() => {
    if (email.includes("@")) {
      if (message.length >= 20) {
        setHelperText(null);
        return setFormIsValid(true);
      } else {
        if (message.length) {
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

  return (
    <View>
      <Pane>
        <VStack space={6} mt={5}>
          <FormControl isRequired isInvalid={helperText === "Must be valid email address" ? true : false}>
            <Input onChangeText={text => handleInputChange(text, setEmail)} value={email} placeholder="Email" shadow={1} />
          </FormControl>
          <FormControl.Label>Questions? Comments? Bug Reports?</FormControl.Label>
          <FormControl isRequired isInvalid={helperText === "Message must be at least 10 characters" ? true : false}>
            <TextArea placeholder="Enter Message" onChangeText={text => handleInputChange(text, setMessage)} value={message} />
          </FormControl>
          {helperText && <HelperText text={helperText} />}
          <Button onPress={() => formAction({ email, message })}>Send Feedback</Button>
        </VStack>
      </Pane>
    </View>
  );
};

export default FeedbackForm;
