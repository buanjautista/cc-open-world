import { defineGUIPlease } from './src/gui-workaround.js';
import { assignSteps } from './src/custom-steps.js'
import { enableHubLaterQuests } from './src/show-quest-hub.js'
let mod 
let mwOptionList = []
let lastOptionList;
const DEFAULT_OPTIONS = {
  "shadeLock": { state: false, type: "none" }, 
  "vtSkip": { state: false },
  "openFajro": { state: false },
  "meteorVW": { state: false },
  "extraBarriers": { state: false },
  "closedGaia": { state: false, type: "none"  },
  "dlcActive": { state: false },
  "randomizedShades": { enable: false, shades: {
    "fall": "flame", "valley": "ice", "jungle": "seed", "ridge": "star", "trail": "leaf", "kajo1": "bolt", "kajo2": "drop" 
  }}
}
let randoOptionList;

const MENU_OW_CUSTOM = {
  QUEST_HUB: 700,
};

export default class OpenWorld {
  async main(){
    mod = activeMods.find(e => e.name == "open-world")
    let multiRandoActive = activeMods.find(e => e.name == "mw-rando")
    randoOptionList = DEFAULT_OPTIONS;

      sc.OPTIONS_DEFINITION["openworld-visitedMaps"] = {
        type: "CHECKBOX",
        init: false,
        cat: sc.OPTION_CATEGORY.GENERAL,
        hasDivider: true,
        header: "cc-open-world",
      };
      sc.OPTIONS_DEFINITION["openworld-disabledTips"] = {
        type: "CHECKBOX",
        init: false,
        cat: sc.OPTION_CATEGORY.GENERAL,
        hasDivider: false,
        header: "cc-open-world",
      };
      sc.OPTIONS_DEFINITION["openworld-fullQuestHub"] = {
        type: "CHECKBOX",
        init: false,
        cat: sc.OPTION_CATEGORY.GENERAL,
        hasDivider: false,
        header: "cc-open-world",
      };

      if (multiRandoActive) {
      // Adds a check to start extra patching on multiworld connection
        sc.Model.addObserver(sc.multiworld, this)
      }
    setTimeout(defineGUIPlease,"1000");
  }
  prestart() {
    assignSteps();
    enableHubLaterQuests(MENU_OW_CUSTOM.QUEST_HUB);
  }

  // *********** //
  /* CC-MWR patching */
  // *********** //
  modelChanged(model, msg, data) {
    if (model == sc.multiworld) {
      // Read multiworld connection to check settings variables, to apply optional map patches
      // Might reapply patches several times depending on possible reconnections
      if ((msg == sc.MULTIWORLD_MSG.CONNECTION_STATUS_CHANGED && data == "Connected") || (msg == sc.MULTIWORLD_MSG.OPTIONS_PRESENT)) {
        mwOptionList = [
          ig.vars.get("mw.options.vtShadeLock"), 
          ig.vars.get("mw.options.vtSkip"), 
          ig.vars.get("mw.options.openFajro"), 
          ig.vars.get("mw.options.meteorPassage"),
          ig.vars.get("mw.options.extraBarriers"),
          ig.vars.get("mw.options.closedGaia"),
          ig.vars.get("mw.options.dlcActive")]
        addMWPatches(mwOptionList)
      }
    }
  }
}


// Definition for Extra Patches
const R_SHADELOCK = 0 // Shade barrier for vermillion tower
const R_VTSKIP = 1 // Skip all Vermillion Tower after first fight
const R_OPENFAJRO = 2 // Non-linear Upper Fajro
const R_METEORVW = 3 // Vermillion Wasteland locked behind Meteor Shade
const R_EXTRABARRIER = 4; // Extra barriers and shade-accesible teleport in CrossCentral
const R_CLOSEDGAIA = 5; // Extra barriers in Gaia's Garden
const R_DLCACTIVE = 6; // DLC Features


// Multiworld Patching
export function addMWPatches(optionList) {

  if (optionList){ // Checks for MW extra patch list
    if (lastOptionList != optionList) {
      mod.runtimeAssets = {}
    }
    for (let x = 0; x < optionList.length; x++) {
      // Convert vars from mw.options into the open-world vars 
      optionList[x] 
        ? randoOptionList[Object.keys(randoOptionList)[x]].state = optionList[x] 
        : randoOptionList[Object.keys(randoOptionList)[x]].state = false
      handlePatching(Object.values(randoOptionList)[x].state, x)
    }
    localStorage.setItem("open-world-settings", JSON.stringify(randoOptionList))
    lastOptionList = optionList;
    return true;
  }
}

function handlePatching(patchstate, patchname) {
  // console.log("patching: ", Object.keys(DEFAULT_OPTIONS)[patchname], patchstate)
  if (patchstate) { // Adds patches
    switch(patchname) {
      case R_SHADELOCK:
        mod.addPatch('data/maps/arid/town-1.json', mod.baseDirectory + 'assets/data/maps/arid/town-1.json.patch');
        if (patchstate > 0) { 
          ig.vars.set("open-world.shadeLock", patchstate);
          ig.vars.set("open-world.towerLock", 1);
          mod.addPatch('data/maps/arid/town-1.json', mod.baseDirectory + 'extra-patches/locked-tower/shadebosslock-vt.json.patch');
        }
        else { ig.vars.set("open-world.towerLock", 0); }
        break;
      case R_VTSKIP:
        ig.vars.set("open-world.towerSkip", patchstate);
        mod.addPatch('data/maps/arid-dng/second/f0/center.json', mod.baseDirectory + 'extra-patches/tower-skip/centerf0.json.patch');
        break;
      case R_OPENFAJRO:
        ig.vars.set("open-world.openFajro", patchstate);
        mod.addPatch('data/maps/heat-dng/f3/room-01-cross.json', mod.baseDirectory + 'extra-patches/open-fajro/f3/room-01-cross.json.patch');
        mod.addPatch('data/maps/heat-dng/f3/room-02.json', mod.baseDirectory + 'extra-patches/open-fajro/f3/room-02.json.patch');
        mod.addPatch('data/maps/heat-dng/f3/room-06.json', mod.baseDirectory + 'extra-patches/open-fajro/f3/room-06.json.patch');
        mod.addPatch('data/maps/heat-dng/f3/room-07.json', mod.baseDirectory + 'extra-patches/open-fajro/f3/room-07.json.patch');
        mod.addPatch('data/maps/heat-dng/f4/corridor-east.json', mod.baseDirectory + 'extra-patches/open-fajro/f4/corridor-east.json.patch');
        mod.addPatch('data/maps/heat-dng/f4/room-01.json', mod.baseDirectory + 'extra-patches/open-fajro/f4/room-01.json.patch');
        mod.addPatch('data/maps/heat-dng/f4/room-03.json', mod.baseDirectory + 'extra-patches/open-fajro/f4/room-03.json.patch');
        mod.addPatch('data/maps/heat-dng/f4/room-10.json', mod.baseDirectory + 'extra-patches/open-fajro/f4/room-10.json.patch');
        break;
      case R_METEORVW:
        ig.vars.set("open-world.meteorPassage", patchstate);
        mod.addPatch('data/maps/forest/path-10-hidden.json', mod.baseDirectory + 'assets/data/maps/forest/path-10-hidden.json.patch');
        mod.addPatch('data/maps/forest/path-10-hidden.json', mod.baseDirectory + 'extra-patches/meteor-vw/passage-barrier.json.patch');
        break;
      case R_EXTRABARRIER:
        ig.vars.set("open-world.extraBarriers", patchstate);
        break;
      case R_CLOSEDGAIA:
        ig.vars.set("open-world.closedGaia", patchstate);
        break;
      case R_DLCACTIVE:
        ig.vars.set("open-world.dlcActive", patchstate);
        break;
      } 
  }
}