import { PATH_ASSETS } from './constants.js'
import { format_tooltip } from './utils.js'
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
                this._getAttributes({ id: 'save', type: 'system' });
                this._getAttributes({ id: 'check', type: 'system' });
                await this._getSkills({ id: 'skills', type: 'system' });
                await this._getSkills({ id: 'knowledge', type: 'system' });
                if (actor.type != "npc")
                    await this._getSkills({ id: 'trade', type: 'system' });
                this._getItems({ id: 'weapons', type: 'system' }, "weapon");
                this._getItems({ id: 'consumables', type: 'system' }, "consumable");
                this._getTechniques({ id: 'maneuvers', type: 'system' }, "maneuver");
                this._getTechniques({ id: 'techniques', type: 'system' }, "technique");
                this._getSpells({ id: 'spells', type: 'system' }, "spell")
                this._getSpells({ id: 'cantrips', type: 'system' }, "cantrip");
                this._getPoints();
                this._getConditions({ id: 'conditions', type: 'system' });
                // TODO DC20RPG.actions
            }
        }
        _getItems(parent, itemtype) {
            let items = []
            let item_list = this.actor.items.filter(i => i.type === itemtype)
            item_list.forEach(el => {
                let element = {
                    id: el.id,
                    img: el.img,
                    name: el.name,
                    tooltip: el.system.description,
                    encodedValue: [parent.id, el.id].join(this.delimiter)
                }
                if ( ["weapon"].includes(el.type) ) {
                    console.warn(el)
                    const formulas =  Object.keys(el.system.formulas)
                    let dmg_type = ""
                    let dmg_value = ""
                    for (let formula of formulas) {
                        dmg_type = el.system.formulas[formula].type;
                        dmg_value = el.system.formulas[formula].formula;
                    }
                    
                    element.info1 = { text: dmg_value }
                    element.info2 = {text:  dmg_type}
                    

                    
                } else if (el.type == 'consumable') {
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
            let item_list = this.actor.items.filter(i => i.type === "technique" && i.system.techniqueType == type);
            item_list.forEach(el => {
                let element = {
                    id: el.id,
                    img: el.img,
                    name: el.name,
                    tooltip: el.system.description,
                    encodedValue: [parent.id, el.id].join(this.delimiter)
                }
                items.push(element)
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
                    tooltip: el.system.description,
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
                        tooltip: `${page.text.content}`,
                        info1: { text: Number(mod) > 0 ? `+${mod}` : `${mod}` },
                        encodedValue: [macroType, skill].join(this.delimiter),
                    })
                }
            }
            console.warn(actions)
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
                        tooltip: `Roll ${coreModule.api.Utils.i18n(`dc20rpg.attributes.${attribute}`)} ${macroType}`,
                        info1: { text: Number(mod) > 0 ? `+${mod}` : `${mod}` },
                        encodedValue: [macroType, attribute].join(this.delimiter),
                    })
                }
            }
            this.addActions(actions, parent);
        }

        _getPoints() {
            ["stamina", "mana", "grit", "ap"].forEach(point => {
                let actions = [];
                let parent = {id: point, type: "system"}
                if ( this.actor.system.resources[point].max > 0) {
                    actions.push({
                        id:`${point}`,
                        icon1: `<i class="fa-solid fa-${this.actor.system.resources[point].value}"></i>`,
                        tooltip: coreModule.api.Utils.i18n(`dc20rpg.sheet.resource.regain${capitalizeFirstLetter(point)}`),
                        encodedValue: [point, ''].join(this.delimiter)
                    
                    })
                    actions.push({
                        id:`${point}Add`,
                        icon1: '<i class="fa fa-plus" aria-hidden="true"></i>',
                        tooltip: coreModule.api.Utils.i18n(`dc20rpg.sheet.resource.regain${capitalizeFirstLetter(point)}`),
                        encodedValue: [point, 'add'].join(this.delimiter)
                    
                    })
                    actions.push({
                        id:`${point}Remove`,
                        icon1: '<i class="fa fa-minus" aria-hidden="true"></i>',
                        tooltip: point == "ap" ? coreModule.api.Utils.i18n('dc20rpg.sheet.resource.useAp') : coreModule.api.Utils.i18n(`dc20rpg.sheet.resource.spend${capitalizeFirstLetter(point)}`),
                        encodedValue: [point, 'remove'].join(this.delimiter)   
                    })

                    actions.push({
                        id:`${point}All`,
                        icon1: '<i class="fa-solid fa-arrows-rotate"></i>',
                        tooltip: coreModule.api.Utils.i18n('dc20rpg.sheet.resource.regainAllAp'),
                        encodedValue: [point, 'all'].join(this.delimiter)   
                    })
                    this.addActions(actions, parent);
                }
            })
        }
        _getConditions(parent) {
            let actions = [];
            const conditions = CONFIG.statusEffects;
            conditions.forEach(_status => {
                let action =  {
                    id: _status.id,
                    name: _status.label,
                    cssClass: this.actor.statuses.filter(i => i.id ==_status.id).size > 0 ? "toggle active" : "togle",
                    img: _status.img,
                    tooltip: format_tooltip(_status.description),
                    encodedValue: ['statuses', _status.id].join(this.delimiter)
                }
                actions.push(action)
            })
            this.addActions(actions, parent); 
        }
    }
})