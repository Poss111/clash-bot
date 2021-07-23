module.exports = {
    "type": "champion", "format": "standAloneComplex", "version": "9.3.1", "data": {
        "Alistar": {
            "id": "Alistar",
            "key": "12",
            "name": "Alistar",
            "title": "the Minotaur",
            "image": {
                "full": "Alistar.png",
                "sprite": "champion0.png",
                "group": "champion",
                "x": 144,
                "y": 0,
                "w": 48,
                "h": 48
            },
            "skins": [{"id": "12000", "num": 0, "name": "default", "chromas": false}, {
                "id": "12001",
                "num": 1,
                "name": "Black Alistar",
                "chromas": false
            }, {"id": "12002", "num": 2, "name": "Golden Alistar", "chromas": false}, {
                "id": "12003",
                "num": 3,
                "name": "Matador Alistar",
                "chromas": false
            }, {"id": "12004", "num": 4, "name": "Longhorn Alistar", "chromas": false}, {
                "id": "12005",
                "num": 5,
                "name": "Unchained Alistar",
                "chromas": false
            }, {"id": "12006", "num": 6, "name": "Infernal Alistar", "chromas": false}, {
                "id": "12007",
                "num": 7,
                "name": "Sweeper Alistar",
                "chromas": false
            }, {"id": "12008", "num": 8, "name": "Marauder Alistar", "chromas": false}, {
                "id": "12009",
                "num": 9,
                "name": "SKT T1 Alistar",
                "chromas": false
            }, {"id": "12010", "num": 10, "name": "Moo Cow Alistar", "chromas": true}, {
                "id": "12019",
                "num": 19,
                "name": "Hextech Alistar",
                "chromas": false
            }],
            "lore": "Always a mighty warrior with a fearsome reputation, Alistar seeks revenge for the death of his clan at the hands of the Noxian empire. Though he was enslaved and forced into the life of a gladiator, his unbreakable will was what kept him from truly becoming a beast. Now, free of the chains of his former masters, he fights in the name of the downtrodden and the disadvantaged, his rage as much a weapon as his horns, hooves and fists.",
            "blurb": "Always a mighty warrior with a fearsome reputation, Alistar seeks revenge for the death of his clan at the hands of the Noxian empire. Though he was enslaved and forced into the life of a gladiator, his unbreakable will was what kept him from truly...",
            "allytips": ["Using Pulverize can allow you to establish better positioning for Headbutt.", "Movement speed is very important on Alistar. Consider which boots to buy carefully.", "Using Flash can allow you catch your target off guard to knock them back into your allies with Pulverize and Headbutt."],
            "enemytips": ["Alistar is very disruptive but very tough - try to target more fragile damage dealers.", "Watch out for the Pulverize-Headbutt combo when around turrets.", "When Alistar uses his ultimate, it's often better to move back and wait until the effect wears off before attacking him."],
            "tags": ["Tank", "Support"],
            "partype": "Mana",
            "info": {"attack": 6, "defense": 9, "magic": 5, "difficulty": 7},
            "stats": {
                "hp": 573.36,
                "hpperlevel": 106,
                "mp": 278.84,
                "mpperlevel": 38,
                "movespeed": 330,
                "armor": 44,
                "armorperlevel": 3.5,
                "spellblock": 32.1,
                "spellblockperlevel": 1.25,
                "attackrange": 125,
                "hpregen": 8.5,
                "hpregenperlevel": 0.85,
                "mpregen": 8.5,
                "mpregenperlevel": 0.8,
                "crit": 0,
                "critperlevel": 0,
                "attackdamage": 61.1116,
                "attackdamageperlevel": 3.62,
                "attackspeedperlevel": 2.125,
                "attackspeed": 0.625
            },
            "spells": [{
                "id": "Pulverize",
                "name": "Pulverize",
                "description": "Alistar smashes the ground, dealing damage to nearby enemies and tossing them into the air.",
                "tooltip": "Alistar smashes the ground, dealing {{ e2 }} <scaleAP>(+{{ a1 }})</scaleAP> magic damage and tossing nearby enemy units into the air for {{ e3 }} second.",
                "leveltip": {
                    "label": ["Damage", "Cooldown", "@AbilityResourceName@ Cost"],
                    "effect": ["{{ e2 }} -> {{ e2NL }}", "{{ cooldown }} -> {{ cooldownNL }}", "{{ cost }} -> {{ costNL }}"]
                },
                "maxrank": 5,
                "cooldown": [17, 16, 15, 14, 13],
                "cooldownBurn": "17/16/15/14/13",
                "cost": [65, 70, 75, 80, 85],
                "costBurn": "65/70/75/80/85",
                "datavalues": {},
                "effect": [null, [375, 375, 375, 375, 375], [60, 105, 150, 195, 240], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "375", "60/105/150/195/240", "1", "0", "0", "0", "0", "0", "0", "0"],
                "vars": [{"link": "spelldamage", "coeff": 0.5, "key": "a1"}],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [365, 365, 365, 365, 365],
                "rangeBurn": "365",
                "image": {
                    "full": "Pulverize.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 144,
                    "y": 144,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }, {
                "id": "Headbutt",
                "name": "Headbutt",
                "description": "Alistar rams a target with his head, dealing damage and knocking the target back.",
                "tooltip": "Alistar rams into an enemy, dealing {{ e2 }} <scaleAP>(+{{ a1 }})</scaleAP> magic damage and knocking them back.",
                "leveltip": {
                    "label": ["Damage", "Cooldown", "@AbilityResourceName@ Cost"],
                    "effect": ["{{ e2 }} -> {{ e2NL }}", "{{ cooldown }} -> {{ cooldownNL }}", "{{ cost }} -> {{ costNL }}"]
                },
                "maxrank": 5,
                "cooldown": [14, 13, 12, 11, 10],
                "cooldownBurn": "14/13/12/11/10",
                "cost": [65, 70, 75, 80, 85],
                "costBurn": "65/70/75/80/85",
                "datavalues": {},
                "effect": [null, [0, 0, 0, 0, 0], [55, 110, 165, 220, 275], [700, 700, 700, 700, 700], [0.75, 0.75, 0.75, 0.75, 0.75], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "0", "55/110/165/220/275", "700", "0.75", "0", "0", "0", "0", "0", "0"],
                "vars": [{"link": "spelldamage", "coeff": 0.7, "key": "a1"}],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [650, 650, 650, 650, 650],
                "rangeBurn": "650",
                "image": {
                    "full": "Headbutt.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 192,
                    "y": 144,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }, {
                "id": "AlistarE",
                "name": "Trample",
                "description": "Alistar tramples nearby enemy units, ignoring unit collision and gaining stacks if he damages an enemy champion. At full stacks Alistar's next basic attack against an enemy champion deals additional magic damage and stuns them.",
                "tooltip": "Alistar tramples the ground, ignoring unit collision and dealing {{ f1 }} <scaleAP>(+{{ f2 }})</scaleAP> magic damage over {{ e3 }} seconds to nearby enemies. Each pulse that damages at least one enemy champion grants Alistar a <span class=\"colorFF6E1C\">Trample</span> stack.<br /><br />At {{ e5 }} <span class=\"colorFF6E1C\">Trample</span> stacks Alistar empowers his next basic attack against an enemy champion to deal an additional <scaleLevel>{{ f3 }}</scaleLevel> magic damage and stun for {{ e6 }} second.",
                "leveltip": {
                    "label": ["Cooldown", "@AbilityResourceName@ Cost", "Damage"],
                    "effect": ["{{ cooldown }} -> {{ cooldownNL }}", "{{ cost }} -> {{ costNL }}", "{{ e1 }} -> {{ e1NL }}"]
                },
                "maxrank": 5,
                "cooldown": [12, 11.5, 11, 10.5, 10],
                "cooldownBurn": "12/11.5/11/10.5/10",
                "cost": [50, 60, 70, 80, 90],
                "costBurn": "50/60/70/80/90",
                "datavalues": {},
                "effect": [null, [80, 110, 140, 170, 200], [50, 50, 50, 50, 50], [5, 5, 5, 5, 5], [350, 350, 350, 350, 350], [5, 5, 5, 5, 5], [1, 1, 1, 1, 1], [5, 5, 5, 5, 5], [20, 20, 20, 20, 20], [15, 15, 15, 15, 15], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "80/110/140/170/200", "50", "5", "350", "5", "1", "5", "20", "15", "0"],
                "vars": [],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [350, 350, 350, 350, 350],
                "rangeBurn": "350",
                "image": {
                    "full": "AlistarE.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 240,
                    "y": 144,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }, {
                "id": "FerociousHowl",
                "name": "Unbreakable Will",
                "description": "Alistar lets out a wild roar, removing all crowd control effects on himself, and reducing incoming physical and magical damage for the duration.",
                "tooltip": "Removes all disables from Alistar. For {{ e1 }} seconds Alistar takes {{ e2 }}% reduced physical and magical damage.",
                "leveltip": {
                    "label": ["Damage Reduction", "Cooldown"],
                    "effect": ["{{ e2 }}% -> {{ e2NL }}%", "{{ cooldown }} -> {{ cooldownNL }}"]
                },
                "maxrank": 3,
                "cooldown": [120, 100, 80],
                "cooldownBurn": "120/100/80",
                "cost": [100, 100, 100],
                "costBurn": "100",
                "datavalues": {},
                "effect": [null, [7, 7, 7], [55, 65, 75], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
                "effectBurn": [null, "7", "55/65/75", "0", "0", "0", "0", "0", "0", "0", "0"],
                "vars": [],
                "costType": " {{ abilityresourcename }}",
                "maxammo": "-1",
                "range": [1, 1, 1],
                "rangeBurn": "1",
                "image": {
                    "full": "FerociousHowl.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 288,
                    "y": 144,
                    "w": 48,
                    "h": 48
                },
                "resource": "{{ cost }} {{ abilityresourcename }}"
            }],
            "passive": {
                "name": "Triumphant Roar",
                "description": "Alistar charges his roar by stunning or displacing enemy champions or when nearby enemies die. When fully charged he heals himself and all nearby allied champions.",
                "image": {
                    "full": "Alistar_E.png",
                    "sprite": "passive0.png",
                    "group": "passive",
                    "x": 144,
                    "y": 0,
                    "w": 48,
                    "h": 48
                }
            },
            "recommended": [{
                "champion": "Alistar",
                "title": "AlistarARAM",
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
                    "items": [{"id": "2051", "count": 1, "hideCount": false}, {
                        "id": "1001",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "2003", "count": 3, "hideCount": false}]
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
                    "items": [{"id": "3109", "count": 1, "hideCount": false}, {
                        "id": "3065",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3190", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3029", "count": 1, "hideCount": false}, {
                        "id": "3100",
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
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3068", "count": 1, "hideCount": false}, {
                        "id": "3075",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3194", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3285", "count": 1, "hideCount": false}, {
                        "id": "3089",
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
                        "id": "2138",
                        "count": 1,
                        "hideCount": false
                    }]
                }]
            }, {
                "champion": "Alistar",
                "title": "AlistarCS",
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
                    "items": [{"id": "3302", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 3,
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
                        "id": "2049",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3097", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3117", "count": 1, "hideCount": false}, {
                        "id": "3109",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3190", "count": 1, "hideCount": false}]
                }, {
                    "type": "protective",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3110", "count": 1, "hideCount": false}, {
                        "id": "3222",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3102", "count": 1, "hideCount": false}]
                }, {
                    "type": "aggressive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3143", "count": 1, "hideCount": false}, {
                        "id": "3060",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3512", "count": 1, "hideCount": false}]
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
                    }, {"id": "2138", "count": 1, "hideCount": true}]
                }]
            }, {
                "champion": "Alistar",
                "title": "AlistarFIRSTBLOOD",
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
                    "hideIfSummonerSpell": "SummonerSmite",
                    "items": [{"id": "3302", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 3,
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
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "2049",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3401", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "items": [{"id": "3117", "count": 1, "hideCount": false}, {
                        "id": "3190",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3110", "count": 1, "hideCount": false}]
                }, {
                    "type": "protective",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "items": [{"id": "3025", "count": 1, "hideCount": false}, {
                        "id": "3222",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3143", "count": 1, "hideCount": false}]
                }, {
                    "type": "aggressive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "items": [{"id": "3800", "count": 1, "hideCount": false}, {
                        "id": "3050",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3504", "count": 1, "hideCount": false}]
                }, {
                    "type": "startingjungle",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1039", "count": 1, "hideCount": false}, {
                        "id": "2031",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3340", "count": 1, "hideCount": false}]
                }, {
                    "type": "earlyjungle",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3711",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3751", "count": 1, "hideCount": false}]
                }, {
                    "type": "essentialjungle",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3117", "count": 1, "hideCount": false}, {
                        "id": "1409",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3742", "count": 1, "hideCount": false}]
                }, {
                    "type": "aggressive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3800", "count": 1, "hideCount": false}, {
                        "id": "3050",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3504", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3110", "count": 1, "hideCount": false}, {
                        "id": "3190",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3143", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2138",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Alistar",
                "title": "AlistarKINGPORO",
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
                    "items": [{"id": "2051", "count": 1, "hideCount": false}, {
                        "id": "3302",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "2003", "count": 2, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3110", "count": 1, "hideCount": false}, {
                        "id": "3190",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3047", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3089", "count": 1, "hideCount": false}, {
                        "id": "3100",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3157", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3742", "count": 1, "hideCount": false}, {
                        "id": "3065",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3401", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2138",
                        "count": 1,
                        "hideCount": false
                    }]
                }]
            }, {
                "champion": "Alistar",
                "title": "AlistarSIEGE",
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
                    "items": [{"id": "3117", "count": 1, "hideCount": false}, {
                        "id": "3109",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3190", "count": 1, "hideCount": false}]
                }, {
                    "type": "protective",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3110", "count": 1, "hideCount": false}, {
                        "id": "3222",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3102", "count": 1, "hideCount": false}]
                }, {
                    "type": "aggressive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3143", "count": 1, "hideCount": false}, {
                        "id": "3060",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3512", "count": 1, "hideCount": false}]
                }]
            }, {
                "champion": "Alistar",
                "title": "AlistarSL",
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
                    "items": [{"id": "4302", "count": 1, "hideCount": false}, {
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
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3024",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3067", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3110", "count": 1, "hideCount": false}, {
                        "id": "4401",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3083", "count": 1, "hideCount": false}, {"id": "3047", "count": 1, "hideCount": false}]
                }, {
                    "type": "protective",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3001", "count": 1, "hideCount": false}, {
                        "id": "3109",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3190", "count": 1, "hideCount": false}]
                }, {
                    "type": "aggressive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3143", "count": 1, "hideCount": false}, {
                        "id": "3050",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3800", "count": 1, "hideCount": false}]
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
                        "id": "3751",
                        "count": 1,
                        "hideCount": false
                    }]
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
                    "items": [{"id": "3742", "count": 1, "hideCount": false}, {
                        "id": "4103",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3047", "count": 1, "hideCount": false}]
                }, {
                    "type": "protective",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3109", "count": 1, "hideCount": false}, {
                        "id": "3190",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3110", "count": 1, "hideCount": false}]
                }, {
                    "type": "aggressive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3143", "count": 1, "hideCount": false}, {
                        "id": "3193",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3050", "count": 1, "hideCount": false}]
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
                        "id": "2138",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Alistar",
                "title": "AlistarSR",
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
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3302", "count": 1, "hideCount": false}, {
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
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3097",
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
                    "items": [{"id": "3117", "count": 1, "hideCount": false}, {
                        "id": "3109",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3190", "count": 1, "hideCount": false}]
                }, {
                    "type": "protective",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3110", "count": 1, "hideCount": false}, {
                        "id": "3222",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3001", "count": 1, "hideCount": false}]
                }, {
                    "type": "aggressive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3143", "count": 1, "hideCount": false}, {
                        "id": "3050",
                        "count": 1,
                        "hideCount": false
                    }]
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
                    "items": [{"id": "1039", "count": 1, "hideCount": false}, {
                        "id": "2031",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3340", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3706", "count": 1, "hideCount": false}, {
                        "id": "1001",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3751", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "1401", "count": 1, "hideCount": false}, {
                        "id": "3117",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3742", "count": 1, "hideCount": false}]
                }, {
                    "type": "protective",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3109", "count": 1, "hideCount": false}, {
                        "id": "3190",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3110", "count": 1, "hideCount": false}]
                }, {
                    "type": "aggressive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3143", "count": 1, "hideCount": false}, {
                        "id": "3193",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3050", "count": 1, "hideCount": false}]
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
                        "id": "2138",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Alistar",
                "title": "AlistarTT",
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
                    "hideIfSummonerSpell": "SummonerSmite",
                    "items": [{"id": "1029", "count": 1, "hideCount": false}, {
                        "id": "2031",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "1001", "count": 1, "hideCount": false}]
                }, {
                    "type": "startingjungle",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1039", "count": 1, "hideCount": false}, {
                        "id": "1041",
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
                    "hideIfSummonerSpell": "SummonerSmite",
                    "items": [{"id": "3068", "count": 1, "hideCount": false}, {
                        "id": "3117",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "2033", "count": 1, "hideCount": false}]
                }, {
                    "type": "essentialjungle",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1413", "count": 1, "hideCount": false}, {
                        "id": "3117",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "2032", "count": 1, "hideCount": false}]
                }, {
                    "type": "aggressive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3748", "count": 1, "hideCount": false}, {
                        "id": "3800",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3143", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3065", "count": 1, "hideCount": false}, {
                        "id": "3110",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3109", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2138",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Alistar",
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
                    "items": [{"id": "1001", "count": 1}, {"id": "3158", "count": 1}]
                }, {
                    "type": "beginner_LegendaryItem",
                    "recMath": true,
                    "items": [{"id": "3010", "count": 1}, {"id": "1026", "count": 1}, {"id": "3027", "count": 1}]
                }, {
                    "type": "beginner_MoreLegendaryItems",
                    "items": [{"id": "3065", "count": 1}, {"id": "3110", "count": 1}, {
                        "id": "3001",
                        "count": 1
                    }, {"id": "3083", "count": 1}]
                }]
            }]
        }
    }
};
