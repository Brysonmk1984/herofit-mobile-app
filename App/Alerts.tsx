import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button, Linking, Pressable } from 'react-native';
import { Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Fonts, Colors, Spacing, AlertThemes, Buttons } from './styles';
import { alertRemover } from './common/helperFunctions';


interface Alert{
  type : string
  message : string,
  link : string | undefined,
  confirm : string | undefined,
  cb : { () : void } | undefined,
}

const Alerts: React.FC<Alerts> = ({ alerts, dispatch } : { alerts : Alert[], dispatch : React.Dispatch<any> }) => {
  

  function handleConfirmButton(a){
    if(a.cb){
      a.cb();
    }
  }

  function renderIcon(aType, aStyle){
    console.log(aType);
    switch(aType){
      case 'success':
        return <Ionicons name="md-checkmark-circle" size={24} color={aStyle.color}  />
      case 'warning':
        return <Ionicons name="md-warning-sharp" size={24} color={aStyle.color}  />
      case 'error':
        return <MaterialIcons name="error" size={24} color={aStyle.color}  />
      case 'info':
        return <MaterialIcons name="info" size={24} color={aStyle.color}  />
      default:
        return null;
    }
  }

  function renderAlerts(){
   
    const alertEls = alerts.map((a)=>{
        const aType = a.type;
        const aStyle =  AlertThemes[aType];
        console.log(a);
        return(
          <View style={ [styles.alertContainer, aStyle] } key={`alert-${a.index}`}>
            <View style={styles.iconColumn}>
              { renderIcon(aType, aStyle) }
            </View>
            <View style={styles.textColumn}>
              <Text style={[styles.header, { color : aStyle.color }]}>{a.type === 'info' ? 'FYI' : a.type.toUpperCase()}</Text>
              { a.link ? <Text style={{color: Colors.linkText, textDecorationLine: 'underline'}} onPress={() => Linking.openURL(a.link)}> {a.message} </Text> 
                : a.confirm ?  <View style={ { flexDirection: 'row', flex: 1, alignItems: 'center' } }><Text style={ { color : aStyle.color } }>{a.message} </Text><Pressable onPress={() => handleConfirmButton(a)}><Text style={ Buttons.primaryButton }>{a.confirm}</Text></Pressable></View> 
                : <Text style={ { color: aStyle.color } }>{a.message} </Text>
              }
              
            </View>
            <Pressable style={styles.closeButton} onPress={() =>{ clearAlert(a.index) }}>
              <Ionicons name="md-close" size={24}  color={`${aStyle.color}`} />
            </Pressable>
          </View>
        )
    });

    if(alerts.length){
      return <View key={alertRemover.index} >
        {[...alertEls]}
      </View>
    }
    return null;
  }


  function clearAlert(index){
    const filtered = alerts.filter((alert) => alert.index === index).map(alert => alert.index);
    alertRemover(filtered, dispatch);
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
    justifyContent: "center",
    alignSelf: "flex-end",
    zIndex:0,
    fontFamily : Fonts.bodyText,
    opacity: .9
  },
  iconColumn:{
    flex: .15
  },
  textColumn:{
    flex: 1
  },
  alertContainer: {
    flexDirection: 'row'
  },
  header: {
    fontFamily : Fonts.headlineText,
    fontSize: 20,
    lineHeight: 24
  },
  closeButton: {
  },

});

export default Alerts;