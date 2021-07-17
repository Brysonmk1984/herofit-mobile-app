import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button, Linking, Pressable } from 'react-native';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, Colors, Spacing } from './styles';

interface LoadingWrapperProps {

}
const Alerts: React.FC<Alerts> = ({ alerts, dispatch }) => {

  function handleConfirmButton(a){
    if(a.cb){
      a.cb();
    }
  }

  function renderAlerts(){
   
    const alertEls = alerts.map((a)=>{
     
        return(
          <View style={styles.alertContainer} key={`alert-${a.index}`}>
            <Ionicons name="md-checkmark-circle" size={32} color="green" />
            
            <View style={styles.textColumn}>
              <Text style={styles.header}>{a.type === 'info' ? 'FYI' : a.type}</Text>
              { a.link ? <Text style={{color: 'blue'}} onPress={() => Linking.openURL(a.link)}> {a.message} </Text> : <Text>{a.message}</Text> }
              { a.confirm ? <Button onPress={() => handleConfirmButton(a)}>{a.confirm}</Button> : null }
            </View>
            
            <Pressable style={styles.closeButton} onPress={() =>{ clearAlert(a.index) }}>
              <Ionicons name="md-close" size={32} color="green" />
            </Pressable>
          </View>
        )
    });

    if(alerts.length){
      return <View key="alert-wrapper" >
        {[...alertEls]}
      </View>
    }
    return null;
  }


  function clearAlert(index){
    const filtered = alerts.filter((alert) => alert.index !== index);
    dispatch({ type: 'SET ALERTS', payload : { alerts : filtered }});
  }

  return(
    <View style={styles.container}>
      { renderAlerts() }
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    display:'none',
    bottom: 0,
    left: 0,
    width: '100%',
    height: Dimensions.get('window').height * .2,
    justifyContent: "center",
    alignSelf: "flex-end",
    zIndex:0,
    backgroundColor: 'red',
    fontFamily : Fonts.bodyText,
  },
  textColumn:{
    flex: 1
  },
  alertContainer: {
    flexDirection: 'row'
  },
  header: {
    fontFamily : Fonts.headlineText,
    fontSize: 50
  },
  closeButton: {

  }
});

export default Alerts;