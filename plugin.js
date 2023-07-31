var shadeLockEnabled = {
  enable: false
}

export default class OpenWorld {
  async main(){
    let mod = activeMods.find(e => e.name == "open-world")
    ig.lang.labels.sc.gui.menu.randomizer.sets["open-world"] = "Open World";
    ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["sblock-enabled"] = "Entrance to Vermillion Tower locked by 4 element dungeon bosses and shades";
    ig.lang.labels.sc.gui.menu.randomizer.options.names["sblock-enabled"] = "Shades and Bosses";

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
}

function addPatchAssets(mod, cond) {
  mod.runtimeAssets = {}
  switch (cond) {
    case "shadeBossLock": //
      if (shadeLockEnabled.enable) {
        // console.log("Shade-boss locks enabled")
        mod.setAsset('data/maps/arid/town-1.json.patch', mod.baseDirectory + 'extra-patches/locked-tower/shadebosslock-vt.json.patch');
        // mod.setAsset('data/maps/cold-dng/g/expo-space.json.patch', mod.baseDirectory + 'extra-patches/locked-tower/coldboss.json.patch');
        // mod.setAsset('data/maps/heat/dng-expo-space.json.patch', mod.baseDirectory + 'extra-patches/locked-tower/heatboss.json.patch');
        // mod.setAsset('data/maps/jungle/dng/wave-expo-space.json.patch', mod.baseDirectory + 'extra-patches/locked-tower/waveboss.json.patch');
        // mod.setAsset('data/maps/jungle/dng/shock-expo-space.json.patch', mod.baseDirectory + 'extra-patches/locked-tower/shockboss.json.patch');
      }
      else {
        // console.log("Shade-boss locks disabled")
        mod.setAsset('data/maps/arid/town-1.json.patch', mod.baseDirectory + 'assets/data/maps/arid/town-1.json.patch');
        // mod.setAsset('data/maps/cold-dng/g/expo-space.json.patch', mod.baseDirectory + 'assets/data/maps/cold-dng/g/expo-space.json.patch');
        // mod.setAsset('data/maps/heat/dng-expo-space.json.patch', mod.baseDirectory + 'assets/data/maps/heat/dng-expo-space.json.patch');
        // mod.setAsset('data/maps/jungle/dng/wave-expo-space.json.patch', mod.baseDirectory + 'assets/data/maps/jungle/dng/wave-expo-space.json.patch');
        // mod.setAsset('data/maps/jungle/dng/shock-expo-space.json.patch', mod.baseDirectory + 'assets/data/maps/jungle/dng/shock-expo-space.json.patch');
      }
      break
    default:
      break
  }
}