export let DC20RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    DC20RollHandler = class DC20RollHandler extends coreModule.api.RollHandler {
        
        async handleActionClick(event, encodedValue) {
            let payload = encodedValue.split("|");
            let macroType = payload[0];
            let actionId = payload[1];

            switch (macroType) {
                case "mana": 
                case "ap":
                case "stamina":
                case "grit":
                    this._updatePoints(event, macroType, actionId)
                break;
                case "actions":
                case "item":
                case "weapons":
                case "cantrips":
                case "consumables":
                case "spells":
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
            }
        }

        _updatePoints(event, item, action) {
            const new_value = action == "remove" ? (this.actor.system.resources[item].value - 1) : (this.actor.system.resources[item].value + 1);
            if (new_value >= 0 && new_value <= this.actor.system.resources[item].max && action != "all") {  
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

        /** @private */
        _rollAttribute(event, macroType, actionId) {
            const actorId = this.token.actor.id;
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