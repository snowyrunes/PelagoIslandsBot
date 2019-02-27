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

	findItemRawDetails: function(itemName, categoryName){
		if (botvars.piCritterCatchCategories.includes(categoryName)){
				return findCritterRaw(itemName, categoryName);
		}

		switch (categoryName){
			case "crops":
				return botvars.piCropsList[itemName];
			case "crystals":
				return botvars.piCrystalsList[itemName];
			case "gems":
				return botvars.piGemsList[itemName];
			case "fabrics":
				return botvars.piFabricList[itemName];
			case "fish":
				return botvars.piFishList[itemName];
			case "flowers":
				return botvars.piFlowerList[itemName];
			case "herbs":
				return botvars.piHerbsList[itemName];
			case "lumber":
				return botvars.piLumberList[itemName];
			case "monsterparts":
				return botvars.piMonsterPartsList[itemName];
			case "ores":
				return botvars.piOresList[itemName];
			case "roots":
				return botvars.piRootsList[itemName];
			case "spores":
				return botvars.piSporesList[itemName];
			case "stones":
				return botvars.piStonesList[itemName];
			case "wildfood":
				return botvars.piWildFoodList[itemName];
			case "misc":
				return botvars.piMiscList[itemName];
			case "mineForge":
				//be sure that armor bleeds into this one
				return botvars.piMineForgeList[itemName];
			default:
				return {};
		}
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
		return findCateogry(itemName);	

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
			default:
				return ("No minigame command found for " + args[0]);
		}

	}

}

function giveFieldPrice(sDescript, field){
	if (field === "N/A"){
		return ""
	}

	return sDescript + commaNumber(field) + "G";
}

//local functions
function giveField(sDescript, field){
	if (field === "N/A"){
		return "";
	}

	return sDescript + field;
}

function parseObtain(oString){
	return oString.split(" + ").join(", ");
}

//roll line functions

function getForageLine(){
	var fLine = "**Roll line for foraging on Arcadia in spring:**\n";
	fLine += lines.forageArcadiaSpring.join(" | ");
	fLine += "\n-\n**Roll line for foraging on Arcadia in summer:**\n";
	fLine += lines.forageArcadiaSummer.join(" | ");
	fLine += "\n-\n**Roll line for foraging on Arcadia in fall:**\n";
	fLine += lines.forageArcadiaFall.join(" | ");
	fLine += "\n-\n**Roll line for foraging on Arcadia in winter:**\n";
	fLine += lines.forageArcadiaWinter.join(" | ");
	fLine += "\n-\n**Roll line for foraging on Elysia:**\n";
	fLine += lines.forageElysia.join(" | ");

	return fLine;
}

function getCritterCatchRolls(){
	var cLine = "**Roll line for critter catching in spring:**\n";
	cLine += lines.springCritterLine.join(" | ");
	cLine += "\n-\n**Roll line for critter catching in summer:**\n";
	cLine += lines.summerCritterLine.join(" | ");
	cLine += "\n-\n**Roll line for critter catching in fall:**\n";
	cLine += lines.fallCritterLine.join(" | ");
	cLine += "\n-\n**Roll line for critter catching in winter:**\n";
	cLine += lines.winterCritterLine.join(" | ");

	return cLine;
}

function getStoneBreakingRolls(){
	var mLine = "**Roll line for using a rusty hammer:**\n";
	mLine += lines.rustyHammerLine.join(" | ");
	mLine += "\n-\n**Roll line for using an ordinary hammer:**\n";
	mLine += lines.ordinaryHammerLine.join(" | ");
	mLine += "\n-\n**Roll line for using a copper hammer:**\n";
	mLine += lines.copperHammerLine.join(" | ");
	mLine += "\n-\n**Roll line for using a silver hammer:**\n";
	mLine += lines.silverHammerLine.join(" | ");
	mLine += "\n-\n**Roll line for using a gold hammer:**\n";
	mLine += lines.goldHammerLine.join(" | ");
	mLine += "\n-\n**Roll line for using a mythic hammer:**\n";
	mLine += lines.mysticHammerLine.join(" | ");

	return mLine;
}

function getLoggingRolls(){
	var mLine = "**Roll line for using a rusty axe:**\n";
	mLine += lines.rustyAxeLine.join(" | ");
	mLine += "\n-\n**Roll line for using an axe:**\n";
	mLine += lines.axeLine.join(" | ");
	mLine += "\n-\n**Roll line for using a copper axe:**\n";
	mLine += lines.copperAxeLine.join(" | ");
	mLine += "\n-\n**Roll line for using a silver axe:**\n";
	mLine += lines.silverAxeLine.join(" | ");
	mLine += "\n-\n**Roll line for using a gold axe:**\n";
	mLine += lines.goldAxeLine.join(" | ");
	mLine += "\n-\n**Roll line for using a mythic axe:**\n";
	mLine += lines.mysticAxeLine.join(" | ");

	return mLine;
}

function getMineRolls(){
	var mLine = "**Roll line for using a hammer:**\n";
	mLine += lines.mineHammerLine.join(" | ");
	mLine += "\n-\n**Roll line for using a hoe:**\n";
	mLine += lines.mineHoeLine.join(" | ");

	return mLine;

}


//get category generic
function getCategoryFromList(categoryList, itemName){
	var item = categoryList[itemName];
	var itemString =  "**Details for " + item.name;
	
	if(item.hasOwnProperty("price")){
		itemString += ":\n**Price: *" + commaNumber(item.price) + "G";
	}

	if(item.hasOwnProperty("seedPrice")){
		itemString += giveFieldPrice("*,\nSeed Price: *", item.seedPrice);
	}

	if(item.hasOwnProperty("rarity")){
		itemString += giveField("*,\nRarity: *", item.rarity);
	}

	if(item.hasOwnProperty("wEffect")){
		itemString += giveField("*,\nWeapon Upgrade Effect: *", item.wEffect);
	}

	if (item.hasOwnProperty("eEffect")){
		itemString += giveField("*,\nEquipment Updgrade Effect: *", item.eEffect);
	}

	if(item.hasOwnProperty("obtainFrom")){
		itemString += "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	}

	if(item.hasOwnProperty("isKingFish")){
		itemString += giveField("*,\nIs it a kingfish? *", item.isKingFish);
	}

	if(item.hasOwnProperty("locations")){
		itemString += giveField("*,\nFishing Locations: *", item.locations);
	}

	return itemString;
}

//get category

function findCritterRaw(critterName, categoryName){
	switch(categoryName){
		case "bees":
			return botvars.piBeesList[critterName];
		case "beetles":
			return botvars.piBeetlesList[critterName];
		case "butterflies":
			return botvars.piButterfliesList[critterName];
		case "cicadas":
			return botvars.piCicadasList[critterName];
		case "crickets":
			return botvars.piCricketsList[critterName];
		case "dragonflies":
			return botvars.piDragonfliesList[critterName];
		case "fireflies":
			return botvars.piFirefliesList[critterName];
		case "frogs":
			return botvars.piFrogsList[critterName];
		case "ladybugs":
			return botvars.piLadybugsList[critterName];
		default:
			return "Invalid Critter Category " + categoryName;
	}

}

function findCritter(critterName, categoryName){

	var item = null;

	switch(categoryName){
		case "bees":
			return getCategoryFromList(botvars.piBeesList, critterName);
		case "beetles":
			return getCategoryFromList(botvars.piBeetlesList, critterName);
		case "butterflies":
			return getCategoryFromList(botvars.piButterfliesList, critterName);
		case "cicadas":
			return getCategoryFromList(botvars.piCicadasList, critterName);
		case "crickets":
			return getCategoryFromList(botvars.piCricketsList, critterName);
		case "dragonflies":
			return getCategoryFromList(botvars.piDragonfliesList, critterName);
		case "fireflies":
			return getCategoryFromList(botvars.piFirefliesList, critterName);
		case "frogs":
			return getCategoryFromList(botvars.piFrogsList, critterName);
		case "ladybugs":
			return getCategoryFromList(botvars.piLadybugsList, critterName);
		default:
			return {};
	}
}


//find item from category
function findItem(itemName, categoryName){
	if (botvars.piCritterCatchCategories.includes(categoryName)){
		return findCritter(itemName, categoryName);
	}

	switch(categoryName){
		case "crops":
			return getCategoryFromList(itemName, botvars.piCropsList);
		case "crystals":
			return getCategoryFromList(itemName, botvars.piCrystalsList);
		case "gems":
			return getCategoryFromList(botvars.piGemsList, itemName);
		case "fabrics":
			return getCategoryFromList(botvars.piFabricList, itemName);
		case "fish":
			return getCategoryFromList(botvars.piFishList, itemName);
		case "flowers":
			return getCategoryFromList(botvars.piFlowerList, itemName);
		case "herbs":
			return getCategoryFromList(botvars.piHerbsList, itemName);
		case "lumber":
			return getCategoryFromList(botvars.piLumberList, itemName);
		case "monsterparts":
			return getCategoryFromList(botvars.piMonsterPartsList, itemName);
		case "ores":
			return getCategoryFromList(botvars.piOresList, itemName);
		case "roots":
			return getCategoryFromList(botvars.piRootsList, itemName);
		case "spores":
			return getCategoryFromList(botvars.piSporesList, itemName);
		case "stones":
			return getCategoryFromList(botvars.piStonesList, itemName);
		case "wildfood":
			return getCategoryFromList(botvars.piWildFoodList, itemName);
		case "misc":
			return getCategoryFromList(botvars.piMiscList, itemName);
		case "mineForge":
			//be sure that armor bleeds into this one
			return getCategoryFromList(botvars.piMineForgeList, itemName);
		default:
			return "Something went wrong. Contact Katie about category " + categoryName;
	}
}

//finding
function findCateogry(itemName){
	var itemCategories = Object.keys(botvars.piItemCategories);

	for(var i = 0; i< itemCategories.length; i++){
		var itemsForCat = botvars.piItemCategories[itemCategories[i]];

		if (itemsForCat.includes(itemName)){
			 return findItem(itemName, itemCategories[i]);
		}
	}

	return "Invalid item name " + itemName;

}
