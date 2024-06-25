import { defineGUIPlease } from './src/gui-workaround.js';
// import { addMWPatches, addIRPatches  } from './src/patch-handling.js'
import { assignSteps } from './src/custom-steps.js'
let mod 
let mwOptionList = []
let randoOptionList = {
  "shadeLock": { enable: false, type: "none" }, 
  "vtSkip": { enable: false },
  "openFajro": { enable: false },
  "meteorVW": { enable: false },
  "extraBarriers": { enable: false },
  "randomizedShades": { enable: false, shades: {
    "fall": "flame", "valley": "ice", "jungle": "seed", "ridge": "star", "trail": "leaf", "kajo1": "bolt", "kajo2": "drop" 
  }}
}
// Item Rando patching
const SBL_TYPE = { "none": 0, "all": 1, "shades": 2, "bosses": 3 }
const RSH_ITEM = { "leaf":145, "ice":225, "flame":230, "seed":376, "star": 410, "meteor":434, "bolt":286, "drop": 231, "ancient": 627 }

export default class OpenWorld {
  async main(){
    mod = activeMods.find(e => e.name == "open-world")
    let itemRandoActive = activeMods.find(e => e.name == "item-rando")
    let multiRandoActive = activeMods.find(e => e.name == "mw-rando")

    try {
      localStorage.getItem("open-world-settings") && (randoOptionList = JSON.parse(localStorage.getItem("open-world-settings")))
    }
    catch(e){
      console.log('invalid settings')
    }
    // Check if either CCItemRando or CCMultiworldRandomizer is active, and add stuff accordingly
    if (itemRandoActive){
      if (RANDOMIZER_OPTIONS && RANDOMIZER_SETS) {
        RANDOMIZER_SETS['open-world'] = { type: "MULTI", order: 2E3 };
        RANDOMIZER_SETS['open-world-sblock'] = { type: "MULTI", order: 2E3 };

        RANDOMIZER_OPTIONS['vt-skip'] = {
          set: "open-world",
          cost: 0,
          getter: () => {
            var _a, _b;
            return (_b = (_a = randoOptionList.vtSkip) == null ? void 0 : _a.enable) != null ? _b : true;
          },
          setter: (value) => {
            var _a;
            (_a = randoOptionList.vtSkip) != null ? _a : randoOptionList.vtSkip = { enable: true };
            randoOptionList.vtSkip.enable = value;
            addIRPatches(randoOptionList)
          }
        };
        RANDOMIZER_OPTIONS['open-fajro'] = {
          set: "open-world",
          cost: 0,
          getter: () => {
            var _a, _b;
            return (_b = (_a = randoOptionList.openFajro) == null ? void 0 : _a.enable) != null ? _b : true;
          },
          setter: (value) => {
            var _a;
            (_a = randoOptionList.openFajro) != null ? _a : randoOptionList.openFajro = { enable: true };
            randoOptionList.openFajro.enable = value;
            addIRPatches(randoOptionList)
          }
        };
        RANDOMIZER_OPTIONS['meteor-vw'] = {
          set: "open-world",
          cost: 0,
          getter: () => {
            var _a, _b;
            return (_b = (_a = randoOptionList.meteorVW) == null ? void 0 : _a.enable) != null ? _b : true;
          },
          setter: (value) => {
            var _a;
            (_a = randoOptionList.meteorVW) != null ? _a : randoOptionList.meteorVW = { enable: true };
            randoOptionList.meteorVW.enable = value;
            addIRPatches(randoOptionList)
          }
        };

        RANDOMIZER_OPTIONS['sblock-all'] = {
          set: "open-world-sblock",
          cost: 0,
          getter: () => {
            var _a, _b;
            return (_b = (_a = randoOptionList.shadeLock) == null ? void 0 : (_a.type == "all")) != null ? _b : (randoOptionList.shadeLock.type == "all");
          },
          setter: () => {
            randoOptionList.shadeLock.enable = true;
            randoOptionList.shadeLock.type = "all"
            addIRPatches(randoOptionList)
          }
        };
        RANDOMIZER_OPTIONS['sblock-boss'] = {
          set: "open-world-sblock",
          cost: 0,
          getter: () => {
            var _a, _b;
            return (_b = (_a = randoOptionList.shadeLock) == null ? void 0 : (_a.type == "bosses")) != null ? _b : (randoOptionList.shadeLock.type == "bosses");
          },
          setter: () => {
            randoOptionList.shadeLock.enable = true;
            randoOptionList.shadeLock.type = "bosses";
            addIRPatches(randoOptionList);
          }
        };
        RANDOMIZER_OPTIONS['sblock-shades'] = {
          set: "open-world-sblock",
          cost: 0,
          getter: () => {
            var _a, _b;
            return (_b = (_a = randoOptionList.shadeLock) == null ? void 0 : (_a.type == "shades")) != null ? _b : (randoOptionList.shadeLock.type == "shades");
          },
          setter: () => {
            randoOptionList.shadeLock.enable = true;
            randoOptionList.shadeLock.type = "shades";
            addIRPatches(randoOptionList);
          }
        };
        RANDOMIZER_OPTIONS['sblock-none'] = {
          set: "open-world-sblock",
          cost: 0,
          getter: () => {
            var _a, _b;
            return (_b = (_a = randoOptionList.shadeLock) == null ? void 0 : !_a.enable) != null ? _b : true;
          },
          setter: () => {
            randoOptionList.shadeLock.enable = false;
            randoOptionList.shadeLock.type = "none";
            addIRPatches(randoOptionList);
          }
        };
      }
      if (multiRandoActive) { console.log("CCOpenWorld will only work correctly with only one instance of either CCItemRandomizer or CCMultiworldRandomizer") }
      
      ig.Game.inject({
        teleport(mapName, marker, hint, clearCache, reloadCache) {
          if (hint == "LOAD") { addIRPatches(randoOptionList) }
          return this.parent(mapName, marker, hint, clearCache, reloadCache);
        },
      }
      );
    }

    else if (multiRandoActive) {
      // Adds a check to start extra patching on multiworld connection
      sc.Model.addObserver(sc.multiworld, this)
    }
    setTimeout(defineGUIPlease,"1000");
  }
  prestart() {
    assignSteps();

    sc.OPTIONS_DEFINITION["openworld-visitedmaps"] = {
      type: "CHECKBOX",
      init: false,
      cat: sc.OPTION_CATEGORY.GENERAL,
      hasDivider: true,
      header: "cc-open-world",
    };
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
          ig.vars.get("mw.options.extraBarriers")]
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

// Item rando patching
export function addIRPatches() {
  // Loop once through all the extra patch settings, and apply corresponding patches
  localStorage.setItem("open-world-settings", JSON.stringify(randoOptionList))
  for (let x = 0; x < Object.keys(randoOptionList).length; x++) { 
    handlePatching(Object.values(randoOptionList)[x].enable, x)
  }
}


// Multiworld Patching
export function addMWPatches(optionList) {
  if (optionList){ // Checks for MW extra patch list
    for (let x = 0; x < optionList.length; x++) {
      // Convert vars from mw.options into the general mod vars 
      optionList[x] ? randoOptionList[Object.keys(randoOptionList)[x]].enable = optionList[x] : randoOptionList[Object.keys(randoOptionList)[x]].enable = false
      handlePatching(Object.values(randoOptionList)[x].enable, x)
    }
    localStorage.setItem("open-world-settings", JSON.stringify(randoOptionList))
    return true;
  }
}

function handlePatching(patchstate, patchname) {
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
      } 
  }
}