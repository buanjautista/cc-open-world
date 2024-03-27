// Definition for Extra Patches
const R_SHADELOCK = 0 // Shade barrier for vermillion tower
const R_VTSKIP = 1 // Skip all Vermillion Tower after first fight
const R_OPENFAJRO = 2 // Non-linear Upper Fajro
const R_METEORVW = 3 // Vermillion Wasteland locked behind Meteor Shade

// Item Rando patching
let randoOptionList = {
  "shadeLock": { enable: false, type: "none" }, 
  "vtSkip": { enable: false },
  "openFajro": { enable: false },
  "meteorVW": { enable: false }
}

const SBL_TYPE = { "none": 0, "all": 1, "shades": 2, "bosses": 3 }

function addIRPatches(mod) {
  // Set this only once, otherwise any repatch gets previous ones removed
  mod.runtimeAssets = {} 

  // Loop once through all the extra patch settings, and apply corresponding patches
  localStorage.setItem("open-world-settings", JSON.stringify(randoOptionList))
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