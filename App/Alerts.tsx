import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button, Linking, Pressable } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Fonts, Colors, Spacing, AlertThemes, Buttons } from './styles';
import { alertRemover } from './common/alerts';
import { IAlert } from './common/interfaces';



const Alerts: React.FC<Alerts> = ({ alerts, dispatch } : { alerts : IAlert[], dispatch : React.Dispatch<any> }) => {

  function renderIcon(aType, aStyle){
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
    // All Alerts
    const alertEls = alerts.map((a) =>{
        const aType = a.type.toLowerCase();
        const aStyle =  AlertThemes[aType];
        console.log('rendering alerts - type, style', aType,aStyle);
        return (
          // Single Alert
          <View style={ [styles.alertContainer, aStyle] } key={`alert-${a.index}`}>
            {/* Alert Icon */}
            <View style={styles.iconColumn}>
              { renderIcon(aType, aStyle) }
            </View>
            {/* Alert Text Column */}
            <View style={styles.textColumn}>
              {/* Alert Header */}
              <Text style={[styles.alertHeader, { color : aStyle.color }]}>{a.type === 'info' ? 'FYI' : a.type.toUpperCase()}</Text>
              {/* Alert Body Text / Link / Button */}
              { a.link ? <Text style={Buttons.lightTextLink} onPress={() => Linking.openURL(a.link)}> {a.message} </Text> 
                : a.confirm ?  
                  <View style={ styles.alertConfirmContent  }>
                    <Text style={ { color : aStyle.color } }>{a.message} </Text>
                    <Pressable style={({pressed}) => (pressed ? Buttons.alertButtonPressed : Buttons.alertButton)}  onPress={() => a.confirm.cb()} 
                    children={({ pressed }) => ( 
                      <Text style={{ color: pressed ? Buttons.pressedButton.color : Buttons.alertButton.color }}>{a.confirm.text}</Text>
                    )} />
                  </View> 
                : <Text style={ { color: aStyle.color } }>{a.message} </Text>
              } 
            </View>
            {/* Alert Close Icon */}
            <Pressable style={styles.closeButton} onPress={() =>{ clearAlert(a.index) }}>
              <Ionicons name="md-close" size={24}  color={`${aStyle.color}`} />
            </Pressable>
          </View>
        )
    });
    
    return <View>
      {[...alertEls]}
    </View>
  }


  function clearAlert(index : string){
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
  alertHeader: {
    fontFamily : Fonts.headlineText,
    fontSize: 20,
    lineHeight: 24
  },
  alertConfirmContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  closeButton: {
  },

});

export default Alerts;