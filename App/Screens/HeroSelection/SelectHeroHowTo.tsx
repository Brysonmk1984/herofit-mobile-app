import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, FlatList, SectionList } from 'react-native';
import debugErrors from '../../common/debugErrors';
import { store } from '../../store';
import { getHeroList } from '../../api/authentication';
import ScreenContainer from '../../Components/ScreenContainer';

// How To Select Screen
const SelectHeroHowTo = ({ navigation }) =>{
  const { state, dispatch } = useContext(store);
  // Make API call to get hero data for the next screen
  const [heroList, setHeroList] = useState([]);
  const DATA = [
    {
      title : "Fire",
      data : ["Critical Strike (Chance for bonus Damage)", "Resistance to Fire", "Bonus Damage to Air & Water", "Weak vs Earth"]
    },
    {
      title : "Earth",
      data : ["Thorns Damage (Damage from enemy is returned)", "Resistance to Earth", "Bonus Damage to Air & Fire", "Weak vs Water",]
    },
    {
      title : "Water",
      data : ["Vampiric Touch (Heal on attack)", "Resistance to Water", "Bonus Damage to Earth & Fire", "Weak vs Air"],
    },
    {
      title : "Air",
      data : ["Evasion (Chance to Dodge elemental Damage)", "Resistance to Air", "Bonus Damage to Earth & Water", "Weak vs Fire"]
    }
  ];
  const Item = ({ title }) => (
    <View >
      <Text>{title}</Text>
    </View>
  );


  useEffect(() =>{

    getHeroList()
    .then((data) =>{
      if(data.error){
        const error = data.error;
        return debugErrors(error);
      }
      
      setHeroList(data);
    });
  }, []);

  return (
    <ScreenContainer>
      <Text>The Dark Forces have breached the Twilight Seal and are causing havoc across Earth Realm!</Text>
      <Text>It's up to you Hero, to grow strong through training and combat these malevolent forces.</Text>
      <Text>Choosing your Hero:</Text>
      <Text>Defaults:</Text>
      <FlatList 
        data={[
          {
  
            trait : "Power",
            description : "Physical Damage",
            value : "100"
          },
          {
     
            trait : "Health",
            description : "A Hero's life total",
            value : "100"
          },
          {
     
            trait : "Armor",
            description : "Reduces Physical Damage",
            value : "0"
          },
          {
 
            trait : "Recovery",
            description : "Effects health Recovered per hour & chance to revive early",
            value : "5"
          }
        ]}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({item}) => <View>
          <Text>{item.trait}</Text>
          <Text>{item.description}</Text>
          <Text>Starting Value: {item.value}</Text>
        </View>}
      />
      <Text>Elemental Power:</Text>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => (item + index).toString()}
        renderItem={({ item }) => <Item title={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text>{title}</Text>
        )}
      />
      <Text>The different Heroes have different starting elemental power. These values have only a small impact; ultimately your training and how you spend Quantum Points (talent points) will dictate how your hero developes.</Text>
      <Button title="OK" onPress={() => navigation.push("SelectHero", { heroList })} />
    </ScreenContainer>
  )
}

export default SelectHeroHowTo;