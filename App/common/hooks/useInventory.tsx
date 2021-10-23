import React, { useState, useEffect, useContext } from "react";
import { buyItemByAvatarId, consumeItemRequest, equipItem, equipUnequipItem, fetchAvatarInventory, unequipItem } from "../../api/inventory";
import debugErrors from "../debugErrors";
import { convertAorAn } from "../helperFunctions";
import useGlobalToast from "./useGlobalToast";
import { EquippableItemType, Hero, InventoryCategories, Item, ItemType, ServerItemType } from "../types";
import { GlobalStateContext } from "../../store";

interface EquippedItems {
  equippedPet: Item;
  equippedCostume: Item;
  equippedTitle: Item;
}

interface UpdaterMethods {
  buy: (item: Item, hero: Hero) => void;
  consume: (item: Item, heroObj: Hero) => void;
  equip: (newItem: Item, hero: Hero) => void;
  unequip: (oldItem: Item, hero: Hero) => void;
  equipUnequip: (newItem: Item, oldItemId: number, hero: Hero) => void;
}

export default function useInventory(makeInventoryRequest?: boolean): InventoryCategories & EquippedItems & UpdaterMethods {
  const { addToast } = useGlobalToast();
  const { state, dispatch } = useContext(GlobalStateContext);
  const { hero, user, inventory } = state;

  const [consumables, setConsumables] = useState<Item[]>([]);
  const [pets, setPets] = useState<Item[]>([]);
  const [costumes, setCostumes] = useState<Item[]>([]);
  const [titles, setTitles] = useState<Item[]>([]);
  const [codex, setCodex] = useState<Item[]>([]);
  const [equippedPet, setEquippedPet] = useState<Item>(null);
  const [equippedCostume, setEquippedCostume] = useState<Item>(null);
  const [equippedTitle, setEquippedTitle] = useState<Item>(null);

  function updateEquipped(item?: Item, unequipOnly?: EquippableItemType) {
    // For Unequipping only
    if (unequipOnly) {
      switch (unequipOnly) {
        case "pet":
          return setEquippedPet(null);
        case "skin":
          return setEquippedCostume(null);
        case "title":
          return setEquippedTitle(null);
        default:
          throw new Error("Inappropriate Item Type");
      }
    }

    // For Equipping and Equip/Unequip
    switch (item.type) {
      case "pet":
        return setEquippedPet(item);
      case "skin":
        return setEquippedCostume(item);
      case "title":
        return setEquippedTitle(item);
      default:
        console.log(item.type);
        throw new Error("Inappropriate Item Type");
    }
  }

  function _updateInventoryCategoriesByItemType(itemCategory: Item[], type: ServerItemType) {
    switch (type) {
      case "consumable":
        setConsumables(itemCategory);
      case "pet":
        setPets(itemCategory);
      case "skin":
        setCostumes(itemCategory);
      case "title":
        setTitles(itemCategory);
      case "codex":
        setCodex(itemCategory);
      default:
        throw new Error("No matching item type!");
    }
  }

  // BUY AN ITEM
  async function buy(item: Item, hero: Hero) {
    try {
      const itemCategoryData = await buyItemByAvatarId({ itemID: item.id, ptCost: item.ptCost, avatarID: hero.id });
      const itemCategoryMap = { consumable: "consumables", pet: "pets", skin: "skins", title: "titles", codex: "codex" };
      // Only update the category of the item bought
      _updateInventoryCategoriesByItemType(itemCategoryData[itemCategoryMap[item.type]], item.type);
      dispatch({ type: "SET HERO", payload: { hero: { ...hero, photonTokens: itemCategoryData.remainingPT } } });
      addToast("success", `Bought ${convertAorAn(item.name)} ${item.name}`);
    } catch (error) {
      error.message = `Unable to buy Item, Please try again later.`;
      addToast("error", `${error.status}: ${error.message}`);
      return debugErrors(error, user);
    }
  }

  // CONSUME A CONSUMABLE ITEM
  async function consume(item: Item, heroObj: Hero) {
    try {
      const { consumables, hero } = await consumeItemRequest({ id: item.id, email: heroObj.owner, avatarID: heroObj.id, effects: item.effects });
      _updateInventoryCategoriesByItemType(consumables, "consumable");
      dispatch({ type: "SET HERO", payload: { hero } });
      addToast("success", `${hero.name} used ${convertAorAn(item.name)} ${item.name}.`);
    } catch (error) {
      addToast("error", `${error.status}: ${error.message}`);
      return debugErrors(error, user);
    }
  }

  // EQUIPPING ITEM WHEN NO OTHER OF SAME TYPE IS EQUIPPED
  async function equip(newItem: Item, hero: Hero) {
    try {
      const { equippedItem } = await equipItem({ avatarId: hero.id, equipId: newItem.itemID });
      //_updateInventoryCategoriesByItemType(equippedItem, newItem.type);
      updateEquipped(equippedItem);
      addToast("success", `${equippedItem.name} Item has been equipped!`);
    } catch (error) {
      addToast("error", `${error.status}: ${error.message}`);
      return debugErrors(error, user);
    }
  }

  async function unequip(oldItem: Item, hero: Hero) {
    try {
      const { unequippedItem } = await unequipItem({ avatarId: hero.id, unequipId: oldItem.itemID });
      updateEquipped(null, unequippedItem.type as EquippableItemType);
      addToast("success", `${unequippedItem.name} has been unequipped!`);
    } catch (error) {
      addToast("error", `${error.status}: ${error.message}`);
      return debugErrors(error, user);
    }
  }

  async function equipUnequip(newItem: Item, oldItemId: number, hero: Hero) {
    // If the clicked on item is not the same item
    if (newItem.itemID !== oldItemId) {
      try {
        const { equippedItem } = await equipUnequipItem({ avatarId: hero.id, equipId: newItem.itemID, unequipId: oldItemId });
        updateEquipped(equippedItem);
        addToast("success", `${equippedItem.name} has been equipped!`);
      } catch (error) {
        addToast("error", `${error.status}: ${error.message}`);
        return debugErrors(error, user);
      }
    }
  }

  // Determines which items are equipped for each item type
  function _setEquippedItems(equipment: InventoryCategories) {
    // // LOOP through each type of equipment
    for (let equipType in equipment) {
      // Find the item that's equipped for that specific equipment type
      const equippedItem: Item | null = equipment[equipType].find((item: Item) => item.equipped === true);

      console.log("EQQITEM", equippedItem);
      if (equippedItem) {
        try {
          updateEquipped(equippedItem);
        } catch (error) {
          console.log("THE ERR", error);
        }
      }
    }
  }

  // ONE-TIME - Homepage makes a fresh inventory request
  useEffect(() => {
    // Only fetch Inventory if the makeInventoryRequest parameter was passed (true) - happens from home page
    // I could alternatively fetch inventory as part of the initial app data, but this seems fine and will help spread out the data-fetching burden
    if (makeInventoryRequest) {
      try {
        (async () => {
          const inventory = await fetchAvatarInventory({ avatarID: hero.id });
          dispatch({ type: "UPDATE INVENTORY", payload: { inventory } });
        })();
      } catch (error) {
        debugErrors(error, user);
        addToast("error", `${error.status}: ${error.message}`);
      }
    }
  }, [makeInventoryRequest]);

  /*---------------*/

  // Any time an inventory type updates in global state, update the local state of the useInventory hook
  // The Inventory Component will read from this state

  // PETS
  useEffect(() => {
    setPets(inventory.pets);
    // Sets Hero's inventory
    _setEquippedItems(inventory);
  }, [inventory.pets.length]);

  // COSTUMES
  useEffect(() => {
    setCostumes(inventory.costumes);
    // Sets Hero's inventory
    _setEquippedItems(inventory);
  }, [inventory.costumes.length]);

  // TITLES
  useEffect(() => {
    setTitles(inventory.titles);
    // Sets Hero's inventory
    _setEquippedItems(inventory);
  }, [inventory.titles.length]);

  // CONSUMABLES
  useEffect(() => {
    setConsumables(inventory.consumables);
    // Sets Hero's inventory
    _setEquippedItems(inventory);
  }, [inventory.consumables.length]);

  // CODEX
  useEffect(() => {
    setCodex(inventory.codex);
    // Sets Hero's inventory
    _setEquippedItems(inventory);
  }, [inventory.codex.length]);

  /*---------------*/

  // Any time an equipped item changes, update the global hero state
  useEffect(() => {
    dispatch({ type: "SET HERO", payload: { hero: { ...hero, equipped: [equippedPet, equippedCostume, equippedTitle] } } });
  }, [equippedPet, equippedCostume, equippedTitle]);

  return {
    // All Owned Items
    consumables,
    pets,
    costumes,
    titles,
    codex,
    // Equipped Items
    equippedPet,
    equippedCostume,
    equippedTitle,
    // Updater Methods
    equip,
    unequip,
    equipUnequip,
    buy,
    consume,
  };
}
