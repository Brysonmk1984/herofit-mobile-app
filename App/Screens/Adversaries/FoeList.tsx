import { Box, Text, FlatList } from "native-base";
import React from "react";

interface FoeListProps {
  foesDefeated: string[];
  foes: string[];
  textAlign: "left" | "right";
  color: "base.black" | "base.white";
}

const FoeList: React.FC<FoeListProps> = ({ foesDefeated, foes, textAlign, color }) => {
  function renderFoe({ item, index }) {
    return foesDefeated.includes(item) ? (
      <Text opacity={0.5} key={`${item}-${index}`} color={color} textAlign={textAlign} strikeThrough={true}>
        {item}
      </Text>
    ) : (
      <Text key={`${item}-${index}`} color={color} textAlign={textAlign}>
        {item}
      </Text>
    );
  }
  return (
    <Box maxHeight={25} mt={3}>
      <FlatList columnWrapperStyle={{ justifyContent: "space-around" }} justifyContent="space-between" numColumns={2} data={foes} renderItem={renderFoe} keyExtractor={(item, index) => `${item}-${index}`} />
    </Box>
  );
};

export default FoeList;
