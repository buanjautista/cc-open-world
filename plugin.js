import { defineGUIPlease } from './src/gui-workaround.js';
import { assignSteps } from './src/custom-steps.js'
import { enableHubLaterQuests } from './src/show-quest-hub.js'
let mod 
let mwOptionList = []
let goalList = {
  shades: false,
  bosses: false,
  creator: false,
  diorbis: false,
  lab: false,
  observatory: false,
  botanics: false,
}
let lastOptionList;
const DEFAULT_OPTIONS = {
  "shadeLock": { state: false, type: "none" }, 
  "vtSkip": { state: false },
  "openFajro": { state: false },
  "meteorVW": { state: false },
  "extraBarriers": { state: false },
  "closedGaia": { state: false, type: "none"  },
  "dlcActive": { state: false },
  "extraQuests": { state: false },
  "goalList": {
    shades: false,
    bosses: false,
    creator: true,
    diorbis: false,
    lab: false,
    observatory: false,
    botanics: false,
  },
  "randomizedShades": { state: false, shades: {
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
          ig.vars.get("mw.options.rhombusHubUnlock"),
          ig.vars.get("mw.options.closedGaia"),
          ig.vars.get("mw.options.dlcActive"),
          ig.vars.get("mw.options.extraQuests"),
          ig.vars.get("mw.options.goalChoices")
        ]
        addMWPatches(mwOptionList)
        // 
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
const R_EXTRAQUESTS = 7; // Custom Quests for Open World and vanilla mandatory story quests edited
const R_GOALSETTINGS = 8; // GOAL SETTINGS


// Multiworld Patching
export function addMWPatches(optionList) {
  if (optionList){ // Checks for MW extra patch list
    if (lastOptionList != optionList) {
      mod.runtimeAssets = {}
    }
    for (let x = 0; x < optionList.length; x++) {
      // separate case scenario for setting the goal list
      if (x == R_GOALSETTINGS) {
        for (let goal of optionList[x]) {
          randoOptionList[Object.keys(randoOptionList)[x]][goal] = true;
          ig.vars.set("open-world.goal-" + goal, true);
        }
        setGoalQuest()
      }
      // Convert vars from mw.options into the open-world vars 
      else {
        optionList[x] 
          ? randoOptionList[Object.keys(randoOptionList)[x]].state = optionList[x] 
          : randoOptionList[Object.keys(randoOptionList)[x]].state = false
          handlePatching(Object.values(randoOptionList)[x].state, x)
      }
    }
    localStorage.setItem("open-world-settings", JSON.stringify(randoOptionList))
    lastOptionList = optionList;
    // console.log(optionList, randoOptionList)
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
          // mod.addPatch('data/maps/arid/town-1.json', mod.baseDirectory + 'extra-patches/locked-tower/shadebosslock-vt.json.patch');
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
        ig.vars.set("open-world.rhombusHubUnlock", patchstate);
        break;
      case R_CLOSEDGAIA:
        ig.vars.set("open-world.closedGaia", patchstate);
        break;
      case R_DLCACTIVE:
        ig.vars.set("open-world.dlcActive", patchstate);
        break;
      case R_EXTRAQUESTS:
        ig.vars.set("open-world.extraQuests", patchstate);
        break;
      case R_GOALSETTINGS:
        ig.vars.set("open-world.goal", patchstate);
        break;
      } 
  }
}


function setGoalQuest() {
  new cc.ig.events.CREATE_QUEST_GOAL({
			"name": {
				"en_US": "Randomizer Goal",
				"de_DE": "Randomizer Goal",
				"zh_CN": "Randomizer Goal",
				"ja_JP": "Randomizer Goal",
				"ko_KR": "Randomizer Goal",
				"zh_TW": "Randomizer Goal",
				"langUid": 3706
			},
			"person": {
				"en_US": "Archie P. Lago",
				"de_DE": "Archie P. Lago",
				"zh_CN": "Archie P. Lago",
				"ja_JP": "Archie P. Lago",
				"ko_KR": "Archie P. Lago",
				"langUid": 3707,
				"zh_TW": "\u7814\u7a76\u54e1\u4ea8\u5229"
			},
			"hideRewards": true,
			"order": 1003,
			"level": 8,
			"description": {
				"en_US": "Complete the randomizer goals and report to Rookie Harbor Quest Hub",
				"de_DE": "Complete the randomizer goals and report to Rookie Harbor Quest Hub",
				"zh_CN": "Complete the randomizer goals and report to Rookie Harbor Quest Hub",
				"ja_JP": "Complete the randomizer goals and report to Rookie Harbor Quest Hub",
				"ko_KR": "Complete the randomizer goals and report to Rookie Harbor Quest Hub",
				"zh_TW": "Complete the randomizer goals and report to Rookie Harbor Quest Hub",
				"langUid": 3709
			},
			"briefing": {
				"en_US": "Filler",
				"de_DE": "Filler",
				"zh_CN": "Filler",
				"ja_JP": "Filler",
				"ko_KR": "Filler",
				"zh_TW": "Filler",
				"langUid": 3710
			},
			"tasks": [
				{
					"task": {
						"en_US": "Finish all the tasks.",
						"de_DE": "Finish all the tasks.",
						"fr_FR": "Finish all the tasks.",
						"zh_CN": "Finish all the tasks.",
						"ja_JP": "Finish all the tasks.",
						"ko_KR": "Finish all the tasks.",
						"zh_TW": "Finish all the tasks.",
						"langUid": 3725
					},
					"subtasks": [
					]
				},
				{
					"task": {
						"en_US": "Return to Rookie Harbor Quest Hub to report your findings.",
						"de_DE": "Return to Rookie Harbor Quest Hub to report your findings.",
						"fr_FR": "Return to Rookie Harbor Quest Hub to report your findings.",
						"zh_CN": "Return to Rookie Harbor Quest Hub to report your findings.",
						"ja_JP": "Return to Rookie Harbor Quest Hub to report your findings.",
						"ko_KR": "Return to Rookie Harbor Quest Hub to report your findings.",
						"zh_TW": "Return to Rookie Harbor Quest Hub to report your findings.",
						"langUid": 3796
					},
					"subtasks": [
						{
							"label": "done",
							"type": "CONDITION"
						}
					]
				}
			],
			"area": "rookie-harbor",
			"rewards": {
				"exp": {
					"exp": 500,
					"bonus": 0
				},
				"money": 1000
			},
			"subgoals": [{
							"text": {
								"en_US": "Complete The Ultimate Experience at Vermillion Tower",
								"de_DE": "Complete The Ultimate Experience at Vermillion Tower",
								"fr_FR": "Complete The Ultimate Experience at Vermillion Tower",
								"zh_CN": "Complete The Ultimate Experience at Vermillion Tower",
								"ja_JP": "Complete The Ultimate Experience at Vermillion Tower",
								"ko_KR": "Complete The Ultimate Experience at Vermillion Tower",
								"zh_TW": "Complete The Ultimate Experience at Vermillion Tower",
								"langUid": 3777
							},
							"type": "QUEST",
							"quest": "goal-creator",
							"questCondition": "open-world.goal-creator"
						},{
							"text": {
								"en_US": "Obtain the four elemental dungeon Shades",
								"de_DE": "Obtain the four elemental dungeon Shades",
								"fr_FR": "Obtain the four elemental dungeon Shades",
								"zh_CN": "Obtain the four elemental dungeon Shades",
								"ja_JP": "Obtain the four elemental dungeon Shades",
								"ko_KR": "Obtain the four elemental dungeon Shades",
								"zh_TW": "Obtain the four elemental dungeon Shades",
								"langUid": 3777
							},
							"type": "QUEST",
							"quest": "goal-dshades",
							"questCondition": "open-world.goal-dungeon_shades"
						},{
							"text": {
								"en_US": "Obtain the four elemental dungeon Bosses",
								"de_DE": "Obtain the four elemental dungeon Bosses",
								"fr_FR": "Obtain the four elemental dungeon Bosses",
								"zh_CN": "Obtain the four elemental dungeon Bosses",
								"ja_JP": "Obtain the four elemental dungeon Bosses",
								"ko_KR": "Obtain the four elemental dungeon Bosses",
								"zh_TW": "Obtain the four elemental dungeon Bosses",
								"langUid": 3777
							},
							"type": "QUEST",
							"quest": "goal-dbosses",
							"questCondition": "open-world.goal-dungeon_bosses"
						},{
							"text": {
								"en_US": "Find Facility X",
								"de_DE": "Find Facility X",
								"fr_FR": "Find Facility X",
								"zh_CN": "Find Facility X",
								"ja_JP": "Find Facility X",
								"ko_KR": "Find Facility X",
								"zh_TW": "Find Facility X",
								"langUid": 3777
							},
							"type": "QUEST",
							"quest": "goal-lab",
							"questCondition": "open-world.goal-lab"
						},{
							"text": {
								"en_US": "Enter the Old Observatory at Autumn's Rise",
								"de_DE": "Enter the Old Observatory at Autumn's Rise",
								"fr_FR": "Enter the Old Observatory at Autumn's Rise",
								"zh_CN": "Enter the Old Observatory at Autumn's Rise",
								"ja_JP": "Enter the Old Observatory at Autumn's Rise",
								"ko_KR": "Enter the Old Observatory at Autumn's Rise",
								"zh_TW": "Enter the Old Observatory at Autumn's Rise",
								"langUid": 3777
							},
							"type": "QUEST",
							"quest": "goal-observatory",
							"questCondition": "open-world.goal-observatory"
						},{
							"text": {
								"en_US": "Defeat Di'orbis at Ku'lero Temple",
								"de_DE": "Defeat Di'orbis at Ku'lero Temple",
								"fr_FR": "Defeat Di'orbis at Ku'lero Temple",
								"zh_CN": "Defeat Di'orbis at Ku'lero Temple",
								"ja_JP": "Defeat Di'orbis at Ku'lero Temple",
								"ko_KR": "Defeat Di'orbis at Ku'lero Temple",
								"zh_TW": "Defeat Di'orbis at Ku'lero Temple",
								"langUid": 3777
							},
							"type": "QUEST",
							"quest": "goal-diorbis",
							"questCondition": "open-world.goal-diorbis"
						},{
							"text": {
								"en_US": "Defeat the Ancient Guardian and the Son of the East in Krys'kajo Temple",
								"de_DE": "Defeat the Ancient Guardian and the Son of the East in Krys'kajo Temple",
								"fr_FR": "Defeat the Ancient Guardian and the Son of the East in Krys'kajo Temple",
								"zh_CN": "Defeat the Ancient Guardian and the Son of the East in Krys'kajo Temple",
								"ja_JP": "Defeat the Ancient Guardian and the Son of the East in Krys'kajo Temple",
								"ko_KR": "Defeat the Ancient Guardian and the Son of the East in Krys'kajo Temple",
								"zh_TW": "Defeat the Ancient Guardian and the Son of the East in Krys'kajo Temple",
								"langUid": 3777
							},
							"type": "QUEST",
							"quest": "goal-monkey",
							"questCondition": "open-world.goal-monkey"
						}]
		}).start();
}