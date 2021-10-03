import React, { useContext, useEffect, useState } from "react";
import { Text } from "native-base";
import WheelSelectModal from "../../Components/ModalTemplates/WheelSelectModal/WheelSelectModal";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { GlobalStateContext } from "../../store";
import useModal from "../../common/hooks/useModal";

interface SpeedModalProps {
  id: string;
  title: string;
  modalAction: (speed: number) => void;
  speed: number;
}

const SpeedModal: React.FC<SpeedModalProps> = ({ id, title, modalAction, speed }) => {
  const { state } = useContext(GlobalStateContext);
  const [integer, setInteger] = useState<number | undefined>();
  const [decimal, setDecimal] = useState<number | undefined>();
  const [onChangeIntegerCalled, setOnChangeIntegerCalled] = useState(false);
  const [onChangeDecimalCalled, setOnChangeDecimalCalled] = useState(false);
  const { closeModal } = useModal();

  function handleModalAction() {
    let intToSave = onChangeIntegerCalled ? integer : 0;
    let decToSave = onChangeDecimalCalled ? decimal : 0.0;

    modalAction(intToSave + decToSave);
    setOnChangeIntegerCalled(false);
    setOnChangeDecimalCalled(false);
    return closeModal(id);
  }

  useEffect(() => {
    if (speed) {
      const int = parseInt(speed.toString().split(".")[0]);
      const dec = parseFloat(speed.toString().split(".")[1]);
      setInteger(int);
      setDecimal(dec);
    }
  }, []);

  return (
    <WheelSelectModal id={id} modalOpen={state.modalQueue[0] === id} title={title} modalAction={handleModalAction}>
      <ScrollPicker
        dataSource={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
        selectedIndex={0}
        renderItem={(data, index) => <Text>{data}</Text>}
        onValueChange={(data, selectedIndex) => {
          setInteger(data);
          setOnChangeIntegerCalled(true);
        }}
        wrapperHeight={120}
        wrapperWidth={30}
        wrapperBackground="#FFFFFF"
        itemHeight={60}
        highlightColor="#d8d8d8"
        highlightBorderWidth={2}
      />
      <ScrollPicker
        dataSource={[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]}
        selectedIndex={0}
        renderItem={(data, index) => <Text>{data.toString().slice(1, 3) || ".0"}</Text>}
        onValueChange={(data, selectedIndex) => {
          setDecimal(data);
          setOnChangeDecimalCalled(true);
        }}
        wrapperHeight={120}
        wrapperWidth={30}
        wrapperBackground="#FFFFFF"
        itemHeight={60}
        highlightColor="#d8d8d8"
        highlightBorderWidth={2}
      />
      <ScrollPicker
        dataSource={["mph"]}
        selectedIndex={1}
        renderItem={(data, index) => <Text>{data}</Text>}
        onValueChange={(data, selectedIndex) => {
          //
        }}
        wrapperHeight={120}
        wrapperWidth={30}
        wrapperBackground="#FFFFFF"
        itemHeight={60}
        highlightColor="#d8d8d8"
        highlightBorderWidth={2}
      />
    </WheelSelectModal>
  );
};

export default SpeedModal;
