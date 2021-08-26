import randomToken from 'random-token';
import { SnackBarAlert, SnackBarAlertWithIndex, AppDispatch, InitialAppState } from './types';


interface AlertAdderReturnType {
  newAlertArray : SnackBarAlertWithIndex[]
  fadeOutAlerts : string[]
}

function alertAdder(current : SnackBarAlertWithIndex[], newAlerts : SnackBarAlert[]) : AlertAdderReturnType{
  newAlerts = Array.isArray(newAlerts) ? newAlerts : [newAlerts];
  const fadeOutAlerts = [];
  
  const arrayWithIndexes : SnackBarAlertWithIndex[] = newAlerts.map((alert : SnackBarAlert, i : number) => {
      const alertWithIndex = {...alert, index : randomToken(16) }
      if(alertWithIndex.persist){
        alert.persist = true;
      }else{
        alertWithIndex.persist = false;
        fadeOutAlerts.push(alertWithIndex.index);
      }

    return alertWithIndex;
  });

  return {newAlertArray : [...current, ...arrayWithIndexes], fadeOutAlerts };
}

function alertRemover(indiciesForRemoval : string[], dispatch : any){
  dispatch({type: 'REMOVE ALERTS', payload : { indiciesForRemoval }});
}

function updateAlerts(newAlerts : SnackBarAlert[], state : InitialAppState, dispatch : AppDispatch){
  // Alerts are NEW and need to be added with new indicies, then added to state with any other state
  const { newAlertArray, fadeOutAlerts }  = alertAdder(state.alerts, newAlerts);

  dispatch({type: 'SET ALERTS', payload : { alerts : newAlertArray }});
  setTimeout(() => { alertRemover(fadeOutAlerts, dispatch); }, 6800);
}


export { updateAlerts, alertAdder, alertRemover };