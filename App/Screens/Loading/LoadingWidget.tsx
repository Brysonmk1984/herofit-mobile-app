import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";

interface LoadingWrapperProps {

}

const LoadingWidget: React.FC<LoadingWrapperProps> = () => {
  const messages = ['powering up...', 'one last squat...', 'power walking to the server...','making sure we are using proper...', '"only five more miles"...', 'communing with the elements...', 'Doing pull-ups on our database...'];
  const [ message, setMessage ] = useState('powering up...');


  // A loading message that cycles through the messages array above. Only used for initial load.
  useEffect(() => {
    
    const messageInt = setInterval(() =>{
      messages.push(messages.shift());
      setMessage(messages[0]);
    },3000);
    return () => clearInterval(messageInt);
   
  }, []);

    

  return (
    <View style={[styles.container, styles.horizontal]}>
      <View style={[styles.activityIndicator]}>
        <AnimatedLoader
          visible={true}
          overlayColor="rgba(255,255,255,0.75)"
          source={require("./loader.json")}
          speed={1}
        >
          <Text>{ message }</Text>
        </AnimatedLoader>
     
       
      </View>


    </View>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "stretch",
    zIndex : 1
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10
  },
  activityIndicator: {
    alignSelf: 'center',
    width:'100%',
    height:'100%'
  }
});

export default LoadingWidget;