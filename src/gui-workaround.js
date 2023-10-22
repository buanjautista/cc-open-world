// Hopefully this workaround will work 
// Redefining all the GUI components for item-rando extra menus

export function defineGUIPlease() {
    ig.lang.labels.sc.gui.menu.randomizer.sets["open-world"] = "Open World";
    ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["sblock-enabled"] = "Entrance to Vermillion Tower locked by 4 element dungeon bosses and shades";
    ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["vt-skip"] = "Enables all floors of Vermillion Tower after the first fight";
    ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["meteor-vw"] = "Locks Vermillion Wasteland behind a Meteor Shade barrier";
    ig.lang.labels.sc.gui.menu.randomizer.options.descriptions["open-fajro"] = "Opens up some locked doors in Upper Faj'ro Temple";
    ig.lang.labels.sc.gui.menu.randomizer.options.names["sblock-enabled"] = "Shades and Bosses";
    ig.lang.labels.sc.gui.menu.randomizer.options.names["vt-skip"] = "All Tower Floors";
    ig.lang.labels.sc.gui.menu.randomizer.options.names["meteor-vw"] = "Locked Wasteland";
    ig.lang.labels.sc.gui.menu.randomizer.options.names["open-fajro"] = "Open Fajro";
}