import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { View, Text } from "native-base";

interface CountdownTimerProps {
  type: "Knocked Out" | "Battle";
  hideType?: boolean;
  fontSize?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ type, hideType = false, fontSize = 20 }) => {
  const [hours, setHours] = useState<string | number>(0);
  const [minutes, setMinutes] = useState<string | number>(0);
  const [seconds, setSeconds] = useState<string | number>(0);

  useEffect(() => {
    let tomorrowDate: string | number = moment.tz("America/Denver").add(1, "days").date();
    if (1 <= tomorrowDate && tomorrowDate <= 9) {
      tomorrowDate = "0" + tomorrowDate;
    }
    // Need to check if next day is Jan 1, if so, set tomorrow month to 1, otherwise set it to current month
    let tomorrowMonth: string | number = moment.tz("America/Denver").add(1, "days").month() === 12 && moment.tz("America/Denver").add(1, "days").date() === 1 ? 1 : moment.tz("America/Denver").add(1, "days").month() + 1;

    if (1 <= tomorrowMonth && tomorrowMonth <= 9) {
      tomorrowMonth = "0" + tomorrowMonth;
    }
    const tomorrowYear = moment.tz("America/Denver").add(1, "days").year();
    const eventTime = moment.tz(`${tomorrowYear}-${tomorrowMonth}-${tomorrowDate} 02:00:00`, "YYYY-MM-DD HH:mm:ss", true, "America/Denver").unix();

    let currentTime = moment.tz(Date.now(), "America/Denver").unix(),
      diffTime = eventTime - currentTime,
      interval = 1000,
      duration = moment.duration(diffTime * 1000, "milliseconds");

    setInterval(() => {
      duration = moment.duration(duration.asMilliseconds() - interval, "milliseconds");
      let h = moment.duration(duration).hours().toString(),
        m = moment.duration(duration).minutes().toString(),
        s = moment.duration(duration).seconds().toString();

      h = h.length === 1 ? "0" + h : h;
      m = m.length === 1 ? "0" + m : m;
      s = s.length === 1 ? "0" + s : s;

      // show how many hours, minutes and seconds are left
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, interval);

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      {type === "Battle" ? (
        <View flexDirection="row" mt={1}>
          {!hideType && (
            <Text mr={2} fontSize={fontSize} fontFamily="heading" color="base.white" opacity={0.6}>
              Battle:
            </Text>
          )}
          <Text fontSize={fontSize} fontFamily="heading" color="base.warning">
            {" "}
            {hours}:
          </Text>
          <Text fontSize={fontSize} fontFamily="heading" color="base.warning">
            {minutes}:
          </Text>
          <Text fontSize={fontSize} fontFamily="heading" color="base.warning">
            {seconds}
          </Text>
        </View>
      ) : type === "Knocked Out" ? (
        <View flexDirection="row" mt={2}>
          {!hideType && (
            <Text fontSize={fontSize} mr={2} fontFamily="heading" color="base.white" opacity={0.6}>
              Knocked Out:
            </Text>
          )}
          <Text fontSize={fontSize} color="base.white" fontFamily="heading">
            {hours}:
          </Text>
          <Text fontSize={fontSize} color="base.white" fontFamily="heading">
            {minutes}:
          </Text>
          <Text fontSize={fontSize} color="base.white" fontFamily="heading">
            {seconds}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
