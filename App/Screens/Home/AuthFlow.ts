import React, { useContext } from "react";
import { getStravaClientCredentials, insertManualDataSrcId, insertStravaCredentials } from "../../api/authentication";
import debugErrors from "../../common/debugErrors";
import { User } from "../../common/types";
import { GlobalStateContext } from "../../store";

interface CredentialsForDB {
  stravaAccessToken: string;
  stravaAccessTokenExpiration: number;
  stravaRefreshToken: string;
}

async function _handleStravaDetails(email): Promise<{ user: User; credentialsForDB: CredentialsForDB }> {
  const { clientId, clientSecret } = await getStravaClientCredentials();
  let stravaAuthCode; // TODO: GET THIS
  const { access_token, expires_at, refresh_token } = await exchangeStravaAuthCode({ clientId, clientSecret, code: stravaAuthCode });

  const credentialsForDB: CredentialsForDB = {
    stravaAccessToken: access_token,
    stravaAccessTokenExpiration: expires_at,
    stravaRefreshToken: refresh_token,
  };

  const { id } = await getStravaUserId(credentialsForDB.stravaAccessToken);
  const { user } = await insertStravaCredentials({ ...credentialsForDB, dataSrcId: id, email });

  return { user, credentialsForDB };
}

async function _handleManualDetails(email): Promise<{ user: User }> {
  const { user } = await insertManualDataSrcId(email);
  return { user };
}

async function updateDataSrcId(email: string, mode: "Manual" | "Strava") {
  const { state, dispatch } = useContext(GlobalStateContext);

  try {
    type dataSrcUpdateReturnObj = { user: User; credentialsForDB?: CredentialsForDB };
    const { user, credentialsForDB = null }: dataSrcUpdateReturnObj = mode === "Strava" ? await _handleStravaDetails(state.user.email) : await _handleManualDetails(state.user.email);

    dispatch({ type: "SET USER", payload: { user: { ...user, ...credentialsForDB } } });
  } catch (error) {
    debugErrors(error, state.user);
  }
}

export default updateDataSrcId;
