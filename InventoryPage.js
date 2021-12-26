import React, { useState, useEffect } from "react";
// LIBRARIES
import PropTypes from "prop-types";
// COMMON
import { Button } from '@material-ui/core';
import { lowercaseUnderscore, lowercaseDash, determineSkinType, determineSkinName, thousandsFormat, convertAorAn } from "../../common/helperFunctions";
import dynamicComponent from "../../common/dynamicComponent";
import { debugErrors } from "../../common/errorHandler";
// SERVICES
import { fetchAvatarInventory, equipItem, equipUnequipItem, unequipItem, buyItemByAvatarId, consumeItemRequest } from "../../services/inventoryService";
// COMPONENTS
import Header from "../Header/Header";
import BorderArrow from "./BorderArror";
import ItemDetail from "../Dialog/Modals/ItemDetail";
import ShopItems from "./modals/ShopItems";
import { GiPayMoney } from 'react-icons/gi';
// STYLES
import "./InventoryPage.scss";
import ITEMS from "../../common/includedItemImages";
import HEROES from "../../common/includedHeroImages";
import PhotonToken from '../../assets/images/misc/photon_stack.webp';

const InventoryPage = function ({ avatar, updateState, MainMenuButton, admin, defaultItems }) {
  const [activeSkin, setActiveSkin] = useState(null);
  const [activeTitle, setActiveTitle] = useState(null);
  const [activePet, setActivePet] = useState(null);
  const [activeCodex, setActiveCodex] = useState(null);
  const [titles, setTitles] = useState([]);
  const [pets, setPets] = useState([]);
  const [skins, setSkins] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [codices, setCodices] = useState([]);
  const [activeSkinClassName, setActiveSkinClassName] = useState('skin-base');
  const [activeSkinVisibleName, setActiveSkinVisibleName] = useState('Default');
  // Item Detail Modal
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [itemDetailPrimaryButton, setItemDetailPrimaryButton] = useState("");
  const [enableUnequipButton, setEnableUnequipButton] = useState(false);
  // Shop Items Modal
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [itemTypeForSale, setItemTypeForSale] = useState(null);

  const skinPrefixes = ['Shadow', 'Ascended', 'Fire Brand', 'Earth Shaker', 'Tide Caller', 'Gale Force', 'Apparition', 'Banshee', 'Wraith', 'Phantom', 'Phantasm', 'Poltergeist', 'Specter', 'Shade'];

  function buyItem(item){
    buyItemByAvatarId({ itemID : item.id, ptCost : item.ptCost, avatarID : avatar.id })
    .then((data) =>{
      if(data.error){
        const error = data.error;
        error.message = `Unable to buy Item, Please try again later.`
        debugErrors(error, admin);
        return updateState({ alerts : [{ type : "error", message : `${error.status}: ${error.message}` }] });
      }
      const { consumables, skins, titles, codices } = data.inventory;
      setConsumables(consumables);
      setPets(consumables);
      setSkins(skins);
      setTitles(titles);
      setCodices(codices);

      updateState({ avatar : Object.assign({}, avatar, { photonTokens : data.photonTokens }), alerts : [{ type : "success", message : `${avatar.name} bought ${convertAorAn(item.name)} ${item.name}. ${item.name === 'Retrocausal Capsule' ? 'Be sure to reassign your Quantum Points!' : ''}` }] });
    });
    
  }

  function handleOpenShopModal(itemType){
    setItemTypeForSale(itemType);
    setShopModalOpen(true);
  }

  // On click of item, close open modal then load new item into item modal
  function handleItemClick(item){
    // Right now only used for Consumables
    setItemDetailPrimaryButton('');
    switch(item.type){
      case 'skin':
        if(activeSkin?.name === item.name){
          setEnableUnequipButton(true);
        }else { setEnableUnequipButton(false); }
        break;
      case 'pet':
        if(activePet?.name === item.name){
          setEnableUnequipButton(true);
        }else { setEnableUnequipButton(false); }
        break;
      case 'title':
        if(activeTitle?.name === item.name){
          setEnableUnequipButton(true);
        }else { setEnableUnequipButton(false); }
        break;
      default: 
      return null;
    }
    setActiveItem(item);
    setItemModalOpen(true);
  }

  function renderCodex() {
    if (codices.length) {
      return codices.sort((a,b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0).map((c, i) => {
        return (
          <div key={i} className={`row-item row-item-consumable`} onClick={() => codexSelect(c)}>
            <div className="row-item-content-container">
              {dynamicComponent({ type: c.type, name: c.name, style: { fontSize: "70px"}, cssClass: c.class })}
              <div className="svg-arrow-border">
                <BorderArrow />
                <BorderArrow />
                <BorderArrow />
                <BorderArrow />
              </div>
              {
                c.count ? <div className="count-container"><strong>{ c.count }</strong></div> : null
              }
            </div>
            <div className="row-item-title">
              <strong>{c.name}</strong>
            </div>
        </div>
        );
      });
    }
    return null;
  }
 
 const useBase = determineSkinType(avatar.equipped.find(item => item.type === 'skin'));
 function renderTitles() {
  let titleElms;
  if (titles.length) {
   titleElms = titles.sort((a,b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0).map((title, i) => {
    //console.log('TTT - ', title);
    return (
     <div
      key={i}
      className={`row-item row-item-title ${activeTitle && activeTitle.itemID === title.itemID ? "active" : ""}`}
      onClick={() => handleItemClick(title)}>
      <div className="row-item-content-container">
       {dynamicComponent({ type: title.type, name: title.name, style: { fontSize: "70px", color: "#356735" }, cssClass: title.class })}
       <div className="svg-arrow-border">
        <BorderArrow />
        <BorderArrow />
        <BorderArrow />
        <BorderArrow />
       </div>
      </div>
      <div className="row-item-title">
       <strong>{title.name}</strong>
      </div>
     </div>
    );
   });
   titleElms.push(
    <div key="-1" className={`row-item row-item-pet ${activeTitle === null ? "active" : ""}`} onClick={() => inventoryToggle(null, "title")}>
     <div className="row-item-content-container">
      <div className="none-square">NONE</div>
      <div className="svg-arrow-border">
       <BorderArrow />
       <BorderArrow />
       <BorderArrow />
       <BorderArrow />
      </div>
     </div>
     <div className="row-item-title">
      <strong>No Title</strong>
     </div>
    </div>
   );
   return titleElms;
  }
  return <div className="none-of-type">No Titles</div>;
 }

 function renderPets() {
  let petElms;
  if (pets.length) {
   petElms = pets.sort((a,b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0).map((pet, i) => {
    return (
     <div key={i} className={`row-item row-item-pet ${activePet && activePet.itemID === pet.itemID ? "active" : ""}`} onClick={() => handleItemClick(pet)}>
      <div className="row-item-content-container">
       <img src={`${ITEMS.pets[lowercaseUnderscore(pet.name)]}`} alt={`pet-${i}`} />
       <div className="svg-arrow-border">
        <BorderArrow />
        <BorderArrow />
        <BorderArrow />
        <BorderArrow />
       </div>
      </div>
      <div className="row-item-title">
       <strong>{pet.name}</strong>
      </div>
     </div>
    );
   });
   petElms.push(
    <div key="-1" className={`row-item row-item-pet ${activePet === null ? "active" : ""}`} onClick={() => inventoryToggle(null, "pet")}>
     <div className="row-item-content-container">
      <div className="none-square">NONE</div>
      <div className="svg-arrow-border">
       <BorderArrow />
       <BorderArrow />
       <BorderArrow />
       <BorderArrow />
      </div>
     </div>
     <div className="row-item-title">
      <strong>No Pet</strong>
     </div>
    </div>
   );
   
   return petElms;
  }
  return <div className="none-of-type">No Pets</div>;
 }

  function renderConsumables() {
    if (consumables.length) {
      return consumables.sort((a,b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0).map((consumable, i) => {
        return (
          <div key={i} className={`row-item row-item-consumable`} onClick={() => consumableSelect(consumable)}>
            <div className="row-item-content-container">
              {dynamicComponent({ type: consumable.type, name: consumable.name, style: { fontSize: "70px", color: "#356735" }, cssClass: consumable.class })}
              <div className="svg-arrow-border">
                <BorderArrow />
                <BorderArrow />
                <BorderArrow />
                <BorderArrow />
              </div>
              {
                consumable.count ? <div className="count-container"><strong>{ consumable.count }</strong></div> : null
              }
            </div>
            <div className="row-item-title">
              <strong>{consumable.name}</strong>
            </div>
        </div>
        );
      });
    }
    return <div className="none-of-type"><span className="light-link-text" onClick={() => handleOpenShopModal('consumable')}>Buy More Items</span></div>;
  }

 function renderSkins() {
  let skinElms;
  skinElms = skins.sort((a,b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0).map((skin, i) => {
    let matchingPrefix;
    skinPrefixes.forEach((s) => {
      const isMatch = skin.name.includes(s);
      if(isMatch){
        matchingPrefix =  s;
      }
    });

    const skinName = matchingPrefix ? `${matchingPrefix} ${avatar.name}` : skin.name;
    const skinPrefix = skin.name.split(' ')[0];

   return (
    <div key={i} className={`row-item row-item-skin ${activeSkin && activeSkin.itemID === skin.itemID ? "active" : ""}`} onClick={() => handleItemClick(skin)}>
     <div className="row-item-content-container">
     <img className={`skin-${lowercaseDash(skinPrefix)} skin-${lowercaseDash(skin.name)}`} src={HEROES[determineSkinType(skin)][`${determineSkinName(skin, avatar.character)}`]} alt="Base Avatar" />
      <div className="svg-arrow-border">
       <BorderArrow />
       <BorderArrow />
       <BorderArrow />
       <BorderArrow />
      </div>
     </div>
     <div className="row-item-title">
      <strong>{ skinName }</strong>
     </div>
    </div>
   );
  });
  skinElms.push(
   <div key="-1" className={`row-item row-item-pet ${activeSkin === null ? "active" : ""}`} onClick={() => inventoryToggle(null, "skin")}>
    <div className="row-item-content-container">
     <img src={HEROES.base[`${lowercaseUnderscore(avatar.character)}`]} alt="Base Avatar" />
     <div className="svg-arrow-border">
      <BorderArrow />
      <BorderArrow />
      <BorderArrow />
      <BorderArrow />
     </div>
    </div>
    <div className="row-item-title">
     <strong>No Costume</strong>
    </div>
   </div>
  );
  return skinElms;
 }

 function consumableSelect(consumable){
  setActiveItem(consumable);
  setEnableUnequipButton(false);
  setItemDetailPrimaryButton('Use Now');
  setItemModalOpen(true);
 }

 function codexSelect(codex){
  setActiveItem(codex);
  setEnableUnequipButton(false);
  setItemDetailPrimaryButton('OK');
  setItemModalOpen(true);
 }

 function inventoryToggle(newItem, newItemType) {
  // new item can contain a value, as well as the type
  // new item can be null, and the type can be a value

  let oldItem;
  let updateFunc;
  if (newItemType === "pet") {
   oldItem = activePet;
   updateFunc = setActivePet;
  } else if (newItemType === "skin") {

   oldItem = activeSkin;
   updateFunc = setActiveSkin;
  } else if (newItemType === "title") {
   oldItem = activeTitle;
   updateFunc = setActiveTitle;
  }

  // If an item is selected and an old item was previously selected
  if (newItem && oldItem) {
   _equipUnequipItems(newItem, oldItem.itemID, updateFunc);
   // If an item is selected and an old item was null
  } else if (newItem && !oldItem) {
   //console.log('2 - only equip');
   _equipItem(newItem, updateFunc);
   // If 'none' is selected and an item was unselected
  } else if (!newItem && oldItem) {
   //console.log('3 - only unequip');
   // If newly clicked item is null, then the user selected "no item"... just unequip the old item;
   _unequipItem(oldItem, updateFunc);
   
   // none was selected and user clicked again on 'none'.
  } else {
   //console.log('4 - nothing');
   return;
  }
 }

 function consumeItem(item){
  consumeItemRequest({ id : item.id, email: avatar.owner, avatarID : avatar.id, effects : item.effects })
  .then((data) =>{
    if(data.error){
      const error = data.error;
      debugErrors(error, admin);
      return updateState({ alerts : [{ type : "error", message : `${error.status}: ${error.message}` }] });
    }
    
    setConsumables(data.consumables);
    updateState({ avatar : Object.assign({}, avatar, data.avatar), alerts : [{ type : "success", message : `${avatar.name} used ${convertAorAn(item.name)} ${item.name}. ${item.name === 'Retrocausal Capsule' ? 'Be sure to reassign your Quantum Points!' : ''}` }] });
  });
 }

 function _equipUnequipItems(newItem, oldItemId, updateFunc) {

  // If the clicked on item is not the same item
  if (newItem.itemID !== oldItemId) {
   //console.log('1 - toggle');
   // Update the selected and deselcted items in the database
 
    return equipUnequipItem({ avatarId : avatar.id, equipId: newItem.itemID, unequipId: oldItemId })
    .then((data) => {
      if(data.error){
        const error = data.error;
        debugErrors(error, admin);
        return updateState({ alerts : [{ type : "error", message : `${error.status}: ${error.message}` }] });
      }

      const { unequippedItem, equippedItem } = data;
      updateFunc(newItem);
      // Update equipped array for root avatar
      const avEquipped = [...avatar.equipped];
      const indexOfRemoved = avEquipped.findIndex((item)=> item.itemID === unequippedItem.itemID);
      avEquipped.splice(indexOfRemoved,1,equippedItem);
      const updatedAv = Object.assign({}, avatar, { equipped : avEquipped });
      updateState({
        avatar : updatedAv,
        alerts: [{ type: "success", message: "Item has been equipped!"}]
      });
    });
  } else {
   //console.log('4 - nothing2');
  }
 }

 function _equipItem(newItem, updateFunc) {
   return equipItem({ avatarId : avatar.id, equipId: newItem.itemID })
   .then((data) => {
    if(data.error){
      const error = data.error;
      debugErrors(error, admin);
      return updateState({ alerts : [{ type : "error", message : `${error.status}: ${error.message}` }] });
    }
    const equippedItem = data.equippedItem;
    updateFunc(newItem);
    // Update equipped array for root avatar
    const avEquipped = [...avatar.equipped];
    avEquipped.push(equippedItem);
    const updatedAv = Object.assign({}, avatar, { equipped : avEquipped });
    //console.log('EE-', avEquipped, updatedAv);
    updateState({ avatar : updatedAv, alerts: [{ type: "success", message: "Item has been equipped!" }]});
   });
 }

 function _unequipItem(oldItem, updateFunc) {

  return unequipItem({ avatarId : avatar.id, unequipId: oldItem.itemID })
  .then((data) => {
    if(data.error){
      const error = data.error;
      debugErrors(error, admin);
      return updateState({ alerts : [{ type : "error", message : `${error.status}: ${error.message}` }] });
    }
    const { unequippedItem } = data;
    updateFunc(null);
    // Update equipped array for root avatar
    const avEquipped = [...avatar.equipped];
    const indexOfRemoved = avEquipped.findIndex((item)=> item.itemID === unequippedItem.itemID);
    avEquipped.splice(indexOfRemoved, 1);
    const updatedAv = Object.assign({}, avatar, { equipped : avEquipped });
    updateState({ avatar : updatedAv, alerts: [{ type: "success", message: "No item equipped!" }] });
    if(oldItem.type === 'skin'){
      setActiveSkinClassName('skin-base');
      setActiveSkinVisibleName(`Default`);
    }
  });
 }


 useEffect(() => {

   fetchAvatarInventory({ avatarID: avatar.id })
  .then((data) => {
    if(data.error){
      const error = data.error;
      debugErrors(error, admin);
      return updateState({ alerts : [{ type : "error", message : `${error.status}: ${error.message}` }] });
    }

    const equipment = data;
      setPets(equipment.pets);
      setSkins(equipment.skins);
      setTitles(equipment.titles);
      setConsumables(equipment.consumables);
      setCodices(equipment.codices);
    //console.log('EQ - ', equipment);

   // LOOP through each type of equipment
   for (let equipType in equipment) {
    // Find the item tht's equipped for that specific equipment type
    const equippedThing = equipment[equipType].find((thing) => {
     return thing.equipped === true;
    });

    // If the equipment is equipped
    if (equippedThing) {
     //console.log("ET! - ", equippedThing);
     // Set the correct state depending on the equipment type
     if (equippedThing.type === "pet") {
      setActivePet(equippedThing);
     } else if (equippedThing.type === "skin") {
      setActiveSkin(equippedThing);
      const skinName = equippedThing.name;
      const skinPrefix = skinName.split(' ')[0];

      setActiveSkinClassName('skin-' + lowercaseDash(skinPrefix));
      setActiveSkinVisibleName(`${skinPrefix} ${avatar.name}`);

     } else if (equippedThing.type === "title") {
      setActiveTitle(equippedThing);
     }
    }
   }
   //console.log('AE - ', avatar.equipped);
  });
 }, [avatar, admin]);

 return (
  <section id="InventoryPage">
   <Header title={`Inventory`} subtitle={`Tap Inventory Items to Equip`} MainMenuButton={MainMenuButton} />
   <div>
    <div id="equippedSection">
     <h2 className="section-title">Equipped</h2>
     <div>
      <div id="primary">
       <div className="primary-equipped equipped-title">
        <strong>Costume</strong>
        <span>{ activeSkinVisibleName }</span>
       </div>
       <div id="equippedCostume" className={"square"} onClick={() => activeSkin ? handleItemClick(activeSkin) : null}>
        {activeSkin ? <img className={`${activeSkinClassName}`} src={HEROES[determineSkinType(avatar.equipped.find(item => item.type === 'skin'))][`${useBase === 'base' ? lowercaseUnderscore(avatar.character) : determineSkinName(activeSkin, avatar.character)}`]} alt={`${activeSkin.name} Skin`} /> : <img className="skin-base" src={HEROES.base[`${lowercaseUnderscore(avatar.character)}`]} alt="Base Skin" /> }
        <div className="svg-arrow-border">
         <BorderArrow />
         <BorderArrow />
         <BorderArrow />
         <BorderArrow />
        </div>
       </div>
      </div>
      <div id="secondary">
       <div id="equippedTitle" className=" equipped-title secondary-equipped" onClick={() => activeTitle ? handleItemClick(activeTitle) : null}>
        <strong>Title</strong>
        <span>{activeTitle ? activeTitle.name : ""}</span>
        <div className="secondary-content-container">
         {activeTitle
          ? dynamicComponent({
             type: activeTitle.type,
             name: activeTitle.name,
             style: {
              fontSize: "150px",
              color: "#e8eddf",
             },
            })
          : null}
         <div className="svg-arrow-border">
          <BorderArrow />
          <BorderArrow />
          <BorderArrow />
          <BorderArrow />
         </div>
        </div>
       </div>
       <div id="equippedPet" className=" equipped-title secondary-equipped"  onClick={() => activePet ? handleItemClick(activePet) : null}>
        <strong>Pet</strong>
        <span>{activePet ? activePet.name : ""}</span>
        <div className="secondary-content-container">
         {activePet ? <img src={ITEMS.pets[`${lowercaseUnderscore(activePet.name)}`]} alt="equipped pet" /> : null}

         <div className="svg-arrow-border">
          <BorderArrow />
          <BorderArrow />
          <BorderArrow />
          <BorderArrow />
         </div>
        </div>
       </div>
       {/* <div className="equipped-title secondary-equipped">
                <strong>First</strong>
                <span>Subtitle</span>
                <div className="secondary-content-container">
                  <div className="svg-arrow-border">
                    <BorderArrow />
                    <BorderArrow />
                    <BorderArrow />
                    <BorderArrow />
                  </div>
                </div>
              </div> */}
       {/* <div className="equipped-title secondary-equipped">
                <strong>Second</strong>
                <span>Subtitle</span>
                <div className="secondary-content-container">
                  <div className="svg-arrow-border">
                    <BorderArrow />
                    <BorderArrow />
                    <BorderArrow />
                    <BorderArrow />
                  </div>
                </div>
              </div> */}
      </div>
     </div>
    </div>
    <div id="inventorySection">
     <h2 className="section-title">Inventory <span className="pt-count">{ thousandsFormat(avatar.photonTokens) } <img src={PhotonToken} alt="Photon Tokens" /></span></h2>
     <div id="consumablesSubsection" className="subsection">
      <h3 className="subsection-title">Consumables <span className="shop-link light-link-text" onClick={() => handleOpenShopModal('consumable')}><GiPayMoney /> BUY</span></h3>
      <div className="subsection-content-container">{renderConsumables()}</div>
     </div>
     {
       codices.length ? 
        <div id="consumablesSubsection" className="subsection">
        <h3 className="subsection-title">Codex</h3>
        <div className="subsection-content-container">{renderCodex()}</div>
        </div>
        : null
     }

     <div id="costumesSubsection" className="subsection">
      <h3 className="subsection-title">Costumes</h3>
      <div className="subsection-content-container">{renderSkins()}</div>
     </div>
     <div id="petsSection" className="subsection">
      <h3 className="subsection-title">Pets <span className="shop-link light-link-text" onClick={() => handleOpenShopModal('pet')}><GiPayMoney /> BUY</span></h3>
      <div className={`subsection-content-container ${!pets.length ? "muted" : ""}`}>{renderPets()}</div>
     </div>
     <div id="titlesSection" className="subsection">
      <h3 className="subsection-title">Titles</h3>
      <div className={`subsection-content-container ${!titles.length ? "muted" : ""}`}>{renderTitles()}</div>
     </div>
    </div>
   </div>

    {
      activeItem ? 
        <ItemDetail modalOpen={itemModalOpen} setModalOpen={setItemModalOpen} item={activeItem} avatar={avatar} inventoryToggle={inventoryToggle} consumeItem={consumeItem} unequip={enableUnequipButton} itemDetailPrimaryButton={itemDetailPrimaryButton}  />
      : null
    }
    <ShopItems modalOpen={shopModalOpen} setModalOpen={setShopModalOpen} avatar={avatar}   buyItem={buyItem} itemType={itemTypeForSale}  />
  </section>
 );
};

export default InventoryPage;

InventoryPage.propTypes = {
  avatar: PropTypes.shape({
    character: PropTypes.string.isRequired,
    air: PropTypes.number.isRequired,
    earth: PropTypes.number.isRequired,
    water: PropTypes.number.isRequired,
    fire: PropTypes.number.isRequired,
    health: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    power: PropTypes.number.isRequired,
    equipped: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  updateState: PropTypes.func.isRequired,
  admin : PropTypes.object.isRequired,
  defaultItems : PropTypes.array.isRequired,
};
