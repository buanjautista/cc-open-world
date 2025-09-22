export function enableHubLaterQuests(quest_hub_menu) {
	sc.QuestHubListFull = sc.QuestHubList.extend({

		init: function () {
			this.parent();

			this.addTab("locked", 3, { type: 3 });
		},
		collectQuests: function (b, a) {
			var d = ig.database.get("questHubs")[sc.menu.questHubID];
			if (!d) throw Error("Quest HUB ID not found: " + sc.menu.questHubID);
			var d = d.areas,
				c = sc.quests.staticQuests,
				e = [],
				f = new ig.VarCondition(),
				g;
			for (g in c) {
				var h = c[g];
				if (h.hubSettings && !h.noTrack && (!h.extension || ig.extensions.hasExtension(h.extension)))
					for (var i = 0; i < d.length; i++)
						if (h.area == d[i])
							if (b == sc.MENU_QUEST_HUB_TABS.OPEN) {
								if (
									!sc.quests.isQuestActive(g) &&
									!sc.quests.isQuestSolved(g)
								)
									if (h.hubSettings.condition) {
										f.setCondition(h.hubSettings.condition);
										f.evaluate() && e.push(g);
									} else e.push(g);
							}
							else if (b == sc.MENU_QUEST_HUB_TABS.ACTIVE) {
								sc.quests.isQuestActive(g) && e.push(g)
							}
							else if (b == sc.MENU_QUEST_HUB_TABS.FINISHED) {
								sc.quests.isQuestSolved(g) &&
									e.push(g);
							}
							else if (b == 3) {
								// Exception to add Quests condition locked
								if (!sc.quests.isQuestActive(g) && !sc.quests.isQuestSolved(g))
									if (h.hubSettings.condition) {
										f.setCondition(h.hubSettings.condition);
										!f.evaluate() && e.push(g);
									}
							}
			}
			a != void 0 && this.sortList(e, a);
			return e;
		},
	})

	sc.QuestHubMenuFull = sc.ListInfoMenu.extend({
		helpGui: null,
		completion: null,
		available: null,
		unavailable: null,
		init: function () {
			this.parent(new sc.QuestHubListFull());
			this.list.hook.pos.x = 0;
			this.list.bg.hook.pos.y = this.list.bg.hook.pos.y - 5;
			this.list.bg.hook.size.y = this.list.bg.hook.size.y + 5;
			this.completion = new sc.QuestHubCompletion();
			this.addChildGui(this.completion);
			this.available = new sc.QuestHubAvailable();
			this.addChildGui(this.available);
			this.sortMenu.addButton("auto", sc.QUEST_SORT_TYPE.ORDER, 0);
			this.sortMenu.addButton("name", sc.QUEST_SORT_TYPE.NAME, 1);
			this.sortMenu.addButton("questLevel", sc.QUEST_SORT_TYPE.LEVEL, 2);
			this.doStateTransition("DEFAULT");
		},
		showMenu: function () {
			this.parent();
			this.list && this.updateSortMenuButton(this.list.getCurrentSortText());
			this.completion.show();
			this.available.show();
		},
		exitMenu: function () {
			this.parent();
			this.completion.hide();
			this.available.hide();
			sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.LARGE);
		},
		createHelpGui: function () {
			if (!this.helpGui) {
				this.helpGui = new sc.HelpScreen(
					this,
					ig.lang.get("sc.gui.menu.help-texts.questHub.title"),
					ig.lang.get("sc.gui.menu.help-texts.questHub.pages"),
					function () {
						this.commitHotKeysToTopBar(true);
					}.bind(this),
					true
				);
				this.helpGui.hook.zIndex = 15e4;
				this.helpGui.hook.pauseGui = true;
			}
		},
		modelChanged: function (b, a, d) {
			if (b == sc.menu)
				if (a == sc.MENU_EVENT.SORT_LIST) this.updateSortMenuButton(d.text);
				else if (a == sc.MENU_EVENT.SYNO_CHANGED_TAB) {
					this.sortMenu.active && this.sortMenu.hideSortMenu();
					this.updateSortMenuButton(this.list.getCurrentSortText());
				}
		},
	});

	ig.EVENT_STEP.OPEN_QUEST_HUB_FULL = ig.EventStepBase.extend({
		hub: null,
		_wm: new ig.Config({
			attributes: {
				hub: {
					_type: "QuestHub",
					_info: "The hub to access.",
					_context: "QuestHub",
				},
			},
		}),
		init: function (b) {
			this.hub = b.hub || null;
		},
		start: function () {
			sc.menu.questHubID = this.hub;
			sc.menu.setDirectMode(true, quest_hub_menu);
			sc.model.enterMenu(true);
			sc.model.prevSubState = sc.GAME_MODEL_SUBSTATE.RUNNING;
		},
	});

	sc.SUB_MENU_INFO[quest_hub_menu] = {
		Clazz: sc.QuestHubMenuFull,
		name: "questHub",
	};
}