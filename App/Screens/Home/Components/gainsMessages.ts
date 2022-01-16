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
  rewards: string[];
}

// For displaying Gains messages after hero upgrade
function buildGainsMessages(upgradeResults: UpgradeReturnObject) {
  const { avatar: hero, improvements, reachedLevel, xpGain, qpEarned, items, rewards } = upgradeResults;
  const messageArray = [];

  // Message for level up and QP earned if new level reached
  if (reachedLevel) {
    if (hero.albedo) {
      messageArray.push(`LEVEL UP! Earned ${qpEarned} QP!`, `+5 Aether, +5 Power, +5 MaxHealth, +${xpGain} XP`);
    } else {
      messageArray.push(`LEVEL UP! Earned ${qpEarned} QP!`, `+5 Power, +5 MaxHealth, +${xpGain} XP`);
    }
  } else {
    messageArray.push(`${xpGain} XP earned!`);
  }

  // message for found items
  messageArray.push(
    ...items.map((item: string) => {
      return `Found item: ${item.toUpperCase()}!`;
    }),
  );
  messageArray.push(
    ...rewards.map((reward: Item) => {
      return `Earned a new ${reward.type}: ${reward.name}, ${reward.description}!`;
    }),
  );

  // GAINS - PHOTON TOKEN
  if (improvements["Photon Tokens"] >= 1) {
    messageArray.push(`Gained ${improvements["Photon Tokens"]} PHOTON TOKENS!`);
  }

  // GAINS - ELEMENTS
  const elmGainArray = [{ fire: improvements.fire }, { earth: improvements.earth }, { water: improvements.water }, { air: improvements.air }];
  elmGainArray.forEach(elmGain => {
    const elmKeyValue = Object.entries(elmGain)[0];
    if (elmKeyValue[1] > 0) {
      messageArray.push(`Gained ${elmKeyValue[1]} ${elmKeyValue[0].toUpperCase()}! `);
    }
  });
  return messageArray;
}

export default buildGainsMessages;
