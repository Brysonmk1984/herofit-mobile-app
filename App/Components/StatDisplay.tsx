import React from 'react'
import { Image, Pressable, FlatList, SectionList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, useToken } from 'native-base';
import { ScreenContainer, Header, Subheader, ScreenActionButton, LoreText, Pane, Icon } from './CustomComponents';

interface StatDisplayProps {
  stat : 'Power' | 'Health' | 'Armor' | 'Recovery' |  'Fire' | 'Earth' | 'Air' | 'Water' | 'Aether',
  value : number,
  description? : string
}

export default function StatDisplay({ stat, value, description, size } : StatDisplayProps){
  const { iconSize, valueSize, statSize, statSize2 } = (() =>{
    let iconSize = 50, valueSize = '2xl', statSize = 50, statSize2 = 35;
   
    if(size === 'sm'){
      iconSize = 30, valueSize = 'lg', statSize = 30, statSize2 = 16;
    }
    return { 
      iconSize,
      valueSize,
      statSize,
      statSize2 
    }
  })();
  console.log('VAL', value);
  const elementNameLC = stat.toLowerCase();
    return (
      <Box display="flex">
        <HStack alignItems="center" justifyContent="center">
          <Icon iconName={elementNameLC} size={iconSize} color={`base.${elementNameLC}`} />
          <View alignItems="center">
            <Text fontFamily="heading" fontSize={value >= 100 ? statSize2 : statSize} textAlign="center"  lineHeight={size === 'sm' ? 40 : 60}>{value}</Text>
            <Text fontFamily="heading" fontSize={valueSize} mt={-1} lineHeight={size === 'sm' ? 5 : 6}>{stat}</Text>
          </View>
          {
            description && <View alignItems='flex-end' flex={4}>
            <Text textAlign="justify" fontSize="sm">{description}</Text>
          </View>
          }
        </HStack>
      </Box>
    );
}