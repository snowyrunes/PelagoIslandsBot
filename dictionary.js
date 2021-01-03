var fs =require('fs');

var botvars = require('./variables/vars');
var botfuncts = require('./botfunct');

var msgWriter = require('./messageWriter');

var Mining = require('./games/minefunct');
var CritterCatching = require('./games/critterfunct');
var Foraging = require('./games/foragefunct');
var ProduceCollection = require('./games/produceCollection');
var Logging = require('./games/logging');
var StoneBreaking = require('./games/stonebreaking');
var Fishing = require('./games/fishing');
var Taming = require('./games/taming');
var Gardening = require('./games/gardening');
var Alchemy = require('./games/alchemy');
var Cooking = require('./games/cooking');
var LevelUp = require('./games/levelup');
var MonsterHunting = require('./games/hunting');


module.exports = {
	initMethodDict: function (methodDict) {
		//general functions
		//methodDict['rtest'] = botfuncts.randomTest;
		methodDict['list'] = botfuncts.listItemsFromCategory;
		
		methodDict['item'] = botfuncts.itemDetails;
        methodDict['monster'] = botfuncts.monsterDetails;
        methodDict['livestock'] = botfuncts.livestockDetails;
        methodDict['location'] = botfuncts.locationDetails;
        methodDict['island'] = botfuncts.islandDetails;
        methodDict['class'] = botfuncts.classDetails;

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

		//fishing
		methodDict['fishone'] = botvars.piAllMinigamesMap["Fishing"].fishOne;
		methodDict['fishing'] = botvars.piAllMinigamesMap["Fishing"].fishing;

        //monster games
        methodDict['produce'] = botvars.piAllMinigamesMap["Produce Collection"].produceCollection;

        methodDict['tameone'] = botvars.piAllMinigamesMap["Monster Taming"].tameOne;
        methodDict['taming'] = botvars.piAllMinigamesMap["Monster Taming"].taming;
        methodDict['monstercare'] = botvars.piAllMinigamesMap["Monster Taming"].monsterCare;

        methodDict['monsterhunt'] = botvars.piAllMinigamesMap["Monster Hunting"].monsterHunt;

        //gardening
        //methodDict['gardenone'] = botvars.piAllMinigamesMap["Gardening"].gardenOne;
        //methodDict['gardening'] = botvars.piAllMinigamesMap["Gardening"].gardening;

        //alchemy
        methodDict['alchemyone'] = botvars.piAllMinigamesMap["Alchemy"].alchemyOne;
        methodDict['alchemy'] = botvars.piAllMinigamesMap["Alchemy"].alchemy;

        //cooking
        methodDict['cookone'] = botvars.piAllMinigamesMap["Cooking"].cookOne;
        methodDict['cooking'] = botvars.piAllMinigamesMap["Cooking"].cooking;

        //level up
        methodDict['levelup'] = botvars.piAllMinigamesMap["Level Up"].levelUp;
        
		//randomline
		methodDict['choose'] = botfuncts.randomFromLine;
		methodDict['rolldie'] = botfuncts.rollDie;

		//message logging
		methodDict['export'] = msgWriter.export;


	},

	privateDic: function(msgCollect, args, channel){
		return msgWriter.exportLogic(msgCollect, args, channel);
	},

	initMethodArray: function (){

		//Preload Data For Dependant Minigames. Will Load Again After.
        preloadFileCategory("monsters", "./data/livestock/monsters.tsv")
        preloadFileCategory("livestock", "./data/livestock/livestock.tsv")
        preloadFileCategory("fish", "./data/fish.tsv");
        preloadFileCategory("locations", "./data/places/locations.tsv");
        preloadFileCategory("islands", "./data/places/islands.tsv");
        preloadFileCategory("potions", "./data/alchemy/potions.tsv");

        cookingPreload();
        floraPreload();
       
        //load minigames
		botvars.piAllMinigamesMap["Logging"] = new Logging("Logging");
		botvars.piAllMinigamesMap["Stone Breaking"] = new StoneBreaking("Stone Breaking");
		botvars.piAllMinigamesMap["Critter Catching"] = new CritterCatching("Critter Catching");
		botvars.piAllMinigamesMap["Foraging"] = new Foraging("Foraging");
		botvars.piAllMinigamesMap["Mining"] = new Mining("Mining");
		botvars.piAllMinigamesMap["Fishing"] = new Fishing("Fishing");
        botvars.piAllMinigamesMap["Produce Collection"] = new ProduceCollection("Produce Collection");
        botvars.piAllMinigamesMap["Monster Taming"] = new Taming("Monster Taming");
        botvars.piAllMinigamesMap["Gardening"] = new Gardening("Gardening");
        botvars.piAllMinigamesMap["Alchemy"] = new Alchemy("Alchemy");
        botvars.piAllMinigamesMap["Cooking"] = new Cooking("Cooking");
        botvars.piAllMinigamesMap["Level Up"] = new LevelUp("Level Up");
        botvars.piAllMinigamesMap["Monster Hunting"] = new MonsterHunting("Monster Hunting");

        //group calls
        cooking();
		critters();
		flora();

		botvars.piClassList = loadCategory("classes", "./data/classes/classes.tsv");
		
		botvars.piCrystalsList = loadCategory("crystals", "./data/materials/crystal.tsv");
		botvars.piFabricList = loadCategory("fabrics", "./data/fabrics.tsv");
		botvars.piFishList = loadCategory("fish","./data/fish.tsv");
		botvars.piGemsList = loadCategory("gems", "./data/materials/gems.tsv");
		botvars.piLivestockList = loadCategory("livestock", "./data/livestock/livestock.tsv")
		botvars.piLumberList = loadCategory("lumber", "./data/materials/lumber.tsv");
		botvars.piMonsterList = loadCategory("monsters", "./data/livestock/monsters.tsv")
		botvars.piMonsterPartsList = loadCategory("monsterparts", "./data/livestock/monsterparts.tsv")
		botvars.piOresList = loadCategory("ores", "./data/materials/ore.tsv");
		botvars.piRootsList = loadCategory("roots", "./data/wildplants/roots.tsv");
		botvars.piProduceList = loadCategory("produce", "./data/livestock/produce.tsv");
		botvars.piPotionsList = loadCategory("potions", "./data/alchemy/potions.tsv");
		botvars.piPowdersList = loadCategory("powders", "./data/alchemy/powders.tsv");
		botvars.piSticksList = loadCategory("sticks", "./data/materials/sticks.tsv");
		botvars.piStonesList = loadCategory("stones", "./data/materials/stones.tsv");
		botvars.piWildFoodList = loadCategory("wildfood", "./data/wildplants/wildfoods.tsv");

		botvars.piIslands = loadCategory("islands", "./data/places/islands.tsv");
		botvars.piLocations = loadCategory("locations", "./data/places/locations.tsv");

		//items that don't fit other categories
		botvars.piMiscList = loadCategory("misc", "./data/misc.tsv");

		//combinations

		//be sure to include this in the receipe list later
		botvars.piMineForgeList = loadCategory("accessories", "./data/crafting/accessories.tsv");
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

//preload for minigames with dependencies for read
function preloadFileCategory(categoryName, filePath){
	var listRaw = readFile(filePath).split("\n");
	var propertyNames = listRaw[0].trim().split("\t");
	var categoryList = [];

	for(i = 1; i< listRaw.length; i++){
		var item = listRaw[i].trim().split("\t");
		
		var tempItem = {};

		for(j = 0; j< propertyNames.length; j++){
			tempItem[propertyNames[j]] = item[j];
		}

		//some categories need to be loaded early
		categoryList[(item[0].trim().toLowerCase())] = tempItem;

			switch(categoryName){
				case "monsters":
					botvars.piAllMonstersMapPreload[tempItem["name"].toLowerCase()] = tempItem;
					break;
				case "livestock":
					botvars.piAllLivestockMapPreload[tempItem["name"].toLowerCase()] = tempItem;
					break;
				case "fish":
					if("yes" === tempItem["isKingFish"].toLowerCase()){
						botvars.piKingFishMapPreload[tempItem["name"].toLowerCase()] = tempItem;
					}
					break;
				case "islands":
					if(!("N/A" === tempItem.monsters || "See Individual Locations" == tempItem.monsters)){
		        		botvars.piMonsterIslandMapPreload[tempItem["name"].toLowerCase()] = tempItem;
		        	}
		        	break;
		        case "locations":
		        	if(!("N/A" === tempItem.monsters)){
		        		botvars.piMonsterLocationMapPreload[tempItem["name"].toLowerCase()] = tempItem;
		        	}
		        	break;
		        case "seeds":
		        	botvars.piSeedsPreload[tempItem["name"].toLowerCase()] = tempItem;
		        	break;
		        case "potions":
		        	botvars.piPotionsPreload[tempItem["name"].toLowerCase()] = tempItem;
		        	break;
		        case "ingredients":
		        case "desserts":
		        case "drinks":
		        case "grillfrydish":
		        case "misc-dishes":
		        case "noodlesbreaddish":
		        case "pot-dishes":
		        case "rice-dishes":
		        case "salads":
		        case "soups":
		        	if(!("N/A" === tempItem.recipe) || ("Universal" === tempItem.recipeSize)){
		        		botvars.piCookingDishPreload[tempItem["name"].toLowerCase()] = tempItem;
		        	}
		        	break;
		        default:
		        	break;
			}		
	}

}

function getFileCategoryListing(categoryName, filePath){
	var listRaw = readFile(filePath).split("\n");
	var propertyNames = listRaw[0].trim().split("\t");
	var categoryList = [];

	for(i = 1; i< listRaw.length; i++){
		var item = listRaw[i].trim().split("\t");
		
		var tempItem = {};

		for(j = 0; j< propertyNames.length; j++){
			tempItem[propertyNames[j]] = item[j];
		}

		if(categoryName != "classes"){
			tempItem["obtainFrom"] = getObtainableFromProperty(tempItem["name"].toLowerCase());
		}
		
		//assume name is always in item[0]
		categoryList[(item[0].trim().toLowerCase())] = tempItem;
	        
	    if("monsters" == categoryName){
	        botvars.piAllMonstersMap[tempItem["name"].toLowerCase()] = tempItem;
	    }else if("livestock" == categoryName){
	        botvars.piAllLivestockMap[tempItem["name"].toLowerCase()] = tempItem;
		}else if("locations" == categoryName){
	        botvars.piAllLocationMap[tempItem["name"].toLowerCase()] = tempItem;
		}else if("islands" == categoryName){
	        botvars.piAllIslandMap[tempItem["name"].toLowerCase()] = tempItem;
		}else if("classes" == categoryName){
			botvars.piAllClassesMap[tempItem["name"].toLowerCase()] = tempItem;
		}else{
	        botvars.piAllItemMap[tempItem["name"].toLowerCase()] = tempItem;
	    }
		
	}

	return categoryList;
}

function getGardeningFileCategoryListing(categoryName, filePath){
	var listRaw = readFile(filePath).split("\n");
	var propertyNames = listRaw[0].trim().split("\t");
	var categoryList = [];

	for(i = 1; i< listRaw.length; i++){
		var item = listRaw[i].trim().split("\t");
		
		var tempItem = {};

		for(j = 0; j< propertyNames.length; j++){
			tempItem[propertyNames[j]] = item[j];
		}

		if(Object.keys(botvars.piAllMinigamesMap["Gardening"].itemConditions).includes(tempItem.name.toLowerCase().trim())){
			tempItem["poorPrice"] = tempItem["price"]/2;
			tempItem["overgrownPrice"] = tempItem["price"]*2;
			tempItem["goldenPrice"] = tempItem["price"]*5;
		}
		
		tempItem["obtainFrom"] = getObtainableFromProperty(tempItem["name"].toLowerCase());
		//assume name is always in item[0]
		categoryList[(item[0].trim().toLowerCase())] = tempItem;
	        
	    botvars.piAllItemMap[tempItem["name"].toLowerCase()] = tempItem;

		
	}

	return categoryList;
}

function getCookingFileCategoryListing(categoryName, filePath){
	var listRaw = readFile(filePath).split("\n");
	var propertyNames = listRaw[0].trim().split("\t");
	var categoryList = [];

	for(i = 1; i< listRaw.length; i++){
		var item = listRaw[i].trim().split("\t");
		
		var tempItem = {};

		for(j = 0; j< propertyNames.length; j++){
			tempItem[propertyNames[j]] = item[j];
		}

		if(Object.keys(botvars.piAllMinigamesMap["Cooking"].itemConditions).includes(tempItem.name.toLowerCase().trim())){
			tempItem["shiningPrice"] = parseInt(tempItem["price"])*5;
			tempItem["shiningStatBoost"] = "If the dish is shining, add +5 to each of this dish's regular stat boosts (if any).";
		}
		
		tempItem["obtainFrom"] = getObtainableFromProperty(tempItem["name"].toLowerCase());
		//assume name is always in item[0]
		categoryList[(item[0].trim().toLowerCase())] = tempItem;
	        
	    botvars.piAllItemMap[tempItem["name"].toLowerCase()] = tempItem;

		
	}

	return categoryList;
}

function loadCategory(categoryName, filepath){
	var categoryList = getFileCategoryListing(categoryName, filepath);

	botvars.piItemCategories[categoryName] = Object.keys(categoryList);
	return categoryList;
}

function loadGardenCategory(categoryName, filepath){
	var categoryList = getGardeningFileCategoryListing(categoryName, filepath);

	botvars.piItemCategories[categoryName] = Object.keys(categoryList);
	return categoryList;	
}

function loadCookingCategory(categoryName, filepath){
	var categoryList = getCookingFileCategoryListing(categoryName, filepath);

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

function flora(){
	botvars.piSeedsList = loadCategory("seeds", "./data/gardening/seeds-old.tsv");
	
	botvars.piCropsList = loadGardenCategory("crops", "./data/gardening/crops-old.tsv");
	botvars.piFlowerList = loadGardenCategory("flowers", "./data/gardening/flowers-old.tsv");
	botvars.piHerbsList = loadGardenCategory("herbs", "./data/wildplants/herbs.tsv");
}


function cookingPreload(){
	botvars.piIngredientsList = preloadFileCategory("ingredients", "./data/dishes/ingredients.tsv");

	botvars.piDessertsList = preloadFileCategory("desserts", "./data/dishes/desserts.tsv");
	botvars.piDrinkList = preloadFileCategory("drinks", "./data/dishes/drinks.tsv");
	botvars.piGrillFryList = preloadFileCategory("grillfrydish", "./data/dishes/grilledFried.tsv");
	botvars.piMiscDishList = preloadFileCategory("misc-dishes", "./data/dishes/misc-dish.tsv");
	botvars.piNoodleBreadList = preloadFileCategory("noodlesbreaddish", "./data/dishes/noodlesBread.tsv");
	botvars.piPotDishesList = preloadFileCategory("pot-dishes", "./data/dishes/pot-dish.tsv");
	botvars.piRiceDishesList = preloadFileCategory("rice-dishes", "./data/dishes/rice-dish.tsv");
	botvars.piSaladList = preloadFileCategory("salads", "./data/dishes/salads.tsv");
	botvars.piSoupList = preloadFileCategory("soups", "./data/dishes/soups.tsv");
}

function cooking(){
	botvars.piIngredientsList = loadCookingCategory("ingredients", "./data/dishes/ingredients.tsv");

	botvars.piDessertsList = loadCookingCategory("desserts", "./data/dishes/desserts.tsv");
	botvars.piDrinkList = loadCookingCategory("drinks", "./data/dishes/drinks.tsv");
	botvars.piGrillFryList = loadCookingCategory("grillfrydish", "./data/dishes/grilledFried.tsv");
	botvars.piMiscDishList = loadCookingCategory("misc-dishes", "./data/dishes/misc-dish.tsv");
	botvars.piNoodleBreadList = loadCookingCategory("noodlesbreaddish", "./data/dishes/noodlesBread.tsv");
	botvars.piPotDishesList = loadCookingCategory("pot-dishes", "./data/dishes/pot-dish.tsv");
	botvars.piRiceDishesList = loadCookingCategory("rice-dishes", "./data/dishes/rice-dish.tsv");
	botvars.piSaladList = loadCookingCategory("salads", "./data/dishes/salads.tsv");
	botvars.piSoupList = loadCookingCategory("soups", "./data/dishes/soups.tsv");
}

function floraPreload(){
	preloadFileCategory("seeds", "./data/gardening/seeds-old.tsv");
}


function misc(){
	var miscFile = "./data/misc.tsv"

	miscListRaw = readFile(miscFile).split("\n");

	for(i = 1; i < miscListRaw.length; i++){
			item = miscListRaw[i].trim().split(",");
			botvars.piMiscList[(item[0].trim().toLowerCase())] = {"name": item[0], "price": item[1], "rarity": item[2], "wEffect": item[3], "eEffect": item[4], "obtainFrom": getObtainableFromProperty(tempItem["name"].toLowerCase())};
		}
}

