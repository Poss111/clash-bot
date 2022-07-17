module.exports = {
    "type": "champion",
    "format": "standAloneComplex",
    "version": "9.3.1",
    "data": {
        "Akali": {
            "id": "Akali",
            "key": "84",
            "name": "Akali",
            "title": "the Rogue Assassin",
            "image": {
                "full": "Akali.png",
                "sprite": "champion0.png",
                "group": "champion",
                "x": 96,
                "y": 0,

                "w": 48,
                "h": 48
            },
            "skins": [
                {
                    "id": "84000",
                    "num": 0,
                    "name": "default",
                    "chromas": false
                },
                {
                    "id": "84001",
                    "num": 1,
                    "name": "Stinger Akali",
                    "chromas": false
                },
                {
                    "id": "84002",
                    "num": 2,
                    "name": "Infernal Akali",
                    "chromas": false
                },
                {
                    "id": "84003",
                    "num": 3,
                    "name": "All-star Akali",
                    "chromas": false
                },
                {
                    "id": "84004",
                    "num": 4,
                    "name": "Nurse Akali",
                    "chromas": false
                },
                {
                    "id": "84005",
                    "num": 5,
                    "name": "Blood Moon Akali",
                    "chromas": false
                },
                {
                    "id": "84006",
                    "num": 6,
                    "name": "Silverfang Akali",
                    "chromas": false
                },
                {
                    "id": "84007",
                    "num": 7,
                    "name": "Headhunter Akali",
                    "chromas": true
                },
                {
                    "id": "84008",
                    "num": 8,
                    "name": "Sashimi Akali",
                    "chromas": false
                },
                {
                    "id": "84009",
                    "num": 9,
                    "name": "K/DA Akali",
                    "chromas": false
                },
                {
                    "id": "84013",
                    "num": 13,
                    "name": "K/DA Akali Prestige Edition",
                    "chromas": false
                }
            ],
            "lore": "Abandoning the Kinkou Order and her title of the Fist of Shadow, Akali now strikes alone, ready to be the deadly weapon her people need. Though she holds onto all she learned from her master Shen, she has pledged to defend Ionia from its enemies, one kill at a time. Akali may strike in silence, but her message will be heard loud and clear: fear the assassin with no master.",
            "blurb": "Abandoning the Kinkou Order and her title of the Fist of Shadow, Akali now strikes alone, ready to be the deadly weapon her people need. Though she holds onto all she learned from her master Shen, she has pledged to defend Ionia from its enemies, one...",
            "allytips": [
                "Akali excels at killing fragile champions. Let your team initiate and then strike at the people in the back.",
                "Twilight Shroud offers safety in even the most dangerous situations. Use that time to save up energy for a quick strike later."
            ],
            "enemytips": [
                "Akali can still be hit by area effect spells while obscured inside Twilight Shroud. Doing so will briefly reveal her position.",
                "Akali's Five Point Strike is powerful when used at maximum range and energy. Engage on her when she has low energy to maximize your chance of winning trades.",
                "Return to base if your Health is low and Akali has her ultimate available."
            ],
            "tags": [
                "Assassin"
            ],
            "partype": "Energy",
            "info": {
                "attack": 5,
                "defense": 3,
                "magic": 8,
                "difficulty": 7
            },
            "stats": {
                "hp": 550,
                "hpperlevel": 85,
                "mp": 200,
                "mpperlevel": 0,
                "movespeed": 345,
                "armor": 23,
                "armorperlevel": 3.5,
                "spellblock": 32.1,
                "spellblockperlevel": 1.25,
                "attackrange": 125,
                "hpregen": 6,
                "hpregenperlevel": 0.5,
                "mpregen": 50,
                "mpregenperlevel": 0,
                "crit": 0,
                "critperlevel": 0,
                "attackdamage": 62.4,
                "attackdamageperlevel": 3.3,
                "attackspeedperlevel": 3.2,
                "attackspeed": 0.625
            },
            "spells": [
                {
                    "id": "AkaliQ",
                    "name": "Five Point Strike",
                    "description": "Akali throws out five kunai, dealing damage based on her bonus Attack Damage and Ability Power and slowing.",
                    "tooltip": "Slings kunai in an arc, dealing <magicDamage>{{ damage }} magic damage</magicDamage>. Enemies at the tip are briefly slowed.<span class=\"size8\"><br /><br /></span>At max rank, deals {{ miniondamage }} damage to minions and monsters.",
                    "leveltip": {
                        "label": [
                            "Damage",
                            "@AbilityResourceName@ Cost"
                        ],
                        "effect": [
                            "{{ basedamagenamed }} -> {{ basedamagenamedNL }}",
                            "{{ cost }} -> {{ costNL }}"
                        ]
                    },
                    "maxrank": 5,
                    "cooldown": [
                        1.5,
                        1.5,
                        1.5,
                        1.5,
                        1.5
                    ],
                    "cooldownBurn": "1.5",
                    "cost": [
                        100,
                        95,
                        90,
                        85,
                        80
                    ],
                    "costBurn": "100/95/90/85/80",
                    "datavalues": {},
                    "effect": [
                        null,
                        [
                            15,
                            40,
                            65,
                            90,
                            115
                        ],
                        [
                            0.5,
                            0.5,
                            0.5,
                            0.5,
                            0.5
                        ],
                        [
                            0.2,
                            0.25,
                            0.3,
                            0.35,
                            0.4
                        ],
                        [
                            0.65,
                            0.65,
                            0.65,
                            0.65,
                            0.65
                        ],
                        [
                            0.5,
                            0.5,
                            0.5,
                            0.5,
                            0.5
                        ],
                        [
                            10,
                            10,
                            10,
                            10,
                            10
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ]
                    ],
                    "effectBurn": [
                        null,
                        "15/40/65/90/115",
                        "0.5",
                        "0.2/0.25/0.3/0.35/0.4",
                        "0.65",
                        "0.5",
                        "10",
                        "0",
                        "0",
                        "0",
                        "0"
                    ],
                    "vars": [],
                    "costType": " {{ abilityresourcename }}",
                    "maxammo": "-1",
                    "range": [
                        550,
                        550,
                        550,
                        550,
                        550
                    ],
                    "rangeBurn": "550",
                    "image": {
                        "full": "AkaliQ.png",
                        "sprite": "spell0.png",
                        "group": "spell",
                        "x": 432,
                        "y": 96,
                        "w": 48,
                        "h": 48
                    },
                    "resource": "{{ cost }} {{ abilityresourcename }}"
                },
                {
                    "id": "AkaliW",
                    "name": "Twilight Shroud",
                    "description": "Akali drops a cover of smoke. While inside the shroud, Akali becomes invisible and unable to be selected by enemy spells and attacks and gains Movement Speed. Attacking or using abilities will briefly reveal her.",
                    "tooltip": "Drops a smoke bomb, unleashing a spreading cover of smoke lasting {{ baseduration }} seconds.<span class=\"size8\"><br /><br /></span>The smoke <keywordStealth>obscures</keywordStealth> Akali from enemy vision and grants her {{ e6 }}% movement speed.<span class=\"size8\"><br /><br /></span>Entering or exiting <keywordStealth>obscured</keywordStealth> extends Shroud's duration.",
                    "leveltip": {
                        "label": [
                            "Energy Restore",
                            "Movement Speed",
                            "Base Duration",
                            "Cooldown"
                        ],
                        "effect": [
                            "{{ energyrestore }} -> {{ energyrestoreNL }}",
                            "{{ movementspeed }}% -> {{ movementspeedNL }}%",
                            "{{ baseduration }} -> {{ basedurationNL }}",
                            "{{ cooldown }} -> {{ cooldownNL }}"
                        ]
                    },
                    "maxrank": 5,
                    "cooldown": [
                        21,
                        19,
                        17,
                        15,
                        13
                    ],
                    "cooldownBurn": "21/19/17/15/13",
                    "cost": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "costBurn": "0",
                    "datavalues": {},
                    "effect": [
                        null,
                        [
                            140,
                            140,
                            140,
                            140,
                            140
                        ],
                        [
                            4,
                            4,
                            4,
                            4,
                            4
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            250,
                            250,
                            250,
                            250,
                            250
                        ],
                        [
                            60,
                            65,
                            70,
                            75,
                            80
                        ],
                        [
                            20,
                            25,
                            30,
                            35,
                            40
                        ],
                        [
                            1,
                            1,
                            1,
                            1,
                            1
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            5,
                            5.5,
                            6,
                            6.5,
                            7
                        ],
                        [
                            3,
                            3,
                            3,
                            3,
                            3
                        ]
                    ],
                    "effectBurn": [
                        null,
                        "140",
                        "4",
                        "0",
                        "250",
                        "60/65/70/75/80",
                        "20/25/30/35/40",
                        "1",
                        "0",
                        "5/5.5/6/6.5/7",
                        "3"
                    ],
                    "vars": [],
                    "costType": " Energy",
                    "maxammo": "-1",
                    "range": [
                        350,
                        350,
                        350,
                        350,
                        350
                    ],
                    "rangeBurn": "350",
                    "image": {
                        "full": "AkaliW.png",
                        "sprite": "spell0.png",
                        "group": "spell",
                        "x": 0,
                        "y": 144,
                        "w": 48,
                        "h": 48
                    },
                    "resource": "Restores {{ energyrestore }} Energy"
                },
                {
                    "id": "AkaliE",
                    "name": "Shuriken Flip",
                    "description": "Flip backward and fire a shuriken forward, dealing physical damage. The first enemy or smoke cloud hit is marked. Re-cast to dash to the marked target, dealing the same damage.",
                    "tooltip": "Flip backward and fire a shuriken forward, dealing <physicalDamage>{{ damage }} physical damage</physicalDamage> and marking the first enemy or smoke cloud hit.<span class=\"size8\"><br /><br /></span><spellActive>Re-cast:</spellActive> Dash to the marked target, dealing the same damage.",
                    "leveltip": {
                        "label": [
                            "Damage",
                            "Cooldown"
                        ],
                        "effect": [
                            "{{ basedamage }} -> {{ basedamageNL }}",
                            "{{ cooldown }} -> {{ cooldownNL }}"
                        ]
                    },
                    "maxrank": 5,
                    "cooldown": [
                        16,
                        14.5,
                        13,
                        11.5,
                        10
                    ],
                    "cooldownBurn": "16/14.5/13/11.5/10",
                    "cost": [
                        30,
                        30,
                        30,
                        30,
                        30
                    ],
                    "costBurn": "30",
                    "datavalues": {},
                    "effect": [
                        null,
                        [
                            50,
                            75,
                            100,
                            125,
                            150
                        ],
                        [
                            400,
                            400,
                            400,
                            400,
                            400
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ]
                    ],
                    "effectBurn": [
                        null,
                        "50/75/100/125/150",
                        "400",
                        "0",
                        "0",
                        "0",
                        "0",
                        "0",
                        "0",
                        "0",
                        "0"
                    ],
                    "vars": [],
                    "costType": " {{ abilityresourcename }}",
                    "maxammo": "-1",
                    "range": [
                        825,
                        825,
                        825,
                        825,
                        825
                    ],
                    "rangeBurn": "825",
                    "image": {
                        "full": "AkaliE.png",
                        "sprite": "spell0.png",
                        "group": "spell",
                        "x": 48,
                        "y": 144,
                        "w": 48,
                        "h": 48
                    },
                    "resource": "{{ cost }} {{ abilityresourcename }}"
                },
                {
                    "id": "AkaliR",
                    "name": "Perfect Execution",
                    "description": "Akali leaps in a direction, stunning and damaging enemies she strikes. Re-cast: Akali dashes in a direction, executing all enemies she strikes.",
                    "tooltip": "Two dashes: The first vaults over enemies, micro-stunning and dealing <physicalDamage>{{ cast1damage }} physical damage</physicalDamage>. Akali can dash again after {{ cooldownbetweencasts }} seconds.<span class=\"size8\"><br /><br /></span>The second is a piercing thrust that executes, dealing <magicDamage>{{ cast2damagemin }}</magicDamage> to <magicDamage>{{ cast2damagemax }} magic damage</magicDamage> based on missing health.",
                    "leveltip": {
                        "label": [
                            "Base Damage",
                            "Max Damage",
                            "Cooldown"
                        ],
                        "effect": [
                            "{{ basedamage }} -> {{ basedamageNL }}",
                            "{{ basedamage*3.000000 }} -> {{ basedamagenl*3.000000 }}",
                            "{{ cooldown }} -> {{ cooldownNL }}"
                        ]
                    },
                    "maxrank": 3,
                    "cooldown": [
                        120,
                        100,
                        80
                    ],
                    "cooldownBurn": "120/100/80",
                    "cost": [
                        0,
                        0,
                        0
                    ],
                    "costBurn": "0",
                    "datavalues": {},
                    "effect": [
                        null,
                        [
                            60,
                            120,
                            180
                        ],
                        [
                            3,
                            3,
                            3
                        ],
                        [
                            1,
                            1,
                            1
                        ],
                        [
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0
                        ],
                        [
                            120,
                            100,
                            80
                        ]
                    ],
                    "effectBurn": [
                        null,
                        "60/120/180",
                        "3",
                        "1",
                        "0",
                        "0",
                        "0",
                        "0",
                        "0",
                        "0",
                        "120/100/80"
                    ],
                    "vars": [],
                    "costType": "No Cost",
                    "maxammo": "-1",
                    "range": [
                        575,
                        575,
                        575
                    ],
                    "rangeBurn": "575",
                    "image": {
                        "full": "AkaliR.png",
                        "sprite": "spell0.png",
                        "group": "spell",
                        "x": 96,
                        "y": 144,
                        "w": 48,
                        "h": 48
                    },
                    "resource": "No Cost"
                }
            ],
            "passive": {
                "name": "Assassin's Mark",
                "description": "Dealing spell damage to a champion creates a ring of energy around them. Exiting that ring empowers Akali's next autoattack with bonus range and damage.",
                "image": {
                    "full": "Akali_P.png",
                    "sprite": "passive0.png",
                    "group": "passive",
                    "x": 96,
                    "y": 0,
                    "w": 48,
                    "h": 48
                }
            },
            "recommended": [
                {
                    "champion": "Akali",
                    "title": "AkaliARAM",
                    "map": "HA",
                    "mode": "ARAM",
                    "type": "riot",
                    "customTag": "",
                    "requiredPerk": "",
                    "sortrank": 0,
                    "extensionPage": false,
                    "customPanel": null,
                    "blocks": [
                        {
                            "type": "starting",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "2051",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "1001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2003",
                                    "count": 3,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "essential",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3146",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3157",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3020",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "offensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3100",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3089",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3135",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "defensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3116",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3068",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3102",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "consumables",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2139",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "champion": "Akali",
                    "title": "AkaliCS",
                    "map": "CrystalScar",
                    "mode": "ODIN",
                    "type": "riot",
                    "customTag": "",
                    "extensionPage": false,
                    "customPanel": null,
                    "blocks": [
                        {
                            "type": "starting",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "1029",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2003",
                                    "count": 4,
                                    "hideCount": false
                                },
                                {
                                    "id": "3340",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "early",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "1001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3145",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3144",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "essential",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3020",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3146",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3001",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "offensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3100",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3135",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3089",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "defensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3026",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3157",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3116",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "consumables",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": true
                                },
                                {
                                    "id": "2055",
                                    "count": 1,
                                    "hideCount": true
                                },
                                {
                                    "id": "2139",
                                    "count": 1,
                                    "hideCount": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "champion": "Akali",
                    "title": "AkaliFIRSTBLOOD",
                    "map": "HA",
                    "mode": "FIRSTBLOOD",
                    "type": "riot",
                    "customTag": "",
                    "sortrank": 0,
                    "extensionPage": false,
                    "customPanel": null,
                    "blocks": [
                        {
                            "type": "starting",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "1029",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2003",
                                    "count": 4,
                                    "hideCount": false
                                },
                                {
                                    "id": "3340",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "early",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "1001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3145",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3144",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "essential",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3020",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3146",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3089",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "offensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3100",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3135",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3116",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "defensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3026",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3157",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3001",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "consumables",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2139",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "champion": "Akali",
                    "title": "AkaliKINGPORO",
                    "map": "HA",
                    "mode": "KINGPORO",
                    "type": "riot",
                    "customTag": "",
                    "extensionPage": false,
                    "customPanel": null,
                    "blocks": [
                        {
                            "type": "KingPoroSnax",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3680",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3681",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3682",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3683",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "starting",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "2051",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "1001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2031",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "essential",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3146",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3157",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3020",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "offensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3100",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3089",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3135",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "defensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3116",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3068",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "consumables",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2139",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "champion": "Akali",
                    "title": "AkaliSIEGE",
                    "map": "SR",
                    "mode": "SIEGE",
                    "type": "riot",
                    "customTag": "",
                    "extensionPage": false,
                    "customPanel": null,
                    "blocks": [
                        {
                            "type": "siegeOffense",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3631",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3641",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3647",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3635",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3642",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "siegeDefense",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3634",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3640",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3643",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3636",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3642",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "essential",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3020",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3146",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3001",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "offensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3100",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3135",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3089",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "defensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3026",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3157",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3116",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "champion": "Akali",
                    "title": "AkaliSL",
                    "map": "SL",
                    "mode": "GAMEMODEX",
                    "type": "riot",
                    "customTag": "",
                    "sortrank": 0,
                    "extensionPage": false,
                    "useObviousCheckmark": false,
                    "customPanel": null,
                    "blocks": [
                        {
                            "type": "starting",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "SummonerSmite",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "4201",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3340",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "startingjungle",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "SummonerSmite",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "4101",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3340",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "early",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "SummonerSmite",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "3145",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "1001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3144",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "earlyjungle",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "SummonerSmite",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "3145",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "1001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3144",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "essential",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "SummonerSmite",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "3146",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3020",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3157",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "essentialjungle",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "SummonerSmite",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "3146",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3020",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "4104",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "offensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "3135",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3089",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3165",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "defensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "3116",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3102",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "consumables",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": true
                                },
                                {
                                    "id": "2139",
                                    "count": 1,
                                    "hideCount": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "champion": "Akali",
                    "title": "AkaliSR",
                    "map": "SR",
                    "mode": "CLASSIC",
                    "type": "riot",
                    "customTag": "",
                    "sortrank": 0,
                    "extensionPage": false,
                    "useObviousCheckmark": false,
                    "customPanel": null,
                    "blocks": [
                        {
                            "type": "starting",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "1054",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3340",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "early",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "3145",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "1001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3144",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "essential",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "3146",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3020",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3157",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "offensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "3100",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3135",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3089",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "defensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "3116",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3102",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3026",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "consumables",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "appendAfterSection": "",
                            "visibleWithAllOf": [
                                ""
                            ],
                            "hiddenWithAnyOf": [
                                ""
                            ],
                            "items": [
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": true
                                },
                                {
                                    "id": "2139",
                                    "count": 1,
                                    "hideCount": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "champion": "Akali",
                    "title": "AkaliTT",
                    "map": "TT",
                    "mode": "CLASSIC",
                    "type": "riot",
                    "customTag": "",
                    "sortrank": 0,
                    "extensionPage": false,
                    "customPanel": null,
                    "blocks": [
                        {
                            "type": "starting",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "1001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "1052",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2003",
                                    "count": 2,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "essential",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3020",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3116",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3145",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "offensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3100",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3146",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3090",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "defensive",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3143",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3102",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "consumables",
                            "recMath": false,
                            "recSteps": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": true
                                },
                                {
                                    "id": "2139",
                                    "count": 1,
                                    "hideCount": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "champion": "Akali",
                    "title": "Beginner",
                    "map": "SR",
                    "mode": "INTRO",
                    "type": "riot",
                    "customTag": "",
                    "customPanel": "",
                    "customPanelCurrencyType": "",
                    "customPanelBuffCurrencyName": "",
                    "blocks": [
                        {
                            "type": "beginner_Starter",
                            "recMath": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": 4,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "1054",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "beginner_Starter",
                            "recMath": false,
                            "minSummonerLevel": 5,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "1054",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "2003",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "beginner_Advanced",
                            "recMath": true,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "1028",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "1052",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3136",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "beginner_MovementSpeed",
                            "recMath": true,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "1001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3020",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "beginner_LegendaryItem",
                            "recMath": true,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3136",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "1026",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3151",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        },
                        {
                            "type": "beginner_MoreLegendaryItems",
                            "recMath": false,
                            "minSummonerLevel": -1,
                            "maxSummonerLevel": -1,
                            "showIfSummonerSpell": "",
                            "hideIfSummonerSpell": "",
                            "items": [
                                {
                                    "id": "3116",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3001",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3089",
                                    "count": 1,
                                    "hideCount": false
                                },
                                {
                                    "id": "3135",
                                    "count": 1,
                                    "hideCount": false
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}