import { capitalize } from "../common/helperFunctions";
import { Stats } from "./types";

interface IPayload {
  newUserDefaults?: Stats;
  stat: string;
}
interface Action {
  type: string;
  payload: IPayload;
}

function spendQPReducer(state: Stats, action: Action): Stats {
  const { type, payload } = action;

  switch (type) {
    case "SET NEW USER DEFAULTS": {
      return { ...state, ...payload.newUserDefaults };
    }
    case "INCREMENT VALUE": {
      const stat = payload.stat;
      const qpCapitalized = stat === "maxHealth" ? "qpHealth" : `qp${capitalize(stat)}`;
      if (state.qp - 1 >= 0) {
        const updatedState = { [stat]: state[stat] + 1, qp: state.qp - 1, [qpCapitalized]: state[qpCapitalized] + 1 };
        return { ...state, ...updatedState };
      }
      return state;
    }
    case "ASTRO INCREMENT BY 5": {
      const stat = payload.stat;
      return { ...state, [stat]: state[stat] + 5 };
    }
    default: {
      console.log("No Matching Action in spendQPReducer!");
      return { ...state };
    }
  }
}

export default spendQPReducer;
