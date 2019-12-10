const Minigame = require('./minigames');
var lines = require('../variables/lines');
var botfunct = require('../botfunct');
var commaNumber = require('comma-number');

module.exports = class Foraging extends Minigame {

	constructor(name) {
		super(name);
		this.loadObtainables();
  	}

	loadObtainables(){
  		super.loadObtainables();

  		var axeLines = {};

  		axeLines["Spring"] = [...new Set(lines.forageArcadiaSpring)];
  		axeLines["Summer"] = [...new Set(lines.forageArcadiaSummer)];
  		axeLines["Fall"] = [...new Set(lines.forageArcadiaFall)];
  		axeLines["Winter"] = [...new Set(lines.forageArcadiaWinter)];
  		axeLines["Year-round on Elysia"] = [...new Set(lines.forageElysia)];

  		var aKeys = Object.keys(axeLines);

  		for(var k = 0; k< aKeys.length; k ++){

  			//console.log(axeLines[aKeys[k]]);
  			for(var i = 0; i< axeLines[aKeys[k]].length; i++ ){
  				var itemName = axeLines[aKeys[k]][i];
	  			super.getObtainablesConditonString(itemName, aKeys[k]);
	  		}
  		}
  	}

	forageOne(args){

		if(args.length < 1 ){
			return "Please provide a season or specify \"Elysia\"."
		}

		var lineOutput = "**Foraging Result:** \n" + "This minigame takes place on ";
		var seasonOrElysia = args[0].trim().toLowerCase();

		switch(seasonOrElysia){
			case "spring":
				return lineOutput + "Arcadia in Spring.\n" + forageOne(lines.forageArcadiaSpring);
			case "summer":
				return lineOutput + "Arcadia in Summer.\n" + forageOne(lines.forageArcadiaSummer);
			case "fall":
			case "autumn":
				return lineOutput + "Arcadia in Fall.\n" + forageOne(lines.forageArcadiaFall);
			case "winter":
				return lineOutput + "Arcadia in Fall.\n" + forageOne(lines.forageArcadiaWinter);
			case "elysia":
				return lineOutput + "Eylsia in any season.\n" + forageOne(lines.forageElysia);
			default:
				return "Invalid Foraging Season/Location. Please use the following: Spring, Summer, Fall, Winter, or Elysia";
		}

	}

	foraging(args){

		if(args.length < 1 ){
			return "Please provide a season or specify \"Elyisa\"."
		}

		var lineOutput = "**Foraging Results:** \n" + "This minigame takes place on ";
		var seasonOrElysia = args[0].trim().toLowerCase();
		var foragingLine = null;

		switch(seasonOrElysia){
			case "spring":
				lineOutput = lineOutput + "Arcadia in Spring.\n\n";
				foragingLine = lines.forageArcadiaSpring;
				break;
			case "summer":
				lineOutput = lineOutput + "Arcadia in Summer.\n\n";
				foragingLine = lines.forageArcadiaSummer;
				break;
			case "fall":
			case "autumn":
				lineOutput = lineOutput + "Arcadia in Fall.\n\n";
				foragingLine = lines.forageArcadiaFall;
				break;
			case "winter":
				lineOutput = lineOutput +"Arcadia in Winter.\n\n";
				foragingLine = lines.forageArcadiaWinter;
				break;
			case "elysia":
				lineOutput = lineOutput + "Eylsia in any season.\n\n";
				foragingLine = lines.forageElysia;
				break;
			default:
				return "Invalid Foraging Season/Location. Please use the following: Spring, Summer, Fall, Winter, or Elysia";
		}

		var total = 0;

		for (i = 0; i<10; i++){
			var item = foragingLine[botfunct.randomize(foragingLine.length)].toLowerCase();
			var itemDetails = botfunct.findItemRawDetails(item);

			if(itemDetails === {} || itemDetails == undefined){
				return "Something went wrong! Ask Katie to look into Invalid category for item " + item;
			} else {
				lineOutput += "**Roll " + (i+1) + ":** " + itemDetails.name + " - " + commaNumber(itemDetails.price) + "G\n";
				total += Number(itemDetails.price);
			}
		}

		return lineOutput + "\nTotal for selling all items: " +  commaNumber(total) + "G";

	}
}


function forageOne(forageList){
	var item = forageList[botfunct.randomize(forageList.length)].toLowerCase();

	var itemDetails = botfunct.findItemRawDetails(item);

	if(itemDetails === {} || itemDetails == undefined){
		return "Something went wrong! Ask Katie to look into item:" + item;
	}
		
	return "\nYou found a(n) " + itemDetails.name + ". It sells for " + commaNumber(itemDetails.price) + "G.";
}

