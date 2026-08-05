import { defineGUIPlease } from './src/gui-workaround.js';
import { assignSteps } from './src/custom-steps.js'
import { enableHubLaterQuests } from './src/show-quest-hub.js'
let mod 

const MENU_OW_CUSTOM = {
  QUEST_HUB: 700,
};

export default class OpenWorld {
  async main(){
    mod = activeMods.find(e => e.name == "open-world")

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
    setTimeout(defineGUIPlease,"1000");
  }
  prestart() {
    assignSteps();
    enableHubLaterQuests(MENU_OW_CUSTOM.QUEST_HUB);
  }
}