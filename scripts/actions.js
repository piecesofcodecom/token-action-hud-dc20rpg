export const action_list = {
    offensive: ["attack", "disarm", "grapple", "shove", "tackle"],
    defensive: ["disengage", "fullDisengage", "dodge", "fullDodge", "hide"],
    utility: ["spell", "move", "help", "object"],
    reaction: ["attackOfOpportunity", "spellDuel"],
    skillBased: [ "medicine","passThrough","feint","intimidate",
        "combatInsight","analyzeCreatureArcana","analyzeCreatureHistory",
        "analyzeCreatureNature","analyzeCreatureReligion","analyzeCreatureOccultism",
        "calmAnimal","investigate","search","conceal","mountedDefence","jump"]
}

export function getActions() {
    return {
      attack: _attack$1(),
      disarm: _disarm(),
      grapple: _grapple(),
      shove: _shove(),
      tackle: _tackle(),
      disengage: _disengage(),
      fullDisengage: _fullDisengage(),
      dodge: _dodge(),
      fullDodge: _fullDodge(),
      hide: _hide(),
      spell: _spell(),
      move: _move(),
      help: _help(),
      object: _object(),
      attackOfOpportunity: _attackOfOpportunity(),
      spellDuel: _spellDuel(),
      medicine: _medicine(),
      passThrough: _passThrough(),
      feint: _feint(),
      intimidate: _intimidate(),
      combatInsight: _combatInsight(),
      analyzeCreatureArcana: _analyzeCreatureArcana(),
      analyzeCreatureHistory: _analyzeCreatureHistory(),
      analyzeCreatureNature: _analyzeCreatureNature(),
      analyzeCreatureReligion: _analyzeCreatureReligion(),
      analyzeCreatureOccultism: _analyzeCreatureOccultism(),
      calmAnimal: _calmAnimal(),
      investigate: _investigate(),
      search: _search(),
      conceal: _conceal(),
      mountedDefence: _mountedDefence(),
      jump: _jump$1(),
    }
  }
  
  function getActionsAsTables() {
    return {
      offensive: {
        name: "Offensive",
        actions: {
          attack: _attack$1(),
          disarm: _disarm(),
          grapple: _grapple(),
          shove: _shove(),
          tackle: _tackle()
        }
      },
      defensive: {
        name: "Defensive",
        actions: {
          disengage: _disengage(),
          fullDisengage: _fullDisengage(),
          dodge: _dodge(),
          fullDodge: _fullDodge(),
          hide: _hide(),
        }
      },
      utility: {
        name: "Utility",
        actions: {
          spell: _spell(),
          move: _move(),
          help: _help(),
          object: _object(),
        }
      },
      reaction: {
        name: "Reaction",
        actions: {
          attackOfOpportunity: _attackOfOpportunity(),
          spellDuel: _spellDuel(),
        }
      },
      skillBased: {
        name: "Skill Based",
        actions: {
          medicine: _medicine(),
          passThrough: _passThrough(),
          feint: _feint(),
          intimidate: _intimidate(),
          combatInsight: _combatInsight(),
          analyzeCreatureArcana: _analyzeCreatureArcana(),
          analyzeCreatureHistory: _analyzeCreatureHistory(),
          analyzeCreatureNature: _analyzeCreatureNature(),
          analyzeCreatureReligion: _analyzeCreatureReligion(),
          analyzeCreatureOccultism: _analyzeCreatureOccultism(),
          calmAnimal: _calmAnimal(),
          investigate: _investigate(),
          search: _search(),
          conceal: _conceal(),
          mountedDefence: _mountedDefence(),
          jump: _jump$1(),
        }
      }
    }
  }
  
  //==================================
  //            OFFENSIVE            =
  //==================================
  function _attack$1() {
    return {
      name: CONFIG.DC20RPG.actions.attack,
      description: CONFIG.DC20RPG.actionsJournalUuid.attack,
      label: CONFIG.DC20RPG.checks.att,
      formula: "d20+@attackMod.value.martial",
      img: "icons/svg/sword.svg",
      type: "attackCheck",
      checkKey: "att",
      apCost: 1,
      reaction: false
    }
  }
  function _disarm() {
    return {
      name: CONFIG.DC20RPG.actions.disarm,
      description: CONFIG.DC20RPG.actionsJournalUuid.disarm,
      label: CONFIG.DC20RPG.checks.att,
      formula: "d20+@attackMod.value.martial",
      img: "icons/svg/lever.svg",
      type: "attackCheck",
      checkKey: "att",
      apCost: 1,
      reaction: false
    }
  }
  function _grapple() {
    return {
      name: CONFIG.DC20RPG.actions.grapple,
      description: CONFIG.DC20RPG.actionsJournalUuid.grapple,
      label: CONFIG.DC20RPG.checks.ath,
      formula: "d20+@skills.ath.modifier",
      img: "icons/svg/trap.svg",
      type: "skillCheck",
      checkKey: "att",
      apCost: 1,
      reaction: false
    }
  }
  function _shove() {
    return {
      name: CONFIG.DC20RPG.actions.shove,
      description: CONFIG.DC20RPG.actionsJournalUuid.shove,
      label: CONFIG.DC20RPG.checks.ath,
      formula: "d20+@skills.ath.modifier",
      img: "icons/svg/thrust.svg",
      type: "skillCheck",
      checkKey: "ath",
      apCost: 1,
      reaction: false
    }
  }
  function _tackle() {
    return {
      name: CONFIG.DC20RPG.actions.tackle,
      description: CONFIG.DC20RPG.actionsJournalUuid.tackle,
      label: CONFIG.DC20RPG.checks.ath,
      formula: "d20+@skills.ath.modifier",
      img: "icons/svg/falling.svg",
      type: "skillCheck",
      checkKey: "ath",
      apCost: 1,
      reaction: false
    }
  }
  
  //==================================
  //            DEFENSIVE            =
  //==================================
  function _disengage() {
    return {
      name: CONFIG.DC20RPG.actions.disengage,
      description: CONFIG.DC20RPG.actionsJournalUuid.disengage,
      label: CONFIG.DC20RPG.actions.disengage,
      formula: "",
      img: "icons/svg/combat.svg",
      type: "",
      apCost: 1,
      reaction: false,
      applyEffect: {
        name: CONFIG.DC20RPG.actions.disengage,
        label: CONFIG.DC20RPG.actions.disengage,
        img: "icons/svg/combat.svg",
        description: `@UUID[${CONFIG.DC20RPG.actionsJournalUuid.disengage}]{${CONFIG.DC20RPG.actions.disengage}}`,
        "duration.rounds": 1,
        changes: [
          {
            key: "system.rollLevel.againstYou.martial.melee",
            value: '"value": 1, "type": "dis", "label": "Disengage"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.againstYou.martial.ranged",
            value: '"value": 1, "type": "dis", "label": "Disengage"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.againstYou.spell.melee",
            value: '"value": 1, "type": "dis", "label": "Disengage"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.againstYou.spell.ranged",
            value: '"value": 1, "type": "dis", "label": "Disengage"',
            mode: 2,
            priority: null
          },
          {
            key: "system.events",
            value: '"eventType": "basic", "trigger": "turnStart", "postTrigger":"delete", "effectName": "Disengage"',
            mode: 2,
            priority: null
          },
        ]
      }
    }
  }
  function _fullDisengage() {
    return {
      name: CONFIG.DC20RPG.actions.fullDisengage,
      description: CONFIG.DC20RPG.actionsJournalUuid.fullDisengage,
      label: CONFIG.DC20RPG.actions.fullDisengage,
      formula: "",
      img: "icons/svg/combat.svg",
      type: "",
      apCost: 2,
      reaction: false,
      applyEffect: {
        name: CONFIG.DC20RPG.actions.fullDisengage,
        label: CONFIG.DC20RPG.actions.fullDisengage,
        img: "icons/svg/combat.svg",
        description: `@UUID[${CONFIG.DC20RPG.actionsJournalUuid.fullDisengage}]{${CONFIG.DC20RPG.actions.fullDisengage}}`,
        "duration.rounds": 1,
        changes: [
          {
            key: "system.events",
            value: '"eventType": "basic", "trigger": "turnStart", "postTrigger":"delete", "effectName": "Full Disengage"',
            mode: 2,
            priority: null
          },
        ]
      }
    }
  }
  function _dodge() {
    return {
      name: CONFIG.DC20RPG.actions.dodge,
      description: CONFIG.DC20RPG.actionsJournalUuid.dodge,
      label: CONFIG.DC20RPG.actions.dodge,
      formula: "",
      img: "icons/svg/invisible.svg",
      type: "",
      apCost: 1,
      reaction: false,
      applyEffect: {
        name: CONFIG.DC20RPG.actions.dodge,
        label: CONFIG.DC20RPG.actions.dodge,
        img: "icons/svg/invisible.svg",
        description: `@UUID[${CONFIG.DC20RPG.actionsJournalUuid.dodge}]{${CONFIG.DC20RPG.actions.dodge}}`,
        "duration.rounds": 1,
        changes: [
          {
            key: "system.rollLevel.againstYou.martial.melee",
            value: '"value": 1, "type": "dis", "label": "Dodge"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.againstYou.martial.ranged",
            value: '"value": 1, "type": "dis", "label": "Dodge"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.againstYou.spell.melee",
            value: '"value": 1, "type": "dis", "label": "Dodge"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.againstYou.spell.ranged",
            value: '"value": 1, "type": "dis", "label": "Dodge"',
            mode: 2,
            priority: null
          },
          {
            key: "system.conditions.grapple.advantage",
            value: 1,
            mode: 2,
            priority: null
          },
          {
            key: "system.events",
            value: '"eventType": "basic", "trigger": "turnStart", "postTrigger":"delete", "effectName": "Dodge"',
            mode: 2,
            priority: null
          },
        ]
      }
    }
  }
  function _fullDodge() {
    return {
      name: CONFIG.DC20RPG.actions.fullDodge,
      description: CONFIG.DC20RPG.actionsJournalUuid.fullDodge,
      label: CONFIG.DC20RPG.actions.fullDodge,
      formula: "",
      img: "icons/svg/invisible.svg",
      type: "",
      apCost: 2,
      reaction: false,
      applyEffect: {
        name: CONFIG.DC20RPG.actions.fullDodge,
        label: CONFIG.DC20RPG.actions.fullDodge,
        img: "icons/svg/invisible.svg",
        description: `@UUID[${CONFIG.DC20RPG.actionsJournalUuid.fullDodge}]{${CONFIG.DC20RPG.actions.fullDodge}}`,
        "duration.rounds": 1,
        changes: [
          {
            key: "system.rollLevel.againstYou.martial.melee",
            value: '"value": 1, "type": "dis", "label": "Full Dodge"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.againstYou.martial.ranged",
            value: '"value": 1, "type": "dis", "label": "Full Dodge"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.againstYou.spell.melee",
            value: '"value": 1, "type": "dis", "label": "Full Dodge"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.againstYou.spell.ranged",
            value: '"value": 1, "type": "dis", "label": "Full Dodge"',
            mode: 2,
            priority: null
          },
          {
            key: "system.conditions.grapple.advantage",
            value: 1,
            mode: 2,
            priority: null
          },
          {
            key: "system.events",
            value: '"eventType": "basic", "trigger": "turnStart", "postTrigger":"delete", "effectName": "Full Dodge"',
            mode: 2,
            priority: null
          },
        ]
      }
    }
  }
  function _hide() {
    return {
      name: CONFIG.DC20RPG.actions.hide,
      description: CONFIG.DC20RPG.actionsJournalUuid.hide,
      label: CONFIG.DC20RPG.checks.ste,
      formula: "d20+@skills.ste.modifier",
      img: "icons/svg/cowled.svg",
      type: "skillCheck",
      checkKey: "ste",
      apCost: 1,
      reaction: false
    }
  }
  
  //==================================
  //             UTILITY             =
  //==================================
  function _spell() {
    return {
      name: CONFIG.DC20RPG.actions.spell,
      description: CONFIG.DC20RPG.actionsJournalUuid.spell,
      label: "Spell",
      formula: "d20+@attackMod.value.spell",
      img: "icons/svg/explosion.svg",
      type: "spellCheck",
      checkKey: "spe",
      apCost: 1,
      reaction: false
    }
  }
  function _move() {
    return {
      name: CONFIG.DC20RPG.actions.move,
      description: CONFIG.DC20RPG.actionsJournalUuid.move,
      label: CONFIG.DC20RPG.actions.move,
      formula: "",
      img: "icons/svg/wingfoot.svg",
      type: "",
      apCost: 1,
      reaction: false
    }
  }
  function _help() {
    return {
      name: CONFIG.DC20RPG.actions.help,
      description: CONFIG.DC20RPG.actionsJournalUuid.help,
      label: CONFIG.DC20RPG.actions.help,
      formula: "",
      img: "icons/svg/dice-target.svg",
      type: "",
      apCost: 1,
      reaction: false
    }
  }
  function _object() {
    return {
      name: CONFIG.DC20RPG.actions.object,
      description: CONFIG.DC20RPG.actionsJournalUuid.object,
      label: CONFIG.DC20RPG.actions.object,
      formula: "",
      img: "icons/svg/chest.svg",
      type: "",
      apCost: 1,
      reaction: false
    }
  }
  
  //==================================
  //           SKILL BASED           =
  //==================================
  function _passThrough() {
    return {
      name: CONFIG.DC20RPG.actions.passThrough,
      description: CONFIG.DC20RPG.actionsJournalUuid.passThrough,
      label: CONFIG.DC20RPG.checks.mar,
      formula: "d20+max(@skills.acr.modifier, @skills.ath.modifier)",
      img: "icons/svg/stoned.svg",
      type: "skillCheck",
      checkKey: "mar",
      apCost: 1,
      reaction: false
    }
  }
  function _analyzeCreatureArcana() {
    return {
      name: CONFIG.DC20RPG.actions.analyzeCreatureArcana,
      description: CONFIG.DC20RPG.actionsJournalUuid.analyzeCreature,
      label: CONFIG.DC20RPG.checks.arc,
      formula: "d20+@skills.arc.modifier",
      img: "icons/svg/book.svg",
      type: "skillCheck",
      checkKey: "arc",
      apCost: 1,
      reaction: false
    }
  }
  function _analyzeCreatureHistory() {
    return {
      name: CONFIG.DC20RPG.actions.analyzeCreatureHistory,
      description: CONFIG.DC20RPG.actionsJournalUuid.analyzeCreature,
      label: CONFIG.DC20RPG.checks.his,
      formula: "d20+@skills.his.modifier",
      img: "icons/svg/city.svg",
      type: "skillCheck",
      checkKey: "his",
      apCost: 1,
      reaction: false
    }
  }
  function _analyzeCreatureNature() {
    return {
      name: CONFIG.DC20RPG.actions.analyzeCreatureNature,
      description: CONFIG.DC20RPG.actionsJournalUuid.analyzeCreature,
      label: CONFIG.DC20RPG.checks.nat,
      formula: "d20+@skills.nat.modifier",
      img: "icons/svg/oak.svg",
      type: "skillCheck",
      checkKey: "nat",
      apCost: 1,
      reaction: false
    }
  }
  function _analyzeCreatureOccultism() {
    return {
      name: CONFIG.DC20RPG.actions.analyzeCreatureOccultism,
      description: CONFIG.DC20RPG.actionsJournalUuid.analyzeCreature,
      label: CONFIG.DC20RPG.checks.occ,
      formula: "d20+@skills.occ.modifier",
      img: "icons/svg/skull.svg",
      type: "skillCheck",
      checkKey: "occ",
      apCost: 1,
      reaction: false
    }
  }
  function _analyzeCreatureReligion() {
    return {
      name: CONFIG.DC20RPG.actions.analyzeCreatureReligion,
      description: CONFIG.DC20RPG.actionsJournalUuid.analyzeCreature,
      label: CONFIG.DC20RPG.checks.rel,
      formula: "d20+@skills.rel.modifier",
      img: "icons/svg/angel.svg",
      type: "skillCheck",
      checkKey: "rel",
      apCost: 1,
      reaction: false
    }
  }
  function _calmAnimal() {
    return {
      name: CONFIG.DC20RPG.actions.calmAnimal,
      description: CONFIG.DC20RPG.actionsJournalUuid.calmAnimal,
      label: CONFIG.DC20RPG.checks.ani,
      formula: "d20+@skills.ani.modifier",
      img: "icons/svg/pawprint.svg",
      type: "skillCheck",
      checkKey: "ani",
      apCost: 1,
      reaction: false
    }
  }
  function _combatInsight() {
    return {
      name: CONFIG.DC20RPG.actions.combatInsight,
      description: CONFIG.DC20RPG.actionsJournalUuid.combatInsight,
      label: "Insight Check",
      formula: "d20+@skills.ins.modifier",
      img: "icons/svg/light.svg",
      type: "skillCheck",
      checkKey: "ins",
      apCost: 1,
      reaction: false
    }
  }
  function _conceal() {
    return {
      name: CONFIG.DC20RPG.actions.conceal,
      description: CONFIG.DC20RPG.actionsJournalUuid.conceal,
      label: CONFIG.DC20RPG.checks.tri,
      formula: "d20+@skills.tri.modifier",
      img: "icons/svg/item-bag.svg",
      type: "skillCheck",
      checkKey: "tri",
      apCost: 1,
      reaction: false
    }
  }
  function _feint() {
    return {
      name: CONFIG.DC20RPG.actions.feint,
      description: CONFIG.DC20RPG.actionsJournalUuid.feint,
      label: CONFIG.DC20RPG.checks.tri,
      formula: "d20+@skills.tri.modifier",
      img: "icons/svg/ice-aura.svg",
      type: "skillCheck",
      checkKey: "tri",
      apCost: 1,
      reaction: false,
      chatEffect: {
        name: CONFIG.DC20RPG.actions.feint,
        label: CONFIG.DC20RPG.actions.feint,
        img: "icons/svg/ice-aura.svg",
        description: `@UUID[${CONFIG.DC20RPG.actionsJournalUuid.feint}]{${CONFIG.DC20RPG.actions.feint}}`,
        "duration.rounds": 1,
        changes: [
          {
            key: "system.rollLevel.onYou.martial.melee",
            value: '"value": 1, "type": "adv", "label": "Feint"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.onYou.martial.ranged",
            value: '"value": 1, "type": "adv", "label": "Feint"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.onYou.spell.melee",
            value: '"value": 1, "type": "adv", "label": "Feint"',
            mode: 2,
            priority: null
          },
          {
            key: "system.rollLevel.onYou.spell.ranged",
            value: '"value": 1, "type": "adv", "label": "Feint"',
            mode: 2,
            priority: null
          },
          {
            key: "system.globalFormulaModifiers.attackDamage.martial.melee",
            value: '"value": "+ 1", "source": "Feint"',
            mode: 2,
            priority: null
          },
          {
            key: "system.globalFormulaModifiers.attackDamage.martial.ranged",
            value: '"value": "+ 1", "source": "Feint"',
            mode: 2,
            priority: null
          },
          {
            key: "system.globalFormulaModifiers.attackDamage.spell.melee",
            value: '"value": "+ 1", "source": "Feint"',
            mode: 2,
            priority: null
          },
          {
            key: "system.globalFormulaModifiers.attackDamage.martial.ranged",
            value: '"value": "+ 1", "source": "Feint"',
            mode: 2,
            priority: null
          },
          {
            key: "system.events",
            value: '"eventType": "basic", "trigger": "attack", "preTrigger": "disable", "postTrigger":"delete", "effectName": "Feint"',
            mode: 2,
            priority: null
          },
          {
            key: "system.events",
            value: '"eventType": "basic", "trigger": "turnStart", "postTrigger":"delete", "effectName": "Feint"',
            mode: 2,
            priority: null
          },
        ]
      }
    }
  }
  function _intimidate() {
    return {
      name: CONFIG.DC20RPG.actions.intimidate,
      description: CONFIG.DC20RPG.actionsJournalUuid.intimidate,
      label: CONFIG.DC20RPG.checks.inm,
      formula: "d20+@skills.inm.modifier",
      img: "icons/svg/terror.svg",
      type: "skillCheck",
      checkKey: "inm",
      apCost: 1,
      reaction: false
    }
  }
  function _investigate() {
    return {
      name: CONFIG.DC20RPG.actions.investigate,
      description: CONFIG.DC20RPG.actionsJournalUuid.investigate,
      label: CONFIG.DC20RPG.checks.inv,
      formula: "d20+@skills.inv.modifier",
      img: "icons/svg/village.svg",
      type: "skillCheck",
      checkKey: "inv",
      apCost: 1,
      reaction: false
    }
  }
  function _jump$1() {
    return {
      name: CONFIG.DC20RPG.actions.jump,
      description: CONFIG.DC20RPG.actionsJournalUuid.jump,
      label: CONFIG.DC20RPG.checks.mar,
      formula: "d20+max(@skills.acr.modifier, @skills.ath.modifier)",
      img: "icons/svg/upgrade.svg",
      type: "skillCheck",
      checkKey: "mar",
      apCost: 1,
      reaction: false
    }
  }
  function _mountedDefence() {
    return {
      name: CONFIG.DC20RPG.actions.mountedDefence,
      description: CONFIG.DC20RPG.actionsJournalUuid.mountedDefence,
      label: CONFIG.DC20RPG.checks.ani,
      formula: "d20+@skills.ani.modifier",
      img: "icons/svg/shield.svg",
      type: "skillCheck",
      checkKey: "ani",
      apCost: 1,
      reaction: false
    }
  }
  function _medicine() {
    return {
      name: CONFIG.DC20RPG.actions.medicine,
      description: CONFIG.DC20RPG.actionsJournalUuid.medicine,
      label: CONFIG.DC20RPG.checks.med,
      formula: "d20+@skills.med.modifier",
      img: "icons/svg/pill.svg",
      type: "skillCheck",
      checkKey: "med",
      apCost: 1,
      reaction: false
    }
  }
  function _search() {
    return {
      name: CONFIG.DC20RPG.actions.search,
      description: CONFIG.DC20RPG.actionsJournalUuid.search,
      label: CONFIG.DC20RPG.checks.awa,
      formula: "d20+@skills.awa.modifier",
      img: "icons/svg/eye.svg",
      type: "skillCheck",
      checkKey: "awa",
      apCost: 1,
      reaction: false
    }
  }
  
  //==================================
  //            REACTION             =
  //==================================
  function _attackOfOpportunity() {
    return {
      name: CONFIG.DC20RPG.actions.attackOfOpportunity,
      description: CONFIG.DC20RPG.actionsJournalUuid.attackOfOpportunity,
      label: CONFIG.DC20RPG.checks.att,
      formula: "d20+@attackMod.value.martial",
      img: "icons/svg/sword.svg",
      type: "attackCheck",
      checkKey: "att",
      apCost: 1,
      reaction: true
    }
  }
  function _spellDuel() {
    return {
      name: CONFIG.DC20RPG.actions.spellDuel,
      description: CONFIG.DC20RPG.actionsJournalUuid.spellDuel,
      label: CONFIG.DC20RPG.checks.spe,
      formula: "d20+@attackMod.value.spell",
      img: "icons/svg/explosion.svg",
      type: "spellCheck",
      checkKey: "spe",
      apCost: 2,
      reaction: true
    }
  }