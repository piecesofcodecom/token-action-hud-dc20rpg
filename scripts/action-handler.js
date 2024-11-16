import { PATH_ASSETS } from './constants.js'
import { format_tooltip } from './utils.js'
import { getActions, action_list } from './actions.js'
export let DC20ActionHandler = null

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    DC20ActionHandler = class DC20ActionHandler extends coreModule.api.ActionHandler {

        /** @override */
        async buildSystemActions(groupIds) {
            const token = this.token;
            if (!token) return;
            const tokenId = token.id;
            const actor = this.actor;
            if (!actor) return;
            
            if(["npc", "character"].includes(actor.type)) {                
                if (actor.type != "npc")
                    await this._getSkills({ id: 'trade', type: 'system' });
                this._getItems({ id: 'weapons', type: 'system' }, "weapon");
                this._getItems({ id: 'consumables', type: 'system' }, "consumable");
                this._getTechniques({ id: 'attacks', type: 'system' }, "Attack");
                this._getTechniques({ id: 'defenses', type: 'system' }, "Defense");
                this._getTechniques({ id: 'saves', type: 'system' }, "Save");
                this._getOtherTechniques({ id: 'maneuvers', type: 'system' }, ["Save","Attack", "Defense"]);
                this._getSpells({ id: 'spells', type: 'system' }, "spell")
                this._getSpells({ id: 'cantrips', type: 'system' }, "cantrip");
                
                this._getDoomed({ id: 'doomed', type: 'system'});
                
                this._getUtils({id: "utils", type: 'system'});
                
                //this._getSpecificFeatures({id: 'attacks', type: 'system'}, 'attack');
                
                await this._getAllActions({id: 'actions', type: 'system'});
                // TODO DC20RPG.actions
            }
            await this._getSkills({ id: 'skills', type: 'system' });
            await this._getSkills({ id: 'knowledge', type: 'system' });
            this._getAttributes({ id: 'save', type: 'system' });
            this._getAttributes({ id: 'check', type: 'system' });
            this._getConditions({ id: 'conditions', type: 'system' });
            this._getEffects({id: 'effects', type: 'system'});
            this.getOtherSaveChecks({ id: 'osave', type: 'system' });
            this.getOtherSaveChecks({ id: 'ocheck', type: 'system' });
            this._getPoints();
            this._getFeatures({id: 'features', type: 'system'});

            if (["npc","companion"].includes(actor.type)) {
                this._getResistence({id: 'resistence', type: 'system'})
            }
        }

        _getResistence(parent) {
            const iconTypes = {
                immune: '<i class="fa-lg fa-solid fa-shield"></i>',
                vulnerability: '<i class="fa-lg fa-solid fa-heart-crack"></i>',
                resistance: '<i class="fa-solid fa-lg fa-shield-halved"></i>'
            }
            const actions = [];
            for (let [key, value] of Object.entries(this.actor.system.damageReduction.damageTypes)) {
                
                if (value.immune || value.resistance || value.vulnerability) {
                    let type = 'immune';
                    let info = "";
                    let tooltip = [];
                    tooltip.push(value.category);
                    let id =  parent.id;

                    if (value.vulnerability) {
                        type = 'vulnerability';
                        id = 'vulnerability';
                        info = value.vulnerable;
                        if (info) {
                            tooltip.push("Vulnerability (X)");
                        } else {
                            tooltip.push("Vulnerability (Double)");
                        }
                    } else if (value.resistance) {
                        type = 'resistence';
                        id = 'resistence';
                        info = value.resist;
                        if (info) {
                            tooltip.push("Resistance (X)");
                        } else {
                            tooltip.push("Resistance (Half)");
                        }
                        
                    } else {
                        tooltip.push("Resistance (Immune)");
                        id ="immunity";
                    }
                    this.addActions([{
                        id: key,
                        img: `systems/dc20rpg/images/sheet/resistances/${key}.svg`,
                        icon1: iconTypes[type],
                        info1: { text: info },
                        name: value.label,
                        cssClass: "toggle active",
                        tooltip: tooltip.join(" "),
                        encodedValue: ["",key].join(this.delimiter)
                    }], {id: id ,type: 'system'})
                }
            }
        }
        async _getAllActions(parent) {
            const keys = Object.keys(action_list);

            for (let category of keys) {
                action_list[category].forEach(async action => {
                    const page = await fromUuid(CONFIG.DC20RPG.actionsJournalUuid[action]);
                    this.addActions([{
                        id: action,
                        img: getActions()[action].img,
                        name: getActions()[action].name,
                        //cssClass: !effect.disabled ? "toggle active" : "toggle",
                        tooltip: page ? format_tooltip(page.text.content) : getActions()[action].name,
                        encodedValue: ["action",action].join(this.delimiter)
                    }],{ id: "actions_"+category, type: "system"})
    
                });
            }
        }
        _getEffects(parent) {
            const effects = Array.from(this.actor.effects);
            const actions = [];
            for (let effect of effects) {
                if ((CONFIG.statusEffects.filter(el => el.name == effect.name)).length == 0) {
                    actions.push({
                        id: effect.id,
                        img: effect.img,
                        name: effect.name,
                        cssClass: !effect.disabled ? "toggle active" : "toggle",
                        tooltip: coreModule.api.Utils.i18n(effect.description),
                        encodedValue: ["effect",effect.id].join(this.delimiter)
                    });
                }

            }
            this.addActions(actions, parent);
        }
        _getFeatures(parent) {
            const features = (this.actor.items.filter(el => el.type == "feature" && !["attack"].includes(el.system.actionType)))

            for(let feature of features) {
                let group = "feature_";
                if (feature.system.featureType.length > 0) {
                    group = 'feature_'+feature.system.featureType;
                } else {
                    group = 'feature_other';
                }
                this.addActions([{
                    id: feature.id,
                    name: feature.name,
                    img: feature.img,
                    tooltip: format_tooltip(feature.system.description),
                    encodedValue: ['item', feature.id].join(this.delimiter)
                
                }], {id: group, type: 'system'});
            }
        }
        _getDoomed(parent) {
            let actions = [];
                actions.push({
                    id: 'doomed',
                    name: coreModule.api.Utils.i18n(`dc20rpg.sheet.doomed`),
                    info1: { text: `${this.actor.system.death.doomed}` },
                    info2: { text: `${this.actor.system.death.treshold}`},
                    img: `${PATH_ASSETS}/exhaustion.svg`,
                    tooltip: format_tooltip(coreModule.api.Utils.i18n(`dc20rpg.sheet.doomed`)),
                    encodedValue: ['doomed', 'mouse'].join(this.delimiter)
                
                })
                actions.push({
                    id:`doomedAll`,
                    icon1: '<i class="fa-solid fa-arrows-rotate"></i>',
                    tooltip: "Reset",
                    encodedValue: ['doomed', 'all'].join(this.delimiter)   
                })
            
            this.addActions(actions, parent);

        }
        _getUtils(parent) {
            const actions = [];
            actions.push({
                id: "initiative",
                img: `${PATH_ASSETS}/d20.svg`,
                name: "Initiative",

                cssClass: this.actor.flags.dc20rpg.rollMenu.initiative ? "toggle active" : "toggle",
                tooltip: coreModule.api.Utils.i18n("dc20rpg.sheet.rollMenu.initiative.inactive"),
                encodedValue: ["initiative","initiative"].join(this.delimiter)
            })
            
            actions.push({
                id: "rest",
                img: `${PATH_ASSETS}/rest.svg`,
                name: coreModule.api.Utils.i18n("dc20rpg.sheet.rest"),
                cssClass: "rest",
                tooltip: coreModule.api.Utils.i18n("dc20rpg.sheet.rest"),
                encodedValue: ["rest","rest"].join(this.delimiter)
            })

            actions.push({
                id: "flat",
                img: `${PATH_ASSETS}/d20.svg`,
                name: coreModule.api.Utils.i18n("dc20rpg.sheet.rollMenu.flat"),
                tooltip: coreModule.api.Utils.i18n("dc20rpg.sheet.rollMenu.flat"),
                encodedValue: ["flat","flat"].join(this.delimiter)
            })
            this.addActions(actions, parent);
            
        }
        _getItems(parent, itemtype) {
            let items = []
            let item_list = this.actor.items.filter(i => i.type === itemtype);

            item_list.forEach(el => {
                let element = {
                    id: el.id,
                    img: el.img,
                    name: el.name,
                    tooltip: format_tooltip(el.system.description),
                    encodedValue: [parent.id, el.id].join(this.delimiter)
                }
                if (el.type == 'consumable') {
                    if (el.system.costs.charges.max != null) {
                        element.info1 = { text: el.system.costs.charges.current +"/"+el.system.costs.charges.max }

                    } else {
                        element.info1 = { text: el.system.quantity }
                    }
                    
                }
                items.push(element)
            })
            this.addActions(items, parent);
        }
        async _getTechniques(parent, type) {
            let items = []
            const item_list = this.actor.items.filter(i => i.type === "technique" && i.system.techniqueOrigin == type);
            const current_items = [];
            item_list.forEach(el => {
                let element = {
                    id: el.id,
                    img: el.img,
                    name: el.name,
                    tooltip: format_tooltip(el.system.description),
                    encodedValue: [parent.id, el.id].join(this.delimiter)
                }
                if (!current_items.includes(el.name)) {
                    items.push(element)
                    current_items.push(el.name)
                }
            })
            this.addActions(items, parent)
        }
        async _getOtherTechniques(parent, type) {
            let items = []
            const item_list = this.actor.items.filter(i => i.type === "technique" && !type.includes(i.system.techniqueOrigin));
            const current_items = [];
            item_list.forEach(el => {
                let element = {
                    id: el.id,
                    img: el.img,
                    name: el.name,
                    tooltip: format_tooltip(el.system.description),
                    encodedValue: [parent.id, el.id].join(this.delimiter)
                }
                if (!current_items.includes(el.name)) {
                    items.push(element)
                    current_items.push(el.name)
                }
            })
            this.addActions(items, parent)
        }
        _getSpells(parent, spellType) {
            let items = []
            let item_list = this.actor.items.filter(i => i.type === "spell" && i.system.spellType == spellType);
            item_list.forEach(el => {
                let element = {
                    id: el.id,
                    img: el.img,
                    name: el.name,
                    tooltip: format_tooltip(el.system.description),
                    encodedValue: [parent.id, el.id].join(this.delimiter)
                }
                items.push(element)
            })
            this.addActions(items, parent)
        }
        async _getSkills(parent) {
            const macroType = parent.id;
            let knowledgeSkill = undefined;
            let customSkill = undefined;
            let prefix_title = "dc20rpg.skills";
            if (macroType == "knowledge") {
                knowledgeSkill = true;
                customSkill = false;
            }
            let actions = []
            let skills = Object.keys(this.token.actor.system.skills);
            let list_skills = this.token.actor.system.skills;
            if (macroType == "trade") {
                skills = Object.keys(this.token.actor.system.tradeSkills);
                list_skills = this.token.actor.system.tradeSkills;
                prefix_title = "dc20rpg.trades";
            }
            const all_skills_journal = {...CONFIG.DC20RPG.skillsJournalUuid, ...CONFIG.DC20RPG.tradeSkillsJournalUuid};
            for (let skill of skills) {
                if (list_skills[skill]["knowledgeSkill"] == knowledgeSkill && list_skills[skill]["custom"] == customSkill) {
                    let page = await fromUuid(all_skills_journal[skill]);
                    let mod = list_skills[skill].modifier;
                    actions.push({
                        id: skill,
                        name: coreModule.api.Utils.i18n(`${prefix_title}.${skill}`),
                        img: PATH_ASSETS + "/" + skill + ".svg",
                        tooltip: format_tooltip(`${page.text.content}`),
                        info1: { text: Number(mod) > 0 ? `+${mod}` : `${mod}` },
                        encodedValue: [macroType, skill].join(this.delimiter),
                    })
                }
            }
            this.addActions(actions, parent);
        }

        getOtherSaveChecks(parent) {
            let actions = [];
            if (parent.id == "ocheck") {
                const other_checks = ["attack"]
                actions.push({
                    id: "attack",
                    name: coreModule.api.Utils.i18n("dc20rpg.sheet.checkSave.attackCheckTitle"),
                    img: PATH_ASSETS + "/attack.svg",
                    info1: { text: Number(this.actor.system.attackMod.value.martial) >= 0 ? `+${this.actor.system.attackMod.value.martial}` : `${this.actor.system.attackMod.value.martial}` },
                    encodedValue: ["attackMod", "martial"].join(this.delimiter),
                })

                actions.push({
                    id: "spell",
                    name: coreModule.api.Utils.i18n("dc20rpg.sheet.checkSave.spellCheckTitle"),
                    img: PATH_ASSETS + "/arc.svg",
                    info1: { text: Number(this.actor.system.attackMod.value.spell) >= 0 ? `+${this.actor.system.attackMod.value.spell}` : `${this.actor.system.attackMod.value.spell}` },
                    encodedValue: ["attackMod", "spell"].join(this.delimiter),
                })
                actions.push({
                    id: "martial",
                    name: coreModule.api.Utils.i18n("dc20rpg.sheet.rollMenu.martialTitle"),
                    img: PATH_ASSETS + "/mar.svg",
                    info1: { text: Number(this.actor.system.special.marCheck) >= 0 ? `+${this.actor.system.special.marCheck}` : `${this.actor.system.special.marCheck}` },
                    encodedValue: ["attackMod", "marCheck"].join(this.delimiter),
                })
            } else {
                let details = {
                    checkKey:"men",
                    roll: "d20+@special.menSave",
                    label: coreModule.api.Utils.i18n("dc20rpg.sheet.rollMenu.menSave"),
                    tooltip: coreModule.api.Utils.i18n("dc20rpg.sheet.rollMenu.menSave"),
                    info1: { text: this.actor.system.special.menSave >= 0 ? `+${this.actor.system.special.menSave}` : `${this.actor.system.special.menSave}`},
                    type: "save",
                    img: PATH_ASSETS + "/men.svg",
                };

                let action = {
                    id: details.checkKey,
                    name: details.label,
                    img: details.img,
                    tooltip: format_tooltip(details.tooltip),
                    encodedValue: ["promptRoll", JSON.stringify(details)].join(this.delimiter),
                }
                if (details.info1) {
                    action.info1 = details.info1;
                }
                actions.push(action)
                details = {
                    checkKey:"phy",
                    roll: "d20+@special.phySave",
                    label: coreModule.api.Utils.i18n("dc20rpg.sheet.rollMenu.phySave"),
                    tooltip: coreModule.api.Utils.i18n("dc20rpg.sheet.rollMenu.phySave"),
                    info1: { text: this.actor.system.special.phySave >= 0 ? `+${this.actor.system.special.phySave}` : `${this.actor.system.special.phySave}`},
                    type: "save",
                    img: PATH_ASSETS + "/phy.svg",
                };

                action = {
                    id: details.checkKey,
                    name: details.label,
                    img: details.img,
                    tooltip: format_tooltip(details.tooltip),
                    encodedValue: ["promptRoll", JSON.stringify(details)].join(this.delimiter),
                }
                if (details.info1) {
                    action.info1 = details.info1;
                }
                actions.push(action)
            }
            this.addActions(actions, parent);
        }
        _getAttributes(parent) {
            const macroType = parent.id;
            let actions = []
            
            const attributes = Object.keys(this.token.actor.system.attributes);
            for (let attribute of attributes) {
                if (attribute != "prime") {
                    let mod = this.token.actor.system.attributes[attribute][macroType];
                    actions.push({
                        id: attribute,
                        name: coreModule.api.Utils.i18n(`dc20rpg.attributes.${attribute}`),
                        img: PATH_ASSETS + "/" + attribute + ".webp",
                        tooltip: format_tooltip(`Roll ${coreModule.api.Utils.i18n(`dc20rpg.attributes.${attribute}`)} ${macroType}`),
                        info1: { text: Number(mod) > 0 ? `+${mod}` : `${mod}` },
                        encodedValue: [macroType, attribute].join(this.delimiter),
                    })
                }
            }
            this.addActions(actions, parent);
        }

        _getPoints() {
            ["stamina", "mana", "grit", "ap", "health"].forEach(point => {
                let actions = [];
                let parent = {id: point, type: "system"}
                if ( this.actor.system.resources[point].max > 0) {
                    const right_text = point == "ap" ? coreModule.api.Utils.i18n('dc20rpg.sheet.resource.useAp') : coreModule.api.Utils.i18n(`dc20rpg.sheet.resource.spend${capitalizeFirstLetter(point)}`);
                    const tooltip = `
                        <p><b>Left click</b>: ${coreModule.api.Utils.i18n(`dc20rpg.sheet.resource.regain${capitalizeFirstLetter(point)}`)}</p>
                        <p><b>Right click</b>: ${right_text}</p>
                    `
                    let info1 = { text: `${this.actor.system.resources[point].value} / ${this.actor.system.resources[point].max}`, class: "info1_size" };
                    let info2 = { text: "" }
                    if (point == "health") {
                        let temphp = this.actor.system.resources.health.temp;
                        let hp_current =  this.actor.system.resources[point].value;
                        if (temphp) {
                            hp_current -= temphp;
                        } else {
                            temphp = 0;
                        }
                        info1.text = `${hp_current} / ${this.actor.system.resources[point].max}`;
                        info2.text =  `${temphp}`;
                        
                    }
                    actions.push({
                        id:`${point}`,
                        name: coreModule.api.Utils.i18n(`dc20rpg.resource.${point}`),
                        info1: info1,
                        info2: info2,
                        img: point == "ap" ? `${PATH_ASSETS}/${point}.svg` : `systems/dc20rpg/images/sheet/header/${point}.svg`,
                        tooltip: format_tooltip(tooltip),
                        encodedValue: [point, 'mouse'].join(this.delimiter)
                    
                    })
                    actions.push({
                        id:`${point}All`,
                        icon1: '<i class="fa-solid fa-arrows-rotate"></i>',
                        tooltip: coreModule.api.Utils.i18n('dc20rpg.sheet.resource.regainAllAp'),
                        encodedValue: [point, 'all'].join(this.delimiter)   
                    })
                }
                this.addActions(actions, parent);
            })
        }
        _getConditions(parent) {
            let actions = [];
            const conditions = CONFIG.statusEffects;
            conditions.forEach(_status => {
                if (!(this.actor.system.conditions[_status.id]?.immunity)) {
                    let action =  {
                        id: _status.id,
                        name: _status.label,
                        cssClass: this.actor.statuses.filter(i => i.id ==_status.id).size > 0 ? "toggle active" : "toggle",
                        img: _status.img,
                        tooltip: format_tooltip(_status.description),
                        encodedValue: ['statuses', _status.id].join(this.delimiter)
                    }
                    this.addActions([action], parent);
                } else {
                    let action =  {
                        id: _status.id,
                        name: _status.label,
                        cssClass: "toggle active",
                        img: _status.img,
                        tooltip: format_tooltip(_status.description),
                        encodedValue: ['', ''].join(this.delimiter)
                    }
                    this.addActions([action], {id: "immunity", type: "system"});
                }
            })
            const tooltip = `
            <p>Left click: increase the ${coreModule.api.Utils.i18n("dc20rpg.sheet.exhaustion")}</p>
            <p>Right click: Decrease the ${coreModule.api.Utils.i18n("dc20rpg.sheet.exhaustion")}</p>
            `
            actions.push({
                id: "exhaustion",
                img: this.actor.system.exhaustion < 6 ? `${PATH_ASSETS}/exhaustion.svg` : `${PATH_ASSETS}/exhaustion-full.svg`,
                name: coreModule.api.Utils.i18n("dc20rpg.sheet.exhaustion"),
                info1: { text: `${this.actor.system.exhaustion}` },
                tooltip: tooltip,
                encodedValue: ["exhaustion","exhaustion"].join(this.delimiter)
            })
            this.addActions(actions, {id: 'exhaustion', type: 'system'});
        }
    }
})