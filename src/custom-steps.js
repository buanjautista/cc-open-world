
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

// A tweak to ARBox so it doesn't overlap with chest detector for Open World tips
ig.module("game.feature.ar.gui.ar-box2").requires("game.feature.ar.gui.ar-box").defines(function () {
  sc.AR_COLOR.BLUE = { rgb: "#17446a", yOff: 16 };
  ig.GUI.OW_ARBox = ig.GUI.ARBox.extend({
    yOffset: null,
    init: function (b, a, d, c, e, f) {
      this.parent();
      this.setPivot(0, 4);
      this.hook.zIndex = -50;
      this.target = b;
      this.text = a;
      this.yOffset = f;
      this.maxTime = this.timer = d || 0;
      this.mode = c || false;
      this.color = e || sc.AR_COLOR.GREEN;
      this.hook.invisibleUpdate = true;
      b = new sc.TextGui(this.text, { speed: ig.TextBlock.SPEED.NORMAL, font: sc.fontsystem.smallFont, });
      b.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_CENTER);
      this.addChildGui(b);
      this.setSize( b.hook.size.x + 8, b.hook.size.y + 4 + (this.mode ? 2 : 0) );
      this.hook.pivot.y = b.hook.size.y / 2 + 2;
      this.doStateTransition("HIDDEN", true);
      this.target
        ? this._updatePos(false)
        : this.doStateTransition("DEFAULT");
    },
    _updatePos: function (b) {
      var a = this.hook,
        d = this.target.getCenter(),
        c = Math.round(d.x) - ig.game.screen.x,
        d = Math.round( d.y - this.target.coll.pos.z - this.target.coll.size.z / 2 - this.yOffset) - ig.game.screen.y,
        e = this.target.coll.size.x / 2,
        f = (this.target.coll.size.y + this.target.coll.size.z) / 2 - 4,
        g = Math.max(e, f),
        h = c - ig.system.width / 2,
        i = h > 0 ? 1 : -1;
      if (b) {
        if (i != this.prevMove.x && Math.abs(h) > 16) this.prevMove.x = i; this.delta.x = this.delta.x * 0.9 + this.prevMove.x * 0.1; this.delta.y = this.delta.y * 0.9 + this.prevMove.y * 0.1;
      } else { this.prevMove.x = this.delta.x = i; this.prevMove.y = this.delta.y = -1; }
      a.pos.x = c + this.delta.x * (e + a.size.x / 2) - a.size.x / 2;
      a.pos.y = d + this.delta.y * (f + a.size.y / 2) - a.size.y / 2;
      if (!this.hideOutsideOfScreen) {
        a.pos.x = a.pos.x.limit(0, ig.system.width - a.size.x);
        b = sc.gui.statusHud.getFreeScreenMinY(a.pos.x);
        a.pos.y = a.pos.y.limit(b, ig.system.height - a.size.y);
        a.removeAfterTransition || this.doStateTransition("DEFAULT");
      }
      this.arrowX = c - a.pos.x;
      this.hideOutsideOfScreen && !a.removeAfterTransition && (this.arrowX < -8 - g || this.arrowX > a.size.x + g + 8 || a.pos.y > d || a.pos.y < d - g - a.size.y - 8
          ? this.doStateTransition("HIDDEN")
          : this.doStateTransition("DEFAULT"));
    },
  });
});

ig.module("game.feature.ar.ar-steps2").requires("game.feature.ar.ar-steps").defines(function () { 
  ig.EVENT_STEP.SHOW_OW_AR_MSG = ig.EVENT_STEP.SHOW_AR_MSG.extend({
    yOffset: null,
    _wm: new ig.Config({
      attributes: {
        entity: { _type: "Entity", _info: "Entity to show AR Message on" },
        text: { _type: "LangLabel", _info: "AR Text to display" },
        time: {
          _type: "NumberExpression",
          _info: "Time in seconds the message should be visible. 0 = forever",
        },
        mode: {
          _type: "String",
          _info: "Mode of AR display.",
          _select: sc.AR_BOX_MODE,
        },
        color: {
          _type: "String",
          _info: "Color of AR display.",
          _select: sc.AR_COLOR,
        },
        hideOutsideOfScreen: {
          _type: "Boolean",
          _info: "If defined: don't show offscreen-msg",
        },
        partName: {
          _type: "String",
          _info: "If provided: Show AR display to sub part of entity",
          _optional: true,
        },
        varFill: {
          _type: "VarName",
          _info: "Filling of AR Message depends on value of variable",
          _optional: true,
        },
        varFillMax: {
          _type: "NumberExpression",
          _info: "Maximum Number of variable to fill bar",
          _optional: true,
        },
      },
      width: 400,
    }),
    init: function (a) {
      this.entity = a.entity;
      this.text = new ig.LangLabel(a.text);
      this.time = a.time;
      this.mode = sc.AR_BOX_MODE[a.mode];
      this.color = sc.AR_COLOR[a.color];
      this.partName = a.partName;
      this.varFill = a.varFill;
      this.varFillMax = a.varFillMax;
      this.yOffset = a.yOffset
    },
    start: function (a, b) {
      var c = ig.Event.getEntity(this.entity, b),
        e = c,
        f = ig.Event.getExpressionValue(this.time);
      if (this.partName)
        for (var g = c.coll.subColls, h = g.length; h--; )
          if (g[h].entity.partName == this.partName) {
            e = g[h].entity;
            break;
          }
      e = new ig.GUI.OW_ARBox(e, this.text.toString(), f, this.mode, this.color, this.yOffset);
      ig.gui.addGuiElement(e);
      if (this.hideOutsideOfScreen) e.hideOutsideOfScreen = true;
      this.varFill &&
        e.setVarFill(
          this.varFill,
          ig.Event.getExpressionValue(this.varFillMax),
          c
        );
      e.setAttachedEntity(c);
    },
  });
});

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
      if (ig.game.mapName == "newgame") { return; }
    }
    return this.parent(model, event, data);
  }
});