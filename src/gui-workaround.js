// Hopefully this workaround will work 
// Redefining all the GUI components for item-rando extra menus

// why the hell does this not work when zipped

export function defineGUIPlease() {
    ig.lang.labels.sc.gui.menu.randomizer.sets["open-world"] = "Open World";
    ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["vt-skip"] = "Enables all floors of Vermillion Tower after the first fight";
    ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["meteor-vw"] = "Locks Vermillion Wasteland behind a Meteor Shade barrier";
    ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["open-fajro"] = "Opens up some locked doors in Upper Faj'ro Temple";
    ig.lang.labels.sc.gui.menu.randomizer.options.names["vt-skip"] = "Skip Vermillion Tower floors";
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