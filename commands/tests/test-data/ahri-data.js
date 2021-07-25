module.exports = {
    "type": "champion", "format": "standAloneComplex", "version": "9.3.1", "data": {
        "Ahri": {
            "id": "Ahri",
            "key": "103",
            "name": "Ahri",
            "title": "the Nine-Tailed Fox",
            "image": {
                "full": "Ahri.png",
                "sprite": "champion0.png",
                "group": "champion",
                "x": 48,
                "y": 0,
                "w": 48,
                "h": 48
            },
            "skins": [{"id": "103000", "num": 0, "name": "default", "chromas": false}, {
                "id": "103001",
                "num": 1,
                "name": "Dynasty Ahri",
                "chromas": false
            }, {"id": "103002", "num": 2, "name": "Midnight Ahri", "chromas": false}, {
                "id": "103003",
                "num": 3,
                "name": "Foxfire Ahri",
                "chromas": false
            }, {"id": "103004", "num": 4, "name": "Popstar Ahri", "chromas": true}, {
                "id": "103005",
                "num": 5,
                "name": "Challenger Ahri",
                "chromas": false
            }, {"id": "103006", "num": 6, "name": "Academy Ahri", "chromas": false}, {
                "id": "103007",
                "num": 7,
                "name": "Arcade Ahri",
                "chromas": false
            }, {"id": "103014", "num": 14, "name": "Star Guardian Ahri", "chromas": false}, {
                "id": "103015",
                "num": 15,
                "name": "K/DA Ahri",
                "chromas": false
            }],
            "lore": "Innately connected to the latent power of Runeterra, Ahri is a vastaya who can reshape magic into orbs of raw energy. She revels in toying with her prey by manipulating their emotions before devouring their life essence. Despite her predatory nature, Ahri retains a sense of empathy as she receives flashes of memory from each soul she consumes.",
            "blurb": "Innately connected to the latent power of Runeterra, Ahri is a vastaya who can reshape magic into orbs of raw energy. She revels in toying with her prey by manipulating their emotions before devouring their life essence. Despite her predatory nature...",
            "allytips": ["Use Charm to set up your combos, it will make landing Orb of Deception and Fox-Fire dramatically easier.", "Initiate team fights using Charm, and chase down stragglers with Spirit Rush.", "Spirit Rush enables Ahri's abilities, it opens up paths for Charm, helps double hitting with Orb of Deception, and closes to make use of Fox-Fire."],
            "enemytips": ["Ahri's survivability is dramatically reduced when her Ultimate, Spirit Rush, is down.", "Stay behind minions to make Charm difficult to land, this will reduce Ahri's damage potential significantly."],
            "tags": ["Mage", "Assassin"],
            "partype": "Mana",
            "info": {"attack": 3, "defense": 4, "magic": 8, "difficulty": 5},
            "stats": {
                "hp": 526,
                "hpperlevel": 92,
                "mp": 418,
                "mpperlevel": 25,
                "movespeed": 330,
                "armor": 20.88,
                "armorperlevel": 3.5,
                "spellblock": 30,
                "spellblockperlevel": 0.5,
                "attackrange": 550,
                "hpregen": 6.5,
                "hpregenperlevel": 0.6,
                "mpregen": 8,
                "mpregenperlevel": 0.8,
                "crit": 0,
                "critperlevel": 0,
                "attackdamage": 53.04,
                "attackdamageperlevel": 3,
                "attackspeedperlevel": 2,
                "attackspeed": 0.668
            },
            "spells": [
                {
                "id": "AhriOrbofDeception",
                "name": "Orb of Deception",
                "description": "Ahri sends out and pulls back her orb, dealing magic damage on the way out and true damage on the way back. After earning several spell hits, Ahri's next orb hits will restore her health.",
                "tooltip": "Deals {{ e1 }} <scaleAP>(+{{ a1 }})</scaleAP> magic damage on the way out, and {{ e1 }} <scaleAP>(+{{ a1 }})</scaleAP> true damage on the way back.<br /><br />Ahri's abilities generate Essence Theft stacks when they hit enemies (max {{ f4.0 }} per cast). At {{ f3.0 }} stacks, Ahri's next Orb of Deception that lands a hit will restore <scaleLevel>{{ f1.0 }}</scaleLevel> <scaleAP>(+{{ f2.-1 }})</scaleAP> health for each enemy hit.",
                "leveltip": {
                    "label": ["Damage", "@AbilityResourceName@ Cost"],
                    "effect": ["{{ e1 }} -> {{ e1NL }}", "{{ cost }} -> {{ costNL }}"]
                },
                "maxrank": 5,
                "cooldown": [7, 7, 7, 7, 7],
                "cooldownBurn": "7",
                "cost": [65, 70, 75, 80, 85],
                "costBurn": "65/70/75/80/85",
                "datavalues": {},
                "effect": [null, [40, 65, 90, 115, 140], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "40/65/90/115/140", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
                "vars": [{"link": "spelldamage", "coeff": 0.35, "key": "a1"}, {
                    "link": "spelldamage",
                    "coeff": 0.35,
                    "key": "a1"
                }],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [880, 880, 880, 880, 880],
                "rangeBurn": "880",
                "image": {
                    "full": "AhriOrbofDeception.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 240,
                    "y": 96,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }, {
                "id": "AhriFoxFire",
                "name": "Fox-Fire",
                "description": "Ahri releases three fox-fires, that lock onto and attack nearby enemies.",
                "tooltip": "Releases fox-fires that seek nearby enemies and deal {{ e1 }} <scaleAP>(+{{ a1 }})</scaleAP> magic damage.<br /><br />Enemies hit with multiple fox-fires take {{ e2 }}% damage from each additional fox-fire beyond the first, for a maximum of <scaleAP>{{ f1 }}</scaleAP> damage to a single enemy.<br /><br /><rules>Fox-fire prioritizes champions recently hit by Charm, then enemies Ahri recently attacked.<br />If Fox-fire cannot find a priority target, it targets champions over the nearest enemy if possible.</rules>",
                "leveltip": {
                    "label": ["Damage", "Cooldown"],
                    "effect": ["{{ e1 }} -> {{ e1NL }}", "{{ cooldown }} -> {{ cooldownNL }}"]
                },
                "maxrank": 5,
                "cooldown": [9, 8, 7, 6, 5],
                "cooldownBurn": "9/8/7/6/5",
                "cost": [40, 40, 40, 40, 40],
                "costBurn": "40",
                "datavalues": {},
                "effect": [null, [40, 65, 90, 115, 140], [30, 30, 30, 30, 30], [0.25, 0.25, 0.25, 0.25, 0.25], [150, 150, 150, 150, 150], [550, 550, 550, 550, 550], [5, 5, 5, 5, 5], [0.4, 0.4, 0.4, 0.4, 0.4], [725, 725, 725, 725, 725], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "40/65/90/115/140", "30", "0.25", "150", "550", "5", "0.4", "725", "0", "0"],
                "vars": [{"link": "spelldamage", "coeff": 0.3, "key": "a1"}],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [700, 700, 700, 700, 700],
                "rangeBurn": "700",
                "image": {
                    "full": "AhriFoxFire.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 288,
                    "y": 96,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }, {
                "id": "AhriSeduce",
                "name": "Charm",
                "description": "Ahri blows a kiss that damages and charms an enemy it encounters, causing them to walk harmlessly towards her and take more damage from her abilities.",
                "tooltip": "Blows a kiss dealing {{ e1 }} <scaleAP>(+{{ a1 }})</scaleAP> magic damage and charms an enemy causing them to walk harmlessly towards Ahri for {{ e2 }} second(s).<br /><br />Enemies hit by Charm become vulnerable for {{ e5 }} seconds, taking {{ e4 }}% more damage from Ahri's abilities.",
                "leveltip": {
                    "label": ["Damage", "Duration"],
                    "effect": ["{{ e1 }} -> {{ e1NL }}", "{{ e2 }} -> {{ e2NL }}"]
                },
                "maxrank": 5,
                "cooldown": [12, 12, 12, 12, 12],
                "cooldownBurn": "12",
                "cost": [70, 70, 70, 70, 70],
                "costBurn": "70",
                "datavalues": {},
                "effect": [null, [60, 90, 120, 150, 180], [1.4, 1.55, 1.7, 1.85, 2], [-0.65, -0.65, -0.65, -0.65, -0.65], [20, 20, 20, 20, 20], [5, 5, 5, 5, 5], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "60/90/120/150/180", "1.4/1.55/1.7/1.85/2", "-0.65", "20", "5", "0", "0", "0", "0", "0"],
                "vars": [{"link": "spelldamage", "coeff": 0.4, "key": "a1"}],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [975, 975, 975, 975, 975],
                "rangeBurn": "975",
                "image": {
                    "full": "AhriSeduce.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 336,
                    "y": 96,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }, {
                "id": "AhriTumble",
                "name": "Spirit Rush",
                "description": "Ahri dashes forward and fires essence bolts, damaging nearby enemies. Spirit Rush can be cast up to three times before going on cooldown.",
                "tooltip": "Nimbly dashes forward firing {{ e2 }} essence bolts at nearby enemies (prioritizing champions) dealing {{ e1 }} <scaleAP>(+{{ a1 }})</scaleAP> magic damage.<br /><br />Can be cast up to {{ e3 }} times within {{ e6 }} seconds before going on cooldown.",
                "leveltip": {
                    "label": ["Damage", "Cooldown"],
                    "effect": ["{{ e1 }} -> {{ e1NL }}", "{{ cooldown }} -> {{ cooldownNL }}"]
                },
                "maxrank": 3,
                "cooldown": [130, 105, 80],
                "cooldownBurn": "130/105/80",
                "cost": [100, 100, 100],
                "costBurn": "100",
                "datavalues": {},
                "effect": [null, [60, 90, 120], [3, 3, 3], [3, 3, 3], [500, 500, 500], [1200, 1200, 1200], [10, 10, 10], [600, 600, 600], [1, 1, 1], [0, 0, 0], [0, 0, 0]],
                "effectBurn": [null, "60/90/120", "3", "3", "500", "1200", "10", "600", "1", "0", "0"],
                "vars": [{"link": "spelldamage", "coeff": 0.35, "key": "a1"}],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [450, 450, 450],
                "rangeBurn": "450",
                "image": {
                    "full": "AhriTumble.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 384,
                    "y": 96,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }],
            "passive": {
                "name": "Vastayan Grace",
                "description": "Whenever Ahri's spells hit a champion 2 times within a short period, she briefly gains movement speed.",
                "image": {
                    "full": "Ahri_SoulEater2.png",
                    "sprite": "passive0.png",
                    "group": "passive",
                    "x": 48,
                    "y": 0,
                    "w": 48,
                    "h": 48
                }
            },
            "recommended": [{
                "champion": "Ahri",
                "title": "AhriARAM",
                "map": "HA",
                "mode": "ARAM",
                "type": "riot",
                "customTag": "",
                "sortrank": 0,
                "extensionPage": false,
                "customPanel": null,
                "blocks": [{
                    "type": "starting",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3073", "count": 1, "hideCount": false}, {
                        "id": "1001",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "2003", "count": 5, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3007", "count": 1, "hideCount": false}, {
                        "id": "3020",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3165", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3089", "count": 1, "hideCount": false}, {
                        "id": "3135",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3907", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3116", "count": 1, "hideCount": false}, {
                        "id": "3157",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3102", "count": 1, "hideCount": false}]
                }, {
                    "type": "offmeta",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3078", "count": 1, "hideCount": false}, {
                        "id": "3508",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3094", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "2003", "count": 1, "hideCount": false}, {
                        "id": "2139",
                        "count": 1,
                        "hideCount": false
                    }]
                }]
            }, {
                "champion": "Ahri",
                "title": "AhriCS",
                "map": "CrystalScar",
                "mode": "ODIN",
                "type": "riot",
                "customTag": "",
                "extensionPage": false,
                "customPanel": null,
                "blocks": [{
                    "type": "starting",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1056", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 2,
                        "hideCount": false
                    }, {"id": "3340", "count": 1, "hideCount": false}]
                }, {
                    "type": "early",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3802",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "1058", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3165",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3285", "count": 1, "hideCount": false}]
                }, {
                    "type": "standard",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3116", "count": 1, "hideCount": false}, {
                        "id": "3001",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3135", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3157", "count": 1, "hideCount": false}, {
                        "id": "3089",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3151", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2055",
                        "count": 1,
                        "hideCount": true
                    }, {"id": "2139", "count": 1, "hideCount": true}]
                }]
            }, {
                "champion": "Ahri",
                "title": "AhriFIRSTBLOOD",
                "map": "HA",
                "mode": "FIRSTBLOOD",
                "type": "riot",
                "customTag": "",
                "sortrank": 0,
                "extensionPage": false,
                "customPanel": null,
                "blocks": [{
                    "type": "starting",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1056", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 2,
                        "hideCount": false
                    }, {"id": "3340", "count": 1, "hideCount": false}]
                }, {
                    "type": "early",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3114",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "1058", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3165",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3285", "count": 1, "hideCount": false}]
                }, {
                    "type": "standard",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3089", "count": 1, "hideCount": false}, {
                        "id": "3157",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3135", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3001", "count": 1, "hideCount": false}, {
                        "id": "3116",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3174", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2139",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Ahri",
                "title": "AhriKINGPORO",
                "map": "HA",
                "mode": "KINGPORO",
                "type": "riot",
                "customTag": "",
                "extensionPage": false,
                "customPanel": null,
                "blocks": [{
                    "type": "KingPoroSnax",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3680", "count": 1, "hideCount": false}, {
                        "id": "3681",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3682", "count": 1, "hideCount": false}, {"id": "3683", "count": 1, "hideCount": false}]
                }, {
                    "type": "starting",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3112", "count": 1, "hideCount": false}, {
                        "id": "1001",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "2031", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3165", "count": 1, "hideCount": false}, {
                        "id": "3285",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3020", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3089", "count": 1, "hideCount": false}, {
                        "id": "3135",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3151", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3116", "count": 1, "hideCount": false}, {
                        "id": "3157",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3001", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "2003", "count": 1, "hideCount": false}, {
                        "id": "2139",
                        "count": 1,
                        "hideCount": false
                    }]
                }]
            }, {
                "champion": "MissFortune",
                "title": "AhriNPE",
                "map": "SR",
                "mode": "TUTORIAL_MODULE_2",
                "type": "riot",
                "customTag": "",
                "sortrank": 0,
                "extensionPage": false,
                "customPanel": null,
                "blocks": [{
                    "type": "npe1",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "1052", "count": 2, "hideCount": false}, {
                        "id": "1027",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3802", "count": 1, "hideCount": false}]
                }, {
                    "type": "npe2",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3802", "count": 1, "hideCount": false}, {
                        "id": "1026",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3285", "count": 1, "hideCount": false}]
                }, {
                    "type": "npe3",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3020",
                        "count": 1,
                        "hideCount": false
                    }]
                }, {
                    "type": "npe4",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3116", "count": 1, "hideCount": false}, {
                        "id": "3151",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3089", "count": 1, "hideCount": false}, {
                        "id": "3115",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3135", "count": 1, "hideCount": false}]
                }]
            }, {
                "champion": "MissFortune",
                "title": "AhriNPE",
                "map": "SR",
                "mode": "TUTORIAL_MODULE_3",
                "type": "riot",
                "customTag": "",
                "sortrank": 0,
                "extensionPage": false,
                "customPanel": null,
                "blocks": [{
                    "type": "npe1",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "1052", "count": 2, "hideCount": false}, {
                        "id": "1027",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3802", "count": 1, "hideCount": false}]
                }, {
                    "type": "npe2",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3802", "count": 1, "hideCount": false}, {
                        "id": "1026",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3285", "count": 1, "hideCount": false}]
                }, {
                    "type": "npe3",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3020",
                        "count": 1,
                        "hideCount": false
                    }]
                }, {
                    "type": "npe4",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3116", "count": 1, "hideCount": false}, {
                        "id": "3151",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3089", "count": 1, "hideCount": false}, {
                        "id": "3115",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3135", "count": 1, "hideCount": false}]
                }]
            }, {
                "champion": "Ahri",
                "title": "AhriSG",
                "map": "CityPark",
                "mode": "STARGUARDIAN",
                "type": "riot",
                "customTag": "",
                "requiredPerk": "",
                "sortrank": 0,
                "extensionPage": false,
                "customPanel": null,
                "blocks": [{
                    "type": "starting",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1056", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 2,
                        "hideCount": false
                    }, {"id": "3340", "count": 1, "hideCount": false}]
                }, {
                    "type": "early",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3802",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "1058", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3165",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3285", "count": 1, "hideCount": false}]
                }, {
                    "type": "standard",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3116", "count": 1, "hideCount": false}, {
                        "id": "3135",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3102", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3157", "count": 1, "hideCount": false}, {
                        "id": "3089",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3151", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2055",
                        "count": 1,
                        "hideCount": true
                    }, {"id": "2139", "count": 1, "hideCount": true}]
                }]
            }, {
                "champion": "Ahri",
                "title": "AhriSIEGE",
                "map": "SR",
                "mode": "SIEGE",
                "type": "riot",
                "customTag": "",
                "extensionPage": false,
                "customPanel": null,
                "blocks": [{
                    "type": "siegeOffense",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3631", "count": 1, "hideCount": false}, {
                        "id": "3641",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3647", "count": 1, "hideCount": false}, {
                        "id": "3635",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3642", "count": 1, "hideCount": false}]
                }, {
                    "type": "siegeDefense",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3634", "count": 1, "hideCount": false}, {
                        "id": "3640",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3643", "count": 1, "hideCount": false}, {
                        "id": "3636",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3642", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3165",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3285", "count": 1, "hideCount": false}]
                }, {
                    "type": "standard",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3116", "count": 1, "hideCount": false}, {
                        "id": "3001",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3135", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3157", "count": 1, "hideCount": false}, {
                        "id": "3089",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3151", "count": 1, "hideCount": false}]
                }]
            }, {
                "champion": "Ahri",
                "title": "AhriSL",
                "map": "SL",
                "mode": "GAMEMODEX",
                "type": "riot",
                "customTag": "",
                "sortrank": 0,
                "extensionPage": false,
                "useObviousCheckmark": false,
                "customPanel": null,
                "blocks": [{
                    "type": "starting",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "4203", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 2,
                        "hideCount": false
                    }, {"id": "3340", "count": 1, "hideCount": false}]
                }, {
                    "type": "startingjungle",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "4101", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 1,
                        "hideCount": false
                    }]
                }, {
                    "type": "early",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3802",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "1026", "count": 1, "hideCount": false}]
                }, {
                    "type": "earlyjungle",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3108", "count": 1, "hideCount": false}, {
                        "id": "1001",
                        "count": 1,
                        "hideCount": false
                    }]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3285",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3165", "count": 1, "hideCount": false}]
                }, {
                    "type": "essentialjungle",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "4104", "count": 1, "hideCount": false}, {
                        "id": "3020",
                        "count": 1,
                        "hideCount": false
                    }]
                }, {
                    "type": "standard",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3089", "count": 1, "hideCount": false}, {
                        "id": "3135",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3102", "count": 1, "hideCount": false}]
                }, {
                    "type": "standard",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3165", "count": 1, "hideCount": false}, {
                        "id": "3089",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3135", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3116", "count": 1, "hideCount": false}, {
                        "id": "3157",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3907", "count": 1, "hideCount": false}, {"id": "3128", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3128", "count": 1, "hideCount": false}, {
                        "id": "3157",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3285", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2139",
                        "count": 1,
                        "hideCount": true
                    }, {"id": "3340", "count": 1, "hideCount": false}]
                }]
            }, {
                "champion": "Ahri",
                "title": "AhriSR",
                "map": "SR",
                "mode": "CLASSIC",
                "type": "riot",
                "customTag": "",
                "sortrank": 0,
                "extensionPage": false,
                "useObviousCheckmark": false,
                "customPanel": null,
                "blocks": [{
                    "type": "starting",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "1056", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 2,
                        "hideCount": false
                    }, {"id": "3340", "count": 1, "hideCount": false}]
                }, {
                    "type": "early",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3802", "count": 1, "hideCount": false}, {
                        "id": "1001",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "1026", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3285",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3165", "count": 1, "hideCount": false}]
                }, {
                    "type": "standard",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3135", "count": 1, "hideCount": false}, {
                        "id": "3089",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3102", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3157", "count": 1, "hideCount": false}, {
                        "id": "3907",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3152", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2139",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Ahri",
                "title": "AhriTT",
                "map": "TT",
                "mode": "CLASSIC",
                "type": "riot",
                "customTag": "",
                "sortrank": 0,
                "extensionPage": false,
                "customPanel": null,
                "blocks": [{
                    "type": "starting",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "1056",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "2031", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3090",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3285", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3135", "count": 1, "hideCount": false}, {
                        "id": "3165",
                        "count": 1,
                        "hideCount": false
                    }]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3152", "count": 1, "hideCount": false}, {
                        "id": "3116",
                        "count": 1,
                        "hideCount": false
                    }]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2139",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Ahri",
                "title": "Beginner",
                "type": "riot",
                "map": "SR",
                "mode": "INTRO",
                "priority": false,
                "blocks": [{
                    "type": "beginner_Starter",
                    "maxSummonerLevel": 4,
                    "items": [{"id": "1056", "count": 1}]
                }, {
                    "type": "beginner_Starter",
                    "minSummonerLevel": 5,
                    "items": [{"id": "1056", "count": 1}, {"id": "2003", "count": 1}]
                }, {
                    "type": "beginner_Advanced",
                    "recMath": true,
                    "items": [{"id": "1028", "count": 1}, {"id": "1027", "count": 1}, {"id": "3010", "count": 1}]
                }, {
                    "type": "beginner_MovementSpeed",
                    "recMath": true,
                    "items": [{"id": "1001", "count": 1}, {"id": "3020", "count": 1}]
                }, {
                    "type": "beginner_LegendaryItem",
                    "recMath": true,
                    "items": [{"id": "3010", "count": 1}, {"id": "1026", "count": 1}, {"id": "3027", "count": 1}]
                }, {
                    "type": "beginner_MoreLegendaryItems",
                    "items": [{"id": "3151", "count": 1}, {"id": "3174", "count": 1}, {
                        "id": "3116",
                        "count": 1
                    }, {"id": "3089", "count": 1}]
                }]
            }]
        }
    }
}