import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../../store";
import { getLsWithExpiry, setLsWithExpiry } from "../helperFunctions";
import useGlobalToast from "./useGlobalToast";

function useServerMessage() {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { addToast } = useGlobalToast();

  // Global messages from the server to inform users about important temporary information
  useEffect(() => {
    if (state.globalMessages) {
      (async () => {
        const hasSeen = await getLsWithExpiry("herofit-seenGlobalMessage");
        // If user hasn't seen the global message yet, as tracked in local storage
        // then display it and set local storage
        if (!hasSeen) {
          if (state.globalMessages) {
            let allMessageTimeouts = [];
            const globalMessageTimeout = setTimeout(() => {
              state.globalMessages.forEach((m, i) => {
                allMessageTimeouts.push(
                  setTimeout(() => {
                    addToast(m.type, m.message, 4500, 125, m.link, m.persist);
                  }, i * 5500),
                );
              });
              // expire haven't seen 'herofit-seenGlobalMessage' after 48 hours, so they can see global messages again
              setLsWithExpiry("herofit-seenGlobalMessage", true, 172800000);
            }, 6000);

            return () => {
              clearTimeout(globalMessageTimeout);
              allMessageTimeouts.forEach(mt => {
                clearTimeout(mt);
              });
            };
          }
        }
      })();
    }
  }, [state.globalMessages]);
}

export default useServerMessage;
