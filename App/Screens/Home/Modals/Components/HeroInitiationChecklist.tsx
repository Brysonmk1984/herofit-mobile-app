import React, { useEffect, useState } from "react";
import { Box, Heading, View, Text } from "native-base";

interface HeroInitiationChecklistProps {
  crossedOut?: boolean[];
}

const HeroInitiationChecklist: React.FC<HeroInitiationChecklistProps> = ({ crossedOut = [] }) => {
  const [c0, setC0] = useState({ strikeThrough: false, opacity: 1 });
  const [c1, setC1] = useState({ strikeThrough: false, opacity: 1 });
  const [c2, setC2] = useState({ strikeThrough: false, opacity: 1 });
  const [c3, setC3] = useState({ strikeThrough: false, opacity: 1 });

  useEffect(() => {
    if (crossedOut[0]) {
      setC0({ strikeThrough: true, opacity: 0.5 });
    }
    if (crossedOut[1]) {
      setC1({ strikeThrough: true, opacity: 0.5 });
    }
    if (crossedOut[2]) {
      setC2({ strikeThrough: true, opacity: 0.5 });
    }
    if (crossedOut[3]) {
      setC3({ strikeThrough: true, opacity: 0.5 });
    }
  }, []);

  return (
    <View p={3} backgroundColor="base.background">
      <Heading borderBottomWidth={2} borderColor="primary.900" textAlign="center">
        <Text fontSize="2xl" fontFamily="heading">
          The Hero's Initiation
        </Text>
      </Heading>
      <Box pl={10}>
        <Text strikeThrough={c0.strikeThrough} opacity={c0.opacity}>
          1. Choose your Hero
        </Text>
        <Text strikeThrough={c1.strikeThrough} opacity={c1.opacity}>
          2. Create a HeroFit Account
        </Text>
        <Text strikeThrough={c2.strikeThrough} opacity={c2.opacity}>
          3. Confirm Email
        </Text>
        <Text strikeThrough={c3.strikeThrough} opacity={c3.opacity}>
          4. Choose Strava or Manual Mode
        </Text>
      </Box>
    </View>
  );
};

export default HeroInitiationChecklist;
