const Minigame = require('./minigames');
var botvars = require('../variables/vars');
var lines = require('../variables/lines');
var botfunct = require('../botfunct');
var commaNumber = require('comma-number');

module.exports = class Fishing extends Minigame {

	constructor(name) {
		super(name);
		this.loadObtainables();
  	}

	loadObtainables(){
  		super.loadObtainables();

  		var fishingLines = {};

  		fishingLines["Leuda Beach"] = [...new Set(lines.fishLeuda)];
  		fishingLines["Arcadia Port"] = [...new Set(lines.fishArcadia)];
  		fishingLines["Sea - Shallow Water Level"] = [...new Set(lines.fishShallow)];
  		fishingLines["Sea - Mid Water Level"] = [...new Set(lines.fishMid)];
  		fishingLines["Sea - Deep Water Level"] = [...new Set(lines.fishDeep)];

  		var aKeys = Object.keys(fishingLines);

  		for(var k = 0; k< aKeys.length; k ++){

  			//console.log(mineLines[aKeys[k]]);
  			for(var i = 0; i< fishingLines[aKeys[k]].length; i++ ){
  				var itemName = fishingLines[aKeys[k]][i];
	  			super.getObtainablesConditonString(itemName, aKeys[k]);
	  		}
  		}

  		var itemConKeys = Object.keys(this.itemConditions);
  		var kingFishNames = Object.keys(botvars.piKingFishMapPreload);
  		//console.log(kingFishNames);

  		for(i=0; i< itemConKeys.length; i++){
  			if(kingFishNames.includes(itemConKeys[i])){
  				this.itemConditions[itemConKeys[i]] = "This King Fish requires a **" + botvars.piKingFishMapPreload[itemConKeys[i]].minRod 
  					+ "** or better. Can only be caught in the following weather: **" + botvars.piKingFishMapPreload[itemConKeys[i]].weather 
  					+ "**. Locations: **" + this.itemConditions[itemConKeys[i]] + "**";
  			}
  		}


  	}

	fishOne(args){

		if(args.length < 1 ){
			return "Please include the location, fishing pole, and weather. Example: pi!fishOne sea, copper fishing pole, sunny";
		}

		var newargs = args.join(" ").split(",").map(a => a.trim());

		if(newargs.length < 3){
			return "Please include the location, fishing pole, and weather. Example: pi!fishOne sea, copper fishing pole, sunny";
		}

		var location = newargs[0].toUpperCase().trim();
		var weather = newargs[2].toUpperCase().trim();
		var rod = newargs[1].trim();

		if(!botvars.weather.map(w => w.toUpperCase()).includes(weather)){
			return "Invalid weather " + weather + ". Include one of the following: " + botvars.weather.join(", ");
		}

		var fishingRodLevel = getFishingRodLevel(rod);

		if(fishingRodLevel == 0){
			return "Invalid fishing rod \"" + rod + "\".";
		}

		var fishingLocation = getFishingLocation(location, fishingRodLevel);

		if(null == fishingLocation){
			return "Invalid Location: " + location + ". Expecting Leuda Beach, Arcadia Port, or Deep Sea. ";
		}

		return fishingFunctOne(fishingLocation, fishingRodLevel, weather);
	}

	fishing(args){
		if(args.length < 1 ){
			return "Please include the location, fishing pole, and weather. Example: pi!fishing sea, copper fishing pole, sunny";
		}

		var newargs = args.join(" ").split(",").map(a => a.trim());

		if(newargs.length < 3){
			return "Please include the location, fishing pole, and weather. Example: pi!fishing sea, copper fishing pole, sunny";
		}

		var location = newargs[0].toUpperCase().trim();
		var weather = newargs[2].toUpperCase().trim();
		var rod = newargs[1].trim();

		if(!botvars.weather.map(w => w.toUpperCase()).includes(weather)){
			return "Invalid weather " + weather + ". Include one of the following: " + botvars.weather.join(", ");
		}

		var fishingRodLevel = getFishingRodLevel(rod);

		if(fishingRodLevel == 0){
			return "Invalid fishing rod \"" + rod + "\".";
		}

		var fishingLocation = getFishingLocation(location, fishingRodLevel);

		if(null == fishingLocation){
			return "Invalid Location: " + location + ". Expecting Leuda Beach, Arcadia Port, or Deep Sea. ";
		}


		return fishingFunct(fishingLocation, fishingRodLevel, weather);
	}
}

function fishingFunctOne(location, rodLevel, weather){

	var totalPrice = 0;
	var lineOutput = "***Fishing Minigame:***\n";
	lineOutput = lineOutput + "You are using a(n) " + getNameFromLevel(rodLevel) + ".\nFishing Location: *";

	switch(location){
		case "Sea: Shallow Water Level":
		case "Sea: Mid Water Level":
		case "Sea: Deep Water Level":
			lineOutput = lineOutput + location + " (**Note:** A boat is required).*";
			break;
		default:
			lineOutput = lineOutput + location + ".*";
			break;
	}

	lineOutput = lineOutput + "\nWeather: *" + weather + "*\n\nYou caught a(n) **";

	var rollLine = getLine(location);
	var result = hookFish(rollLine, rodLevel, weather);

	totalPrice = result.price;

	lineOutput = lineOutput + result.name + "**! It is worth **" + commaNumber(totalPrice) + "G**."

	return lineOutput;	

}

function fishingFunct(location, rodLevel, weather){
	var totalPrice = 0;
	var lineOutput = "***Fishing Minigame:***\n";
	var fishOutput = [];
	lineOutput = lineOutput + "You are using a(n) " + getNameFromLevel(rodLevel) + ".\nFishing Location: *";

	switch(location){
		case "Sea: Shallow Water Level":
		case "Sea: Mid Water Level":
		case "Sea: Deep Water Level":
			lineOutput = lineOutput + location + " (**Note:** A boat is required).*";
			break;
		default:
			lineOutput = lineOutput + location + ".*";
			break;
	}

	lineOutput = lineOutput + "\nWeather: *" + weather + "*\n\n";

	for(var i = 0; i<10; i++){
		var rollLine = getLine(location);
		var result = hookFish(rollLine, rodLevel, weather);

		totalPrice += Number(result.price);
		lineOutput = lineOutput + "You caught a(n) **" + result.name + "** worth **" + commaNumber(result.price) + "G**.\n"
		fishOutput.push(result.name);

	}

	lineOutput = lineOutput + "\n List of all catches: " + fishOutput.join(", ");
	lineOutput = lineOutput + "\n Total haul: " + commaNumber(totalPrice) + "G."

	

	return lineOutput;	

}


function hookFish(fishLine, rodLevel, weather){
	var fishName = fishLine[botfunct.randomize(fishLine.length)].toLowerCase();
	//console.log(fishLine.length);
	//console.log(fishName);
	var fishItem = botfunct.findItemRawDetails(fishName);

	if(Object.keys(botvars.piKingFishMapPreload).includes(fishName)){
		if(!caughtKingFish(weather, rodLevel, fishItem)){
			//console.log(fishName);
			return botfunct.findItemRawDetails("fish bone");
		}
	}

	return fishItem;

}


function getLine(location){
	switch(location){
		case "Leuda Beach":
			return lines.fishLeuda;
		case "Arcadia Port":
			return lines.fishArcadia;
		case "Sea: Shallow Water Level":
			return lines.fishShallow;
		case "Sea: Mid Water Level":
			return lines.fishMid;
		case "Sea: Deep Water Level":
			return lines.fishDeep;
		default:
			return null;
	}
}

function caughtKingFish(weather, rodLevel, kingFish){

	var kingFishRodLevel = getFishingRodLevel(kingFish.minRod);
	var kingFishWeather = kingFish.weather.split(",").map(w => w.trim().toUpperCase());

	//console.log(kingFishWeather.includes(weather));

	return ((rodLevel >= kingFishRodLevel) && kingFishWeather.includes(weather.toUpperCase().trim()));
}

function getDeepSeaGroup(seaLine){
	return "Sea: " + seaLine[botfunct.randomize(seaLine.length)];
}

function getFishingLocation(location, rodLevel){
	switch(location){
		case "LEUDA":
		case "LEUDA BEACH":
			return "Leuda Beach";
		case "ARCADIA":
		case "ARCADIA PORT":
			return "Arcadia Port";
		case "SEA":
		case "DEEP SEA":
			switch(rodLevel){
				case 1:
				case 2:
					return getDeepSeaGroup(lines.fishRustyReq);
				case 3:
				case 4:
					return getDeepSeaGroup(lines.fishCopperReq);
				case 5:
				case 6:
					return getDeepSeaGroup(lines.fishGoldReq);
				default:
					return null;
			}
		default:
			return null;
	}
}

function getFishingRodLevel(fishingRod){
	switch(fishingRod.toLowerCase()){
		case "rusty fishing rod":
		case "rusty fishing pole":
		case "rusty pole":
		case "rusty rod":
		case "rusty":
			return 1;
		case "ordinary fishing rod":
		case "ordinary fishing pole":
		case "fishing rod":
		case "fishing pole":
		case "pole":
		case "rod":
			return 2;
		case "copper fishing rod":
		case "copper fishing pole":
		case "copper pole":
		case "copper rod":
		case "copper":
			return 3;
		case "silver fishing rod":
		case "silver fishing pole":
		case "silver pole":
		case "silver rod":
		case "silver":
			return 4;
		case "gold fishing rod":
		case "gold fishing pole":
		case "gold pole":
		case "gold rod":
		case "gold":
			return 5;
		case "mystic fishing rod":
		case "mystic fishing pole":
		case "mystic pole":
		case "mystic rod":
		case "mystic":
			return 6;
		default:
			return 0;
	}
}

function getNameFromLevel(rodLevel){
	switch(rodLevel){
		case 1:
			return "Rusty Fishing Pole";
		case 2:
			return "Ordinary Fishing Pole";
		case 3:
			return "Copper Fishing Pole";
		case 4:
			return "Silver Fishing Pole";
		case 5:
			return "Gold Fishing Pole";
		case 6:
			return "Mystic Fishing Pole";
		default:
			return null;
	}
}