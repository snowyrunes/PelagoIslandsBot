const Minigame = require('./minigames');
var lines = require('../variables/lines');
var botfunct = require('../botfunct');
var commaNumber = require('comma-number');

module.exports = class CritterCatching extends Minigame {

	constructor(name) {
		super(name);
		this.loadObtainables();
  	}

	loadObtainables(){
  		super.loadObtainables();

  		var critterLines = {};

  		critterLines["Spring"] = [...new Set(lines.springCritterLine)];
  		critterLines["Summer"] = [...new Set(lines.summerCritterLine)];
  		critterLines["Fall"] = [...new Set(lines.fallCritterLine)];
  		critterLines["Winter"] = [...new Set(lines.winterCritterLine)];

  		var aKeys = Object.keys(critterLines);

  		for(var k = 0; k< aKeys.length; k ++){

  			//console.log(critterLines[aKeys[k]]);
  			for(var i = 0; i< critterLines[aKeys[k]].length; i++ ){
  				var itemName = critterLines[aKeys[k]][i];
	  			super.getObtainablesConditonString(itemName, aKeys[k]);
	  		}
  		}
  	}

	critterOne(args){

		if(args.length < 1 ){
			return "Please provide a season."
		}


		var season = args[0].trim().toLowerCase();
		var lineOutput = "***Critter Catching Minigame:*** \n" + "You are catching critters during ";

		switch(season){
			case "spring":
				return lineOutput + season + ".\n\n" + "**Critter Caught:** " + getCritterDetailsOne(lines.springCritterLine);
			case "summer":
				return lineOutput + season + ".\n\n" + "**Critter Caught:** " + getCritterDetailsOne(lines.summerCritterLine);
			case "autumn":
			case "fall":
				return lineOutput + season + ".\n\n" + "**Critter Caught:** " + getCritterDetailsOne(lines.fallCritterLine);
			case "winter":
				return lineOutput + season + ".\n\n" + "**Critter Caught:** " + getCritterDetailsOne(lines.winterCritterLine);
			default:
				return "Invalid season " + season;
		}

	}

	critterAll(args){
		if(args.length < 1 ){
			return "Please provide a season."
		}

		var season = args[0].trim().toLowerCase();
		var lineOutput = "***Critter Catching Minigame:*** \n" + "You are catching critters during " + season + ".\n\n";
		var totalPrice = 0;

		var critterList = null;

		switch(season){
			case "spring":
				critterList = lines.springCritterLine;
				break;
			case "summer":
				critterList = lines.summerCritterLine;
				break;
			case "autumn":
			case "fall":
				critterList = lines.fallCritterLine;
				break;
			case "winter":
				critterList = lines.winterCritterLine;
				break;
			default:
				return "Invalid season " + season;
		}

		for(var i = 0; i<10; i++){
			var critterObjRaw = getCritterDetailsRaw(critterList);
			if (critterObjRaw === {} || critterObjRaw.name === undefined){
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
    //console.log(critter);
	return botfunct.findItemRawDetails(critter);
}

function getCritterDetailsOne(critterList){
	var critterObj =  getCritterDetailsRaw(critterList);

	if(critterObj === {} || critterObj.name === undefined){
		return "Something went wrong. Talk to Katie about Invalid Result " + critter;
	}

	return critterObj.name + " - " + commaNumber(critterObj.price) + "G";

}