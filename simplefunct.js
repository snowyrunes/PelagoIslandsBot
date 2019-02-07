var botvars = require('./vars');
var botfunct = require('./botfunct');
var commaNumber = require('comma-number');

module.exports = {

	logging: function(args){
		if(args.length < 1 ){
			return "Please provide an axe."
		}

		var axeName =  ""+ args.join(" ").trim().toLowerCase() + "";
		var lineOutput = "***Logging Minigame***\n" + "This minigame takes place on Arcadia.\n" + "You are playing with a";

		switch(axeName){
			case "rusty axe":
				return lineOutput + " " + axeName +".\n\n" + getLoggingResults(botvars.rustyAxeLine);
			case "axe":
				return lineOutput + "n " + axeName +".\n\n" + getLoggingResults(botvars.axeLine);
			case "copper axe":
				return lineOutput + " " + axeName +".\n\n" + getLoggingResults(botvars.copperAxeLine);
			case "silver axe":
				return lineOutput + " " + axeName +".\n\n" + getLoggingResults(botvars.silverAxeLine);
			case "gold axe":
				return lineOutput + " " + axeName +".\n\n" + getLoggingResults(botvars.goldAxeLine);
			case "mystic axe":
				return lineOutput + " " + axeName +".\n\n" + getLoggingResults(botvars.mysticAxeLine);
			default:
				return "Invalid axe name: " + axeName;
		}
		
	},

	logone: function(args){
		if(args.length < 1 ){
			return "Please provide an axe."
		}

		var axeName =  ""+ args.join(" ").trim().toLowerCase() + "";
		var lineOutput = "***Logging Minigame***\n" + "This minigame takes place on Arcadia.\n" + "You are playing with a";

		switch(axeName){
			case "rusty axe":
				return lineOutput + " " + axeName +".\n\n" + getLogOneResults(botvars.rustyAxeLine);
			case "axe":
				return lineOutput + "n " + axeName +".\n\n" + getLogOneResults(botvars.axeLine);
			case "copper axe":
				return lineOutput + " " + axeName +".\n\n" + getLogOneResults(botvars.copperAxeLine);
			case "silver axe":
				return lineOutput + " " + axeName +".\n\n" + getLogOneResults(botvars.silverAxeLine);
			case "gold axe":
				return lineOutput + " " + axeName +".\n\n" + getLogOneResults(botvars.goldAxeLine);
			case "mystic axe":
				return lineOutput + " " + axeName +".\n\n" + getLogOneResults(botvars.mysticAxeLine);
			default:
				return "Invalid axe name: " + axeName;
		}

	},

	stoneBreakOne: function(args){
		if(args.length < 1 ){
			return "Please provide a hammer."
		}

		var hammerName =  ""+ args.join(" ").trim().toLowerCase() + "";
		var lineOutput = "***Stone Breaking Minigame***\n" + "You are playing with a";

		switch(hammerName){
			case "rusty hammer":
				return lineOutput + " "+  hammerName + ".\n\n" + getStoneBreakOne(botvars.rustyHammerLine);
			case "ordinary hammer":
				return lineOutput + "n "+  hammerName + ".\n\n" + getStoneBreakOne(botvars.ordinaryHammerLine);
			case "copper hammer":
				return lineOutput + " "+  hammerName + ".\n\n" + getStoneBreakOne(botvars.copperHammerLine);
			case "silver hammer":
				return lineOutput + " "+  hammerName + ".\n\n" + getStoneBreakOne(botvars.silverHammerLine);
			case "gold hammer":
				return lineOutput + " "+  hammerName + ".\n\n" + getStoneBreakOne(botvars.goldHammerLine);
			case "mystic hammer":
				return lineOutput + " "+  hammerName + ".\n\n" + getStoneBreakOne(botvars.mysticHammerLine);
			default:
				return "Invalid hammer name: " + hammerName;
		}

	},

	stoneBreak: function(args){
		if(args.length < 1 ){
			return "Please provide a hammer."
		}

		var hammerName =  ""+ args.join(" ").trim().toLowerCase() + "";
		var lineOutput = "***Stone Breaking Minigame***\n" + "You are playing with a";

		switch(hammerName){
			case "rusty hammer":
				return lineOutput + " "+  hammerName +".\n\n" + getStoneBreakingMulti(botvars.rustyHammerLine);
			case "ordinary hammer":
				return lineOutput + "n "+  hammerName +".\n\n" + getStoneBreakingMulti(botvars.ordinaryHammerLine);
			case "copper hammer":
				return lineOutput + " "+ hammerName +".\n\n" + getStoneBreakingMulti(botvars.copperHammerLine);
			case "silver hammer":
				return lineOutput + " "+ hammerName +".\n\n" + getStoneBreakingMulti(botvars.silverHammerLine);
			case "gold hammer":
				return lineOutput + " "+ hammerName +".\n\n" + getStoneBreakingMulti(botvars.goldHammerLine);
			case "mystic hammer":
				return lineOutput + " "+ hammerName +".\n\n" + getStoneBreakingMulti(botvars.mysticHammerLine);
			default:
				return "Invalid hammer name: " + hammerName;
		}
		
	}
}

//stone breaking
function getStoneBreakOne(stoneList){
	var numResult = botfunct.randomize(stoneList.length);

	var stoneResult = stoneList[numResult].toLowerCase();

	if (Object.keys(botvars.piStonesList).includes(stoneResult)){
		var stoneObj = botvars.piStonesList[stoneResult];
		return "**Stone Breaking Result:** " + stoneObj.name + " - " + commaNumber(stoneObj.price) + "G";
	}


	return "Something went very wrong with stone breaking. Talk to Katie about " + stoneResult;
}

function getStoneBreakingMulti(stoneList){
	var lineOutput = "";
	var price = 0;

	for(var i = 0; i<10; i++){
		var numResult = botfunct.randomize(stoneList.length);

		var stoneResult = stoneList[numResult].toLowerCase();

		if (!Object.keys(botvars.piStonesList).includes(stoneResult)){
			return "There was a problem with " + stoneResult;
		}
			
		var stoneObj = botvars.piStonesList[stoneResult];

		lineOutput += "**Roll " + (i + 1) + ":** " + stoneObj.name + " - " + commaNumber(stoneObj.price) + "G\n";
		price += Number(stoneObj.price);

	}

	lineOutput += "\nTotal: " + commaNumber(price) + "G";
	return lineOutput;
}



//logging
function getLoggingObject(itemName){
	var itemCategories = botvars.piLoggingCategories;

	for(var i = 0; i< itemCategories.length; i++){
		var itemsForCat = botvars.piItemCategories[itemCategories[i]];

		if (itemsForCat.includes(itemName)){
			 return botfunct.findItemRawDetails(itemName, itemCategories[i]);
		}
	}

	return {};
}


function getLoggingEventResults(){
	var eventResultNum = botfunct.randomize(botvars.loggingEventLine.length);
	var eventResult = botvars.loggingEventLine[eventResultNum];


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
			var loggingObject = getLoggingObject(eventResult.toLowerCase());

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
			var lumberObj = botvars.piLumberList[lumberResult];
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
				var lumberObj = botvars.piLumberList[lumberResult];

				lineOutput += "**Roll " + (i + 1) + ":** " + lumberObj.name + " - " + commaNumber(lumberObj.price) + "G\n";
				price += Number(lumberObj.price);
				break;
		}	

	}

	lineOutput += "\nTotal for lumber: " + commaNumber(price) + "G\nItems Retained: " + specialItems.join(", ") + "\nTotal for items: " + commaNumber(priceItems) + "G\nNet Total: " + commaNumber(price + priceItems) +"G";
	return lineOutput;
}