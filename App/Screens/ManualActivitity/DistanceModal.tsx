import React, { useState, useEffect, useContext } from "react";
import { Text } from "native-base";
import WheelSelectModal from "../../Components/ModalTemplates/WheelSelectModal/WheelSelectModal";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { GlobalStateContext } from "../../store";
import useModal from "../../common/hooks/useModal";

interface DistanceModalProps {
  id: string;
  title: string;
  modalAction: (distance: number) => void;
  distance: number;
}

const DistanceModal: React.FC<DistanceModalProps> = ({ id, title, modalAction, distance }) => {
  const { state } = useContext(GlobalStateContext);
  const [integer, setInteger] = useState<number | undefined>(0);
  const [decimal, setDecimal] = useState<number | undefined>(0);
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
    if (distance) {
      const int = parseInt(distance.toString().split(".")[0]);
      const dec = parseFloat(distance.toString().split(".")[1]);
      setInteger(int);
      setDecimal(dec);
    }
  }, []);

  return (
    <WheelSelectModal id={id} modalOpen={state.modalQueue[0] === id} title={title} modalAction={handleModalAction}>
      <ScrollPicker
        dataSource={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]}
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
          console.log(data, typeof data);
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
      <ScrollPicker dataSource={["mi"]} selectedIndex={1} renderItem={(data, index) => <Text>{data}</Text>} wrapperHeight={120} wrapperWidth={30} wrapperBackground="#FFFFFF" itemHeight={60} highlightColor="#d8d8d8" highlightBorderWidth={2} />
    </WheelSelectModal>
  );
};

export default DistanceModal;
