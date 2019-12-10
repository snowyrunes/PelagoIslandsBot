const Minigame = require('./minigames');
var lines = require('./variables/lines');
var botfunct = require('./botfunct');
var commaNumber = require('comma-number');

module.exports = class StoneBreaking extends Minigame {

	constructor(name) {
		super(name);
		this.loadObtainables();
  	}

	loadObtainables(){
  		super.loadObtainables();

  		var hammerLines = {};

  		hammerLines["Rusty Hammer"] = [...new Set(lines.rustyHammerLine)];
  		hammerLines["Ordinary Hammer"] = [...new Set(lines.ordinaryHammerLine)];
  		hammerLines["Copper Hammer"] = [...new Set(lines.copperHammerLine)];
  		hammerLines["Silver Hammer"] = [...new Set(lines.silverHammerLine)];
  		hammerLines["Gold Hammer"] = [...new Set(lines.goldHammerLine)];
  		hammerLines["Mystic Hammer"] = [...new Set(lines.mysticHammerLine)];

  		var aKeys = Object.keys(hammerLines);

  		for(var k = 0; k< aKeys.length; k ++){

  			//console.log(hammerLines[aKeys[k]]);
  			for(var i = 0; i< hammerLines[aKeys[k]].length; i++ ){
  				var itemName = hammerLines[aKeys[k]][i];
	  			super.getObtainablesConditonString(itemName, aKeys[k]);
	  		}
  		}
  	}

	stoneBreakOne(args){
		if(args.length < 1 ){
			return "Please provide a hammer."
		}

		var hammerName =  ""+ args.join(" ").trim().toLowerCase() + "";
		var lineOutput = "***Stone Breaking Minigame***\n" + "You are playing with a";

		switch(hammerName){
			case "rusty hammer":
				return lineOutput + " "+  hammerName + ".\n\n" + getStoneBreakOne(lines.rustyHammerLine);
			case "ordinary hammer":
				return lineOutput + "n "+  hammerName + ".\n\n" + getStoneBreakOne(lines.ordinaryHammerLine);
			case "copper hammer":
				return lineOutput + " "+  hammerName + ".\n\n" + getStoneBreakOne(lines.copperHammerLine);
			case "silver hammer":
				return lineOutput + " "+  hammerName + ".\n\n" + getStoneBreakOne(lines.silverHammerLine);
			case "gold hammer":
				return lineOutput + " "+  hammerName + ".\n\n" + getStoneBreakOne(lines.goldHammerLine);
			case "mystic hammer":
				return lineOutput + " "+  hammerName + ".\n\n" + getStoneBreakOne(lines.mysticHammerLine);
			default:
				return "Invalid hammer name: " + hammerName;
		}

	}

	stoneBreak(args){
		if(args.length < 1 ){
			return "Please provide a hammer."
		}

		var hammerName =  ""+ args.join(" ").trim().toLowerCase() + "";
		var lineOutput = "***Stone Breaking Minigame***\n" + "You are playing with a";

		switch(hammerName){
			case "rusty hammer":
				return lineOutput + " "+  hammerName +".\n\n" + getStoneBreakingMulti(lines.rustyHammerLine);
			case "ordinary hammer":
				return lineOutput + "n "+  hammerName +".\n\n" + getStoneBreakingMulti(lines.ordinaryHammerLine);
			case "copper hammer":
				return lineOutput + " "+ hammerName +".\n\n" + getStoneBreakingMulti(lines.copperHammerLine);
			case "silver hammer":
				return lineOutput + " "+ hammerName +".\n\n" + getStoneBreakingMulti(lines.silverHammerLine);
			case "gold hammer":
				return lineOutput + " "+ hammerName +".\n\n" + getStoneBreakingMulti(lines.goldHammerLine);
			case "mystic hammer":
				return lineOutput + " "+ hammerName +".\n\n" + getStoneBreakingMulti(lines.mysticHammerLine);
			default:
				return "Invalid hammer name: " + hammerName;
		}
		
	}
}

//stone breaking
function getStoneBreakOne(stoneList){
	var numResult = botfunct.randomize(stoneList.length);

	var stoneResult = stoneList[numResult].toLowerCase();

	var stoneObj = botfunct.findItemRawDetails(stoneResult);

	if(stoneObj === {} || stoneObj.name === undefined){
		return "Something went very wrong with stone breaking. Talk to Katie about " + stoneResult;
	}

	return "**Stone Breaking Result:** " + stoneObj.name + " - " + commaNumber(stoneObj.price) + "G";
	
}

function getStoneBreakingMulti(stoneList){
	var lineOutput = "";
	var price = 0;

	for(var i = 0; i<10; i++){
		var numResult = botfunct.randomize(stoneList.length);

		var stoneResult = stoneList[numResult].toLowerCase();

		var stoneObj = botfunct.findItemRawDetails(stoneResult);

		if(stoneObj === {} || stoneObj.name === undefined){
			return "There was a problem with " + stoneResult;
		}			

		lineOutput += "**Roll " + (i + 1) + ":** " + stoneObj.name + " - " + commaNumber(stoneObj.price) + "G\n";
		price += Number(stoneObj.price);

	}

	lineOutput += "\nTotal: " + commaNumber(price) + "G";
	return lineOutput;
}

