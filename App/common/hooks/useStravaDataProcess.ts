import { Dispatch, useContext, useEffect, useState } from "react";
import { stravaFetchAndUpdateAccessToken, getStravaActivityData } from "../../api/strava";
import debugErrors from "../../common/debugErrors";
import { determineDataSrcType, getLsWithExpiry, setLsWithExpiry } from "../../common/helperFunctions";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import { isExistingHero } from "../../common/typeGuards";
import { Activity, AppAction, Hero, InitialAppState, User } from "../../common/types";
import { GlobalStateContext } from "../../store";
import moment from "moment";
import activityList from "../../common/activityList.json";
const activityTypes = activityList.map(a => a.type);

async function _checkStravaToken(user: User, state: InitialAppState, dispatch: React.Dispatch<AppAction>): Promise<string> {
  const accessTokenExpiration = user.stravaAccessTokenExpiration;
  const nowEpoch = moment().valueOf() / 1000;

  // CHECK IF access token is valid, if so, just resolve the promise and move on
  if (accessTokenExpiration > nowEpoch && user.stravaAccessToken) {
    //console.log("TOKEN VALID, using existing access token");
    return user.stravaAccessToken;
  }
  //console.log("TOKEN INVALID, refreshing access token");

  try {
    // OTHERWISE, we need to run the sequence to update the access token
    // set updated user and return the access token to the parent function so it can fetch strava activities
    const { user: updatedUser } = await stravaFetchAndUpdateAccessToken({ email: state.user.email });
    dispatch({ type: "SET USER", payload: { user: updatedUser, isSignedIn: true } });

    return updatedUser.stravaAccessToken;
  } catch (error) {
    // Couldn't retrieve strava credentials
    debugErrors(error, user);
    throw new Error(`${error.status}: ${error.message}`);
  }
}

// Combines the Data from the DB and Strava, and updates state and DB with combined data
function _handleStravaActivities(hero: Hero, stravaActivities: any[], dateOfLatestSaved: string | null, user: User): Activity[] {
  let formattedActivities: any[] | undefined = stravaActivities.map(act => {
    return {
      id: act.id,
      activityDate: act.start_date || act.activityDate,
      type: activityTypes.includes(act.type) ? act.type : "Workout",
      averageSpeed: act.average_speed ?? act.averageSpeed,
      maxSpeed: act.max_speed ?? act.maxSpeed,
      distance: act.distance,
      duration: act.moving_time ?? act.duration,
      elevationGain: act.total_elevation_gain || act.elevationGain,
      source: "strava",
    };
  });

  // IF Existing User, only use activities after latest saved, or if none are saved, use it
  if (hero.hasBeenUpgraded) {
    return formattedActivities.filter(activity => {
      return moment(activity.activityDate).isAfter(dateOfLatestSaved) || dateOfLatestSaved === null;
    });
  } else if (!dateOfLatestSaved) {
    // If not a new user, but there is no saved activities, get everything after account creation AND 5 before.
    // This is for users who dont buff avatar right away.
    let accountDate = moment.utc(user.createdAt, "YYYY-MM-DD[T]HH:mm[Z]");

    const afterArray = formattedActivities.filter(activity => {
      let activityDate = moment.utc(activity.activityDate, "YYYY-MM-DD[T]HH:mm[Z]");
      return activityDate.isAfter(accountDate);
    });
    const beforeArray = formattedActivities.filter(activity => {
      let activityDate = moment.utc(activity.activityDate, "YYYY-MM-DD[T]HH:mm[Z]");
      return activityDate.isBefore(accountDate);
    });
    return [...afterArray, ...beforeArray.slice(0, 5)];
  } else {
    const error = new Error("User hasn't been upgraded AND there IS a latest saved activity... must be a bug");
    debugErrors(error.toString(), user);
    throw error;
  }
}

// IF Strava is the dataSrc method on user's account,
// GET STRAVA ACTIVITIES TO FIGURE OUT IF THE USER HAS NEW UPGRADES TO ADD
function useStravaDataProcess(): { newStravaActivities: Activity[]; getFreshStravaData: (manually?: boolean) => void; resetNewStravaActivities: () => void } {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [lsStrava, setLsStrava] = useState<any[] | undefined>();
  const [newStravaActivities, setNewStravaActivities] = useState<Activity[]>([]);
  const [lsStravaCheckHappened, setLsStravaCheckHappened] = useState(false);
  const hero = state.hero as Hero;
  const { addToast } = useGlobalToast();

  async function getFreshStravaData(manually?: boolean): Promise<void> {
    if (manually) {
      setLsStrava([]);
      //dispatch({ type: "SET LS STRAVA CHECK HAPPENED", payload: { lsStravaCheckHappened: false } });
      setLsStravaCheckHappened(false);
    }
    try {
      const accessToken = await _checkStravaToken(state.user, state, dispatch);
      const activities = await getStravaActivityData(accessToken);

      const formattedNewActivities = _handleStravaActivities(hero, activities, state.latestSavedActivityDate, state.user);
      //console.log("FNA", formattedNewActivities);
      await setNewStravaActivities(formattedNewActivities);

      // Setting LS to prevent repeated calls to strava server - Expires in 30 minutes
      await setLsWithExpiry("herofit-stravaActivities", formattedNewActivities, 1800000);
      if (manually && !formattedNewActivities?.length) {
        addToast("info", `Couldn't find any new Strava activities...`, undefined, 125);
      } else if (formattedNewActivities?.length) {
        addToast("success", `Strava Activities Found!`, undefined, 125);
      }
      return;
    } catch (error) {
      debugErrors(error, state.user);
      addToast("error", `${error.status}: ${error.message}`);
    }
  }

  // Check if Strava activities exist locally and set local state
  async function _doLocalStravaCheck() {
    const lsSavedStravaActivities: any[] = await getLsWithExpiry("herofit-stravaActivities");
    setLsStrava(lsSavedStravaActivities);
    setLsStravaCheckHappened(true);
  }

  // Check if Strava User && get lsSaved Strava activities
  useEffect(() => {
    //console.log(state.user?.dataSrcId, !lsStravaCheckHappened);
    if (state.user?.dataSrcId && !lsStravaCheckHappened) {
      _doLocalStravaCheck();
    }
  }, []);

  // Either Use LS Strava Data OR
  // Initialize Strava Data Fetch Sequence
  useEffect(() => {
    // This should absolutely only be called once on load, or when screen gets refreshed
    // either from swiping down or coming to foreground
    if (lsStravaCheckHappened) {
      // Only run Strava code if user is an existing user who already set up Strava with their HF account
      if (isExistingHero(state.hero) && determineDataSrcType(state.user?.dataSrcId) === "Strava") {
        (async () => {
          // If there are locally saved strava activities, use cached version
          // This is to prevent too many requests against Strava API
          if (lsStrava) {
            //console.log("YES LS STRAVA DATA", state.latestSavedActivityDate, lsStrava, state.latestSavedActivityDate);
            const formattedNewActivities = _handleStravaActivities(hero, lsStrava, state.latestSavedActivityDate, state.user);
            setNewStravaActivities(formattedNewActivities);
          } else {
            //console.log("NO LS STRAVA DATA");
            // Otherwise, do Strava Check
            getFreshStravaData();
          }
        })();
      }
    }
  }, [lsStravaCheckHappened]);

  useEffect(() => {
    if (state.refreshCount > 0) {
      if (state.user?.dataSrcId) {
        setLsStravaCheckHappened(false);
        _doLocalStravaCheck();
      }
    }
  }, [state.refreshCount]);

  return {
    newStravaActivities,
    getFreshStravaData,
    resetNewStravaActivities: () => setNewStravaActivities([]),
  };
}

export default useStravaDataProcess;
