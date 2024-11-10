export let DC20RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    DC20RollHandler = class DC20RollHandler extends coreModule.api.RollHandler {
        
        async handleActionClick(event, encodedValue) {
            let payload = encodedValue.split("|");
            let macroType = payload[0];
            let actionId = payload[1];

            switch (macroType) {
                case "promptRoll":
                    const details = JSON.parse(actionId);
                    game.dc20rpg.tools.promptRoll(this.actor, details)
                    break;
                case 'exhaustion':
                    let ex = this.actor.system.exhaustion;
                    if (event.type == "click") {
                        ex += 1;
                    } else {
                        ex -=1;
                    }
                    if (ex > -1 && ex < 7)
                        this.actor.update({[`system.exhaustion`] : ex});
                    break;
                case "initiative":
                    this._toggleInitiative();
                    break;
                case "mana": 
                case "ap":
                case "stamina":
                case "grit":
                case "health":
                    this._updatePoints(event, macroType, actionId)
                break;
                case "actions":
                case "item":
                case "weapons":
                case "cantrips":
                case "consumables":
                case "spells":
                case "maneuvers":
                case "attacks":
                case "defenses":
                case "saves":
                    this._rollItem(event, macroType, actionId);
                    break;
                case "effects":
                case "statuses":
                    await this._toggleStatus(macroType, actionId);
                    break;
                case "check":
                case "save":
                    this._rollAttribute(event, macroType, actionId);
                    break;
                case "attackMod":
                    this._rollOtherChecks(event, macroType, actionId);
                    break;
                case "knowledge":
                case "skills":
                    this._rollSkill(event, actionId, this.token.actor);
                    break;
                case "trade":
                    this._rollTradeSkill(event, actionId, this.token.actor);
                    break;
                case "maneuver":
                    const driver = await fromUuid(this.actor.system.driver.id)
                    this._rollSkill(event, actionId, driver);
                    break;
                case "rest":
                    game.dc20rpg.tools.createRestDialog(this.actor);
                    break;
                case 'doomed':
                    const new_value = event.type == "click" ? (this.actor.system.death.doomed + 1 ) : (this.actor.system.death.doomed - 1);
                    if (new_value > 0 && actionId != "all") {
                        this.actor.update({[`system.death.doomed`] : new_value});
                    } else if (actionId == "all") {
                        this.actor.update({[`system.death.doomed`] : 0});
                    }
                    break;
                case 'flat':
                    const flat_roll = {
                        checkKey: "flat",
                        roll: "d20",
                        label: coreModule.api.Utils.i18n(`dc20rpg.sheet.rollMenu.flat`),
                        type: ""
                    };
                    game.dc20rpg.tools.promptRoll(this.actor, flat_roll)
                    break;
            }
        }
        _updatePoints(event, item, action) {
            const new_value = action == "remove" || event.type == "click" ? (this.actor.system.resources[item].value - 1) : (this.actor.system.resources[item].value + 1);
            if ((new_value >= 0 && new_value <= this.actor.system.resources[item].max && action != "all") || (item == "health" && action != "all")) {
                this.actor.update({[`system.resources.${item}.value`] : new_value});
            } else if (action == "all") {
                const max = this.actor.system.resources[item].max;
                this.actor.update({[`system.resources.${item}.value`] : max});
            }
        }

        /** @private */
        async _rollItem(event, macroType, actionId) {
            game.dc20rpg.tools.promptItemRoll(this.token.actor, this.token.actor.items.get(actionId))
        }

        /** @private */
        async _toggleStatus(event, actionId) {
            if (this.actor.statuses.filter(el => el.id === actionId).size) {
                this.actor.toggleStatusEffect(actionId, { active: false });
            } else {
                this.actor.toggleStatusEffect(actionId, { active: true });
            }
            Hooks.callAll('forceUpdateTokenActionHud');
        }
        async _toggleInitiative() {
            if (this.actor.flags.dc20rpg.rollMenu.initiative) {
                this.actor.update({
                    'flags.dc20rpg.rollMenu.initiative': false
                  });
            } else {
                this.actor.update({
                    'flags.dc20rpg.rollMenu.initiative': true
                  });
            }
            Hooks.callAll('forceUpdateTokenActionHud');
        }

        _rollOtherChecks(event, macroType, actionId) {
            if (actionId == "marCheck") {
                const details = {
                    checkKey: "mar",
                    roll: "d20+@special.marCheck",
                    label: coreModule.api.Utils.i18n(`dc20rpg.sheet.rollMenu.martial`),
                    type: "skillCheck"
                };
                game.dc20rpg.tools.promptRoll(this.actor, details)

            } else {
                const check_type = actionId == "spell" ? "spellCheck" : "attackCheck";
                const details = {
                    checkKey: actionId == "spell" ? "spe" : "att",
                    roll: "d20+@"+macroType+".value."+actionId,
                    label: coreModule.api.Utils.i18n(`dc20rpg.sheet.checkSave.${check_type}`),
                    type: check_type
                };
                game.dc20rpg.tools.promptRoll(this.actor, details)
            }
            
        }
        /** @private */
        _rollAttribute(event, macroType, actionId) {
            const details = {
                checkKey: actionId,
                roll: "d20+@attributes."+actionId+"."+macroType,
                label: coreModule.api.Utils.i18n(`dc20rpg.attributes.${actionId}`) +" "+String(macroType).charAt(0).toUpperCase() + String(macroType).slice(1),
                type: "attribute"+String(macroType).charAt(0).toUpperCase() + String(macroType).slice(1)
            };
            game.dc20rpg.tools.promptRoll(this.actor, details)
        }
        /** @private */
        _rollSkill(event, actionId, actor) {
            const actorId = this.token.actor.id;
            const details = {
                checkKey: actionId,
                roll: "d20+@skills."+actionId+".modifier",
                label: coreModule.api.Utils.i18n(`dc20rpg.skills.${actionId}`) +" Check",
                type: "skillCheck"
            };
            game.dc20rpg.tools.promptRoll(this.actor, details)
        }

        _rollTradeSkill(event, actionId, actor) {
            const actorId = this.token.actor.id;
            const details = {
                checkKey: actionId,
                roll: "d20+@tradeSkills."+actionId+".modifier",
                label: coreModule.api.Utils.i18n(`dc20rpg.trades.${actionId}`) +" Check",
                type: "skillCheck"
            };
            game.dc20rpg.tools.promptRoll(this.actor, details)
        }
    }
})
