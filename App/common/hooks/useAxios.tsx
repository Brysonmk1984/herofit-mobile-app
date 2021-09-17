import axios from "axios";
import { useEffect, useState } from "react";
import handleHttpError from "../../api/handleHttpError";
import { axiosOptions } from "../../api/axiosDefaults";
import Constants from "expo-constants";
const endpoint: string = Constants.manifest.extra.HF_ENDPOINT;

type HttpRequestMethod = "get" | "post" | "put" | "delete";

export default function useAxios(type: HttpRequestMethod, url: string, wholeUrlPassed: boolean = false, extraOptions: object = null): [any, boolean, any] {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (url) {
      const options = { ...axiosOptions, ...extraOptions };
      const finalUrl = wholeUrlPassed ? url : `${endpoint}${url}`;

      (async () => {
        try {
          const { data } = await axios[type](finalUrl, options);
          setLoading(false);
          setResponse(data.data);
        } catch (error) {
          handleHttpError(error.request, error.response);
          setLoading(false);
          setError(error);
        }
      })();
    }
  }, [url]);

  return [response, loading, error];
}
