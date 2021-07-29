const timeTracker = require('../utility/time-tracker');
module.exports = {
    name: 'live',
    description: 'Ping!',
    execute(msg) {
        const startTime = process.hrtime.bigint();
        let places = [];
        places.push("[Do you know how to kick a football....](https://www.google.com/maps/place/Charlie+Brown's+Bar+%26+Grill/@39.7381736,-104.9934341,14z/data=!3m1!5s0x876c7ed65a892177:0x2b6c70c17f1668b5!4m9!1m2!2m1!1sbar!3m5!1s0x0:0x6986b6d079674ef4!8m2!3d39.731798!4d-104.983212!15sCgNiYXJaBSIDYmFykgENYmFyX2FuZF9ncmlsbA)");
        places.push('[Donkey Kong is King!](https://www.google.com/maps/place/The+Monkey+Bar/@39.7381736,-104.9934341,14z/data=!3m1!5s0x876c7f3266cdee19:0xc53ad51bccf96c8d!4m9!1m2!2m1!1sbar!3m5!1s0x0:0xfa0fd086c0cdf6!8m2!3d39.7339726!4d-104.9985335!15sCgNiYXJaBSIDYmFykgEDYmFy)')
        places.push("[I cast magic missle at the darkness](https://www.google.com/maps/place/The+Wizard's+Chest/@39.738237,-104.9934341,14z/data=!3m1!5s0x876c7f2725669dc9:0xe0d085ddc0fb60b1!4m9!1m2!2m1!1sGame+store!3m5!1s0x0:0x12f05befd1e2e4a8!8m2!3d39.7236132!4d-104.9877138!15sCgpHYW1lIHN0b3JlWgwiCmdhbWUgc3RvcmWSAQ1jb3N0dW1lX3N0b3JlmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVVJuYm5aaE9HMUJSUkFC)");
        places.push("[Let the Show begin... Although watch out for stds](https://www.google.com/maps/place/Aztlan+Theatre/@39.7383003,-104.9934341,14z/data=!4m9!1m2!2m1!1smovie+theater!3m5!1s0x0:0xdc4b10fb69c30179!8m2!3d39.7318925!4d-104.9985226!15sCg1tb3ZpZSB0aGVhdGVykgEXcGVyZm9ybWluZ19hcnRzX3RoZWF0ZXI)");
        places.push("[do svidaniya Comrade](https://www.google.com/maps/place/Russian+Books/@39.6987589,-104.9363529,13z/data=!4m9!1m2!2m1!1sAnime+store!3m5!1s0x0:0x6bd5cd70c128b28c!8m2!3d39.6987601!4d-104.9115875!15sCgtBbmltZSBzdG9yZVoNIgthbmltZSBzdG9yZZIBCmJvb2tfc3RvcmU)");
        places.push("[What up porky](https://www.google.com/maps/place/Hiro+Japanese+Buffet/@39.6988805,-104.9363529,13z/data=!3m1!5s0x876c87f1a3cb47c3:0x3b5ab9c8a5cd1ce3!4m9!1m2!2m1!1sbuffet!3m5!1s0x876c87f19f4973c9:0x24620b1456736655!8m2!3d39.6660499!4d-104.8614615!15sCgZidWZmZXRaCCIGYnVmZmV0kgETamFwYW5lc2VfcmVzdGF1cmFudJoBI0NoWkRTVWhOTUc5blMwVkpRMEZuU1VSTmVWOTVlRlpSRUFF)");
        places.push("[Maybe you should shower at least once a month Otaku cause you reek!](https://www.google.com/maps/place/Mutiny+Comics/@39.699002,-104.936353,13z/data=!3m1!5s0x876c7f1fb2fb209d:0xbbb63d4d3ff48942!4m9!1m2!2m1!1sManga+store!3m5!1s0x876c7f1fb8b13a6f:0xe90c1a38ebf07!8m2!3d39.7164762!4d-104.9871427!15sCgtNYW5nYSBzdG9yZVIYCMLr_X4Qw4G0vq_nmYGbARoCZW4iAlVTWg0iC21hbmdhIHN0b3JlaAGSARBjb21pY19ib29rX3N0b3Jl)");
        try { 
            msg.reply({ embed: { description: places[Math.floor(Math.random()*places.length)]}});
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
