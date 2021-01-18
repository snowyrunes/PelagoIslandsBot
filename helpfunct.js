var fs =require('fs');

var botvars = require('./variables/vars');
var botfuncts = require('./botfunct');

var msgWriter = require('./messageWriter');

/*var Mining = require('./games/minefunct');
var CritterCatching = require('./games/critterfunct');
var Foraging = require('./games/foragefunct');
var ProduceCollection = require('./games/produceCollection');
var Logging = require('./games/logging');
var StoneBreaking = require('./games/stonebreaking');
var Fishing = require('./games/fishing');
var Taming = require('./games/taming');
var Gardening = require('./games/gardening');
var Alchemy = require('./games/alchemy');
var Cooking = require('./games/cooking');
var LevelUp = require('./games/levelup');
var MonsterHunting = require('./games/hunting');*/


module.exports = {
	helpInfo: function (args) {
		//general functions
		var lineOutput = "***Pelago Island Bot Help***\n\n";

		if(args.length < 1){
			
			lineOutput += "**Use the following commands to learn more about this bot:\n**";
			lineOutput += "pi!help lookup\n";
			lineOutput += "pi!help minigames\n";
			lineOutput += "pi!help rerolls\n";
			lineOutput += "pi!help other\n";

			return lineOutput;
		}

		var newargs = args.join("").toLowerCase().trim();
		var detailOut = helpInfo2(newargs);

		if(null === detailOut){
			return "No help found for topic: " + newargs;
		}

		return lineOutput + detailOut;


	}
}


function helpInfo2(helpCmd) {
		var lineOut = "";

		switch(helpCmd){
			case "lookup":
				lineOut += "**Use the following commands to look up data:\n**";
				lineOut += "pi!class\n";
				lineOut += "pi!getline\n";
				lineOut += "pi!item\n";
				lineOut += "pi!island\n";
				lineOut += "pi!list\n";
				lineOut += "pi!livestock\n";
				lineOut += "pi!location\n";
				lineOut += "pi!monster\n";
				break;
			case "minigames":
				lineOut += "**Use the following commands to play full minigames:\n**";
				lineOut += "pi!alchemy\n";
				lineOut += "pi!cooking\n";
				lineOut += "pi!crittercatch\n";
				lineOut += "pi!fishing\n";
				lineOut += "pi!foraging\n";
				lineOut += "pi!levelup\n";
				lineOut += "pi!logging\n";
				lineOut += "pi!mine\n";
				lineOut += "pi!monsterhunt\n";
				lineOut += "pi!produce\n";
				lineOut += "pi!stonebreak\n";
				lineOut += "pi!taming\n";
				break;
			case "rerolls":
				lineOut += "**Use the following commands to reroll for minigames:\n**";
				lineOut += "pi!alchemyone\n";
				lineOut += "pi!attack\n";
				lineOut += "pi!cookone\n";
				lineOut += "pi!crittercatchone\n";
				lineOut += "pi!fishone\n";
				lineOut += "pi!forageone\n";
				lineOut += "pi!logone\n";
				lineOut += "pi!mineone\n";
				lineOut += "pi!monsterattack\n";
				lineOut += "pi!stonebreakone\n";
				lineOut += "pi!tameone\n";
				break;
			case "other":
					lineOut += "**Other helpful commands:\n**";
				lineOut += "pi!attack\n";
				lineOut += "pi!choose\n";
				lineOut += "pi!export\n";
				lineOut += "pi!monsterattack\n";
				lineOut += "pi!monstercare\n";
				lineOut += "pi!rolldie\n";
				break;
			default:
				return null;

		}
		
		return lineOut;

	}
