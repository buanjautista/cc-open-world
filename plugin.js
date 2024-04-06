import { defineGUIPlease } from './src/gui-workaround.js';
import { addMWPatches, addIRPatches } from './src/patch-handling.js'
import { assignSteps } from './src/custom-steps.js'
let mod 
let mwOptionList = []

export default class OpenWorld {
  async main(){
    mod = activeMods.find(e => e.name == "open-world")
    let itemRandoActive = activeMods.find(e => e.name == "item-rando")
    let multiRandoActive = activeMods.find(e => e.name == "mw-rando")

    // Check if either CCItemRando or CCMultiworldRandomizer is active, and add stuff accordingly
    if (itemRandoActive){
      localStorage.getItem("open-world-settings") && (randoOptionList = JSON.parse(localStorage.getItem("open-world-settings")))
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
            addIRPatches(mod)
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
            randoOptionList.shadeLock.type = "bosses"
            addIRPatches(mod)
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
            randoOptionList.shadeLock.type = "shades"
            addIRPatches(mod)
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
            randoOptionList.shadeLock.type = "none"
            addIRPatches(mod)
          }
        };
        setTimeout(defineGUIPlease,"1000");
      }
      if (multiRandoActive) { console.log("CCOpenWorld will only work correctly with only one instance of either CCItemRandomizer or CCMultiworldRandomizer") }

      ig.Game.inject({
        loadingComplete() {
          this.parent();
  
          ig.vars.set("open-world.shadeLock", SBL_TYPE[randoOptionList.shadeLock.type])
        },}
      );
    }

    else if (multiRandoActive) {
      // Adds a check to start extra patching on multiworld connection
      sc.Model.addObserver(sc.multiworld, this)
    }
  }
  prestart() {
    assignSteps();
  }

  // *********** //
  /* CC-MWR patching */
  // *********** //
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
