import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { getStravaClientCredentials, insertStravaCredentials } from "../../api/authentication";
import { getNewAccessToken, getStravaActivityData, getStravaUserId } from "../../api/strava";
import { updateAlerts } from "../../common/alerts";
import debugErrors from "../../common/debugErrors";
import { getLsWithExpiry, setLsWithExpiry } from "../../common/helperFunctions";
import useDidMount from "../../common/hooks/useDidMount";
import { Activity } from "../../common/types";
import { GlobalStateContext } from "../../store";

function _checkStravaToken() {
  const accessTokenExpiration = this.state.admin.stravaAccessTokenExpiration;
  const nowEpoch = moment().valueOf() / 1000;
  // Check if access token is valid, if so, just resolve the promise and move on
  if (accessTokenExpiration > nowEpoch && this.state.admin.stravaAccessToken) {
    //console.log('TOKEN VALID, using existing access token');
    return Promise.resolve(this.state.admin.stravaAccessToken);
  }
  //console.log('TOKEN INVALID, refreshing access token');

  // otherwise, we need to run the sequence to update the access token
  // Get Strava client Credentials from my server
  return getStravaClientCredentials()
    .then(data => {
      if (data.error) {
        const error = data.error;
        // Couldn't retrieve strava credentials
        debugErrors(data.error, this.state.admin);
        return this.updateState({ appIsLoading: false, alerts: [{ type: "error", message: `${error.status}: ${error.message}` }] });
      }
      const authData = { clientId: data.clientId, clientSecret: data.clientSecret, refreshToken: this.state.admin.stravaRefreshToken };
      return new Promise((resolve, reject) => {
        return getNewAccessToken(authData, resolve, reject);
      });
    })
    .then(data => {
      let credentialsForDB = {
        email: this.state.admin.email,
        stravaAccessToken: data.access_token,
        stravaAccessTokenExpiration: data.expires_at,
        stravaRefreshToken: data.refresh_token,
      };
      const user = this.state.admin;
      // If we are already saving the dataSrcId, then just return the credentialsObj without fetching the strava account data
      if (user.dataSrcId) {
        //If dataSrcId exists, just return access token so app can fetch activity data
        return credentialsForDB;
      }

      // NEW - IF USER DATA DOES NOT INCLUDE A DATA SRC ID...
      // FETCH USER INFO TO GET STRAVA ID, WHICH WILL ALSO BE SAVED TO DB
      // Since this is just to get active users strava id, and it's not necessary for functionality right now,
      // I'm letting this run without blocking the rest of the game

      // Get Strava account info
      return new Promise((resolve, reject) => {
        return getStravaUserId(credentialsForDB.stravaAccessToken, resolve, reject);
      })
        .then(data => {
          return Object.assign({}, credentialsForDB, { dataSrcId: data.id });
        })
        .catch(error => {
          // Couldn't retrieve strava account details
          debugErrors(error, this.state.admin);
          this.updateState({ appIsLoading: false, alerts: [{ type: "error", message: `${error.status}: ${error.message}` }] });
          return error;
        });
    })
    .then(credentialsForDB => {
      // UPDATE DB with new strava credentials
      return insertStravaCredentials(credentialsForDB);
    })
    .then(data => {
      const { user, error } = data;
      if (data.error) {
        // Couldn't retrieve strava credentials
        debugErrors(data.error, this.state.admin);
        //console.log('Couldnt retrieve strava credentials', error);
        return this.updateState({ appIsLoading: false, alerts: [{ type: "error", message: `${error.status}: ${error.message}` }] });
      }
      const updatedCredentials = {
        stravaAccessToken: user.stravaAccessToken,
        stravaAccessTokenExpiration: user.stravaAccessTokenExpiration,
        stravaRefreshToken: user.stravaRefreshToken,
      };
      // UPDATE STATE with new strava credentials, and check to see if we need to call
      // checkNewActivities() again with a new access token
      const admin = Object.assign({}, this.state.admin, updatedCredentials);
      this.setState({ admin });
      return updatedCredentials.stravaAccessToken;
    })
    .catch(error => {
      if (error.status === 400) {
        error.message = error.meta;
      }
      debugErrors(error, this.state.admin);
      this.updateState({ alerts: [{ type: "error", message: `${error.status}: ${error.message}` }] });
    });
}

// Combines the Data from the DB and Strava, and updates state and DB with combined data
function _handleStravaActivities(stravaActivities: Activity[], dateOfLatestSaved: string | null) {
  // Setting LS to prevent repeated calls to strava server
  setLsWithExpiry("herofit-stravaActivities", stravaActivities, 1800000);

  let newStravaActivities;

  // IF Existing User, only use activities after latest saved, or if none are saved, use it
  if (this.state.avatar.hasBeenUpgraded) {
    newStravaActivities = stravaActivities.filter(activity => {
      let activityDate = moment.utc(activity.start_date, "YYYY-MM-DD[T]HH:mm[Z]");
      //console.log('is after latest saved', activityDate.isAfter(dateOfLatestSaved), 'ID - ', activity.id);
      return activityDate.isAfter(dateOfLatestSaved) || dateOfLatestSaved === null;
    });
    // If not a new user, but there is no saved activities, get everything after account creation AND 5 before.
    // This is for users who dont buff avatar right away.
  } else {
    let accountDate = moment.utc(this.state.admin.createdAt, "YYYY-MM-DD[T]HH:mm[Z]");
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

  // If there are any new activities, present user option to upgrade
  if (newStravaActivities.length) {
    // As of 09/28/21, we're not saving strava activities differently
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

    this.setState({ upgradeAvailable: true, newStravaActivities: newFormatActivities });
  }
}

// IF Strava is the dataSrc method on user's account,
// GET STRAVA ACTIVITIES TO FIGURE OUT IF THE USER HAS NEW UPGRADES TO ADD
function useStravaDataProcess() {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [lsStrava, setLsStrava] = useState();
  const [lsStravaCheckHappened, setLsStravaCheckHappened] = useState(false);
  const { mounted } = useDidMount();

  console.log("SAVED STAVA ACTS", lsStrava);

  // Check if Strava User && get lsSaved Strava activities
  useEffect(() => {
    // A length of 8 means the user has Strava set up in HeroFit
    if (state.user.dataSrcId?.length === 8) {
      (async () => {
        const lsSavedStravaActivities: Activity[] = await getLsWithExpiry("herofit-stravaActivities");
        setLsStrava(lsSavedStravaActivities);
        setLsStravaCheckHappened(true);
      })();
    }
  }, [state.user.dataSrcId]);

  // Either Use LS Strava Data OR
  // Initialize Strava Data Fetch Sequence
  useEffect(() => {
    (async () => {
      // Only run this after LS check happened
      if (lsStravaCheckHappened) {
        // If there are locally saved strava activities, use cached version
        // This is to prevent too many requests against Strava API
        if (lsStrava) {
          _handleStravaActivities(lsStrava, state.latestSavedActivityDate);
        } else {
          // Otherwise, do Strava Check
          try {
            const accessToken = await _checkStravaToken();
            const activities = await getStravaActivityData(accessToken);
            _handleStravaActivities(activities, dateOfLatestSaved);
          } catch (error) {
            debugErrors(error, state.user);
            updateAlerts([{ type: "error", message: `${error.status}: ${error.message}` }], state, dispatch);
          }
        }
      }
    })();
  }, [lsStravaCheckHappened]);
}

export default useStravaDataProcess;
