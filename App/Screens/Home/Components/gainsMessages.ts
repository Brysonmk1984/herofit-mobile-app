import { Activity, Hero, Item } from "../../../common/types";

interface StatImprovement {
  fire?: number;
  earth?: number;
  air?: number;
  water?: number;
  armor?: number;
  recovery?: number;
  aether?: number;
}
interface UpgradeReturnObject {
  activities: Activity[];
  avatar: Hero;
  improvements: StatImprovement;
  reachedLevel: number;
  xpGain: number;
  qpEarned: number;
  items: Item[];
  rewards: Item[];
}

// For displaying Gains messages after hero upgrade
function buildGainsMessages(upgradeResults: UpgradeReturnObject) {
  const { activities, avatar: hero, improvements, reachedLevel, xpGain, qpEarned, items, rewards } = upgradeResults;
  const messageArray = [];

  // Message for level up and QP earned if new level reached
  if (reachedLevel) {
    if (hero.albedo) {
      messageArray.push(`LEVEL UP! Earned ${qpEarned} QP for reaching Albedo Level ${reachedLevel}!`);
    } else {
      messageArray.push(`LEVEL UP! Earned ${qpEarned} QP for reaching ${reachedLevel}!`);
    }
  }

  // message for found items
  messageArray.push(
    ...items.map((item: Item) => {
      return `Found item: ${item}!`;
    }),
  );
  messageArray.push(
    ...rewards.map((reward: Item) => {
      return `Earned a new ${reward.type}: ${reward.name}, ${reward.description}!`;
    }),
  );

  // Message for XP gain
  messageArray.push(`${xpGain} XP earned!`);
  // Messages for stat improvements
  for (let attribute in improvements) {
    if (improvements[attribute] >= 1) {
      let improvement = improvements[attribute];
      messageArray.push(`Gained ${improvement} ${attribute.toUpperCase()}!`);
    }
  }
  return messageArray;
}

function displayGainsMessages(messageArray, alertUpdateFunc) {
  setTimeout(() => {
    messageArray.forEach((message, i) => {
      setTimeout(() => {
        alertUpdateFunc([{ type: "success", message }]);
      }, 1500 * i);
    });
  }, 2000);
}

export { buildGainsMessages, displayGainsMessages };
