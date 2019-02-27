var botvars = require('./variables/vars');
var lines = require('./variables/lines');
var botfunct = require('./botfunct');
var commaNumber = require('comma-number');

module.exports = {

	mineOne: function(args){

		if(args.length < 1 ){
			return "Please provide a tool."
		}

		var lineOutput = "**Mining Result:** \n" + "This minigame takes place on Leuda.";
		var tool = args[0].trim().toLowerCase();

		var rollResult = mineLine(tool);

		switch(rollResult) {
			case "INVALID-TOOL":
				return "Invalid Tool. Please use a hammer or a hoe.";
			case "FOUND NOTHING!":
				return lineOutput + "\n\n" + rollResult;
			case "FELL THROUGH A HOLE!":
				return lineOutput + "\n\n" + rollResult + botvars.mineHole;
			case "ENCOUNTERED MONSTER!":
				return lineOutput + "\n\n" + rollResult + botvars.encounterMonst;
			case "RED GAS!":
				return lineOutput + "\n\n" + rollResult + botvars.redGasDesc;
			case "YELLOW GAS!":
				return lineOutput + "\n\n" + rollResult + botvars.yellowGasDesc;
			case "ORANGE GAS!":
				return lineOutput + "\n\n" + rollResult + botvars.orangeGasDesc;
			case "GREEN GAS!":
				return lineOutput + "\n\n" + rollResult + botvars.greenGasDesc;
			case "???":
				return lineOutput + "\n\n" + rollResult + botvars.questionDesc;
			case "TUNNEL":
				return lineOutput + "\n\n" + rollResult + botvars.tunnelDesc;
			default:
				var mItemName = rollResult.trim().toLowerCase();
				var category = findMineObjectCategory(mItemName);

				if (category === "INVALID"){
					return "Something went very wrong here. Let Katie know about " + mItemName;
				}

				return lineOutput + "\n\n" + singleMine(mItemName, category, tool);
		}

	},

	mineAll: function(args){
		if(args.length < 1 ){
			return "Please provide a tool."
		}

		var tool = args[0].trim().toLowerCase();

		if( !((tool === "hammer") || (tool === "hoe")) ){
			return "Invalid Tool. Please use a hammer or a hoe.";
		}

		return multiLine(tool)
	}
}

//local functions
function findMineObjectCategory(itemName){

	for(var i = 0; i< botvars.piMiningCategories.length; i++){
		var itemsForCat = botvars.piItemCategories[botvars.piMiningCategories[i]];

		if (itemsForCat.includes(itemName)){
			 return botvars.piMiningCategories[i];
		}
	}

	return "INVALID";


}

function mineLine(tool){
	var mineNum = botfunct.randomize(100)

	switch(tool){
		case 'hammer':
			return lines.mineHammerLine[mineNum];
		case 'hoe':
			return lines.mineHoeLine[mineNum];
		default:
			return "INVALID-TOOL";
	}
}

function singleMine(itemName, category, tool){
	var mineItem = botfunct.findItemRawDetails(itemName, category);
	var mineOutput = "With your " + tool + ", you mined a(n) " + mineItem.name + "!\nIt is worth " + commaNumber(mineItem.price) + "G!";

	return mineOutput;
}

function multiLine(tool){
	var lineOutput = "***Mining Minigame***\n" +  "This minigame takes place on Leuda\n";
	lineOutput = lineOutput + "You are playing with a " + tool +".\n\n";

		var minedItems = [];

		var gold = 0;

		for(var i = 0; i< 10; i++){
			var rollResult = mineLine(tool);

			lineOutput  = lineOutput + "**Roll " + (i+1) + ":** ";
			var resultLine = "";

			switch(rollResult){
				case "FOUND NOTHING!":
					resultLine = rollResult;
					break;
				case "FELL THROUGH A HOLE!":
					i = i+5;
					resultLine =  rollResult + " (-5 HP)";
					break;
				case "ENCOUNTERED MONSTER!":
					i = 10;
					minedItems = [];
					gold = 0;
					resultLine =  rollResult + botvars.encounterMonst;
					break;
				case "RED GAS!":
					i = i+5;
					resultLine =  rollResult + " - POISONED! (-5 HP)";
					break;
				case "YELLOW GAS!":
					i = i +5;
					resultLine =  rollResult + botvars.yellowGasDesc;
					break;
				case "ORANGE GAS!":
					i = i +1;
					resultLine = rollResult + "\n" + "**Roll " + (i+1) + ":** FOUND NOTHING!";
					break;
				case "GREEN GAS!":
					resultLine = rollResult + botvars.greenGasDesc + " (Use the \"mineone\" command after this)";
					break;
				case "???":
					resultLine = rollResult + botvars.questionDesc;
					break;
				case "TUNNEL":
					resultLine = rollResult + botvars.tunnelDesc;
					break
				case "INVALID-TOOL":
					return "Something went very wrong here. Let Katie know about tools and" + mItemName;
				default:
					var mItemName = rollResult.trim().toLowerCase();
					var category = findMineObjectCategory(mItemName);

					if (category === "INVALID"){
						return "Something went very wrong here. Let Katie know about " + mItemName;
					}

					var minedItemToAdd = botfunct.findItemRawDetails(mItemName, category);

					minedItems.push(minedItemToAdd.name);
					gold = gold + Number(minedItemToAdd.price);

					resultLine = minedItemToAdd.name + " - " + commaNumber(minedItemToAdd.price) + "G";
					break;

			}

			lineOutput = lineOutput + resultLine + "\n";
		}

		lineOutput = lineOutput + "\nItems retained: " + minedItems.join(", ") + "\nIncome from selling everything: " + commaNumber(gold) + "G";
		return lineOutput;
}