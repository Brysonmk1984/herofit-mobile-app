import React, { useState, useEffect } from "react";
import { fetchAvatarInventory } from "../../../../../api/inventory";
import debugErrors from "../../../../../common/debugErrors";
import useGlobalToast from "../../../../../common/hooks/useGlobalToast";
import { Item, ItemType, User } from "../../../../../common/types";

// Determines which items are equipped for each item type
function _determineEquippedItems(equipment: Inventory) {
  let equippedPet = null,
    equippedCostume = null,
    equippedTitle = null;

  // // LOOP through each type of equipment
  for (let equipType in equipment) {
    // Find the item that's equipped for that specific equipment type
    const equippedItem = equipment[equipType].find((item: Item) => item.equipped === true);

    // If the equipment is equipped, set the corresponding equippedVariable to that item
    if (equippedItem) {
      if (equippedItem.type === "pet") {
        equippedPet = equippedItem;
      } else if (equippedItem.type === "skin") {
        equippedCostume = equippedItem;
      } else if (equippedItem.type === "title") {
        equippedTitle = equippedItem;
      }
    }
  }

  return { equippedPet, equippedCostume, equippedTitle };
}

type Inventory = {
  [T in Lowercase<ItemType>]: Item[];
};

interface EquippedItems {
  equippedPet: Item;
  equippedCostume: Item;
  equippedTitle: Item;
}

export default function useInventory(heroId: number | null, user: User): Inventory & EquippedItems {
  const { addToast } = useGlobalToast();

  const [consumables, setConsumables] = useState<Item[]>([]);
  const [pets, setPets] = useState<Item[]>([]);
  const [costumes, setCostumes] = useState<Item[]>([]);
  const [titles, setTitles] = useState<Item[]>([]);
  const [codex, setCodex] = useState<Item[]>([]);
  const [equippedPet, setEquippedPet] = useState<Item>(null);
  const [equippedCostume, setEquippedCostume] = useState<Item>(null);
  const [equippedTitle, setEquippedTitle] = useState<Item>(null);

  useEffect(() => {
    // Only fetch Equipment if active hero
    if (heroId) {
      try {
        (async () => {
          const equipment = await fetchAvatarInventory({ avatarID: heroId });
          //console.log("EQ - ", equipment);
          setPets(equipment.pets);
          setCostumes(equipment.skins);
          setTitles(equipment.titles);
          setConsumables(equipment.consumables);
          setCodex(equipment.codices);

          const { equippedPet, equippedCostume, equippedTitle } = _determineEquippedItems(equipment);
          setEquippedPet(equippedPet);
          setEquippedCostume(equippedCostume);
          setEquippedTitle(equippedTitle);
        })();
      } catch (error) {
        debugErrors(error, user);
        addToast("error", `${error.status}: ${error.message}`);
      }
    }
  }, [heroId]);

  return {
    consumables,
    pets,
    costumes,
    titles,
    codex,
    equippedPet,
    equippedCostume,
    equippedTitle,
  };
}
