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
                check:      {id: 'check', name: coreModule.api.Utils.i18n('dc20rpg.sheet.attributes.title') + " & " + coreModule.api.Utils.i18n('DC20RPG.Check'), type: 'system', settings: {collapse: false}  },
                save:       {id: 'save', name: coreModule.api.Utils.i18n('dc20rpg.sheet.attributes.title') + " & " + coreModule.api.Utils.i18n('DC20RPG.Save'), type: 'system', settings: {collapse: false}  },
                ocheck:     {id: 'ocheck', name: coreModule.api.Utils.i18n('dc20rpg.dialog.settings.nav.other') + " & " + coreModule.api.Utils.i18n('DC20RPG.Check'), type: 'system', settings: {collapse: false} },
                osave:      {id: 'osave', name: coreModule.api.Utils.i18n('dc20rpg.dialog.settings.nav.other') + " & " + coreModule.api.Utils.i18n('DC20RPG.Save'), type: 'system', settings: {collapse: false} },
                skills:     {id: 'skills', name: coreModule.api.Utils.i18n('dc20rpg.sheet.skills.skillsTitle'), type: 'system', settings: {collapse: false}  },
                knowledge:  {id: 'knowledge', name: coreModule.api.Utils.i18n('dc20rpg.sheet.skills.knowledgeTitle'), type: 'system', settings: {collapse: false}  },
                trade:      {id: 'trade', name: coreModule.api.Utils.i18n('dc20rpg.sheet.skills.tradeTitle'), type: 'system', settings: {collapse: false}  },
                weapons:    { id: 'weapons', name: coreModule.api.Utils.i18n('TYPES.Item.weapon'), type: 'system', settings: {collapse: false}  },
                consumables:{ id: 'consumables', name: coreModule.api.Utils.i18n('TYPES.Item.consumable'), type: 'system', settings: {collapse: false}  },
                spells:     { id: 'spells', name: coreModule.api.Utils.i18n('dc20rpg.sheet.nav.spells'), type: 'system', settings: {collapse: false}  },
                cantrips:   { id: 'cantrips', name: coreModule.api.Utils.i18n('dc20rpg.sheet.cantrips.known'), type: 'system', settings: {collapse: false}  },
                conditions: { id: 'conditions', name: coreModule.api.Utils.i18n('dc20rpg.sheet.effects.conditions'), type: 'system', settings: {collapse: false} },
                stamina:    { id: 'stamina', name: coreModule.api.Utils.i18n('dc20rpg.resource.stamina'), type: 'system', settings: {collapse: false}  },
                exhaustion: { id: 'exhaustion', name: coreModule.api.Utils.i18n('dc20rpg.conditions.exhaustion'), type: 'system', settings: {collapse: false}  },
                mana:       { id: 'mana', name: coreModule.api.Utils.i18n('dc20rpg.resource.mana'), type: 'system', settings: {collapse: false}  },
                grit:       { id: 'grit', name: coreModule.api.Utils.i18n('dc20rpg.resource.grit'), type: 'system', settings: {collapse: false}  },
                action:     { id: 'ap', name: coreModule.api.Utils.i18n('dc20rpg.resource.ap'), type: 'system', settings: {collapse: false}  },
                health:     { id: 'health', name: coreModule.api.Utils.i18n('dc20rpg.resource.health'), type: 'system', settings: {collapse: false}  },
                maneuvers:  { id: 'maneuvers', name: coreModule.api.Utils.i18n('dc20rpg.sheet.maneuvers.known'), type: 'system', settings: {collapse: false}  },
                techniques: { id: 'techniques', name: coreModule.api.Utils.i18n('TYPES.Item.technique'), type: 'system', settings: {collapse: false}  },
                attacks:    { id: 'attacks', name: coreModule.api.Utils.i18n('dc20rpg.sheet.checkSave.attack'), type: 'system', settings: {collapse: false}  },
                defenses:   { id: 'defenses', name: "Defense", type: 'system', settings: {collapse: false}  },
                saves:      { id: 'saves', name: coreModule.api.Utils.i18n("dc20rpg.dialog.display.save"), type: 'system', settings: {collapse: false}  },
                doomed:     { id: 'doomed', name: coreModule.api.Utils.i18n('dc20rpg.sheet.doomed'), type: 'system', settings: {collapse: false}  },
                fclass:     { id: 'feature_class', name: coreModule.api.Utils.i18n('TYPES.Item.class'), type: 'system', settings: {collapse: false}  },
                fother:     { id: 'feature_other', name: coreModule.api.Utils.i18n('dc20rpg.dialog.settings.nav.other'), type: 'system', settings: {collapse: false}  },
                fancestry:  { id: 'feature_ancestry', name: coreModule.api.Utils.i18n('TYPES.Item.ancestry'), type: 'system', settings: {collapse: false}  },
                effects:    { id: 'effects', name: coreModule.api.Utils.i18n('dc20rpg.effect.sheet.effectsTab'), type: 'system', settings: {collapse: false}  },
                utils:      { id: 'utils', name: "Utilities", type: 'system', settings: {collapse: false}  },
                offensive:  { id: 'actions_offensive', name: "Offensive", type: 'system', settings: {collapse: false}  },
                defensive:  { id: 'actions_defensive', name: "Defensive", type: 'system', settings: {collapse: false}  },
                utility:    { id: "actions_utility", name: "Utility", type: "system", settings: {collapse: false} },
                reaction:   { id: "actions_reaction", name: "Reaction", type: "system", settings: {collapse: false} },
                skillBased: { id: "actions_skillBased", name: "Skill Based", type: "system", settings: {collapse: false} },
                others:     { id: "actions_others", name: "Others", type: "system", settings: {collapse: false} },
                immunity:   { id: "immunity", name: "Immunity", type: "system", settings: {collapse: false} },
                vulnerability:   { id: "vulnerability", name: "Vulnerability", type: "system", settings: {collapse: false} },
                resistence: { id: 'resistence', name: "Resistences", type: 'system'}
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
                        ],
                        settings: {
                            image: "icons/sundries/gaming/chess-pawn-white-glass.webp",
                            collapse: false
                        }
                    },
                    {
                        nestId: 'attributes',
                        id: 'attributes',
                        name: coreModule.api.Utils.i18n('dc20rpg.sheet.checkSave.title'),
                        groups: [
                            { ...groups.check, nestId: 'attributes_check' },
                            { ...groups.save, nestId: 'attributes_save' },
                            { ...groups.ocheck, nestId: 'attributes_ocheck'},
                            { ...groups.osave, nestId: 'attributes_osave'}
                        ],
                        settings: {
                            image: "icons/sundries/gaming/dice-pair-white-green.webp",
                            collapse: false,
                            style: "list"
                        }
                    },
                    {
                        nestId: 'skills',
                        id: 'skills',
                        name: coreModule.api.Utils.i18n('dc20rpg.sheet.skills.skillsTitle'),
                        groups: [
                            { ...groups.skills, nestId: 'skills_skills' },
                            { ...groups.trade, nestId: 'skills_trade' },
                            { ...groups.knowledge, nestId: 'skills_knowledge' }
                        ],
                        image: "icons/environment/people/archer.webp",
                        settings: {
                            image: "icons/environment/people/archer.webp",
                            collapse: false
                        }
                    },
                    {
                        nestId: 'resistences',
                        id: 'resistences',
                        name: "Resistences",
                        groups: [
                            { ...groups.resistence, nestId: 'resistences_resistences' },
                            { ...groups.immunity, nestId: 'resistences_immunity'},
                            { ...groups.vulnerability, nestId: 'resistences_vulnerability'}
                        ],
                        settings: {
                            image: "icons/equipment/shield/Scutum-steel-worn.webp",
                            collapse: false
                        }
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
                            { ...groups.others, nestId: 'actions_others' },
                        ],
                        settings: {
                            image: "icons/skills/movement/arrow-upward-white.webp",
                            collapse: false
                        }
                    },
                    {
                        nestId: 'weapons',
                        id: 'weapons',
                        name: coreModule.api.Utils.i18n('TYPES.Item.equipment'),
                        groups: [
                            { ...groups.weapons, nestId: 'weapons_weapons' },
                            { ...groups.consumables, nestId: 'weapons_consumables' }
                        ],
                        settings: {
                            image: "icons/containers/bags/case-leather-tan.webp",
                            collapse: false
                        }
                    },
                    {
                        nestId: 'spells',
                        id: 'spells',
                        name: coreModule.api.Utils.i18n('dc20rpg.sheet.nav.spells'),
                        groups: [
                            { ...groups.cantrips, nestId: 'spells_cantrips' },
                            { ...groups.spells, nestId: 'spells_spells' },
                        ],
                        settings: {
                            image: "icons/magic/symbols/rune-sigil-black-pink.webp",
                            collapse: false
                        }
                    },
                    {
                        nestId: 'conditions',
                        id: 'conditions',
                        name: coreModule.api.Utils.i18n('dc20rpg.sheet.effects.conditions'),
                        groups: [
                            { ...groups.exhaustion, nestId: 'conditions_exhaustion'},
                            { ...groups.conditions, nestId: 'conditions_conditions' },
                        ],
                        settings: {
                            image: "icons/skills/wounds/injury-face-impact-orange.webp",
                            collapse: false
                        }
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
                        ],
                        settings: {
                            image: "icons/skills/movement/feet-winged-sandals-tan.webp",
                            collapse: false
                        }
                    },
                    {
                        nestId: 'features',
                        id: 'features',
                        name: "Features",
                        groups: [
                            { ...groups.fclass, nestId: 'features_class' },
                            { ...groups.fother, nestId: 'features_other' },
                            { ...groups.fancestry, nestId: "features_ancestry"}
                        ],
                        settings: {
                            image: "icons/sundries/flags/banner-symbol-eye-purple.webp",
                            collapse: false
                        }
                    },
                    {
                        nestId: 'effects',
                        id: 'effects',
                        name: "Effects",
                        groups: [
                            { ...groups.effects, nestId: 'effects_effects' }
                        ],
                        settings: {
                            image: "icons/sundries/misc/hourglass-wood.webp",
                            collapse: false
                        }
                    },
                    {
                        nestId: 'utils',
                        id: 'utils',
                        name: "Extras",
                        groups: [
                            { ...groups.utils, nestId: 'utils_utils' }
                        ],
                        settings: {
                            image: "icons/sundries/flags/banner-silver-white.webp",
                            collapse: false
                        }
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

