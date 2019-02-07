var botvars = require('./vars');
var botfunct = require('./botfunct');
var commaNumber = require('comma-number');

module.exports = {

	critterOne: function(args){

		if(args.length < 1 ){
			return "Please provide a season."
		}


		var season = args[0].trim().toLowerCase();
		var lineOutput = "***Critter Catching Minigame:*** \n" + "You are catching critters during ";

		switch(season){
			case "spring":
				return lineOutput + season + ".\n\n" + "**Critter Caught:** " + getCritterDetailsOne(botvars.springCritterLine);
			case "summer":
				return lineOutput + season + ".\n\n" + "**Critter Caught:** " + getCritterDetailsOne(botvars.summerCritterLine);
			case "autumn":
			case "fall":
				return lineOutput + season + ".\n\n" + "**Critter Caught:** " + getCritterDetailsOne(botvars.fallCritterLine);
			case "winter":
				return lineOutput + season + ".\n\n" + "**Critter Caught:** " + getCritterDetailsOne(botvars.winterCritterLine);
			default:
				return "Invalid season " + season;
		}

	},

	critterAll: function(args){
		if(args.length < 1 ){
			return "Please provide a season."
		}

		var season = args[0].trim().toLowerCase();
		var lineOutput = "***Critter Catching Minigame:*** \n" + "You are catching critters during " + season + ".\n\n";
		var totalPrice = 0;

		var critterList = null;

		switch(season){
			case "spring":
				critterList = botvars.springCritterLine;
				break;
			case "summer":
				critterList = botvars.summerCritterLine;
				break;
			case "autumn":
			case "fall":
				critterList = botvars.fallCritterLine;
				break;
			case "winter":
				critterList = botvars.winterCritterLine;
				break;
			default:
				return "Invalid season " + season;
		}

		for(var i = 0; i<10; i++){
			var critterObjRaw = getCritterDetailsRaw(critterList);
			if (critterObjRaw.name === undefined){
				return "ERROR " + critterObjRaw
			}
			lineOutput += "**Roll " + (i+1) + ":** " + critterObjRaw.name + " - " + commaNumber(critterObjRaw.price) + "G\n";
			totalPrice = totalPrice + Number(critterObjRaw.price);
		}

		return lineOutput + "\nTotal: " + commaNumber(totalPrice) + "G";
	}
}


function getCritterDetailsRaw(critterList){
	var critter = critterList[botfunct.randomize(critterList.length)].toLowerCase();
	var category = "";

	for(var i = 0; i< botvars.piCritterCatchCategories.length; i++){
		var categoryIndex = botvars.piCritterCatchCategories[i];

		if (botvars.piItemCategories[categoryIndex].includes(critter)){
			category = categoryIndex;
			break;
		}
	}

	if (category === ""){
		return "Error with critter catching lookup, critter: " + critter;
	}

	return botfunct.findItemRawDetails(critter, category);
}

function getCritterDetailsOne(critterList){
	var critterObj =  getCritterDetailsRaw(critterList);

	return critterObj.name + " - " + commaNumber(critterObj.price) + "G";

}