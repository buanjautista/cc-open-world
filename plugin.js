var shadeLockEnabled = {
  enable: false
}

export default class OpenWorld {
  async main(){
    let mod = activeMods.find(e => e.name == "open-world")
    let itemrando = activeMods.find(e => e.name == "item-rando")
    let multirando = activeMods.find(e => e.name == "mw-rando")

    if (itemrando){
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
            addPatchAssets(mod, "shadeBossLock")
          }
        };
        RANDOMIZER_SETS['open-world'] = {
              type: "MULTI",
              order: 2E3
        };
      }
      if (multirando) { console.log("Open world will only work with only one instance of either CCItemRandomizer or CCMultiworldRandomizer") }
    }
    else if (multirando) {
      // do something to check yaml settings and add the corresponding patches in here
      console.log("Insert yaml settings extra patches for open world here")
      if (shadeLockEnabled.enable == true) {
        addPatchAssets(mod, "shadeBossLock")
      }
    }
  }
}

function addPatchAssets(mod, cond) {
  mod.runtimeAssets = {}
  switch (cond) {
    case "shadeBossLock": //
      if (shadeLockEnabled.enable) {
        mod.setAsset('data/maps/arid/town-1.json.patch', mod.baseDirectory + 'extra-patches/locked-tower/shadebosslock-vt.json.patch');
      }
      else {
        mod.setAsset('data/maps/arid/town-1.json.patch', mod.baseDirectory + 'assets/data/maps/arid/town-1.json.patch');
      }
      break
    default:
      break
  }
}