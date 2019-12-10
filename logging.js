const Minigame = require('./minigames');
var lines = require('./variables/lines');
var botfunct = require('./botfunct');
var commaNumber = require('comma-number');

module.exports = class Logging extends Minigame{

	constructor(name) {
		super(name);
		this.loadObtainables();
  	}

	loadObtainables(){
  		super.loadObtainables();

  		var axeLines = {};

  		axeLines["Rusty Axe"] = [...new Set(lines.rustyAxeLine)];
  		axeLines["Axe"] = [...new Set(lines.axeLine)];
  		axeLines["Copper Axe"] = [...new Set(lines.copperAxeLine)];
  		axeLines["Silver Axe"] = [...new Set(lines.silverAxeLine)];
  		axeLines["Gold Axe"] = [...new Set(lines.goldAxeLine)];
  		axeLines["Mystic Axe"] = [...new Set(lines.mysticAxeLine)];
  		axeLines["via Logging Event"] = [...new Set(lines.loggingEventLine)];

  		var aKeys = Object.keys(axeLines);

  		for(var k = 0; k< aKeys.length; k ++){

  			//console.log(axeLines[aKeys[k]]);
  			for(var i = 0; i< axeLines[aKeys[k]].length; i++ ){
  				var itemName = axeLines[aKeys[k]][i];
	  			if(!isSpecialCase(itemName)){
	  				super.getObtainablesConditonString(itemName, aKeys[k]);
	  			}
	  		}
  		}
  	}


	logging(args){
		if(args.length < 1 ){
			return "Please provide an axe."
		}

		var axeName =  ""+ args.join(" ").trim().toLowerCase() + "";
		var lineOutput = "***Logging Minigame***\n" + "This minigame takes place on Arcadia.\n" + "You are playing with a";

		switch(axeName){
			case "rusty axe":
				return lineOutput + " " + axeName +".\n\n" + getLoggingResults(lines.rustyAxeLine);
			case "axe":
				return lineOutput + "n " + axeName +".\n\n" + getLoggingResults(lines.axeLine);
			case "copper axe":
				return lineOutput + " " + axeName +".\n\n" + getLoggingResults(lines.copperAxeLine);
			case "silver axe":
				return lineOutput + " " + axeName +".\n\n" + getLoggingResults(lines.silverAxeLine);
			case "gold axe":
				return lineOutput + " " + axeName +".\n\n" + getLoggingResults(lines.goldAxeLine);
			case "mystic axe":
				return lineOutput + " " + axeName +".\n\n" + getLoggingResults(lines.mysticAxeLine);
			default:
				return "Invalid axe name: " + axeName;
		}
		
	}

	logone(args){
		if(args.length < 1 ){
			return "Please provide an axe."
		}

		var axeName =  ""+ args.join(" ").trim().toLowerCase() + "";
		var lineOutput = "***Logging Minigame***\n" + "This minigame takes place on Arcadia.\n" + "You are playing with a";

		switch(axeName){
			case "rusty axe":
				return lineOutput + " " + axeName +".\n\n" + getLogOneResults(lines.rustyAxeLine);
			case "axe":
				return lineOutput + "n " + axeName +".\n\n" + getLogOneResults(lines.axeLine);
			case "copper axe":
				return lineOutput + " " + axeName +".\n\n" + getLogOneResults(lines.copperAxeLine);
			case "silver axe":
				return lineOutput + " " + axeName +".\n\n" + getLogOneResults(lines.silverAxeLine);
			case "gold axe":
				return lineOutput + " " + axeName +".\n\n" + getLogOneResults(lines.goldAxeLine);
			case "mystic axe":
				return lineOutput + " " + axeName +".\n\n" + getLogOneResults(lines.mysticAxeLine);
			default:
				return "Invalid axe name: " + axeName;
		}

	}
}


function isSpecialCase(itemName){
	switch(itemName){
		case "Monster":
		case "1000":
		case "5000":
		case "500":
		case "2000":
		case "Bees' Nest":
		case "Snake":
		case "Caterpillar":
		case "Bird's Nest":
		case "!!!":
			return true;
		default:
			return false;
	}
}

function getLoggingEventResults(){
	var eventResultNum = botfunct.randomize(lines.loggingEventLine.length);
	var eventResult = lines.loggingEventLine[eventResultNum];

	switch(eventResult){
		case "Monster":
			return "!!! - A monster fell out of the tree!\nYou may play the Monster Hunting Minigame as a result of this roll.";
		case "1000":
		case "5000":
		case "500":
		case "2000":
			return "!!! - $" + eventResult + "$G fell out of the tree!";
		case "Bees' Nest":
			return "!!! - A bees' nest fell out of the tree! What a buzzkill!";
		case "Snake":
			return "!!! - A snake fell out of the tree! Eeek!";
		case "Caterpillar":
			return "!!! - A caterpillar fell out of the tree! What a cute little critter!";
		case "Bird's Nest":
			return "!!! - A bird's nest fell out of the tree! Oh no! Hopefully the eggs are ok...";
		default:
			var loggingObject = botfunct.findItemRawDetails(eventResult.toLowerCase());

			if(loggingObject === {} || loggingObject.name === undefined){
				return "Something went wrong. Talk to Katie about Invalid !!! Result " + eventResult;
			}
			
			return "!!! - A(n) ~" + loggingObject.name + "~ fell out of the tree! It's worth $" + loggingObject.price +"$G";
	}
}


//logging
function getLogObjectName(slResult){
	return slResult.split("~")[1];
}

function getLogObjectPrice(slResult){
	return slResult.split("$")[1];
}

function CleanupNameIndict(slResult){
	return slResult.split("~").join("");
}

function CleanupPriceIndict(slResult){
	var tempArr = slResult.split("$");
	tempArr[1] = commaNumber(tempArr[1])
	return tempArr.join("");
}

function getLogOneResults(lumberList){
	var lineOutput = "";
	var numResult = botfunct.randomize(lumberList.length);

	var lumberResult = lumberList[numResult].toLowerCase();
		//return lumberResult + " " + numResult;
	switch(lumberResult){
		case "!!!":
			var rLine = getLoggingEventResults();

			if(rLine.includes("$")){
				if (rLine.includes("~")) {
					rLine = CleanupNameIndict(rLine);
				}
				
				rLine = CleanupPriceIndict(rLine);
			}

			lineOutput += "**Logging Result:** " + rLine;
			break;
		default:
			var lumberObj = botfunct.findItemRawDetails(lumberResult); 
				lineOutput += "**Logging Result:** " + lumberObj.name + " - " + commaNumber(lumberObj.price) + "G";
			break;
	}	

	return lineOutput;

}


function getLoggingResults(lumberList){
	var lineOutput = "";
	var price = 0;
	var priceItems = 0;
	var specialItems = [];

	for(var i = 0; i<10; i++){
		var numResult = botfunct.randomize(lumberList.length);

		var lumberResult = lumberList[numResult].toLowerCase();

		//return lumberResult + " " + numResult;

		switch(lumberResult){
			case "!!!":

				var rLine = getLoggingEventResults();

				if(rLine.includes("$")){
					var rPrice = Number(getLogObjectPrice(rLine));
					priceItems += rPrice;
					if(rLine.includes("~")){
						specialItems.push(getLogObjectName(rLine));
						rLine = CleanupNameIndict(rLine);
					}else{
						specialItems.push(commaNumber(rPrice) + "G");
					}

					rLine = CleanupPriceIndict(rLine);

				}

				lineOutput += "**Roll " + (i + 1) + ":** " + rLine + "\n";

				break;
			default:
				var lumberObj = botfunct.findItemRawDetails(lumberResult);

				lineOutput += "**Roll " + (i + 1) + ":** " + lumberObj.name + " - " + commaNumber(lumberObj.price) + "G\n";
				price += Number(lumberObj.price);
				break;
		}	

	}

	lineOutput += "\nTotal for lumber: " + commaNumber(price) + "G\nItems Retained: " + specialItems.join(", ") + "\nTotal for items: " + commaNumber(priceItems) + "G\nNet Total: " + commaNumber(price + priceItems) +"G";
	return lineOutput;
}