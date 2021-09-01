import React, { useState, useRef, useContext } from "react";
import { ScrollView, VStack, FormControl, Input, TextArea, Button, Dropdown, Select, CheckIcon, Radio } from "native-base";
import HelperText from "../HelperText";
import Pane from "../Pane";
import { useDebouncedCallback } from "use-debounce/lib";
import { GlobalStateContext } from "../../store";
import Subheader from "../Subheader";
import { emailFeedbackData, FeedbackChoiceBody } from "../../api/email";
import { updateAlerts } from "../../common/alerts";
import debugErrors from "../../common/debugErrors";
import useModal from "../../common/hooks/useModal";

interface FeedbackChoiceFormFormProps {
  id: string;
  title: string;
  postSubmitAction?: (data?: any) => void;
}

const FeedbackChoiceForm: React.FC<FeedbackChoiceFormFormProps> = ({ id, title, postSubmitAction }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [radioValue, setRadioValue] = useState(null);
  const [openResponse, setOpenResponse] = useState("");
  const scrollViewRef = useRef();
  const { closeModal } = useModal();
  const { user } = state;

  function handleFormAction() {
    const accountInfo = { username: user.username, firstName: user.firstName, email: user.email };
    setOpenResponse(null);
    setRadioValue(null);
    closeModal(id);
    _handleSubmit({
      email: user.email,
      username: user.username,
      title,
      opinion: radioValue,
      openResponse,
      accountInfo,
    });
  }

  // Handle submit of form: send form data to back end, which handles sending the email logic
  async function _handleSubmit(body: FeedbackChoiceBody) {
    try {
      await emailFeedbackData(body);
      updateAlerts([{ type: "success", message: "Feedback Submitted!" }], state, dispatch);
      postSubmitAction();
    } catch (error) {
      const errorMessage = debugErrors(error, state.user);
      updateAlerts([{ type: "error", message: errorMessage }], state, dispatch);
      postSubmitAction();
    }
  }

  return (
    <ScrollView mb={5} ref={scrollViewRef}>
      <Pane>
        <Subheader text={title} fontFamily="body" fontSize="md" />
        <VStack space={3} px={2}>
          <FormControl>
            <Radio.Group
              name="myRadioGroup"
              accessibilityLabel="favorite number"
              value={radioValue}
              onChange={nextValue => {
                setRadioValue(nextValue);
                // Doesn't work
                //scrollViewRef.current.scrollToEnd({ animated: true });
              }}
            >
              <Radio value="I'm already tired the game, so it wouldn't effect me much." my={1} _text={{ fontSize: "sm" }}>
                I'm already tired the game, so it wouldn't effect me much.
              </Radio>
              <Radio value="I'd be fine, the game content and/or the web app is a bit frustrating anyways." my={1} _text={{ fontSize: "sm" }}>
                I'd be fine, the game content and/or the web app is a bit frustrating anyways.
              </Radio>
              <Radio value="Neutral. It's been a fun post workout game, but I can live without it." my={1} _text={{ fontSize: "sm" }}>
                Neutral. It's been a fun post workout game, but I can live without it.
              </Radio>
              <Radio value="I'd feel disappointed. I enjoy the game and/or I'm attached to the progress I made." my={1} _text={{ fontSize: "sm" }}>
                I'd feel disappointed. I enjoy the game and/or I'm attached to the progress I made.
              </Radio>
              <Radio value="Very disappointed. I find it fun & rewarding and I look forward leveling my hero." my={1} _text={{ fontSize: "sm" }}>
                Very disappointed. I find it fun & rewarding and I look forward leveling my hero.
              </Radio>
            </Radio.Group>
          </FormControl>
          <FormControl>
            <TextArea textAlignVertical="top" justifyContent="flex-start" placeholder="Why specifically do you feel this way?" totalLines={5} onChangeText={text => setOpenResponse(text)} value={openResponse} />
          </FormControl>
          <Button disabled={!radioValue} onPress={() => handleFormAction()}>
            Send Feedback
          </Button>
        </VStack>
      </Pane>
    </ScrollView>
  );
};

export default FeedbackChoiceForm;
