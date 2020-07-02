var botvars = require('./variables/vars');
var lines = require('./variables/lines');
var commaNumber = require('comma-number');

module.exports = {

	randomize: function(max){
		//Math.Random does not include max, but starts from 0, so the range is the same
		return Math.floor(Math.random() * max);
	},

	randomFromLine: function(args){
		var rLine = args.join(" ");
		var rArray = [];

		if(rLine.includes("|")){
			rArray = rLine.split("|");
		}else{
			if(rLine.includes(",")){
				rArray = rLine.split(",");
			}else{
				return "Please include bar separated list ( option 1 | option 2 ) or comma separated list ( option 1, option 2)."
			}
		}

		var rNum = Math.floor(Math.random() * rArray.length);

		return "Result: " + rArray[rNum].trim();
	},

	findItemRawDetails: function(itemName){
		if(Object.keys(botvars.piAllItemMap).includes(itemName)){
			return botvars.piAllItemMap[itemName];
		}
		return {};
	
	},

	listItemsFromCategory: function (args) {

		var itemCategories = Object.keys(botvars.piItemCategories);

		if (args.length < 1){
			return ("Please include a category to list. Categories include: " + itemCategories.join(", "));
		}

		var categoryName = ""+ args[0].trim().toLowerCase() + "";

		if (!itemCategories.includes(categoryName)){
			return ("Invalid category " + categoryName + ". Valid categories include: " + itemCategories.join(", "));
		}

		return "**Listing " + categoryName + "**: " + botvars.piItemCategories[categoryName].join(", ");

	},


	itemDetails: function (args) {
		if (args.length < 1){
			return ("Please include an item.");
		}

		var itemName =  ""+ args.join(" ").trim().toLowerCase() + "";

		//console.log(Object.keys(botvars.piAllItemMap));
		if(Object.keys(botvars.piAllItemMap).includes(itemName)){
			return getCategoryFromList(itemName, botvars.piAllItemMap);
		}else{
			return "Invalid item name " + itemName;
		}
		
		//return findCateogry(itemName);	

	},
    
    monsterDetails: function (args) {
		if (args.length < 1){
			return ("Please include a monster name.");
		}

		var monsterName =  ""+ args.join(" ").trim().toLowerCase() + "";

		//console.log(Object.keys(botvars.piAllMonstersMap));
		if(Object.keys(botvars.piAllMonstersMap).includes(monsterName)){
			return getCategoryFromList(monsterName, botvars.piAllMonstersMap);
		}else{
			return "Invalid monster name " + monsterName;
		}

	},

	livestockDetails: function (args) {
		if (args.length < 1){
			return ("Please include an animal name (must be livestock).");
		}

		var livestockName =  ""+ args.join(" ").trim().toLowerCase() + "";

		//console.log(Object.keys(botvars.piAllMonstersMap));
		if(Object.keys(botvars.piAllLivestockMap).includes(livestockName)){
			return getCategoryFromList(livestockName, botvars.piAllLivestockMap);
		}else{
			return "Invalid livestock name " + livestockName;
		}

	},

	rollLine: function(args) {
		if (args.length < 1){
			return ("Please include a minigame roll command.");
		}

		switch(args[0]){
			case "mineone":
			case "mine":
				return getMineRolls();
			case "logging":
			case "logone":
				return getLoggingRolls();
			case "stonebreakone":
			case "stonebreak":
				return getStoneBreakingRolls();
			case "crittercatch":
			case "crittercatchone":
				return getCritterCatchRolls();
			case "forageone":
			case "foraging":
				return getForageLine();
			case "fishone":
			case "fishing":
				return getFishingLine();
			default:
				return ("No minigame command found for " + args[0]);
		}

	}

}

function giveFieldPrice(sDescript, field, endString){
	if (field === "N/A"){
		return ""
	}

	return sDescript + commaNumber(field) + "G" + endString;
}

//local functions
function giveField(sDescript, field, endString){
	if (field === "N/A"){
		return "";
	}

	return sDescript + field + endString;
}

function parseObtain(oString){
	return oString.split(" + ").join(", ");
}

//roll line functions

function getFishingLine(){
	var fLine = "**Roll line for fishing at Leuda Beach:**\n";
	fLine += lines.fishLeuda.join(" | ");
	fLine += "\n\n**Roll line for fishing at Arcadia Port:**\n";
	fLine += lines.fishArcadia.join(" | ");
	fLine += "\n\n**Roll line for fishing at Deep Sea (Shallow Water Level):**\n";
	fLine += lines.fishShallow.join(" | ");
	fLine += "\n\n**Roll line for fishing at Deep Sea (Mid Water Level):**\n";
	fLine += lines.fishMid.join(" | ");
	fLine += "\n\n**Roll line for fishing at Deep Sea (Deep Water Level):**\n";
	fLine += lines.fishDeep.join(" | ");
	fLine += "\n\n**Roll line for water level at Deep Sea with a Rusty/Ordinary Fishing Pole :**\n";
	fLine += lines.fishRustyReq.join(" | ");
	fLine += "\n\n**Roll line for water level at Deep Sea with a Copper/Silver Fishing Pole :**\n";
	fLine += lines.fishCopperReq.join(" | ");
	fLine += "\n\n**Roll line for water level at Deep Sea with a Gold/Mystic Fishing Pole :**\n";
	fLine += lines.fishGoldReq.join(" | ");

	return fLine;
}

function getForageLine(){
	var fLine = "**Roll line for foraging on Arcadia in spring:**\n";
	fLine += lines.forageArcadiaSpring.join(" | ");
	fLine += "\n\n**Roll line for foraging on Arcadia in summer:**\n";
	fLine += lines.forageArcadiaSummer.join(" | ");
	fLine += "\n\n**Roll line for foraging on Arcadia in fall:**\n";
	fLine += lines.forageArcadiaFall.join(" | ");
	fLine += "\n\n**Roll line for foraging on Arcadia in winter:**\n";
	fLine += lines.forageArcadiaWinter.join(" | ");
	fLine += "\n\n**Roll line for foraging on Elysia:**\n";
	fLine += lines.forageElysia.join(" | ");

	return fLine;
}

function getCritterCatchRolls(){
	var cLine = "**Roll line for critter catching in spring:**\n";
	cLine += lines.springCritterLine.join(" | ");
	cLine += "\n\n**Roll line for critter catching in summer:**\n";
	cLine += lines.summerCritterLine.join(" | ");
	cLine += "\n\n**Roll line for critter catching in fall:**\n";
	cLine += lines.fallCritterLine.join(" | ");
	cLine += "\n\n**Roll line for critter catching in winter:**\n";
	cLine += lines.winterCritterLine.join(" | ");

	return cLine;
}

function getStoneBreakingRolls(){
	var mLine = "**Roll line for using a rusty hammer:**\n";
	mLine += lines.rustyHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using an ordinary hammer:**\n";
	mLine += lines.ordinaryHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using a copper hammer:**\n";
	mLine += lines.copperHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using a silver hammer:**\n";
	mLine += lines.silverHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using a gold hammer:**\n";
	mLine += lines.goldHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using a mythic hammer:**\n";
	mLine += lines.mysticHammerLine.join(" | ");

	return mLine;
}

function getLoggingRolls(){
	var mLine = "**Roll line for using a rusty axe:**\n";
	mLine += lines.rustyAxeLine.join(" | ");
	mLine += "\n\n**Roll line for using an axe:**\n";
	mLine += lines.axeLine.join(" | ");
	mLine += "\n\n**Roll line for using a copper axe:**\n";
	mLine += lines.copperAxeLine.join(" | ");
	mLine += "\n\n**Roll line for using a silver axe:**\n";
	mLine += lines.silverAxeLine.join(" | ");
	mLine += "\n\n**Roll line for using a gold axe:**\n";
	mLine += lines.goldAxeLine.join(" | ");
	mLine += "\n\n**Roll line for using a mythic axe:**\n";
	mLine += lines.mysticAxeLine.join(" | ");

	return mLine;
}

function getMineRolls(){
	var mLine = "**Roll line for using a hammer:**\n";
	mLine += lines.mineHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using a hoe:**\n";
	mLine += lines.mineHoeLine.join(" | ");

	return mLine;

}

function getCategoryFromList(itemName, cItemMap){
	var item = null;
	if(Object.keys(cItemMap).includes(itemName)){
		item =cItemMap[itemName];
	} else{
		return "Invalid Object " + itemName;
	}

	//console.log("ITEM: " + item);
	var itemString =  "**Details for " + item.name + ":**";
	
	if(item.hasOwnProperty("price")){
		itemString += giveFieldPrice("\nPrice: *", item.price, "*");
	}

	if(item.hasOwnProperty("seedPrice")){
		itemString += giveFieldPrice("\nSeed Price: *", item.seedPrice, "*");
	}

	if(item.hasOwnProperty("rarity")){
		itemString += giveField("\nRarity: *", item.rarity, "*");
	}

	if (item.hasOwnProperty("effect")){
		itemString += giveField("\nEffect: *", item.effect, "*");
	}

	if(item.hasOwnProperty("wEffect")){
		itemString += giveField("\nWeapon Upgrade Effect: *", item.wEffect, "*");
	}

	if (item.hasOwnProperty("eEffect")){
		itemString += giveField("\nEquipment Updgrade Effect: *", item.eEffect, "*");
	}

	if (item.hasOwnProperty("recipeSize")){
		itemString += giveField("\nRecipe Size: *", item.recipeSize, "*");
	}

	if (item.hasOwnProperty("pSize")){
		itemString += giveField("\nRecipe Size: *", item.pSize, "*");
	}

	if (item.hasOwnProperty("season")){
		itemString += giveField("\nGrowing Season: *", item.season, "*");
	}

	if (item.hasOwnProperty("recipe")){
		itemString += giveField("\nRecipe: *", item.recipe, "*");
	}

	if(item.hasOwnProperty("isKingFish")){
		itemString += giveField("\nIs it a kingfish: *", item.isKingFish, "*");
	}

	if (item.hasOwnProperty("mLevel")){
		itemString += giveField("\nLevel: *", item.mLevel, "*");
	}

	if (item.hasOwnProperty("resistance")){
		itemString += giveField("\nResistant to: *", item.resistance, "*");
	}

	if (item.hasOwnProperty("weakness")){
		itemString += giveField("\nWeak Against: *", item.weakness, "*");
	}

	if (item.hasOwnProperty("drops")){
		itemString += giveField("\nDrops: *", item.drops, "*");
	}

	if (item.hasOwnProperty("produce")){
		itemString += giveField("\nProduce: *", item.produce, "*");
	}

	if(item.hasOwnProperty("obtainFrom")){
		itemString += giveField("\nObtainable From: *", parseObtain(item.obtainFrom), "*");
	}

	/*if(item.hasOwnProperty("locations")){
		itemString += giveField("*,\nFishing Locations: *", item.locations);
	}*/

	return itemString;
}