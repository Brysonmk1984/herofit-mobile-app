import { generate } from 'rand-token';

function adder(current, newAlerts){
  newAlerts = Array.isArray(newAlerts) ? newAlerts : [newAlerts];
  const fadeOutAlerts = [];
  
  const arrayWithIndexes = newAlerts.map((alert, i) => {
      const token = generate(16);
      let mappedAlert = { type : alert.type, message : alert.message, confirm : alert.confirm, identifier : alert.identifier, index : token }
      if(alert.link){
        mappedAlert.link = alert.link;
      }
      if(alert.persist){
          mappedAlert.persist = true;
      }else{
          mappedAlert.persist = false;
          fadeOutAlerts.push(token);
      }
      if(alert.cb){
        mappedAlert.cb = alert.cb;
      }

    return mappedAlert;
  });

  return {newAlertArray : [...current, ...arrayWithIndexes], fadeOutAlerts };
}

function remover(current, indiciesForRemoval){
  return current.filter((alert) => {
    return !indiciesForRemoval.includes(alert.index);
  });
}

export { adder, remover };