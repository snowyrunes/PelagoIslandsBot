var fs =require('fs');

var botvars = require('./variables/vars');
var botfuncts = require('./botfunct');

var msgWriter = require('./messageWriter');

var Mining = require('./minefunct');
var CritterCatching = require('./critterfunct');
var Foraging = require('./foragefunct');
var Logging = require('./logging');
var StoneBreaking = require('./stonebreaking');


module.exports = {
	initMethodDict: function (methodDict) {
		//general functions
		methodDict['rtest'] = botfuncts.randomTest;
		methodDict['list'] = botfuncts.listItemsFromCategory;
		methodDict['item'] = botfuncts.itemDetails;
		methodDict['getline'] = botfuncts.rollLine;

		//mining functions
		methodDict['mineone'] = botvars.piAllMinigamesMap["Mining"].mineOne;
		methodDict['mine'] = botvars.piAllMinigamesMap["Mining"].mineAll;

		//simple minigame functions
		methodDict['logging'] = botvars.piAllMinigamesMap["Logging"].logging;
		methodDict['logone'] = botvars.piAllMinigamesMap["Logging"].logone;
		methodDict['stonebreakone'] = botvars.piAllMinigamesMap["Stone Breaking"].stoneBreakOne;
		methodDict['stonebreak'] = botvars.piAllMinigamesMap["Stone Breaking"].stoneBreak;

		//critter catching
		methodDict['crittercatchone'] = botvars.piAllMinigamesMap["Critter Catching"].critterOne;
		methodDict['crittercatch'] = botvars.piAllMinigamesMap["Critter Catching"].critterAll;

		//foraging
		methodDict['forageone'] = botvars.piAllMinigamesMap["Foraging"].forageOne;
		methodDict['foraging'] = botvars.piAllMinigamesMap["Foraging"].foraging;

		//randomline
		methodDict['choose'] = botfuncts.randomFromLine;

		//message logging
		methodDict['export'] = msgWriter.export;


	},

	privateDic: function(msgCollect, args, channel){
		return msgWriter.exportLogic(msgCollect, args, channel);
	},

	initMethodArray: function (){

		botvars.piAllMinigamesMap["Logging"] = new Logging("Logging");
		botvars.piAllMinigamesMap["Stone Breaking"] = new StoneBreaking("Stone Breaking");
		botvars.piAllMinigamesMap["Critter Catching"] = new CritterCatching("Critter Catching");
		botvars.piAllMinigamesMap["Foraging"] = new Foraging("Foraging");
		botvars.piAllMinigamesMap["Mining"] = new Mining("Mining");

		critters();

		botvars.piCropsList = loadCategory("crops", "./data/crops.tsv");
		botvars.piCrystalsList = loadCategory("crystals", "./data/crystal.tsv");
		botvars.piFabricList = loadCategory("fabrics", "./data/fabrics.tsv");
		botvars.piFishList = loadCategory("fish", "./data/fish.tsv");
		botvars.piFlowerList = loadCategory("flowers", "./data/flowers.tsv");
		botvars.piHerbsList = loadCategory("herbs", "./data/herbs.tsv");
		botvars.piGemsList = loadCategory("gems", "./data/gems.tsv");
		botvars.piLumberList = loadCategory("lumber", "./data/lumber.tsv");
		botvars.piMonsterPartsList = loadCategory("monsterparts", "./data/monsterparts.tsv")
		botvars.piOresList = loadCategory("ores", "./data/ore.tsv");
		botvars.piRootsList = loadCategory("roots", "./data/roots.tsv");
		botvars.piSporesList = loadCategory("spores", "./data/spore.tsv");
		botvars.piStonesList = loadCategory("stones", "./data/stones.tsv");
		botvars.piWildFoodList = loadCategory("wildfood", "./data/wildfoods.tsv");

		//items that don't fit other categories
		botvars.piMiscList = loadCategory("misc", "./data/misc.tsv");

		//combinations

		//be sure to include this in the receipe list later
		botvars.piMineForgeList = loadCategory("accessories", "./data/accessories.tsv");
    }

}


//general read function
function readFile(filepath){
	var fs = require("fs");
	var filejunk = fs.readFileSync(filepath, {"encoding": "utf-8"}).trim();
	return filejunk;
}

function getObtainableFromProperty(itemName){
	var obtainableFrom = "N/A";

	var mgMapping = Object.keys(botvars.piAllMinigamesMap);
	for(var i = 0; i< mgMapping.length; i++){

		var obtFrom = botvars.piAllMinigamesMap[mgMapping[i]].getItemConditions(itemName);

		if(null != obtFrom){
			if("N/A" == obtainableFrom){
				obtainableFrom = obtFrom;
			}else {
				obtainableFrom = obtainableFrom + "; " + obtFrom;
			}
		}
	}

	return obtainableFrom;
}


function getFileCategoryListing(filePath){
	var listRaw = readFile(filePath).split("\n");
	var propertyNames = listRaw[0].trim().split("\t");
	var categoryList = [];

	for(i = 1; i< listRaw.length; i++){
		var item = listRaw[i].trim().split("\t");
		
		var tempItem = {};

		for(j = 0; j< propertyNames.length; j++){
			tempItem[propertyNames[j]] = item[j];
		}

		tempItem["obtainFrom"] = getObtainableFromProperty(tempItem["name"].toLowerCase());
		//assume name is always in item[0]
		categoryList[(item[0].trim().toLowerCase())] = tempItem;
		botvars.piAllItemMap[tempItem["name"].toLowerCase()] = tempItem;
		
	}

	return categoryList;
}

function loadCategory(categoryName, filepath){
	var categoryList = getFileCategoryListing(filepath);

	botvars.piItemCategories[categoryName] = Object.keys(categoryList);
	return categoryList;
}


//critter categories
function critters(){
	botvars.piBeesList = loadCategory("bees", "./data/critters/bees.tsv");
	botvars.piBeetlesList = loadCategory("beetles", "./data/critters/beetles.tsv");
	botvars.piButterfliesList = loadCategory("butterflies", "./data/critters/butterflies.tsv");
	botvars.piCicadasList = loadCategory ("cicadas", "./data/critters/cicadas.tsv");
	botvars.piCricketsList = loadCategory("crickets", "./data/critters/crickets.tsv");
	botvars.piDragonfliesList = loadCategory("dragonflies", "./data/critters/dragonflies.tsv");
	botvars.piFirefliesList = loadCategory("fireflies", "./data/critters/fireflies.tsv");
	botvars.piFrogsList = loadCategory("frogs", "./data/critters/frogs.tsv");
	botvars.piLadybugsList = loadCategory("ladybugs", "./data/critters/ladybugs.tsv");
}


function misc(){
	var miscFile = "./data/misc.tsv"

	miscListRaw = readFile(miscFile).split("\n");

	for(i = 1; i < miscListRaw.length; i++){
			item = miscListRaw[i].trim().split(",");
			botvars.piMiscList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": getObtainableFromProperty(tempItem["name"].toLowerCase())};
		}
}

