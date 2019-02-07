var botvars = require('./vars');
var commaNumber = require('comma-number');

module.exports = {

	randomize: function(max){
		//Math.Random does not include max, but starts from 0, so the range is the same
		return Math.floor(Math.random() * max);
	},

	findItemRawDetails: function(itemName, categoryName){
		if (botvars.piCritterCatchCategories.includes(categoryName)){
				return findCritterRaw(itemName, categoryName);
		}

		switch (categoryName){
			case "crops":
				return botvars.picropsList[itemName];
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
function getStoneBreakingRolls(){
	var mLine = "**Roll line for using a rusty hammer:**\n";
	mLine += botvars.rustyHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using an ordinary hammer:**\n";
	mLine += botvars.ordinaryHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using a copper hammer:**\n";
	mLine += botvars.copperHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using a silver hammer:**\n";
	mLine += botvars.silverHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using a gold hammer:**\n";
	mLine += botvars.goldHammerLine.join(" | ");
	mLine += "\n\n**Roll line for using a mythic hammer:**\n";
	mLine += botvars.mysticHammerLine.join(" | ");

	return mLine;
}

function getLoggingRolls(){
	var mLine = "**Roll line for using a rusty axe:**\n";
	mLine += botvars.rustyAxeLine.join(" | ");
	mLine += "\n\n**Roll line for using an axe:**\n";
	mLine += botvars.axeLine.join(" | ");
	mLine += "\n\n**Roll line for using a copper axe:**\n";
	mLine += botvars.copperAxeLine.join(" | ");
	mLine += "\n\n**Roll line for using a silver axe:**\n";
	mLine += botvars.silverAxeLine.join(" | ");
	mLine += "\n\n**Roll line for using a gold axe:**\n";
	mLine += botvars.goldAxeLine.join(" | ");
	mLine += "\n\n**Roll line for using a mythic axe:**\n";
	mLine += botvars.mysticAxeLine.join(" | ");

	return mLine;
}

function getMineRolls(){
	var mLine = "**Roll line for using a hammer:**\n";
	mLine += botvars.mineHammerLine.join(" | ");
	mLine += "\n-\n**Roll line for using a hoe:**\n";
	mLine += botvars.mineHoeLine.join(" | ");

	return mLine;

}


//get category
function getCrops(itemName){
	var item = botvars.picropsList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveFieldPrice("*,\nSeed Price: *", item.seedPrice)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getFabrics(itemName){
	var item = botvars.piFabricList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getFish(itemName){
	var item = botvars.piFishList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nIs it a kingfish? *", item.isKingFish)
					+ giveField("*,\nFishing Locations: *", item.locations)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getFlowers(itemName){
	var item = botvars.piFlowerList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ giveFieldPrice("*,\nSeed Price: *", item.seedPrice)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getHerbs(itemName){
	var item = botvars.piHerbsList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getMonsterParts(itemName){
	var item = botvars.piMonsterPartsList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getSpores(itemName){
	var item = botvars.piSporesList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}


function getCrystal(itemName){
	var item = botvars.piCrystalsList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getGem(itemName){
	var item = botvars.piGemsList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}


function getOre(itemName){
	var item = botvars.piOresList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;
}

function getStone(itemName){
	var item = botvars.piStonesList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getMisc(itemName){
	var item = botvars.piMiscList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}


function getMisc(itemName){
	var item = botvars.piMiscList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getMineForge(itemName){
	var item = botvars.piMineForgeList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getRoots(itemName){
	var item = botvars.piRootsList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

function getLumber(itemName){
	var item = botvars.piLumberList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ giveField("*,\nRarity: *", item.rarity)
					+ giveField("*,\nWeapon Upgrade Effect: *", item.wEffect)
					+ giveField("*,\nEquipment Updgrade Effect: *", item.eEffect)
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;
}

function getWildFood(itemName){
	var item = botvars.piWildFoodList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

//critters
function getBees(itemName){
	var item = botvars.picropsList[itemName];
	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;

}

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
			item = botvars.piBeesList[critterName];
			break;
		case "beetles":
			item = botvars.piBeetlesList[critterName];
			break;
		case "butterflies":
			item = botvars.piButterfliesList[critterName];
			break;
		case "cicadas":
			item = botvars.piCicadasList[critterName];
			break;
		case "crickets":
			item = botvars.piCricketsList[critterName];
			break;
		case "dragonflies":
			item = botvars.piDragonfliesList[critterName];
			break;
		case "fireflies":
			item = botvars.piFirefliesList[critterName];
			break;
		case "frogs":
			item = botvars.piFrogsList[critterName];
			break;
		case "ladybugs":
			item = botvars.piLadybugsList[critterName];
			break;
		default:
			return {};
	}

	var itemString =  "**Details for " + item.name 
					+ ":\n**Price: *" + commaNumber(item.price) + "G" 
					+ "*,\nObtainable From: *" + parseObtain(item.obtainFrom) + "*";
	
	return itemString;
}


//find item from category
function findItem(itemName, categoryName){
	if (botvars.piCritterCatchCategories.includes(categoryName)){
		return findCritter(itemName, categoryName);
	}

	switch(categoryName){
		case "crops":
			return getCrops(itemName);
		case "crystals":
			return getCrystal(itemName);
		case "gems":
			return getGem(itemName);
		case "fabrics":
			return getFabrics(itemName);
		case "fish":
			return getFish(itemName);
		case "flowers":
			return getFlowers(itemName);
		case "herbs":
			return getHerbs(itemName);
		case "lumber":
			return getLumber(itemName);
		case "ores":
			return getOre(itemName);
		case "monsterparts":
			return getMonsterParts(itemName);
		case "roots":
			return getRoots(itemName);
		case "spores":
			return getSpores(itemName);
		case "stones":
			return getStone(itemName);
		case "wildfood":
			return getWildFood(itemName);
		case "misc":
			return getMisc(itemName);
		case "mineForge":
			return getMineForge(itemName);
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
