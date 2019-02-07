var botfuncts = require('./botfunct');
var minefuncts = require('./minefunct');
var simplefuncts = require('./simplefunct');
var critterfuncts = require('./critterfunct');
var foragefuncts = require('./foragefunct');
var botvars = require('./vars');
var fs =require('fs');

//var parse = require('csv-parse');
//var Converter = require("csvtojson").Converter;
//var csv = require('csv-parser')

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


	},

	initMethodArray: function (){
		crops();
		crystals();
		fabrics();
		fish();
		flowers();
		gems();
		herbs();
		lumber();
		ores();
		monsterParts();
		roots();
		spores();
		stones();
		critters();
		wildFoods();
		
		//items that don't fit other categories
		misc();

		//combinations
		getMineForge();

		botvars.piItemCategories["crops"] = Object.keys(botvars.picropsList);
		botvars.piItemCategories["crystals"] = Object.keys(botvars.piCrystalsList);
		botvars.piItemCategories["fabrics"] = Object.keys(botvars.piFabricList);
		botvars.piItemCategories["fish"] = Object.keys(botvars.piFishList);
		botvars.piItemCategories["flowers"]= Object.keys(botvars.piFlowerList);
		botvars.piItemCategories["herbs"] = Object.keys(botvars.piHerbsList);
		botvars.piItemCategories["gems"] = Object.keys(botvars.piGemsList);
		botvars.piItemCategories["lumber"] = Object.keys(botvars.piLumberList);
		botvars.piItemCategories["monsterparts"] = Object.keys(botvars.piMonsterPartsList);
		botvars.piItemCategories["ores"] = Object.keys(botvars.piOresList);
		botvars.piItemCategories["roots"] = Object.keys(botvars.piRootsList);
		botvars.piItemCategories["spores"] = Object.keys(botvars.piSporesList);
		botvars.piItemCategories["stones"] = Object.keys(botvars.piStonesList);
		botvars.piItemCategories["wildfood"] = Object.keys(botvars.piWildFoodList);

		//critters
		botvars.piItemCategories["bees"] = Object.keys(botvars.piBeesList);
		botvars.piItemCategories["beetles"] = Object.keys(botvars.piBeetlesList);
		botvars.piItemCategories["butterflies"] = Object.keys(botvars.piButterfliesList);
		botvars.piItemCategories["cicadas"] = Object.keys(botvars.piCicadasList);
		botvars.piItemCategories["crickets"] = Object.keys(botvars.piCricketsList);
		botvars.piItemCategories["dragonflies"] = Object.keys(botvars.piDragonfliesList);
		botvars.piItemCategories["fireflies"] = Object.keys(botvars.piFirefliesList);
		botvars.piItemCategories["frogs"] = Object.keys(botvars.piFrogsList);
		botvars.piItemCategories["ladybugs"] = Object.keys(botvars.piLadybugsList);

		botvars.piItemCategories["misc"] = Object.keys(botvars.piMiscList);

		//be sure to include this in the recepie list later
		botvars.piItemCategories["mineForge"] = Object.keys(botvars.piMineForgeList);

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

function lumber(){
	var lumberFile = "./data/lumber.csv"

	lumberListRaw = readFile(lumberFile).split("\n");

	for(i = 1; i < lumberListRaw.length; i++){
			item = lumberListRaw[i].trim().split(",");
			botvars.piLumberList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": item[5]};
		}
}


//all fetch categories

function critters(){
	var beesFile = "./data/critters/bees.csv"
	var beetlesFile = "./data/critters/beetles.csv"
	var butterfliesFile = "./data/critters/butterflies.csv"
	var cicadasFile = "./data/critters/cicadas.csv"
	var cricketsFile = "./data/critters/crickets.csv"
	var dragonfliesFile = "./data/critters/dragonflies.csv"
	var firefliesFile = "./data/critters/fireflies.csv"
	var frogsFile = "./data/critters/frogs.csv"
	var ladybugsFile = "./data/critters/ladybugs.csv"

	var beesListRaw = readFile(beesFile).split("\n");
	var beetlesListRaw = readFile(beetlesFile).split("\n");
	var butterfliesListRaw = readFile(butterfliesFile).split("\n");
	var cicadasListRaw = readFile(cicadasFile).split("\n");
	var cricketsListRaw = readFile(cricketsFile).split("\n");
	var dragonfliesListRaw = readFile(dragonfliesFile).split("\n");
	var firefliesListRaw = readFile(firefliesFile).split("\n");
	var frogsListRaw = readFile(frogsFile).split("\n");
	var ladybugsListRaw = readFile(ladybugsFile).split("\n");

	for(i = 1; i < beesListRaw.length; i++) {
			item = beesListRaw[i].trim().split(",");
			botvars.piBeesList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
	}

	for(i = 1; i < beetlesListRaw.length; i++) {
			item = beetlesListRaw[i].trim().split(",");
			botvars.piBeetlesList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
	}

	for(i = 1; i < butterfliesListRaw.length; i++) {
			item = butterfliesListRaw[i].trim().split(",");
			botvars.piButterfliesList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
	}

	for(i = 1; i < cicadasListRaw.length; i++) {
			item = cicadasListRaw[i].trim().split(",");
			botvars.piCicadasList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
	}

	for(i = 1; i < cricketsListRaw.length; i++) {
			item = cricketsListRaw[i].trim().split(",");
			botvars.piCricketsList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
	}

	for(i = 1; i < dragonfliesListRaw.length; i++) {
			item = dragonfliesListRaw[i].trim().split(",");
			botvars.piDragonfliesList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
	}

	for(i = 1; i < firefliesListRaw.length; i++) {
			item = firefliesListRaw[i].trim().split(",");
			botvars.piFirefliesList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
	}

	for(i = 1; i < frogsListRaw.length; i++) {
			item = frogsListRaw[i].trim().split(",");
			botvars.piFrogsList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
	}

	for(i = 1; i < ladybugsListRaw.length; i++) {
			item = ladybugsListRaw[i].trim().split(",");
			botvars.piLadybugsList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
	}
}

function spores(){
	var sporesFile = "./data/spore.csv"

	sporesListRaw = readFile(sporesFile).split("\n");

	for(i = 1; i < sporesListRaw.length; i++){
			item = sporesListRaw[i].trim().split(",");
			botvars.piSporesList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": item[5]};
		}
}

function monsterParts(){
	var monsterPartsFile = "./data/monsterparts.csv"

	monsterPartsListRaw = readFile(monsterPartsFile).split("\n");

	for(i = 1; i < monsterPartsListRaw.length; i++){
			item = monsterPartsListRaw[i].trim().split(",");
			botvars.piMonsterPartsList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": item[5]};
		}
}

function crops(){
	var cropsFile = "./data/crops.csv"

	cropsListRaw = readFile(cropsFile).split("\n");

	for(i = 1; i < cropsListRaw.length; i++){
			item = cropsListRaw[i].trim().split(",");
			botvars.picropsList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "seedPrice": item[2], "obtainFrom": item[3]};
		}
}

function fish(){
	var fishFile = "./data/fish.csv"

	fishListRaw = readFile(fishFile).split("\n");

	for(i = 1; i < fishListRaw.length; i++){
			item = fishListRaw[i].trim().split(",");
			botvars.piFishList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "isKingFish": item[2], "locations": item[3], "obtainFrom": item[4]};
		}
}

function fabrics(){
	var fabricFile = "./data/fabrics.csv"

	fabricsListRaw = readFile(fabricFile).split("\n");

	for(i = 1; i < fabricsListRaw.length; i++){
			item = fabricsListRaw[i].trim().split(",");
			botvars.piFabricList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
		}
}


function flowers(){
	var flowersFile = "./data/flowers.csv"

	flowersListRaw = readFile(flowersFile).split("\n");

	for(i = 1; i < flowersListRaw.length; i++){
			item = flowersListRaw[i].trim().split(",");
			botvars.piFlowerList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "seedPrice": item[5], "obtainFrom": item[6]};
		}
}


function gems(){
	var gemsFile = "./data/gems.csv"

	gemsListRaw = readFile(gemsFile).split("\n");

	for(i = 1; i < gemsListRaw.length; i++){
			item = gemsListRaw[i].trim().split(",");
			botvars.piGemsList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": item[5]};
		}
}

function herbs(){
	var herbsFile = "./data/herbs.csv"

	herbsListRaw = readFile(herbsFile).split("\n");

	for(i = 1; i < herbsListRaw.length; i++){
			item = herbsListRaw[i].trim().split(",");
			botvars.piHerbsList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
		}
}

function roots(){
	var rootsFile = "./data/roots.csv"

	rootsListRaw = readFile(rootsFile).split("\n");

	for(i = 1; i < rootsListRaw.length; i++){
			item = rootsListRaw[i].trim().split(",");
			botvars.piRootsList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": item[5]};
		}
}


//THIS WILL NEED FUTURE EDITS
function getMineForge(){
	var mineForgeFile = "./data/mineforge.csv"

	mineForgeListRaw = readFile(mineForgeFile).split("\n");

	for(i = 1; i < mineForgeListRaw.length; i++){
			item = mineForgeListRaw[i].trim().split(",");
			botvars.piMineForgeList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
		}
}

function crystals(){
	var crystalFile = "./data/crystal.csv"

	crystalListRaw = readFile(crystalFile).split("\n");

	for(i = 1; i < crystalListRaw.length; i++){
			item = crystalListRaw[i].trim().split(",");
			botvars.piCrystalsList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": item[5]};
		}
}

function ores(){
	var oreFile = "./data/ore.csv"

	oreListRaw = readFile(oreFile).split("\n");

	for(i = 1; i < oreListRaw.length; i++){
			item = oreListRaw[i].trim().split(",");
			botvars.piOresList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": item[5]};
		}
}

function stones(){
	var stonesFile = "./data/stones.csv"

	stoneListRaw = readFile(stonesFile).split("\n");

	for(i = 1; i < stoneListRaw.length; i++){
			item = stoneListRaw[i].trim().split(",");
			botvars.piStonesList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": item[5]};
		}
}

function wildFoods(){
	var wildFoodFile = "./data/wildfoods.csv"

	wildFoodListRaw = readFile(wildFoodFile).split("\n");

	for(i = 1; i < wildFoodListRaw.length; i++){
			item = wildFoodListRaw[i].trim().split(",");
			botvars.piWildFoodList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "obtainFrom": item[2]};
		}
}


function misc(){
	var miscFile = "./data/misc.csv"

	miscListRaw = readFile(miscFile).split("\n");

	for(i = 1; i < miscListRaw.length; i++){
			item = miscListRaw[i].trim().split(",");
			botvars.piMiscList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": item[5]};
		}
}

