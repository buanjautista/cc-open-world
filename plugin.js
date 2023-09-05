var shadeLockEnabled = {
  enable: false
}


let mod 
export default class OpenWorld {
  async main(){
    mod = activeMods.find(e => e.name == "open-world")
    let itemRandoActive = activeMods.find(e => e.name == "item-rando")
    let multiRandoActive = activeMods.find(e => e.name == "mw-rando")

    // Check if either CCItemRando or CCMultiworldRandomizer is active, and add stuff accordingly
    if (itemRandoActive){
      if (RANDOMIZER_OPTIONS && RANDOMIZER_SETS) {
        RANDOMIZER_OPTIONS['sblock-enabled'] = {
          set: "open-world",
          cost: 0,
          getter: () => {
            var _a, _b;
            return (_b = (_a = shadeLockEnabled) == null ? void 0 : _a.enable) != null ? _b : true;
          },
          setter: (value) => {
            var _a;
            (_a = shadeLockEnabled) != null ? _a : shadeLockEnabled = {
              enable: true
            };
            shadeLockEnabled.enable = value;
            shadeLockEnabled.enable 
              ? addPatchAssets(mod, "add", "shadeBossLock") 
              : addPatchAssets(mod, "default", "shadeBossLock")
          }
        };
        RANDOMIZER_SETS['open-world'] = {
              type: "MULTI",
              order: 2E3
        };
      }
      if (multiRandoActive) { console.log("Open world will only work with only one instance of either CCItemRandomizer or CCMultiworldRandomizer") }
    }

    else if (multiRandoActive) {
      // Adds a check to start extra patching on multiworld connection
      sc.Model.addObserver(sc.multiworld, this)
    }
  }

  modelChanged(model, msg, data) {
    // Read multiworld connection to check settings variables, to apply optional map patches
    if (model == sc.multiworld && msg == sc.MULTIWORLD_MSG.CONNECTION_STATUS_CHANGED && data == "Connected") {
      if (ig.vars.get("vars.mw.options.vtShadeLock") ) {
        ig.vars.get("vars.mw.options.vtShadeLock") 
          ? addPatchAssets(mod, "add", "shadeBossLock")
          : addPatchAssets(mod, "default", "shadeBossLock")
      }
      else {
        addPatchAssets(mod, "default", "shadeBossLock")
      }
    }
  }

}

function addPatchAssets(mod, state, cond) {
  mod.runtimeAssets = {}
  switch (state) {
    case "add":
      {
        switch (cond) {
          case "shadeBossLock": //
            mod.setAsset('data/maps/arid/town-1.json.patch', mod.baseDirectory + 'extra-patches/locked-tower/shadebosslock-vt.json.patch');
            break
          default:
            break
        }
      }
      break
    default:
      switch (cond) {
        case "shadeBossLock": //
          mod.setAsset('data/maps/arid/town-1.json.patch', mod.baseDirectory + 'assets/data/maps/arid/town-1.json.patch');
          break
        default:
          break
      }
      break
  }

}