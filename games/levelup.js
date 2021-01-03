const Minigame = require('./minigames');
var botvars = require('../variables/vars');
var lines = require('../variables/lines');
var botfunct = require('../botfunct');
var commaNumber = require('comma-number');

module.exports = class LevelUp extends Minigame {

	constructor(name) {
		super(name);
		this.loadObtainables();
  	}

	loadObtainables(){
  		super.loadObtainables();
  	}

	levelUp(args){

		if(args.length < 1 ){
			return "Please include the class name, level, currentExp, and gainedExp. Example: pi!levelUp Alchemist, 5, 100, 50";
		}

		var newargs = args.join(" ").split(",").map(a => a.trim());

		if(newargs.length < 4){
			return "Please include the class name, level, currentExp, and gainedExp. Example: pi!levelUp Alchemist, 5, 100, 50";
		}

		var classData = getClass(newargs[0].toLowerCase());

		if(null === classData){
			return "Invalid class \"" + newargs[0] + "\". Use \"pi!list classes\" for valid class names."
		}

		if(isNaN(newargs[1]) || parseInt(newargs[1]) < 1){
			return "Invalid Level: " + newargs[1];
		}

		if(isNaN(newargs[2]) || parseInt(newargs[2]) < 0){
			return "Invalid Number for Current EXP: " + newargs[2];
		}

		if(isNaN(newargs[3]) || parseInt(newargs[3]) < 0){
			return "Invalid Number for Gained EXP: " + newargs[3];
		}

		var currLevel = parseInt(newargs[1]);
		var currEXP = parseInt(newargs[2]);
		var gainedEXP = parseInt(newargs[3]);

		var newLevel = currLevel;
		var totalEXP = currEXP + gainedEXP;
		var expToLevelUp = calcEXPToLevelUp(currLevel);


		var lineOutput = "***Level Up Minigame:***\n\n";
		lineOutput += "You will be leveling up as a(n) **" + classData.name + "**, Level " + currLevel + " *(" + currEXP + "/" + expToLevelUp + " EXP)*\n";
		lineOutput += "EXP gained: " + gainedEXP + "\n";

		var rollLine = getLine(classData.mainStat);

		while(totalEXP >= expToLevelUp){
			++newLevel;
			totalEXP = totalEXP - expToLevelUp;
			expToLevelUp = calcEXPToLevelUp(newLevel);
		}	

		var levelDiff = newLevel-currLevel;

		if(levelDiff > 0){
			lineOutput += "\n";
		}else{
			lineOutput += "\nYou have not gained enough EXP to level up.";
		}

		//lineOutput += "You have risen " + levelDiff + " level(s)!\n"

		var totalSPD = 0;
		var totalDEF = 0;
		var totalATK = 0;
		var totalMATK = 0;
		var totalMDEF = 0;

		for(var i = 0; i < levelDiff; i++){
			
			lineOutput += "*Stat Increases for Level " + (currLevel + i + 1) + ":* ";

			for(var j = 0; j< 3; j++){
				
				var result = rollLine[botfunct.randomize(rollLine.length)];
				var increase = botfunct.randomize(5)+1;

				switch(result){
					case "SPD":
						totalSPD += increase;
						lineOutput += "SPD +" + increase;
						break;
					case "DEF":
						totalDEF += increase;
						lineOutput += "DEF +" + increase;
						break;
					case "ATK":
						totalATK += increase;
						lineOutput += "ATK +" + increase;
						break;
					case "M.ATK":
						totalMATK += increase;
						lineOutput += "M.ATK +" + increase;
						break;
					case "M.DEF":
						totalMDEF += increase;
						lineOutput += "M.DEF +" + increase;
						break;
					default:
						return "ERROR - RESULT: " + result;
				}

				if(j < 2){
					lineOutput += ", ";
				}
			}

			lineOutput += "\n";
		}


		lineOutput += "\nYou are now **Level " + newLevel + " *(" + totalEXP + "/" + expToLevelUp + " EXP)***\n";
		lineOutput += getTotalsLine(totalSPD, totalDEF, totalATK, totalMATK, totalMDEF);

		return lineOutput;
	}

}

function getTotalsLine(totalSPD, totalDEF, totalATK, totalMATK, totalMDEF){
	if((totalSPD + totalDEF + totalATK + totalMATK + totalMDEF ) == 0){
		return "";
	}

	var outArr = [];

	if(totalSPD > 0){
		outArr.push("SPD +" + totalSPD);
	}

	if(totalDEF > 0){
		outArr.push("DEF +" + totalDEF);
	}

	if(totalATK > 0){
		outArr.push("ATK +" + totalATK);
	}

	if(totalMATK > 0){
		outArr.push("M.ATK +" + totalMATK);
	}

	if(totalMDEF > 0){
		outArr.push("M.DEF +" + totalMDEF);
	}

	return "*Total Stat Changes:* " + outArr.join(", ");
}

function getLine(highStat){
	switch(highStat){
		case "SPD":
			return lines.highSPD;
		case "DEF":
			return lines.highDEF;
		case "ATK":
			return lines.highATK;
		case "M.ATK":
			return lines.highMATK;
		case "M.DEF":
			return lines.highDEF;
		default:
			return null;
	}
}

function calcEXPToLevelUp(level){
	var modifier = Math.ceil((level+1)/5);

	return 100*modifier;

}

function getClass(className){
	if(!Object.keys(botvars.piClassList).includes(className)){
		return null;
	}

	return botvars.piClassList[className];

}

