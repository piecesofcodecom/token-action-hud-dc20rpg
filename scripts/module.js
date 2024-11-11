import { DC20ActionHandler } from './action-handler.js'
import { DC20RollHandler as CoreRoll } from './core-rollhandler.js'
import { MODULE } from './constants.js'

export let DC20SystemManager = null

export let DEFAULTS = null

Hooks.on('tokenActionHudCoreApiReady', async (coreModule) => {
    DC20SystemManager = class DC20SystemManager extends coreModule.api.SystemManager {
        /** @override */
        getActionHandler() {
            return new DC20ActionHandler()
        }

        getAvailableRollHandlers() {
            let coreTitle = "dc20rpg"
            let choices = { core: "Core DC20 RPG" }
            choices = { core: coreTitle }
            DC20SystemManager.addHandler(choices, 'dc20rpg')

            return choices
        }

        /** @override */
        getRollHandler(handlerId) {
            let rollHandler = new CoreRoll()
            return rollHandler
        }

        /** @override */
        /*registerSettings (updateFunc) {
            systemSettings.register(updateFunc)
        }*/

        async registerDefaults() {
            const GROUP = {
                check:      {id: 'check', name: coreModule.api.Utils.i18n('dc20rpg.sheet.attributes.title') + " & " + coreModule.api.Utils.i18n('DC20RPG.Check'), type: 'system' },
                save:       {id: 'save', name: coreModule.api.Utils.i18n('dc20rpg.sheet.attributes.title') + " & " + coreModule.api.Utils.i18n('DC20RPG.Save'), type: 'system' },
                ocheck:     {id: 'ocheck', name: coreModule.api.Utils.i18n('dc20rpg.dialog.settings.nav.other') + " & " + coreModule.api.Utils.i18n('DC20RPG.Check'), type: 'system'},
                osave:      {id: 'osave', name: coreModule.api.Utils.i18n('dc20rpg.dialog.settings.nav.other') + " & " + coreModule.api.Utils.i18n('DC20RPG.Save'), type: 'system'},
                skills:     {id: 'skills', name: coreModule.api.Utils.i18n('dc20rpg.sheet.skills.skillsTitle'), type: 'system' },
                knowledge:  {id: 'knowledge', name: coreModule.api.Utils.i18n('dc20rpg.sheet.skills.knowledgeTitle'), type: 'system' },
                trade:      {id: 'trade', name: coreModule.api.Utils.i18n('dc20rpg.sheet.skills.tradeTitle'), type: 'system' },
                weapons:    { id: 'weapons', name: coreModule.api.Utils.i18n('TYPES.Item.weapon'), type: 'system' },
                consumables:{ id: 'consumables', name: coreModule.api.Utils.i18n('TYPES.Item.consumable'), type: 'system' },
                spells:     { id: 'spells', name: coreModule.api.Utils.i18n('dc20rpg.sheet.nav.spells'), type: 'system' },
                cantrips:   { id: 'cantrips', name: coreModule.api.Utils.i18n('dc20rpg.sheet.cantrips.known'), type: 'system' },
                conditions: { id: 'conditions', name: coreModule.api.Utils.i18n('dc20rpg.sheet.effects.conditions'), type: 'system'},
                stamina:    { id: 'stamina', name: coreModule.api.Utils.i18n('dc20rpg.resource.stamina'), type: 'system' },
                exhaustion: { id: 'exhaustion', name: coreModule.api.Utils.i18n('dc20rpg.conditions.exhaustion'), type: 'system' },
                mana:       { id: 'mana', name: coreModule.api.Utils.i18n('dc20rpg.resource.mana'), type: 'system' },
                grit:       { id: 'grit', name: coreModule.api.Utils.i18n('dc20rpg.resource.grit'), type: 'system' },
                action:     { id: 'ap', name: coreModule.api.Utils.i18n('dc20rpg.resource.ap'), type: 'system' },
                health:     { id: 'health', name: coreModule.api.Utils.i18n('dc20rpg.resource.health'), type: 'system' },
                maneuvers:  { id: 'maneuvers', name: coreModule.api.Utils.i18n('dc20rpg.sheet.maneuvers.known'), type: 'system' },
                techniques: { id: 'techniques', name: coreModule.api.Utils.i18n('TYPES.Item.technique'), type: 'system' },
                attacks:    { id: 'attacks', name: coreModule.api.Utils.i18n('dc20rpg.sheet.checkSave.attack'), type: 'system' },
                defenses:   { id: 'defenses', name: "Defense", type: 'system' },
                saves:      { id: 'saves', name: coreModule.api.Utils.i18n("dc20rpg.dialog.display.save"), type: 'system' },
                doomed:     { id: 'doomed', name: coreModule.api.Utils.i18n('dc20rpg.sheet.doomed'), type: 'system' },
                fclass:     { id: 'feature_class', name: coreModule.api.Utils.i18n('TYPES.Item.class'), type: 'system' },
                fother:     { id: 'feature_other', name: coreModule.api.Utils.i18n('dc20rpg.dialog.settings.nav.other'), type: 'system' },
                fancestry:  { id: 'feature_ancestry', name: coreModule.api.Utils.i18n('TYPES.Item.ancestry'), type: 'system' },
                effects:    { id: 'effects', name: coreModule.api.Utils.i18n('dc20rpg.effect.sheet.effectsTab'), type: 'system' },
                utils:      { id: 'utils', name: "Utilities", type: 'system' },
                offensive:  { id: 'actions_offensive', name: "Offensive", type: 'system' },
                defensive:  { id: 'actions_defensive', name: "Defensive", type: 'system' },
                utility:    { id: "actions_utility", name: "Utility", type: "system"},
                reaction:   { id: "actions_reaction", name: "Reaction", type: "system"},
                skillBased: { id: "actions_skillBased", name: "Skill Based", type: "system"},
            }
            const groups = GROUP
            Object.values(groups).forEach(group => {
                group.name = group.name
                group.listName = `Group: ${group.name}`
            })
            const groupsArray = Object.values(groups)
            DEFAULTS = {
                layout: [
                    {
                        nestId: 'attributes',
                        id: 'attributes',
                        name: coreModule.api.Utils.i18n('dc20rpg.sheet.checkSave.title'),
                        groups: [
                            { ...groups.check, nestId: 'attributes_check' },
                            { ...groups.save, nestId: 'attributes_save' },
                            { ...groups.ocheck, nestId: 'attributes_ocheck'},
                            { ...groups.osave, nestId: 'attributes_osave'}
                        ]
                    },
                    {
                        nestId: 'skills',
                        id: 'skills',
                        name: coreModule.api.Utils.i18n('dc20rpg.sheet.skills.skillsTitle'),
                        groups: [
                            { ...groups.skills, nestId: 'skills_skills' },
                            { ...groups.trade, nestId: 'skills_trade' },
                            { ...groups.knowledge, nestId: 'skills_knowledge' }
                        ]
                    },
                    {
                        nestId: 'actions',
                        id: 'actions',
                        name: "Actions",
                        groups: [
                            { ...groups.offensive, nestId: 'actions_offensive' },
                            { ...groups.defensive, nestId: 'actions_defensive' },
                            { ...groups.utility, nestId: 'actions_utility' },
                            { ...groups.reaction, nestId: 'actions_reaction' },
                            { ...groups.skillBased, nestId: 'actions_skillBased' },
                        ]
                    },
                    {
                        nestId: 'weapons',
                        id: 'weapons',
                        name: coreModule.api.Utils.i18n('TYPES.Item.equipment'),
                        groups: [
                            { ...groups.weapons, nestId: 'weapons_weapons' },
                            { ...groups.consumables, nestId: 'weapons_consumables' }
                        ]
                    },
                    {
                        nestId: 'spells',
                        id: 'spells',
                        name: coreModule.api.Utils.i18n('dc20rpg.sheet.nav.spells'),
                        groups: [
                            { ...groups.cantrips, nestId: 'spells_cantrips' },
                            { ...groups.spells, nestId: 'spells_spells' },
                        ]
                    },
                    {
                        nestId: 'points',
                        id: 'points',
                        name: "Points",
                        groups: [
                            { ...groups.stamina, nestId: 'points_stamina' },
                            { ...groups.mana, nestId: 'points_mana' },
                            { ...groups.grit, nestId: 'points_grit' },
                            { ...groups.action, nestId: 'points_ap' },
                            { ...groups.health, nestId: 'points_health' },
                            {...groups.doomed,  nestId: 'points_doomed'}
                        ]
                    },
                    {
                        nestId: 'conditions',
                        id: 'conditions',
                        name: coreModule.api.Utils.i18n('dc20rpg.sheet.effects.conditions'),
                        groups: [
                            { ...groups.exhaustion, nestId: 'conditions_exhaustion'},
                            { ...groups.conditions, nestId: 'conditions_conditions' }
                        ]
                    },
                    {
                        nestId: 'maneuvers',
                        id: 'maneuvers',
                        name: coreModule.api.Utils.i18n('TYPES.Item.technique'),
                        groups: [
                            { ...groups.attacks, nestId: 'maneuvers_attacks' },
                            { ...groups.defenses, nestId: 'maneuvers_defenses' },
                            { ...groups.saves, nestId: 'maneuvers_saves' },
                            { ...groups.maneuvers, nestId: 'maneuvers_maneuvers' }
                        ]
                    },
                    {
                        nestId: 'features',
                        id: 'features',
                        name: "Features",
                        groups: [
                            { ...groups.fclass, nestId: 'features_class' },
                            { ...groups.fother, nestId: 'features_other' },
                            { ...groups.fancestry, nestId: "features_ancestry"}
                        ]
                    },
                    {
                        nestId: 'effects',
                        id: 'effects',
                        name: "Effects",
                        groups: [
                            { ...groups.effects, nestId: 'effects_effects' }
                        ]
                    },
                    {
                        nestId: 'utils',
                        id: 'utils',
                        name: "Extras",
                        groups: [
                            { ...groups.utils, nestId: 'utils_utils' }
                        ]
                    }
                    
                ],
                groups: groupsArray
            }
            return DEFAULTS
        }
    }

    /* STARTING POINT */

    const module = game.modules.get(MODULE.ID);
    module.api = {
        requiredCoreModuleVersion: '2.0',
        SystemManager: DC20SystemManager 
    }
    Hooks.call('tokenActionHudSystemReady', module)
});

