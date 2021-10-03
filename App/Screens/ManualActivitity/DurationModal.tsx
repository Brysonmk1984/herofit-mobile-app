import React, { useState, useEffect, useContext } from "react";
import { Text } from "native-base";
import WheelSelectModal from "../../Components/ModalTemplates/WheelSelectModal/WheelSelectModal";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { GlobalStateContext } from "../../store";
import useModal from "../../common/hooks/useModal";

interface DurationModalProps {
  id: string;
  title: string;
  modalAction: (duration: string) => void;
  duration: number;
}

const DurationModal: React.FC<DurationModalProps> = ({ id, title, modalAction, duration }) => {
  const { state } = useContext(GlobalStateContext);
  const [hours, setHours] = useState<number | undefined>(0);
  const [minutes, setMinutes] = useState<number | undefined>(0);
  const [onChangeHoursCalled, setOnChangeHoursCalled] = useState(false);
  const [onChangeMinutesCalled, setOnChangeMinutesCalled] = useState(false);
  const { closeModal } = useModal();

  function handleModalAction() {
    let hoursToSave = onChangeHoursCalled ? hours : 0;
    let minutesToSave = onChangeMinutesCalled ? minutes : 0.0;
    const stringToSave = hoursToSave && minutesToSave ? `${hoursToSave} hrs, ${minutesToSave} min` : hoursToSave ? `${hoursToSave} hrs` : `${minutesToSave} min`;
    modalAction(stringToSave);
    setOnChangeHoursCalled(false);
    setOnChangeMinutesCalled(false);
    return closeModal(id);
  }

  useEffect(() => {
    if (duration) {
      const hours = parseInt(duration.toString().split(":")[0]);
      const minutes = parseFloat(duration.toString().split(":")[1]);
      setHours(hours);
      setMinutes(minutes);
    }
  }, []);

  return (
    <WheelSelectModal id={id} modalOpen={state.modalQueue[0] === id} title={title} modalAction={handleModalAction}>
      <ScrollPicker
        dataSource={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]}
        selectedIndex={0}
        renderItem={(data, index) => <Text>{data}</Text>}
        onValueChange={(data, selectedIndex) => {
          setHours(data);
          setOnChangeHoursCalled(true);
        }}
        wrapperHeight={120}
        wrapperWidth={30}
        wrapperBackground="#FFFFFF"
        itemHeight={60}
        highlightColor="#d8d8d8"
        highlightBorderWidth={2}
      />
      <ScrollPicker dataSource={["hr"]} selectedIndex={1} renderItem={(data, index) => <Text>{data}</Text>} wrapperHeight={120} wrapperWidth={30} wrapperBackground="#FFFFFF" itemHeight={60} highlightColor="#d8d8d8" highlightBorderWidth={2} />
      <ScrollPicker
        dataSource={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]}
        selectedIndex={0}
        renderItem={(data, index) => <Text>{data.toString() || "0"}</Text>}
        onValueChange={(data, selectedIndex) => {
          console.log(data, typeof data);
          setMinutes(data);
          setOnChangeMinutesCalled(true);
        }}
        wrapperHeight={120}
        wrapperWidth={30}
        wrapperBackground="#FFFFFF"
        itemHeight={60}
        highlightColor="#d8d8d8"
        highlightBorderWidth={2}
      />
      <ScrollPicker dataSource={["min"]} selectedIndex={1} renderItem={(data, index) => <Text>{data}</Text>} wrapperHeight={120} wrapperWidth={30} wrapperBackground="#FFFFFF" itemHeight={60} highlightColor="#d8d8d8" highlightBorderWidth={2} />
    </WheelSelectModal>
  );
};

export default DurationModal;
