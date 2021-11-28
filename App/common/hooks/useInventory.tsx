import React, { useState, useEffect, useContext } from "react";
import { buyItemByAvatarId, consumeItemRequest, equipItem, equipUnequipItem, fetchAvatarInventory, unequipItem } from "../../api/inventory";
import debugErrors from "../debugErrors";
import { convertAorAn } from "../helperFunctions";
import useGlobalToast from "./useGlobalToast";
import { BattleInstantItem, Hero, Item, ServerInventoryCategories, ServerItemType } from "../types";
import { GlobalStateContext } from "../../store";

interface EquippedItems {
  equippedPet: Item | null;
  equippedSkin: Item | null;
  equippedTitle: Item | null;
}

interface UpdaterMethods {
  buy: (item: Item, hero: Hero) => void;
  consume: (item: Item, heroObj: Hero) => Promise<{ isBattleInstantItem: boolean }>;
  equip: (newItem: Item, hero: Hero) => void;
  unequip: (oldItem: Item, hero: Hero) => void;
  equipUnequip: (newItem: Item, oldItemId: number, hero: Hero) => void;
}

export default function useInventory(makeInventoryRequest?: boolean): ServerInventoryCategories & EquippedItems & UpdaterMethods {
  const { addToast } = useGlobalToast();
  const { state, dispatch } = useContext(GlobalStateContext);
  const { hero, user, inventory, equipped } = state;

  const [consumables, setConsumables] = useState<Item[]>([]);
  const [pets, setPets] = useState<Item[]>([]);
  const [skins, setSkins] = useState<Item[]>([]);
  const [titles, setTitles] = useState<Item[]>([]);
  const [codices, setCodices] = useState<Item[]>([]);
  const [equippedPet, setEquippedPet] = useState<Item>(null);
  const [equippedSkin, setEquippedSkin] = useState<Item>(null);
  const [equippedTitle, setEquippedTitle] = useState<Item>(null);

  function _updateInventoryCategoriesByItemType(itemCategory: Item[], type: ServerItemType) {
    switch (type) {
      case "consumable":
        setConsumables(itemCategory);
      case "pet":
        setPets(itemCategory);
      case "skin":
        setSkins(itemCategory);
      case "title":
        setTitles(itemCategory);
      case "codex":
        setCodices(itemCategory);
      default:
        throw new Error("No matching item type!");
    }
  }

  // BUY AN ITEM
  async function buy(item: Item, hero: Hero) {
    try {
      const { inventory, photonTokens } = await buyItemByAvatarId({ itemID: item.id, ptCost: item.ptCost, avatarID: hero.id });

      dispatch({ type: "UPDATE INVENTORY", payload: { inventory: { ...inventory } } });
      dispatch({ type: "SET HERO", payload: { hero: { ...hero, photonTokens } } });

      addToast("success", `Bought ${convertAorAn(item.name)} ${item.name}`);
    } catch (error) {
      error.message = `Unable to buy Item, Please try again later.`;
      addToast("error", `${error.status}: ${error.message}`);
      return debugErrors(error, user);
    }
  }

  // CONSUME A CONSUMABLE ITEM
  async function consume(item: Item, heroObj: Hero): Promise<{ isBattleInstantItem: boolean }> {
    try {
      if (heroObj.goToBattle) {
        throw new Error("Hero is already queued for a battle!");
      }
      const { consumables, avatar: hero } = await consumeItemRequest({ id: item.id, email: heroObj.owner, avatarID: heroObj.id, effects: item.effects });

      const updatedInventory = { ...inventory, consumables };
      const updatedHero: Hero = { ...heroObj, ...hero };
      dispatch({ type: "UPDATE INVENTORY", payload: { inventory: { ...updatedInventory } } });
      dispatch({ type: "SET HERO", payload: { hero: updatedHero } });
      addToast("success", `${heroObj.name} used ${convertAorAn(item.name)} ${item.name}.`);

      const battleInstantItems: BattleInstantItem[] = ["Storm Crow Bone Chimes", "Smoldering Skull Torch", "Petrified Power Totem", "Wave-Swept Battle Conch", "Plague Token", "Obsidian Mirror"];
      if (battleInstantItems.includes(item.name)) {
        return { isBattleInstantItem: true };
      } else {
        return { isBattleInstantItem: false };
      }
    } catch (error) {
      // Error handled one level up, so throw one more time
      throw error;
    }
  }

  // EQUIPPING ITEM WHEN NO OTHER OF SAME TYPE IS EQUIPPED
  async function equip(newItem: Item, hero: Hero) {
    try {
      const { equippedItem } = await equipItem({ avatarId: hero.id, equipId: newItem.itemID });
      equippedItem.itemID = equippedItem.id;
      const updatedEquipped = equipped;
      updatedEquipped[newItem.type] = equippedItem;
      dispatch({ type: "UPDATE EQUIPPED", payload: { equipped: updatedEquipped } });
      addToast("success", `${equippedItem.name} Item has been equipped!`);
    } catch (error) {
      addToast("error", `${error.status}: ${error.message}`);
      return debugErrors(error, user);
    }
  }

  async function unequip(oldItem: Item, hero: Hero) {
    try {
      const { unequippedItem } = await unequipItem({ avatarId: hero.id, unequipId: oldItem.itemID });
      const updatedEquipped = equipped;
      updatedEquipped[oldItem.type] = null;
      dispatch({ type: "UPDATE EQUIPPED", payload: { equipped: updatedEquipped } });
      addToast("success", `${oldItem.name} has been unequipped!`);
    } catch (error) {
      addToast("error", `${error.status}: ${error.message}`);
      return debugErrors(error, user);
    }
  }

  async function equipUnequip(newItem: Item, oldItemId: number) {
    // If the clicked on item is not the same item
    // newItem needs to use "id", oldItemId is the itemID, but they mean the same thing in this case
    if (newItem.itemID !== oldItemId) {
      try {
        const { equippedItem } = await equipUnequipItem({ avatarId: hero.id, equipId: newItem.itemID, unequipId: oldItemId });
        // It gets confusing with the inventory, some items have itemID coming from the server, others not. this makes sure it will be set
        equippedItem.itemID = equippedItem.id;
        const updatedEquipped = equipped;
        updatedEquipped[newItem.type] = equippedItem;

        dispatch({ type: "UPDATE EQUIPPED", payload: { equipped: updatedEquipped } });
        //updateEquipped(equippedItem);
        addToast("success", `${equippedItem.name} has been equipped!`);
      } catch (error) {
        addToast("error", `${error.status}: ${error.message}`);
        return debugErrors(error, user);
      }
    }
  }

  function _determineEquippedItems(heroInventory: ServerInventoryCategories): { skin: Item | null; pet: Item | null; title: Item | null } {
    const skin = heroInventory.skins.find((item: Item) => item.equipped === true);
    const pet = heroInventory.pets.find((item: Item) => item.equipped === true);
    const title = heroInventory.titles.find((item: Item) => item.equipped === true);
    return { skin: skin ?? null, pet: pet ?? null, title: title ?? null };
  }

  // ONE-TIME - Homepage makes a fresh inventory request
  useEffect(() => {
    // Only fetch Inventory if the makeInventoryRequest parameter was passed (true) - happens from home page
    // I could alternatively fetch inventory as part of the initial app data, but this seems fine and will help spread out the data-fetching burden
    if (makeInventoryRequest) {
      try {
        (async () => {
          const inventory = await fetchAvatarInventory({ avatarID: hero.id });
          const equipped = _determineEquippedItems(inventory);

          dispatch({ type: "UPDATE INVENTORY", payload: { inventory } });
          dispatch({ type: "UPDATE EQUIPPED", payload: { equipped } });
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
  }, [inventory.pets]);

  // COSTUMES
  useEffect(() => {
    setSkins(inventory.skins);
  }, [inventory.skins]);

  // TITLES
  useEffect(() => {
    setTitles(inventory.titles);
  }, [inventory.titles]);

  // CONSUMABLES
  useEffect(() => {
    setConsumables(inventory.consumables);
  }, [inventory.consumables]);

  // CODEX
  useEffect(() => {
    setCodices(inventory.codices);
  }, [inventory.codices]);

  /*---------------*/

  // PETS
  useEffect(() => {
    // Sets Hero's inventory
    setEquippedPet(equipped.pet);
  }, [equipped.pet]);

  // COSTUMES
  useEffect(() => {
    setEquippedSkin(equipped.skin);
  }, [equipped.skin]);

  // TITLES
  useEffect(() => {
    setEquippedTitle(equipped.title);
  }, [equipped.title]);

  return {
    // All Owned Items
    consumables,
    pets,
    skins,
    titles,
    codices,
    // Equipped Items
    equippedPet,
    equippedSkin,
    equippedTitle,
    // Updater Methods
    equip,
    unequip,
    equipUnequip,
    buy,
    consume,
  };
}
