import React from "react";
import { ScrollView, VStack, FormControl, TextArea, Radio } from "native-base";
import Pane from "../../../../Components/Pane";
import Subheader from "../../../../Components/Subheader";

interface FeedbackChoiceFormFormProps {
  id: string;
  title: string;
  radioValue: string;
  setRadioValue: (radioValue: string) => void;
  openResponse: string;
  setOpenResponse: (openResponse: string) => void;
}

const FeedbackChoiceForm: React.FC<FeedbackChoiceFormFormProps> = ({ title, radioValue, setRadioValue, openResponse, setOpenResponse }) => {
  return (
    <ScrollView mb={5}>
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
        </VStack>
      </Pane>
    </ScrollView>
  );
};

export default FeedbackChoiceForm;
