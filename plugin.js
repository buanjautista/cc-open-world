// import {defineGUIPlease} from './src/gui-workaround.js'

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
      if (multiRandoActive) { console.log("Open world will only work with only one instance of either CCItemRandomizer or CCMultiworldRandomizer") }

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

    // *********** //
    /* EVENT STEPS */
    // *********** //

    // "fix" for increase_player_sp_level
    ig.EVENT_STEP.INCREASE_PLAYER_SP_LEVEL.inject({
      start() {
        sc.model.player.setSpLevel("" + (Number(sc.model.player.spLevel) + 1));
      },
    });

    // fix for to not show landmarks on enhanced skip beginning
    sc.TopMsgHudGui.inject({
      modelChanged: function(model, event, data) {
      if (model == sc.map && event == sc.MAP_EVENT.LANDMARK_ADDED) {
        if (ig.game.mapName == "newgame") {
          return;
        }
      }
      return this.parent(model, event, data);
          }
    });

        // New event to equip an item, for enhanced skip beginning
      ig.module("game.feature.player.rando-utils") .requires( "impact.base.action", "impact.base.event", "game.feature.player.player-model", "game.feature.model.game-model" ).defines(function () {
        ig.EVENT_STEP.EQUIP_ITEM = ig.EventStepBase.extend({
          part: null,
          item: null,
          _wm: new ig.Config({
            attributes: {
              part: { _type: "Number", _info: "Where does the equip go", _select: sc.MENU_EQUIP_BODYPART, },
              item: { _type: "Number", _info: "ID of item to equip", },
            },
          }),
          init: function (a) {
            this.part = Number(a.part);
            this.item = Number(a.item);
          },
          start: function () {
            sc.model.player.setEquipment(this.part, this.item)
          },
        });
      });

      // New event to mark an area as visited, for enhanced skip beginning
      ig.module("game.feature.menu.rando-utils") .requires( "impact.base.action", "impact.base.event", "game.feature.menu.map-model" ).defines(function () {
        ig.EVENT_STEP.UPDATE_VISITED_AREA = ig.EventStepBase.extend({
          _wm: new ig.Config({
            attributes: {
              area: { _type: "String", _info: "Area to mark as visited", } }
        }),

        init: function (settings) {
          this.area = settings.area;
        },

        start: function() {
          sc.map.updateVisitedArea(this.area);
        }
      });
      });

    // New event step to sync specific party member's SP level 
    ig.module("game.feature.party.party-steps2") .requires( "impact.base.action", "impact.base.event", "game.feature.party.party-steps", "game.feature.model.model-steps").defines(function () {
          ig.EVENT_STEP.SYNC_PARTY_MEMBER_SP_LEVEL = ig.EventStepBase.extend({
            _wm: new ig.Config({
              attributes: {
                member: {
                  _type: "String",
                  _info: "Party member to add",
                  _select: sc.PARTY_OPTIONS,
                },
              },
            }),
            init: function (a) {
              this.member = a.member;
              console.log(a)
            },
            start: function () {
              sc.party.getPartyMemberModel(this.member).setSpLevel(sc.model.player.spLevel);
            },
          });
        }
        );
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

export function defineGUIPlease() {
  ig.lang.labels.sc.gui.menu.randomizer.sets["open-world"] = "Open World";
  ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["vt-skip"] = "Enables all floors of Vermillion Tower after the first fight";
  ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["meteor-vw"] = "Locks Vermillion Wasteland behind a Meteor Shade barrier";
  ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["open-fajro"] = "Opens up some locked doors in Upper Faj'ro Temple";
  ig.lang.labels.sc.gui.menu.randomizer.options.names["vt-skip"] = "Skip Tower floors";
  ig.lang.labels.sc.gui.menu.randomizer.options.names["meteor-vw"] = "Locked Wasteland";
  ig.lang.labels.sc.gui.menu.randomizer.options.names["open-fajro"] = "Open Fajro";
  ig.lang.labels.sc.gui.menu.randomizer.sets["open-world-sblock"] = "Open World - Vermillion Tower entry barrier";
  ig.lang.labels.sc.gui.menu.randomizer.options.names["sblock-all"] = "Bosses and Shades";
  ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["sblock-all"] = "Block Vermillion Tower behind four element dungeon bosses and shades";
  ig.lang.labels.sc.gui.menu.randomizer.options.names["sblock-boss"] = "Bosses only";
  ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["sblock-boss"] = "Block Vermillion Tower behind the four element dungeon bosses";
  ig.lang.labels.sc.gui.menu.randomizer.options.names["sblock-shades"] = "Shades only";
  ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["sblock-shades"] = "Block Vermillion Tower behind the four element shades";
  ig.lang.labels.sc.gui.menu.randomizer.options.names["sblock-none"] = "Disable VT barrier";
  ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["sblock-none"] = "Vermillion Tower is accessible at any time";
}
