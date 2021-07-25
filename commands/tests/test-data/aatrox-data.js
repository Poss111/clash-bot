module.exports = {
    "type": "champion", "format": "standAloneComplex", "version": "9.3.1", "data": {
        "Aatrox": {
            "id": "Aatrox",
            "key": "266",
            "name": "Aatrox",
            "title": "the Darkin Blade",
            "image": {
                "full": "Aatrox.png",
                "sprite": "champion0.png",
                "group": "champion",
                "x": 0,
                "y": 0,
                "w": 48,
                "h": 48
            },
            "skins": [{"id": "266000", "num": 0, "name": "default", "chromas": false}, {
                "id": "266001",
                "num": 1,
                "name": "Justicar Aatrox",
                "chromas": false
            }, {"id": "266002", "num": 2, "name": "Mecha Aatrox", "chromas": true}, {
                "id": "266003",
                "num": 3,
                "name": "Sea Hunter Aatrox",
                "chromas": false
            }, {"id": "266007", "num": 7, "name": "Blood Moon Aatrox", "chromas": false}, {
                "id": "266008",
                "num": 8,
                "name": "Blood Moon Aatrox Prestige Edition",
                "chromas": false
            }],
            "lore": "Once honored defenders of Shurima against the Void, Aatrox and his brethren would eventually become an even greater threat to Runeterra, and were defeated only by cunning mortal sorcery. But after centuries of imprisonment, Aatrox was the first to find freedom once more, corrupting and transforming those foolish enough to try and wield the magical weapon that contained his essence. Now, with stolen flesh, he walks Runeterra in a brutal approximation of his previous form, seeking an apocalyptic and long overdue vengeance.",
            "blurb": "Once honored defenders of Shurima against the Void, Aatrox and his brethren would eventually become an even greater threat to Runeterra, and were defeated only by cunning mortal sorcery. But after centuries of imprisonment, Aatrox was the first to find...",
            "allytips": ["Use Umbral Dash while casting The Darkin Blade to increase your chances of hitting the enemy.", "Crowd Control abilities like Infernal Chains or your allies' immobilizing effects will help you set up The Darkin Blade.", "Cast World Ender when you are sure you can force a fight."],
            "enemytips": ["Aatrox's attacks are very telegraphed, so use the time to dodge the hit zones.", "Aatrox's Infernal Chains are easier to exit when running towards the sides or at Aatrox.", "Keep your distance when Aatrox uses his Ultimate to prevent him from reviving."],
            "tags": ["Fighter", "Tank"],
            "partype": "Blood Well",
            "info": {"attack": 8, "defense": 4, "magic": 3, "difficulty": 4},
            "stats": {
                "hp": 580,
                "hpperlevel": 80,
                "mp": 0,
                "mpperlevel": 0,
                "movespeed": 345,
                "armor": 33,
                "armorperlevel": 3.25,
                "spellblock": 32.1,
                "spellblockperlevel": 1.25,
                "attackrange": 175,
                "hpregen": 8,
                "hpregenperlevel": 0.75,
                "mpregen": 0,
                "mpregenperlevel": 0,
                "crit": 0,
                "critperlevel": 0,
                "attackdamage": 60,
                "attackdamageperlevel": 5,
                "attackspeedperlevel": 2.5,
                "attackspeed": 0.651
            },
            "spells": [{
                "id": "AatroxQ",
                "name": "The Darkin Blade",
                "description": "Aatrox slams his greatsword down, dealing physical damage. He can swing three times, each with a different area of effect.",
                "tooltip": "Aatrox slams his greatsword down, dealing <physicalDamage>{{ qdamage }} physical damage</physicalDamage>. The Darkin Blade may be re-cast 2 additional times, each one increasing in damage.<br /><br />Each strike can hit with the Edge, briefly knocking enemies up and dealing more damage.",
                "leveltip": {
                    "label": ["Cooldown", "Damage", "Total AD Ratio"],
                    "effect": ["{{ cooldown }} -> {{ cooldownNL }}", "{{ qbasedamage }} -> {{ qbasedamageNL }}", "{{ qtotaladratio*100.000000 }}% -> {{ qtotaladrationl*100.000000 }}%"]
                },
                "maxrank": 5,
                "cooldown": [16, 15, 14, 13, 12],
                "cooldownBurn": "16/15/14/13/12",
                "cost": [0, 0, 0, 0, 0],
                "costBurn": "0",
                "datavalues": {},
                "effect": [null, [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
                "vars": [],
                "costType": "No Cost",
                "maxammo": "-1",
                "range": [25000, 25000, 25000, 25000, 25000],
                "rangeBurn": "25000",
                "image": {
                    "full": "AatroxQ.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 48,
                    "y": 96,
                    "w": 48,
                    "h": 48
                },
                "resource": "No Cost"
            }, {
                "id": "AatroxW",
                "name": "Infernal Chains",
                "description": "Aatrox smashes the ground, dealing damage to the first enemy hit. Champions and large monsters have to leave the impact area quickly or they will be dragged to the center and take the damage again.",
                "tooltip": "Aatrox smashes the ground, dealing <physicalDamage>{{ wdamage }} physical damage</physicalDamage> to the first enemy hit and slowing by {{ wslowpercentage*-100 }}% for {{ wslowduration }}s.<br /><br />Champions or Large Monsters have {{ wslowduration }}s to leave the impact area or be dragged back and damaged again.",
                "leveltip": {
                    "label": ["Cooldown", "Damage", "Movement Slow"],
                    "effect": ["{{ cooldown }} -> {{ cooldownNL }}", "{{ wbasedamage }} -> {{ wbasedamageNL }}", "{{ wslowpercentage*-100.000000 }}% -> {{ wslowpercentagenl*-100.000000 }}%"]
                },
                "maxrank": 5,
                "cooldown": [18, 17, 16, 15, 14],
                "cooldownBurn": "18/17/16/15/14",
                "cost": [0, 0, 0, 0, 0],
                "costBurn": "0",
                "datavalues": {},
                "effect": [null, [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
                "vars": [],
                "costType": "No Cost",
                "maxammo": "-1",
                "range": [825, 825, 825, 825, 825],
                "rangeBurn": "825",
                "image": {
                    "full": "AatroxW.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 96,
                    "y": 96,
                    "w": 48,
                    "h": 48
                },
                "resource": "No Cost"
            }, {
                "id": "AatroxE",
                "name": "Umbral Dash",
                "description": "Aatrox lunges, gaining attack damage.",
                "tooltip": "<spellPassive>Passive:</spellPassive> Aatrox heals for {{ espellvamp }}% of physical damage he deals to champions.<br /><br /><spellActive>Active:</spellActive> Aatrox lunges, briefly gaining Attack Damage.",
                "leveltip": {
                    "label": ["Cooldown", "Healing %", "Bonus Attack Damage"],
                    "effect": ["{{ cooldown }} -> {{ cooldownNL }}", "{{ espellvamp }}% -> {{ espellvampNL }}%", "{{ ebonusad }} -> {{ ebonusadNL }}"]
                },
                "maxrank": 5,
                "cooldown": [9, 8, 7, 6, 5],
                "cooldownBurn": "9/8/7/6/5",
                "cost": [0, 0, 0, 0, 0],
                "costBurn": "0",
                "datavalues": {},
                "effect": [null, [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                "effectBurn": [null, "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
                "vars": [],
                "costType": "No Cost",
                "maxammo": "1",
                "range": [25000, 25000, 25000, 25000, 25000],
                "rangeBurn": "25000",
                "image": {
                    "full": "AatroxE.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 144,
                    "y": 96,
                    "w": 48,
                    "h": 48
                },
                "resource": "No Cost"
            }, {
                "id": "AatroxR",
                "name": "World Ender",
                "description": "Aatrox unleashes his demonic form, gaining attack damage and movement speed. Upon taking lethal damage, Aatrox will revive instead of dying, healing for a percentage of his maximum health.",
                "tooltip": "Aatrox reveals his true demonic form for the next {{ rduration }} seconds, fearing nearby minions and gaining: <span class=\"size4\"><br /><br /></span><li>Increased movement speed for the first 1 second, and when not in combat with champions or turrets.<span class=\"size4\"><br /><br /></span>Increased Attack Damage.<span class=\"size4\"><br /><br /></span>A Blood Well that steadily stores health, allowing him to <u>Revive</u> if he takes lethal damage.</li>",
                "leveltip": {
                    "label": ["Cooldown", "Movement Speed", "Total Attack Damage Increase"],
                    "effect": ["{{ cooldown }} -> {{ cooldownNL }}", "{{ rmovementspeed }} -> {{ rmovementspeedNL }}", "{{ rtotaladamp*100.000000 }}% -> {{ rtotaladampnl*100.000000 }}%"]
                },
                "maxrank": 3,
                "cooldown": [160, 140, 120],
                "cooldownBurn": "160/140/120",
                "cost": [0, 0, 0],
                "costBurn": "0",
                "datavalues": {},
                "effect": [null, [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
                "effectBurn": [null, "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
                "vars": [],
                "costType": "No Cost",
                "maxammo": "-1",
                "range": [25000, 25000, 25000],
                "rangeBurn": "25000",
                "image": {
                    "full": "AatroxR.png",
                    "sprite": "spell0.png",
                    "group": "spell",
                    "x": 192,
                    "y": 96,
                    "w": 48,
                    "h": 48
                },
                "resource": "No Cost"
            }],
            "passive": {
                "name": "Deathbringer Stance",
                "description": "Aatrox deals bonus damage on his next attack and reduces heals and shields on the target.",
                "image": {
                    "full": "Aatrox_Passive.png",
                    "sprite": "passive0.png",
                    "group": "passive",
                    "x": 0,
                    "y": 0,
                    "w": 48,
                    "h": 48
                }
            },
            "recommended": [{
                "champion": "Aatrox",
                "title": "AatroxARAM",
                "map": "HA",
                "mode": "ARAM",
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
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "2051",
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
                    "items": [{"id": "3071", "count": 1, "hideCount": false}, {
                        "id": "3111",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3053", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3812", "count": 1, "hideCount": false}, {
                        "id": "3156",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3161", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3065", "count": 1, "hideCount": false}, {
                        "id": "3742",
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
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "2003", "count": 1, "hideCount": false}, {
                        "id": "2140",
                        "count": 1,
                        "hideCount": false
                    }]
                }]
            }, {
                "champion": "Aatrox",
                "title": "AatroxCS",
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
                    "items": [{"id": "1055", "count": 1, "hideCount": false}, {
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
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3077",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "1053", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3047", "count": 1, "hideCount": false}, {
                        "id": "3153",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3812", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3078", "count": 1, "hideCount": false}, {
                        "id": "3074",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3071", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3143", "count": 1, "hideCount": false}, {
                        "id": "3156",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3065", "count": 1, "hideCount": false}]
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
                    }, {"id": "2140", "count": 1, "hideCount": true}]
                }]
            }, {
                "champion": "Aatrox",
                "title": "AatroxFIRSTBLOOD",
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
                    "items": [{"id": "1055", "count": 1, "hideCount": false}, {
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
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "3077",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "1053", "count": 1, "hideCount": false}]
                }, {
                    "type": "essential",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "items": [{"id": "3047", "count": 1, "hideCount": false}, {
                        "id": "3153",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3812", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "items": [{"id": "3078", "count": 1, "hideCount": false}, {
                        "id": "3074",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3071", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "items": [{"id": "3143", "count": 1, "hideCount": false}, {
                        "id": "3156",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3065", "count": 1, "hideCount": false}]
                }, {
                    "type": "startingjungle",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1041", "count": 1, "hideCount": false}, {
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
                        "id": "3706",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "1043", "count": 1, "hideCount": false}]
                }, {
                    "type": "essentialjungle",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3047", "count": 1, "hideCount": false}, {
                        "id": "1416",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3153", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3074", "count": 1, "hideCount": false}, {
                        "id": "3812",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3071", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3065", "count": 1, "hideCount": false}, {
                        "id": "3156",
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
                        "id": "2140",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Aatrox",
                "title": "AatroxKINGPORO",
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
                    "items": [{"id": "3074", "count": 1, "hideCount": false}, {
                        "id": "3742",
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
                    "items": [{"id": "3072", "count": 1, "hideCount": false}, {
                        "id": "3812",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3046", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3143", "count": 1, "hideCount": false}, {
                        "id": "3065",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3156", "count": 1, "hideCount": false}]
                }, {
                    "type": "consumables",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "2003", "count": 1, "hideCount": false}, {
                        "id": "2140",
                        "count": 1,
                        "hideCount": false
                    }]
                }]
            }, {
                "champion": "Aatrox",
                "title": "AatroxSIEGE",
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
                    "items": [{"id": "3047", "count": 1, "hideCount": false}, {
                        "id": "3153",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3812", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3078", "count": 1, "hideCount": false}, {
                        "id": "3074",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3071", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3143", "count": 1, "hideCount": false}, {
                        "id": "3156",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3065", "count": 1, "hideCount": false}]
                }]
            }, {
                "champion": "Aatrox",
                "title": "AatroxSL",
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
                    "items": [{"id": "4202", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 1,
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
                        "id": "3044",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3067", "count": 1, "hideCount": false}]
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
                        "id": "3133",
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
                    "items": [{"id": "3047", "count": 1, "hideCount": false}, {
                        "id": "3071",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3812", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "4102", "count": 1, "hideCount": false}, {
                        "id": "3047",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3071", "count": 1, "hideCount": false}, {"id": "3053", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3053", "count": 1, "hideCount": false}, {
                        "id": "3026",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3748", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3065", "count": 1, "hideCount": false}, {
                        "id": "3143",
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
                        "id": "2140",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Aatrox",
                "title": "AatroxSR",
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
                    "items": [{"id": "1055", "count": 1, "hideCount": false}, {
                        "id": "2003",
                        "count": 1,
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
                    "items": [{"id": "1039", "count": 1, "hideCount": false}, {
                        "id": "2031",
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
                        "id": "3044",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3067", "count": 1, "hideCount": false}]
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
                        "id": "3706",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3133", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3047", "count": 1, "hideCount": false}, {
                        "id": "3071",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3812", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "1400", "count": 1, "hideCount": false}, {
                        "id": "3047",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3071", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3053", "count": 1, "hideCount": false}, {
                        "id": "3026",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3748", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3065", "count": 1, "hideCount": false}, {
                        "id": "3143",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3156", "count": 1, "hideCount": false}]
                }, {
                    "type": "offensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "SummonerSmite",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3053", "count": 1, "hideCount": false}, {
                        "id": "3812",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3026", "count": 1, "hideCount": false}]
                }, {
                    "type": "defensive",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "TeleportCancel",
                    "hideIfSummonerSpell": "",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3065", "count": 1, "hideCount": false}, {
                        "id": "3742",
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
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2140",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Aatrox",
                "title": "AatroxTT",
                "map": "TT",
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
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "1055",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "2003", "count": 2, "hideCount": false}]
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
                    "items": [{"id": "1041", "count": 1, "hideCount": false}, {
                        "id": "1039",
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
                    "hideIfSummonerSpell": "SummonerSmite",
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "3047", "count": 1, "hideCount": false}, {
                        "id": "3071",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3053", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3706", "count": 1, "hideCount": false}, {
                        "id": "1001",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3071", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3812", "count": 1, "hideCount": false}, {
                        "id": "3748",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3156", "count": 1, "hideCount": false}]
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
                    "items": [{"id": "3065", "count": 1, "hideCount": false}, {
                        "id": "3742",
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
                    "appendAfterSection": "",
                    "visibleWithAllOf": [""],
                    "hiddenWithAnyOf": [""],
                    "items": [{"id": "2003", "count": 1, "hideCount": true}, {
                        "id": "2140",
                        "count": 1,
                        "hideCount": true
                    }]
                }]
            }, {
                "champion": "Aatrox",
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
                    "items": [{"id": "1054", "count": 1, "hideCount": false}]
                }, {
                    "type": "beginner_starter",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": 5,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1054", "count": 1, "hideCount": false}, {
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
                    "items": [{"id": "1036", "count": 1, "hideCount": false}, {
                        "id": "1053",
                        "count": 1,
                        "hideCount": false
                    }]
                }, {
                    "type": "beginner_movementspeed",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1001", "count": 1, "hideCount": false}, {
                        "id": "1029",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3047", "count": 1, "hideCount": false}]
                }, {
                    "type": "beginner_legendaryitem",
                    "recMath": true,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "1053", "count": 1, "hideCount": false}, {
                        "id": "1038",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3072", "count": 1, "hideCount": false}]
                }, {
                    "type": "beginner_morelegendaryitems",
                    "recMath": false,
                    "recSteps": false,
                    "minSummonerLevel": -1,
                    "maxSummonerLevel": -1,
                    "showIfSummonerSpell": "",
                    "hideIfSummonerSpell": "",
                    "items": [{"id": "3068", "count": 1, "hideCount": false}, {
                        "id": "3031",
                        "count": 1,
                        "hideCount": false
                    }, {"id": "3046", "count": 1, "hideCount": false}]
                }]
            }]
        }
    }
}
