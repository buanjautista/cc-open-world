import {defineGUIPlease} from './src/gui-workaround.js'
// Definition for Extra Patches
const R_SHADELOCK = 0 // Shade barrier for vermillion tower
const R_VTSKIP = 1 // Skip all Vermillion Tower after first fight
const R_OPENFAJRO = 2 // Non-linear Upper Fajro
const R_METEORVW = 3 // Vermillion Wasteland locked behind Meteor Shade

let mod 

export default class OpenWorld {
  async main(){
    mod = activeMods.find(e => e.name == "open-world")
    let itemRandoActive = activeMods.find(e => e.name == "item-rando")
    let multiRandoActive = activeMods.find(e => e.name == "mw-rando")

    // Check if either CCItemRando or CCMultiworldRandomizer is active, and add stuff accordingly
    if (itemRandoActive){
      if (RANDOMIZER_OPTIONS && RANDOMIZER_SETS) {
        RANDOMIZER_SETS['open-world'] = {
          type: "MULTI",
          order: 2E3
        };
        RANDOMIZER_OPTIONS['sblock-enabled'] = {
          set: "open-world",
          cost: 0,
          getter: () => {
            var _a, _b;
            return (_b = (_a = randoOptionList.shadeLock) == null ? void 0 : _a.enable) != null ? _b : true;
          },
          setter: (value) => {
            var _a;
            (_a = randoOptionList.shadeLock) != null ? _a : randoOptionList.shadeLock = { enable: true };
            randoOptionList.shadeLock.enable = value;
            addIRPatches(mod)
          }
        };
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
            addIRPatches(mod)
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
            addIRPatches(mod)
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
            addIRPatches(mod)
          }
        };
        defineGUIPlease()
      }
      if (multiRandoActive) { console.log("Open world will only work with only one instance of either CCItemRandomizer or CCMultiworldRandomizer") }
    }

    else if (multiRandoActive) {
      // Adds a check to start extra patching on multiworld connection
      sc.Model.addObserver(sc.multiworld, this)
    }
  }

  modelChanged(model, msg, data) {
    if (model == sc.multiworld) {
      // Read multiworld connection to check settings variables, to apply optional map patches
      // Might reapply patches several times depending on possible reconnections
      if ((msg == sc.MULTIWORLD_MSG.CONNECTION_STATUS_CHANGED && data == "Connected") || (msg == sc.MULTIWORLD_MSG.OPTIONS_PRESENT)) {
        mwOptionList = [ig.vars.get("mw.options.vtShadeLock"), ig.vars.get("mw.options.vtSkip"), ig.vars.get("mw.options.openFajro"), ig.vars.get("mw.options.meteorPassage")]
        addMWPatches(mod, mwOptionList)
      }
    }
  }
}

// Item Rando patching
let randoOptionList = {
  "shadeLock": { enable: false }, 
  "vtSkip": { enable: false },
  "openFajro": { enable: false },
  "meteorVW": { enable: false }
}

function addIRPatches(mod) {
  // Set this only once, otherwise any repatch gets previous ones removed
  mod.runtimeAssets = {} 

  // Loop once through all the extra patch settings, and apply corresponding patches
  for (let x = 0; x < Object.keys(randoOptionList).length; x++) { 
    handlePatching(Object.values(randoOptionList)[x].enable, x)
  }
}


// Multiworld Patching
let mwOptionList = []
function addMWPatches(mod, optionList) {
  // Set this only once, otherwise any repatch gets previous ones removed
  mod.runtimeAssets = {} 
  
  if (optionList){ // Checks for MW extra patch list
    // Loop once through all the extra patch settings, and apply corresponding patches. 
    for (let x = 0; x < optionList.length; x++) { 
      handlePatching(optionList[x], x)
    }
    return true;
  }
}


function handlePatching(patchstate, patchname) {
  // console.log("Patching: ", patchname, " State:", patchstate)
  if (patchstate) { // Adds patches
    switch(patchname) {
      case R_SHADELOCK:
        mod.setAsset('data/maps/arid/town-1.json.patch', mod.baseDirectory + 'extra-patches/locked-tower/shadebosslock-vt.json.patch');
        break;
      case R_VTSKIP:
        mod.setAsset('data/maps/arid-dng/second/f0/center.json.patch', mod.baseDirectory + 'extra-patches/tower-skip/centerf0.json.patch');
        break;
      case R_OPENFAJRO:
        mod.setAsset('data/maps/heat-dng/f3/room-01-cross.json.patch', mod.baseDirectory + 'extra-patches/open-fajro/f3/room-01-cross.json.patch');
        mod.setAsset('data/maps/heat-dng/f3/room-02.json.patch', mod.baseDirectory + 'extra-patches/open-fajro/f3/room-02.json.patch');
        mod.setAsset('data/maps/heat-dng/f3/room-06.json.patch', mod.baseDirectory + 'extra-patches/open-fajro/f3/room-06.json.patch');
        mod.setAsset('data/maps/heat-dng/f3/room-07.json.patch', mod.baseDirectory + 'extra-patches/open-fajro/f3/room-07.json.patch');
        mod.setAsset('data/maps/heat-dng/f4/corridor-east.json.patch', mod.baseDirectory + 'extra-patches/open-fajro/f4/corridor-east.json.patch');
        mod.setAsset('data/maps/heat-dng/f4/room-01.json.patch', mod.baseDirectory + 'extra-patches/open-fajro/f4/room-01.json.patch');
        mod.setAsset('data/maps/heat-dng/f4/room-03.json.patch', mod.baseDirectory + 'extra-patches/open-fajro/f4/room-03.json.patch');
        mod.setAsset('data/maps/heat-dng/f4/room-10.json.patch', mod.baseDirectory + 'extra-patches/open-fajro/f4/room-10.json.patch');
        break;
      case R_METEORVW:
        mod.setAsset('data/maps/forest/path-10-hidden.json.patch', mod.baseDirectory + 'extra-patches/meteor-vw/passage-barrier.json.patch');
        break;
      }
  }
  else { // Back to default
    switch(patchname) {
      case R_SHADELOCK:
        mod.setAsset('data/maps/arid/town-1.json.patch', mod.baseDirectory + 'assets/data/maps/arid/town-1.json.patch');
        break;
      case R_VTSKIP:
        mod.setAsset('data/maps/arid-dng/second/f0/center.json.patch', mod.baseDirectory + 'assets/data/maps/arid-dng/second/f0/center.json.patch');
        break;
      case R_OPENFAJRO:
        mod.setAsset('data/maps/heat-dng/f3/room-01-cross.json.patch', mod.baseDirectory + 'assets/data/maps/heat-dng/f3/room-01-cross.json.patch');
        mod.setAsset('data/maps/heat-dng/f3/room-02.json.patch', mod.baseDirectory + 'assets/data/maps/heat-dng/f3/room-02.json.patch');
        mod.setAsset('data/maps/heat-dng/f3/room-06.json.patch', mod.baseDirectory + 'assets/data/maps/heat-dng/f3/room-06.json.patch');
        mod.setAsset('data/maps/heat-dng/f3/room-07.json.patch', mod.baseDirectory + 'assets/data/maps/heat-dng/f3/room-07.json.patch');
        mod.setAsset('data/maps/heat-dng/f4/corridor-east.json.patch', mod.baseDirectory + 'assets/data/maps/heat-dng/f4/corridor-east.json.patch');
        mod.setAsset('data/maps/heat-dng/f4/room-01.json.patch', mod.baseDirectory + 'assets/data/maps/heat-dng/f4/room-01.json.patch');
        mod.setAsset('data/maps/heat-dng/f4/room-03.json.patch', mod.baseDirectory + 'assets/data/maps/heat-dng/f4/room-03.json.patch');
        mod.setAsset('data/maps/heat-dng/f4/room-10.json.patch', mod.baseDirectory + 'assets/data/maps/heat-dng/f4/room-10.json.patch');
        break;
      case R_METEORVW:
        mod.setAsset('data/maps/forest/path-10-hidden.json.patch', mod.baseDirectory + 'assets/data/maps/forest/path-10-hidden.json.patch');
        break;
    }
  }
}