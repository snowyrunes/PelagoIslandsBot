var botvars = require('./vars');
var botfunct = require('./botfunct');
var commaNumber = require('comma-number');

module.exports =  {
	forageOne: function(args){

		if(args.length < 1 ){
			return "Please provide a season or specify \"Elyisa\"."
		}

		var lineOutput = "**Foraging Result:** \n" + "This minigame takes place on ";
		var seasonOrElysia = args[0].trim().toLowerCase();

		switch(seasonOrElysia){
			case "spring":
				return lineOutput + "Arcadia in Spring.\n" + forageOne(botvars.forageArcadiaSpring);
			case "summer":
				return lineOutput + "Arcadia in Summer.\n" + forageOne(botvars.forageArcadiaSummer);
			case "fall":
			case "autumn":
				return lineOutput + "Arcadia in Fall.\n" + forageOne(botvars.forageArcadiaFall);
			case "winter":
				return lineOutput + "Arcadia in Fall.\n" + forageOne(botvars.forageArcadiaWinter);
			case "elysia":
				return lineOutput + "Eylsia in any season.\n" + forageOne(botvars.forageElysia);
			default:
				return "Invalid Foraging Season/Location. Please use the following: Spring, Summer, Fall, Winter, or Elysia";
		}

	},

	foraging: function(args){

		if(args.length < 1 ){
			return "Please provide a season or specify \"Elyisa\"."
		}

		var lineOutput = "**Foraging Results:** \n" + "This minigame takes place on ";
		var seasonOrElysia = args[0].trim().toLowerCase();
		var foragingLine = null;

		switch(seasonOrElysia){
			case "spring":
				lineOutput = lineOutput + "Arcadia in Spring.\n\n";
				foragingLine = botvars.forageArcadiaSpring;
				break;
			case "summer":
				lineOutput = lineOutput + "Arcadia in Summer.\n\n";
				foragingLine = botvars.forageArcadiaSummer;
				break;
			case "fall":
			case "autumn":
				lineOutput = lineOutput + "Arcadia in Fall.\n\n";
				foragingLine = botvars.forageArcadiaFall;
				break;
			case "winter":
				lineOutput = lineOutput +"Arcadia in Winter.\n\n";
				foragingLine = botvars.forageArcadiaWinter;
				break;
			case "elysia":
				lineOutput = lineOutput + "Eylsia in any season.\n\n";
				foragingLine = botvars.forageElysia;
				break;
			default:
				return "Invalid Foraging Season/Location. Please use the following: Spring, Summer, Fall, Winter, or Elysia";
		}

		var total = 0;

		for (i = 0; i<10; i++){
			var item = foragingLine[botfunct.randomize(foragingLine.length)].toLowerCase();
			var category = getForgingCategory(item);

			if(category != "INVALID") {
				var itemDetails = botfunct.findItemRawDetails(item, category);
				
				lineOutput += "**Roll " + (i+1) + ":** " + itemDetails.name + " - " + commaNumber(itemDetails.price) + "G\n";
				total += Number(itemDetails.price);
			} else {
				return "Something went wrong! Ask Katie to look into Invalid category for item " + item;
			}
		}

		return lineOutput + "\nTotal for selling all items: " +  commaNumber(total) + "G";

	}
}


function getForgingCategory(itemName) {

	for(var i = 0; i< botvars.piForagingCategories.length; i++){
		var categoryIndex = botvars.piForagingCategories[i];

		/*if (botvars.piItemCategories[categoryIndex] == undefined || categoryIndex == undefined){
			return "item: " + itemName + " category:" + categoryIndex + " i:" + i;
		}*/
		if (botvars.piItemCategories[categoryIndex].includes(itemName)){
			return categoryIndex;
		}
	}
	return "INVALID";

}

function forageOne(forageList){
	var item = forageList[botfunct.randomize(forageList.length)].toLowerCase();
	var category = getForgingCategory(item);

	//return getForgingCategory(item)
	if(category != "INVALID") {
		var itemDetails = botfunct.findItemRawDetails(item, category);

		if( itemDetails == undefined){
			return "Something went wrong! Ask Katie to look into category: " + category + " item:" + item;
		}
		
		return "\nYou found a(n) " + itemDetails.name + ". It sells for " + commaNumber(itemDetails.price) + "G.";
	} else {
		return "Something went wrong! Ask Katie to look into Invalid category for item " + item;
	}
	
}

