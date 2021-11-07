import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { getStravaClientCredentials, insertStravaCredentials } from "../../api/authentication";
import { getNewAccessToken, getStravaActivityData, getStravaUserId } from "../../api/strava";

import debugErrors from "../../common/debugErrors";
import { determineDataSrcType, getLsWithExpiry, setLsWithExpiry } from "../../common/helperFunctions";
import useDidMount from "../../common/hooks/useDidMount";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import { isExistingHero } from "../../common/typeGuards";
import { Activity, Hero, User } from "../../common/types";
import { GlobalStateContext } from "../../store";

async function _checkStravaToken(user: User, state, dispatch): Promise<string> {
  const accessTokenExpiration = user.stravaAccessTokenExpiration;
  const nowEpoch = moment().valueOf() / 1000;

  // CHECK IF access token is valid, if so, just resolve the promise and move on
  if (accessTokenExpiration > nowEpoch && user.stravaAccessToken) {
    //console.log("TOKEN VALID, using existing access token");
    return user.stravaAccessToken;
  }
  console.log("TOKEN INVALID, refreshing access token");

  try {
    // OTHERWISE, we need to run the sequence to update the access token
    // First, get Strava client Credentials from my server
    const { clientId, clientSecret } = await getStravaClientCredentials();
    const authData = { clientId, clientSecret, refreshToken: user.stravaRefreshToken };

    const accessTokenData = await getNewAccessToken(authData);
    const { access_token: stravaAccessToken, expires_at: stravaAccessTokenExpiration, refresh_token: stravaRefreshToken } = accessTokenData;
    console.log("STRAVA - ATD", accessTokenData);
    let credentialsForDB = { email: user.email, stravaAccessToken, stravaAccessTokenExpiration, stravaRefreshToken };

    interface UpdatedCredentialsForDB {
      email: string;
      stravaAccessToken: string;
      stravaAccessTokenExpiration: string;
      stravaRefreshToken: string;
      dataSrcId: string;
    }
    let updatedCredentialsForDB: UpdatedCredentialsForDB | null;

    // If we are already saving the dataSrcId, then just return the credentialsObj without fetching the strava account data
    if (user.dataSrcId) {
      updatedCredentialsForDB = Object.assign({}, credentialsForDB, { dataSrcId: user.dataSrcId });
    } else {
      // NEW - IF USER DATA DOES NOT INCLUDE A DATA SRC ID...
      // FETCH USER INFO TO GET STRAVA ID, WHICH WILL ALSO BE SAVED TO DB

      // Get Strava account info
      const { id: dataSrcId } = await getStravaUserId(credentialsForDB.stravaAccessToken);

      updatedCredentialsForDB = Object.assign({}, credentialsForDB, { dataSrcId });
    }

    // UPDATE DB with new strava credentials
    const { user: userWithNewStravaCredentials } = await insertStravaCredentials(updatedCredentialsForDB);

    // UPDATE STATE with new strava credentials
    const updatedUser = Object.assign({}, user, userWithNewStravaCredentials);
    dispatch({ type: "SET USER", payload: { user: updatedUser } });

    return updatedUser.stravaAccessToken;
  } catch (error) {
    // Couldn't retrieve strava credentials
    debugErrors(error, user);
    throw new Error(`${error.status}: ${error.message}`);
  }
}

// Combines the Data from the DB and Strava, and updates state and DB with combined data
function _handleStravaActivities(hero: Hero, stravaActivities: any[], dateOfLatestSaved: string | null, user: User): Activity[] {
  let newStravaActivities: any[];

  // IF Existing User, only use activities after latest saved, or if none are saved, use it
  if (hero.hasBeenUpgraded) {
    newStravaActivities = stravaActivities.filter(activity => {
      let activityDate = moment.utc(activity.start_date, "YYYY-MM-DD[T]HH:mm[Z]");
      //console.log('is after latest saved', activityDate.isAfter(dateOfLatestSaved), 'ID - ', activity.id);
      return activityDate.isAfter(dateOfLatestSaved) || dateOfLatestSaved === null;
    });
    // If not a new user, but there is no saved activities, get everything after account creation AND 5 before.
    // This is for users who dont buff avatar right away.
  } else {
    let accountDate = moment.utc(user.createdAt, "YYYY-MM-DD[T]HH:mm[Z]");
    const afterArray = stravaActivities.filter(activity => {
      let activityDate = moment.utc(activity.start_date, "YYYY-MM-DD[T]HH:mm[Z]");
      return activityDate.isAfter(accountDate);
    });
    const beforeArray = stravaActivities.filter(activity => {
      let activityDate = moment.utc(activity.start_date, "YYYY-MM-DD[T]HH:mm[Z]");
      return activityDate.isBefore(accountDate);
    });
    newStravaActivities = [...afterArray, ...beforeArray.slice(0, 5)];
  }
  // console.log("NAL!!!", newStravaActivities.length);
  // If there are any new activities, present user option to upgrade
  if (newStravaActivities.length) {
    const newFormatActivities = newStravaActivities.map(act => {
      return {
        id: act.id,
        activityDate: act.start_date,
        type: act.type,
        averageSpeed: act.average_speed,
        maxSpeed: act.max_speed,
        distance: act.distance,
        duration: act.moving_time,
        elevationGain: act.total_elevation_gain,
        source: "strava",
      };
    });

    return newFormatActivities;
  }
}

// IF Strava is the dataSrc method on user's account,
// GET STRAVA ACTIVITIES TO FIGURE OUT IF THE USER HAS NEW UPGRADES TO ADD
function useStravaDataProcess(): { newStravaActivities: Activity[]; getFreshStravaData: (manually?: boolean) => void } {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [lsStrava, setLsStrava] = useState<any[] | undefined>();
  const [lsStravaCheckHappened, setLsStravaCheckHappened] = useState(false);
  const [newStravaActivities, setNewStravaActivities] = useState<Activity[]>([]);
  const hero = state.hero as Hero;
  const { addToast } = useGlobalToast();

  async function getFreshStravaData(manually?: boolean): Promise<void> {
    if (manually) {
      setLsStrava([]);
      setLsStravaCheckHappened(false);
    }
    try {
      const accessToken = await _checkStravaToken(state.user, state, dispatch);
      const activities = await getStravaActivityData(accessToken);

      const formattedNewActivities = _handleStravaActivities(hero, activities, state.latestSavedActivityDate, state.user);
      await setNewStravaActivities(formattedNewActivities);
      // Setting LS to prevent repeated calls to strava server - Expires in 30 minutes
      await setLsWithExpiry("herofit-stravaActivities", formattedNewActivities, 1800000);
      if (manually && !formattedNewActivities?.length) {
        addToast("info", `Couldn't find any new Strava activities...`);
      }
      return;
    } catch (error) {
      debugErrors(error, state.user);
      addToast("error", `${error.status}: ${error.message}`);
    }
  }

  // Check if Strava User && get lsSaved Strava activities
  useEffect(() => {
    if (state.user?.dataSrcId) {
      (async () => {
        const lsSavedStravaActivities: any[] = await getLsWithExpiry("herofit-stravaActivities");
        setLsStrava(lsSavedStravaActivities);
        setLsStravaCheckHappened(true);
      })();
    }
  }, [state.user?.dataSrcId]);

  // Either Use LS Strava Data OR
  // Initialize Strava Data Fetch Sequence
  useEffect(() => {
    // Only run Strava code if user is an existing user who already set up Strava with their HF account
    if (isExistingHero(state.hero) && determineDataSrcType(state.user?.dataSrcId) === "Strava") {
      (async () => {
        // Only run this after LS check happened
        if (lsStravaCheckHappened) {
          // If there are locally saved strava activities, use cached version
          // This is to prevent too many requests against Strava API
          if (lsStrava) {
            //console.log("YES LS STRAVA DATA");
            const formattedNewActivities = _handleStravaActivities(hero, lsStrava, state.latestSavedActivityDate, state.user);
            setNewStravaActivities(formattedNewActivities);
          } else {
            //console.log("NO LS STRAVA DATA");
            // Otherwise, do Strava Check
            getFreshStravaData();
          }
        }
      })();
    }
  }, [lsStravaCheckHappened]);

  return {
    newStravaActivities,
    getFreshStravaData,
  };
}

export default useStravaDataProcess;
