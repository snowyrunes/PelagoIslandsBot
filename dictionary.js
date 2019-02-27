var botfuncts = require('./botfunct');
var minefuncts = require('./minefunct');
var simplefuncts = require('./simplefunct');
var critterfuncts = require('./critterfunct');
var foragefuncts = require('./foragefunct');
var botvars = require('./variables/vars');
var fs =require('fs');

module.exports = {
	initMethodDict: function (methodDict) {
		//general functions
		methodDict['rtest'] = botfuncts.randomTest;
		methodDict['list'] = botfuncts.listItemsFromCategory;
		methodDict['item'] = botfuncts.itemDetails;
		methodDict['getline'] = botfuncts.rollLine;

		//mining functions
		methodDict['mineone'] = minefuncts.mineOne;
		methodDict['mine'] = minefuncts.mineAll;

		//simple minigame functions
		methodDict['logging'] = simplefuncts.logging;
		methodDict['logone'] = simplefuncts.logone;
		methodDict['stonebreakone'] = simplefuncts.stoneBreakOne;
		methodDict['stonebreak'] = simplefuncts.stoneBreak;

		//critter catching
		methodDict['crittercatchone'] = critterfuncts.critterOne;
		methodDict['crittercatch'] = critterfuncts.critterAll;

		//foraging
		methodDict['forageone'] = foragefuncts.forageOne;
		methodDict['foraging'] = foragefuncts.foraging;

		//randomline
		methodDict['choose'] = botfuncts.randomFromLine;


	},

	initMethodArray: function (){
		critters();

		botvars.piCropsList = loadCategory("crops", "./data/crops.csv");
		botvars.piCrystalsList = loadCategory("crystals", "./data/crystal.csv");
		botvars.piFabricList = loadCategory("fabrics", "./data/fabrics.csv");
		botvars.piFishList = loadCategory("fish", "./data/fish.csv");
		botvars.piFlowerList = loadCategory("flowers", "./data/flowers.csv");
		botvars.piHerbsList = loadCategory("herbs", "./data/herbs.csv");
		botvars.piGemsList = loadCategory("gems", "./data/gems.csv");
		botvars.piLumberList = loadCategory("lumber", "./data/lumber.csv");
		botvars.piMonsterPartsList = loadCategory("monsterparts", "./data/monsterparts.csv")
		botvars.piOresList = loadCategory("ores", "./data/ore.csv");
		botvars.piRootsList = loadCategory("roots", "./data/roots.csv");
		botvars.piSporesList = loadCategory("spores", "./data/spore.csv");
		botvars.piStonesList = loadCategory("stones", "./data/stones.csv");
		botvars.piWildFoodList = loadCategory("wildfood", "./data/wildfoods.csv");

		//items that don't fit other categories
		botvars.piMiscList = loadCategory("misc", "./data/misc.csv");

		//combinations

		//be sure to include this in the receipe list later
		botvars.piMineForgeList = loadCategory("mineForge", "./data/mineforge.csv");

		//minigames categories for easy reference
		botvars.piMiningCategories = ["crystals", "gems", "ores", "stones", "misc", "mineForge", "roots"];
		botvars.piLoggingCategories = ["lumber", "crops", "stones", "spores", "crystals"];
		botvars.piCritterCatchCategories = ["bees", "beetles", "butterflies", "cicadas", "crickets", "dragonflies", "fireflies", "frogs", "ladybugs"];
		botvars.piForagingCategories = ["crops", "crystals", "fabrics", "fish", "flowers", "herbs", "lumber", "misc", "monsterparts", "roots", "spores", "stones", "wildfood"];
    }

}


//general read function
function readFile(filepath){
	var fs = require("fs");
	var filejunk = fs.readFileSync(filepath, {"encoding": "utf-8"}).trim();
	return filejunk;
}

function getFileCategoryListing(filePath){
	var listRaw = readFile(filePath).split("\n");
	var propertyNames = listRaw[0].trim().split(",");
	var categoryList = [];

	for(i = 1; i< listRaw.length; i++){
		var item = listRaw[i].trim().split(",");
		
		var tempItem = {};

		for(j = 0; j< propertyNames.length; j++){
			tempItem[propertyNames[j]] = item[j];
		}
		//assume name is always in item[0]
		categoryList[(item[0].trim().toLowerCase())] = tempItem;
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
	botvars.piBeesList = loadCategory("bees", "./data/critters/bees.csv");
	botvars.piBeetlesList = loadCategory("beetles", "./data/critters/beetles.csv");
	botvars.piButterfliesList = loadCategory("butterflies", "./data/critters/butterflies.csv");
	botvars.piCicadasList = loadCategory ("cicadas", "./data/critters/cicadas.csv");
	botvars.piCricketsList = loadCategory("crickets", "./data/critters/crickets.csv");
	botvars.piDragonfliesList = loadCategory("dragonflies", "./data/critters/dragonflies.csv");
	botvars.piFirefliesList = loadCategory("fireflies", "./data/critters/fireflies.csv");
	botvars.piFrogsList = loadCategory("frogs", "./data/critters/frogs.csv");
	botvars.piLadybugsList = loadCategory("ladybugs", "./data/critters/ladybugs.csv");
}


function misc(){
	var miscFile = "./data/misc.csv"

	miscListRaw = readFile(miscFile).split("\n");

	for(i = 1; i < miscListRaw.length; i++){
			item = miscListRaw[i].trim().split(",");
			botvars.piMiscList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": item[5]};
		}
}

