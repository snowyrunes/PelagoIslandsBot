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

	splitCommaOrBar: function(arrLine){
		var rArray = null;

		if(arrLine.includes("|")){
			rArray = arrLine.split("|").map(m => m.trim());
		}else{
			rArray = arrLine.split(",").map(m => m.trim());
		}

		return rArray;
	},

	rollDie: function(args){

		if(isNaN(args[0])){
			return args[0] + " is not a number.";
		}

		return "Rolling a d" + args[0] + ".\nResult: " + (Math.floor(Math.random() * args[0]) + 1);
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

	locationDetails: function (args) {
		if (args.length < 1){
			return ("Please include a location name (note that islands are separate).");
		}

		var locationName =  ""+ args.join(" ").trim().toLowerCase() + "";

		//console.log(Object.keys(botvars.piAllMonstersMap));
		if(Object.keys(botvars.piAllLocationMap).includes(locationName)){
			return getCategoryFromList(locationName, botvars.piAllLocationMap);
		}else{
			return "Invalid location name " + locationName + " (note that islands are input as pi!island ISLAND NAME)";
		}

	},


	islandDetails: function (args) {
		if (args.length < 1){
			return ("Please include an island name (note that locations are separate).");
		}

		var islandName =  ""+ args.join(" ").trim().toLowerCase() + "";

		//console.log(Object.keys(botvars.piAllMonstersMap));
		if(Object.keys(botvars.piAllIslandMap).includes(islandName)){
			return getCategoryFromList(islandName, botvars.piAllIslandMap);
		}else{
			return "Invalid island name " + islandName + " (note that islands are not the same as locations)";
		}

	},

	classDetails: function (args) {
		if (args.length < 1){
			return ("Please include a class name.");
		}

		var className =  ""+ args.join(" ").trim().toLowerCase() + "";

		//console.log(Object.keys(botvars.piAllMonstersMap));
		if(Object.keys(botvars.piAllClassesMap).includes(className)){
			return getCategoryFromList(className, botvars.piAllClassesMap);
		}else{
			return "Invalid class name " + className;
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
			case "tameone":
			case "taming":
				return getTamingRolls();
			case "gardenone":
			case "gardening":
				return getGardeningRolls();
			case "alchemyone":
			case "alchemy":
				return getAlchemyRolls();
			case "cooking":
			case "cookone":
				return getCookingRolls();
			case "levelup":
				return getLevelUpRolls();
			case "monsterhunt":
				return getMonsterHuntRolls();
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

function getLevelUpRolls(){
	var aLine = "**Roll line for classes with High SPD**\n"
	aLine += lines.highSPD.join(" | ");
	aLine += "\n\n**Roll line for classes with High DEF**\n"
	aLine += lines.highDEF.join(" | ");
	aLine += "\n\n**Roll line for classes with High ATK**\n"
	aLine += lines.highATK.join(" | ");
	aLine += "\n\n**Roll line for classes with High M.ATK**\n"
	aLine += lines.highMATK.join(" | ");
	aLine += "\n\n**Roll line for classes with High M.DEF**\n"
	aLine += lines.highMDEF.join(" | ");

	return aLine;
}

function getMonsterHuntRolls(){
	var aLine = "**Roll line for Player Levels 1-3**\n"
	aLine += lines.level1To3HitLine.join(" | ");
	aLine += "\n**Roll line for Player Levels 4-6**\n"
	aLine += lines.level4To6HitLine.join(" | ");
	aLine += "\n**Roll line for Player Levels 7-9**\n"
	aLine += lines.level7To9HitLine.join(" | ");
	aLine += "\n**Roll line for Player Levels 10-12**\n"
	aLine += lines.level10To12HitLine.join(" | ");
	aLine += "\n**Roll line for Player Levels 13 and Above**\n"
	aLine += lines.level13PlusHitLine.join(" | ");
	aLine += "\n\n**Roll line for Monster Level E**\n"
	aLine += lines.levelEHitLine.join(" | ");
	aLine += "\n**Roll line for Monster Level D**\n"
	aLine += lines.levelDHitLine.join(" | ");
	aLine += "\n**Roll line for Monster Level C**\n"
	aLine += lines.levelCHitLine.join(" | ");
	aLine += "\n**Roll line for Monster Level B**\n"
	aLine += lines.levelBHitLine.join(" | ");
	aLine += "\n**Roll line for Monster Level A**\n"
	aLine += lines.levelAHitLine.join(" | ");
	aLine += "\n**Roll line for Monster Level Boss**\n"
	aLine += lines.levelBossHitLine.join(" | ");

	return aLine;
}

function getCookingRolls(){
	var aLine = "**Roll line for using a Small Kitchen**\n"
	aLine += lines.smallKitchen.join(" | ");
	aLine += "\n\n**Roll line for using a Medium Kitchen**\n"
	aLine += lines.mediumKitchen.join(" | ");
	aLine += "\n\n**Roll line for using a Large Kitchen**\n"
	aLine += lines.largeKitchen.join(" | ");

	return aLine;
}

function getAlchemyRolls(){
	var aLine = "**Roll line for using a Small Chemistry Set**\n"
	aLine += lines.smallChemistrySet.join(" | ");
	aLine += "\n\n**Roll line for using a Medium Chemistry Set**\n"
	aLine += lines.mediumChemistrySet.join(" | ");
	aLine += "\n\n**Roll line for using a Large Chemistry Set**\n"
	aLine += lines.largeChemistrySet.join(" | ");

	return aLine;
}

function getGardeningRolls(){
	var gLine = "**Roll line for using a rusty watering can**\n";
	gLine += lines.rustyWateringCanLine.join(" | ");
	gLine += "\n\n**Roll line for using an ordinary watering can:**\n";
	gLine += lines.ordinaryWateringCanLine.join(" | ");
	gLine += "\n\n**Roll line for using a copper watering can:**\n";
	gLine += lines.copperWateringCanLine.join(" | ");
	gLine += "\n\n**Roll line for using a silver watering can:**\n";
	gLine += lines.silverWateringCanLine.join(" | ");
	gLine += "\n\n**Roll line for using a gold watering can:**\n";
	gLine += lines.goldWateringCanLine.join(" | ");
	gLine += "\n\n**Roll line for using a mythic watering can:**\n";
	gLine += lines.mysticWateringCanLine.join(" | ");

	return gLine;
}

function getTamingRolls(){
	var mLine = "**Roll line for taming Level E monsters:**\n";
	mLine += lines.tameLevelE.join(" | ");
	mLine +=  "\n\n**Roll line for taming Level D monsters:**\n";
	mLine += lines.tameLevelD.join(" | ");
	mLine +=  "\n\n**Roll line for taming Level C monsters:**\n";
	mLine += lines.tameLevelC.join(" | ");
	mLine +=  "\n\n**Roll line for taming Level B monsters:**\n";
	mLine += lines.tameLevelB.join(" | ");
	mLine +=  "\n\n**Roll line for taming Level A monsters:**\n";
	mLine += lines.tameLevelA.join(" | ");
	mLine +=  "\n\n**Roll line for taming Boss Level monsters:**\n";
	mLine += lines.tameLevelBoss.join(" | ");

	return mLine;

}

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

	if(item.hasOwnProperty("shiningPrice")){
		itemString += giveFieldPrice("\nShining Price: *", item.shiningPrice, "*");
	}

	if(item.hasOwnProperty("poorPrice")){
		itemString += giveFieldPrice("\nPoor Quality Price: *", item.poorPrice, "*");
	}

	if(item.hasOwnProperty("overgrownPrice")){
		itemString += giveFieldPrice("\nOvergrown Price: *", item.overgrownPrice, "*");
	}

	if(item.hasOwnProperty("goldenPrice")){
		itemString += giveFieldPrice("\nGolden Price: *", item.goldenPrice, "*");
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

	if(item.hasOwnProperty("shiningStatBoost")){
		itemString += giveField("\nShining Dish Stat Boost: *", item.shiningStatBoost, "*" );
	}

	if(item.hasOwnProperty("effects")){
		itemString += giveField("\nEffects: *", item.effects, "*" );
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

	if (item.hasOwnProperty("owner")){
		itemString += giveField("\nOwner: *", item.owner, "*");
	}

	if (item.hasOwnProperty("discovered")){
		itemString += giveField("\nDiscovered: *", item.discovered, "*");
	}

	if (item.hasOwnProperty("destroyed")){
		itemString += giveField("\nDestroyed: *", item.destroyed, "*");
	}

	if (item.hasOwnProperty("accessibility")){
		itemString += giveField("\nAccessibility: *", item.accessibility, "*");
	}

	if (item.hasOwnProperty("locations")){
		itemString += giveField("\nLocations: *", item.locations, "*");
	}

	if (item.hasOwnProperty("monsters")){
		itemString += giveField("\nMonsters: *", item.monsters, "*");
	}

	if (item.hasOwnProperty("expE")){
		itemString += giveField("\nEXP earned for defeating/Taming **level E** monsters: *", item.expE, "*");
	}

	if (item.hasOwnProperty("expD")){
		itemString += giveField("\nEXP earned for defeating/Taming **level D** monsters: *", item.expD, "*");
	}

	if (item.hasOwnProperty("expC")){
		itemString += giveField("\nEXP earned for defeating/Taming **level C** monsters: *", item.expC, "*");
	}

	if (item.hasOwnProperty("expB")){
		itemString += giveField("\nEXP earned for defeating/Taming **level B** monsters: *", item.expB, "*");
	}

	if (item.hasOwnProperty("expA")){
		itemString += giveField("\nEXP earned for defeating/Taming **level A** monsters: *", item.expA, "*");
	}

	if (item.hasOwnProperty("expBoss")){
		itemString += giveField("\nEXP earned for defeating/Taming **Boss level** monsters: *", item.expBoss, "*");
	}

	if (item.hasOwnProperty("baseATK")){
		itemString += giveField("\nBase ATK: *", item.baseATK, "*");
	}

	if (item.hasOwnProperty("baseDEF")){
		itemString += giveField("\nBase DEF: *", item.baseDEF, "*");
	}

	if (item.hasOwnProperty("baseMATK")){
		itemString += giveField("\nBase M.ATK: *", item.baseMATK, "*");
	}

	if (item.hasOwnProperty("baseMDEF")){
		itemString += giveField("\nBase M.DEF: *", item.baseMDEF, "*");
	}

	if (item.hasOwnProperty("baseSPD")){
		itemString += giveField("\nBase SPD: *", item.baseSPD, "*");
	}

	if (item.hasOwnProperty("MP")){
		itemString += giveField("\nMP: *", item.MP, "*");
	}

	if (item.hasOwnProperty("mainStat")){
		itemString += giveField("\nMain Stat: *", item.mainStat, "*");
	}

	if (item.hasOwnProperty("classCategory")){
		itemString += giveField("\nClass Type: *", item.classCategory, "*");
	}

	if (item.hasOwnProperty("description")){
		itemString += giveField("\nDescription: *", item.description, "*");
	}

	if(item.hasOwnProperty("obtainFrom")){
		itemString += giveField("\nObtainable From: *", parseObtain(item.obtainFrom), "*");
	}

	/*if(item.hasOwnProperty("locations")){
		itemString += giveField("*,\nFishing Locations: *", item.locations);
	}*/

	return itemString;
}