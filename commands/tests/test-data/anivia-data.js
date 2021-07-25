module.exports = {
    "type": "champion", "format": "standAloneComplex", "version": "9.3.1", "data": {
        "Anivia": {
            "id": "Anivia",
            "key": "34",
            "name": "Anivia",
            "title": "the Cryophoenix",
            "image": {
                "full": "Anivia.png",
                "sprite": "champion0.png",
                "group": "champion",
                "x": 240,
                "y": 0,
                "w": 48,
                "h": 48
            },
            "skins": [{"id": "34000", "num": 0, "name": "default", "chromas": false}, {
                "id": "34001",
                "num": 1,
                "name": "Team Spirit Anivia",
                "chromas": false
            }, {"id": "34002", "num": 2, "name": "Bird of Prey Anivia", "chromas": false}, {
                "id": "34003",
                "num": 3,
                "name": "Noxus Hunter Anivia",
                "chromas": false
            }, {"id": "34004", "num": 4, "name": "Hextech Anivia", "chromas": false}, {
                "id": "34005",
                "num": 5,
                "name": "Blackfrost Anivia",
                "chromas": false
            }, {"id": "34006", "num": 6, "name": "Prehistoric Anivia", "chromas": false}, {
                "id": "34007",
                "num": 7,
                "name": "Festival Queen Anivia",
                "chromas": false
            }],
            "lore": "Anivia is a benevolent winged spirit who endures endless cycles of life, death, and rebirth to protect the Freljord. A demigod born of unforgiving ice and bitter winds, she wields those elemental powers to thwart any who dare disturb her homeland. Anivia guides and protects the tribes of the harsh north, who revere her as a symbol of hope, and a portent of great change. She fights with every ounce of her being, knowing that through her sacrifice, her memory will endure, and she will be reborn into a new tomorrow.",
            "blurb": "Anivia is a benevolent winged spirit who endures endless cycles of life, death, and rebirth to protect the Freljord. A demigod born of unforgiving ice and bitter winds, she wields those elemental powers to thwart any who dare disturb her homeland...",
            "allytips": ["Timing Flash Frost with Frostbite can lead to devastating combinations.", "Anivia is extremely reliant on Mana for Glacial Storm. Try getting items with Mana or going for a Crest of the Ancient Golem buff on Summoner's Rift.", "It can be very difficult for enemy champions to kill her egg early in game. Seize the advantage by playing aggressively."],
            "enemytips": ["Try to gank Anivia when she's laning. With multiple people, it is easier to ensure that her egg dies.", "If you're playing a ranged champion, stay far enough away from Anivia so you can dodge Flash Frost more easily.", "Try to fight Anivia in the lanes. In the jungle she can block pathways with lower ranks of Crystallize."],
            "tags": ["Mage", "Support"],
            "partype": "Mana",
            "info": {"attack": 1, "defense": 4, "magic": 10, "difficulty": 10},
            "stats": {
                "hp": 480,
                "hpperlevel": 82,
                "mp": 495,
                "mpperlevel": 25,
                "movespeed": 325,
                "armor": 21.22,
                "armorperlevel": 4,
                "spellblock": 30,
                "spellblockperlevel": 0.5,
                "attackrange": 600,
                "hpregen": 5.5,
                "hpregenperlevel": 0.55,
                "mpregen": 8,
                "mpregenperlevel": 0.8,
                "crit": 0,
                "critperlevel": 0,
                "attackdamage": 51.376,
                "attackdamageperlevel": 3.2,
                "attackspeedperlevel": 1.68,
                "attackspeed": 0.625
            },
            "spells": [{
                "id": "FlashFrost",
                "name": "Flash Frost",
                "description": "Anivia brings her wings together and summons a sphere of ice that flies towards her opponents, chilling and damaging anyone in its path. When the sphere explodes it does moderate damage in a radius, stunning anyone in the area.",
                "tooltip": "A massive chunk of ice flies toward target location, dealing {{ e1 }} <scaleAP>(+{{ a1 }})</scaleAP> magic damage. <br /><br />At the end of its range or if Anivia activates the spell again, the missile detonates, doing {{ e1 }} <scaleAP>(+{{ a1 }})</scaleAP> magic damage in a small area and stunning units for {{ e4 }} seconds.<br /><br />Enemies damaged by Flash Frost are also slowed by {{ f1 }}% for {{ e5 }} seconds.",
                "leveltip": {
                    "label": ["Damage", "Stun Duration", "Cooldown", "@AbilityResourceName@ Cost"],
                    "effect": ["{{ e1 }} -> {{ e1NL }}", "{{ e4 }} -> {{ e4NL }}", "{{ cooldown }} -> {{ cooldownNL }}", "{{ cost }} -> {{ costNL }}"]
                },
                "maxrank": 5,
                "cooldown": [10, 9.5, 9, 8.5, 8],
                "cooldownBurn": "10/9.5/9/8.5/8",
                "cost": [80, 90, 100, 110, 120],
                "costBurn": "80/90/100/110/120",
                "datavalues": {},
                "effect": [null, [60, 85, 110, 135, 160], [13, 12, 11, 10, 9], [0, 0, 0, 0, 0], [1.1, 1.2, 1.3, 1.4, 1.5], [3, 3, 3, 3, 3], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "60/85/110/135/160", "13/12/11/10/9", "0", "1.1/1.2/1.3/1.4/1.5", "3", "0", "0", "0", "0", "0"],
                "vars": [{"link": "spelldamage", "coeff": 0.45, "key": "a1"}, {
                    "link": "spelldamage",
                    "coeff": 0.45,
                    "key": "a1"
                }],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [1075, 1075, 1075, 1075, 1075],
                "rangeBurn": "1075",
                "image": {
                    "full": "FlashFrost.png",
                    "sprite": "spell1.png",
                    "group": "spell",
                    "x": 48,
                    "y": 0,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }, {
                "id": "Crystallize",
                "name": "Crystallize",
                "description": "Anivia condenses the moisture in the air into an impassable wall of ice to block all movement. The wall only lasts a short duration before it melts.",
                "tooltip": "Anivia summons an impassable wall of ice {{ e2 }} units wide, blocking all movement. The wall lasts for {{ e1 }} seconds before it melts.",
                "leveltip": {"label": ["Width"], "effect": ["{{ e2 }} -> {{ e2NL }}"]},
                "maxrank": 5,
                "cooldown": [17, 17, 17, 17, 17],
                "cooldownBurn": "17",
                "cost": [70, 70, 70, 70, 70],
                "costBurn": "70",
                "datavalues": {},
                "effect": [null, [5, 5, 5, 5, 5], [400, 500, 600, 700, 800], [4, 5, 6, 7, 8], [120, 120, 120, 120, 120], [250, 250, 250, 250, 250], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "5", "400/500/600/700/800", "4/5/6/7/8", "120", "250", "0", "0", "0", "0", "0"],
                "vars": [],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [1000, 1000, 1000, 1000, 1000],
                "rangeBurn": "1000",
                "image": {
                    "full": "Crystallize.png",
                    "sprite": "spell1.png",
                    "group": "spell",
                    "x": 96,
                    "y": 0,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }, {
                "id": "Frostbite",
                "name": "Frostbite",
                "description": "With a flap of her wings, Anivia blasts a freezing gust of wind at her target, dealing a low amount of damage. If the target was recently stunned by Flash Frost or damaged by a fully formed Glacial Storm, the damage they take is doubled.",
                "tooltip": "Anivia blasts her target with a freezing wind, dealing {{ e1 }} <scaleAP>(+{{ a1 }})</scaleAP> magic damage. <br /><br />If a target was recently stunned by Anivia or damaged by a fully formed Glacial Storm, they take double damage.",
                "leveltip": {
                    "label": ["Damage", "@AbilityResourceName@ Cost"],
                    "effect": ["{{ e1 }} -> {{ e1NL }}", "{{ cost }} -> {{ costNL }}"]
                },
                "maxrank": 5,
                "cooldown": [4, 4, 4, 4, 4],
                "cooldownBurn": "4",
                "cost": [50, 60, 70, 80, 90],
                "costBurn": "50/60/70/80/90",
                "datavalues": {},
                "effect": [null, [50, 75, 100, 125, 150], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "50/75/100/125/150", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
                "vars": [{"link": "spelldamage", "coeff": 0.5, "key": "a1"}],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [650, 650, 650, 650, 650],
                "rangeBurn": "650",
                "image": {
                    "full": "Frostbite.png",
                    "sprite": "spell1.png",
                    "group": "spell",
                    "x": 144,
                    "y": 0,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }, {
                "id": "GlacialStorm",
                "name": "Glacial Storm",
                "description": "Anivia summons a driving rain of ice and hail to damage her enemies and slow their advance.",
                "tooltip": "<spellPassive>Activate: </spellPassive>Drains {{ e2 }} Mana per second. <br /><br />Anivia calls forth a driving rain of ice and hail that increases in size over {{ e7 }} seconds, dealing {{ e1 }} <scaleAP>(+{{ a1 }})</scaleAP> magic damage per second to targets and slowing their Movement Speed by {{ e4 }}%. <br /><br />When the Glacial Storm is fully formed, it slows targets' Movement Speed by {{ f1 }}% and does {{ e3 }}% damage instead.",
                "leveltip": {
                    "label": ["Damage Per Second", "Chilled Slow Amount", "Mana Cost Per Second"],
                    "effect": ["{{ e1 }} -> {{ e1NL }}", "{{ e4 }}% -> {{ e4NL }}%", "{{ e2 }} -> {{ e2NL }}"]
                },
                "maxrank": 3,
                "cooldown": [6, 6, 6],
                "cooldownBurn": "6",
                "cost": [75, 75, 75],
                "costBurn": "75",
                "datavalues": {},
                "effect": [null, [40, 60, 80], [40, 50, 60], [300, 300, 300], [20, 30, 40], [0, 0, 0], [1, 1, 1], [1.5, 1.5, 1.5], [50, 50, 50], [800, 800, 800], [1000, 1000, 1000]],
                "effectBurn": [null, "40/60/80", "40/50/60", "300", "20/30/40", "0", "1", "1.5", "50", "800", "1000"],
                "vars": [{"link": "spelldamage", "coeff": 0.125, "key": "a1"}],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [750, 750, 750],
                "rangeBurn": "750",
                "image": {
                    "full": "GlacialStorm.png",
                    "sprite": "spell1.png",
                    "group": "spell",
                    "x": 192,
                    "y": 0,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }],
            "passive": {
                "name": "Rebirth",
                "description": "Upon dying, Anivia will revert into an egg. If the egg can survive for six seconds, she is gloriously reborn.",
                "image": {
                    "full": "Anivia_P.png",
                    "sprite": "passive0.png",
                    "group": "passive",
                    "x": 240,
                    "y": 0,
                    "w": 48,
                    "h": 48
                }
            },
            "recommended": [{
                "champion": "Anivia",
                "title": "AniviaARAM",
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
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3007",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3029", "count": 1, "hideCount": false}]
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
                    }, {"id": "3285", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3157", "count": 1, "hideCount": false}, {
                        "id": "3151",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3102", "count": 1, "hideCount": false}]
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
                "champion": "Anivia",
                "title": "AniviaCS",
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
                        "id": "3010",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3073", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3029",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3007", "count": 1, "hideCount": false}]
                }, {
                    "type": "standard",
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
                    }, {"id": "3135", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3151", "count": 1, "hideCount": false}, {
                        "id": "3030",
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
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2055",
                        "count": 1,
                        "hideCount": true
                    }, {"id": "2139", "count": 1, "hideCount": true}]
                }]
            }, {
                "champion": "Anivia",
                "title": "AniviaFIRSTBLOOD",
                "map": "HA",
                "mode": "FIRSTBLOOD",
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
                        "id": "3010",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3070", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3027",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3003", "count": 1, "hideCount": false}]
                }, {
                    "type": "standard",
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
                    }, {"id": "3135", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3174", "count": 1, "hideCount": false}, {
                        "id": "3116",
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
                        "id": "2043",
                        "count": 1,
                        "hideCount": true
                    }, {"id": "2139", "count": 1, "hideCount": true}]
                }]
            }, {
                "champion": "Anivia",
                "title": "AniviaKINGPORO",
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
                    "items": [{"id": "3070", "count": 1, "hideCount": false}, {
                        "id": "1028",
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
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3027",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3003", "count": 1, "hideCount": false}]
                }, {
                    "type": "standard",
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
                    }, {"id": "3157", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3151", "count": 1, "hideCount": false}, {
                        "id": "3285",
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
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2139",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Anivia",
                "title": "AniviaSIEGE",
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
                        "id": "3029",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3007", "count": 1, "hideCount": false}]
                }, {
                    "type": "standard",
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
                    }, {"id": "3135", "count": 1, "hideCount": false}]
                }, {
                    "type": "situational",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3151", "count": 1, "hideCount": false}, {
                        "id": "3030",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3285", "count": 1, "hideCount": false}]
                }]
            }, {
                "champion": "Anivia",
                "title": "AniviaSL",
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
                    }, {"id": "3340", "count": 1, "hideCount": false}]
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
                        "id": "3073",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3010", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3108",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3073", "count": 1, "hideCount": false}]
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
                        "id": "3007",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3029", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3020", "count": 1, "hideCount": false}, {
                        "id": "3007",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "4104", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3089", "count": 1, "hideCount": false}, {
                        "id": "3135",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3151", "count": 1, "hideCount": false}]
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
                        "id": "3165",
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
                "champion": "Anivia",
                "title": "AniviaSR",
                "map": "SR",
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
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3010",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3070", "count": 1, "hideCount": false}, {"id": "3073", "count": 1, "hidecount": false}]
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
                        "id": "3027",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3029", "count": 1, "hidecount": false}, {
                        "id": "3003",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3007", "count": 1, "hidecount": false}]
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
                    "items": [{"id": "3089", "count": 1, "hideCount": false}, {
                        "id": "3135",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3907", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3151", "count": 1, "hideCount": false}, {
                        "id": "3157",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3165", "count": 1, "hideCount": false}]
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
                "champion": "Anivia",
                "title": "AniviaTT",
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
                    "items": [{"id": "3070", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 2,
                        "hideCount": false
                    }]
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
                    "items": [{"id": "3027", "count": 1, "hideCount": false}, {
                        "id": "3020",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3003", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3090", "count": 1, "hideCount": false}, {
                        "id": "3135",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3907", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3151", "count": 1, "hideCount": false}, {
                        "id": "3165",
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
                "champion": "Anivia",
                "title": "Beginner",
                "map": "SR",
                "mode": "INTRO",
                "type": "riot",
                "customTag": "",
                "extensionPage": false,
                "customPanel": null,
                "blocks": [{
                    "type": "beginner_starter",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": 4,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1056", "count": 1, "hideCount": false}]
                }, {
                    "type": "beginner_starter",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": 5,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1056", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 1,
                        "hideCount": false
                    }]
                }, {
                    "type": "beginner_advanced",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1027", "count": 1, "hideCount": false}, {
                        "id": "1028",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3010", "count": 1, "hideCount": false}]
                }, {
                    "type": "beginner_movementspeed",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3020",
                        "count": 1,
                        "hideCount": false
                    }]
                }, {
                    "type": "beginner_legendaryitem",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3010", "count": 1, "hideCount": false}, {
                        "id": "1026",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3027", "count": 1, "hideCount": false}]
                }, {
                    "type": "beginner_morelegendaryitems",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3151", "count": 1, "hideCount": false}, {
                        "id": "3027",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3116", "count": 1, "hideCount": false}, {"id": "3089", "count": 1, "hideCount": false}]
                }]
            }]
        }
    }
}
