import randomToken from 'random-token';
import { SnackBarAlert, AppDispatch, AppState } from './types';

function alertAdder(current : SnackBarAlert[], newAlerts : SnackBarAlert[]){
  newAlerts = Array.isArray(newAlerts) ? newAlerts : [newAlerts];
  const fadeOutAlerts = [];
  
  const arrayWithIndexes = newAlerts.map((alert : SnackBarAlert, i : string) => {
      alert.index = randomToken(16);
      if(alert.persist){
        alert.persist = true;
      }else{
        alert.persist = false;
        fadeOutAlerts.push(alert.index);
      }

    return alert;
  });

  return {newAlertArray : [...current, ...arrayWithIndexes], fadeOutAlerts };
}

function alertRemover(indiciesForRemoval : string[], dispatch : any){
  dispatch({type: 'REMOVE ALERTS', payload : { indiciesForRemoval }});
}

function updateAlerts(newAlerts : object[], state : AppState, dispatch : AppDispatch){
  // Alerts are NEW and need to be added with new indicies, then added to state with any other state
  const { newAlertArray, fadeOutAlerts }  = alertAdder(state.alerts, newAlerts);

  dispatch({type: 'SET ALERTS', payload : { alerts : newAlertArray }});
  setTimeout(() => { alertRemover(fadeOutAlerts, dispatch); }, 6800);
}


export { updateAlerts, alertAdder, alertRemover };