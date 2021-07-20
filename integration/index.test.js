const corde = require("corde");
const {bot} = require("../index");
const helpMenu = require('../templates/help-menu');

corde.group("main commands", () => {
    corde.test("ping command must return... Ping?!!", () => {
        corde.expect("start").toReturn({
                "color": 71,
                "description": "Please check the Releases page for new updates and bug fixes :smile:.",
                "image": {
                    "height": 500,
                    "url": "https://repository-images.githubusercontent.com/363187357/577557c6-50c4-422c-adbf-8a06281c14e9",
                    "width": 1000,
                },
                "title": "Clash-Bot has been updated :partying_face:!",
                "url": "https://github.com/Poss111/clash-bot/releases",
            }
        );
        corde.expect("ping").toReturn("<@839586949748228156>, pong");
    });

    corde.test("help command should return the help menu template.", () => {
        let copy = JSON.parse(JSON.stringify(helpMenu));
        delete copy['footer'];
        corde.expect("help").toEmbedMatch(copy);
    });

    corde.test("time command should return a list of times for the Tournaments.", () => {
        let copy = JSON.parse(JSON.stringify(helpMenu));
        delete copy['footer'];
        corde.expect("help").toEmbedMatch(copy);
    });
});

corde.afterAll(() => {
    bot.destroy();
});
