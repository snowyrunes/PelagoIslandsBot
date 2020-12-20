module.exports = {

	//preloads map
	piAllMonstersMapPreload: {},
    piAllLivestockMapPreload: {},
	piKingFishMapPreload: {},
	piMonsterLocationMapPreload: {},
	piMonsterIslandMapPreload: {},
	//piFlowersPreload: {},
	piSeedsPreload: {},
	//piCropsPreload:{},
	piPotionsPreload:{},

	//loaded maps
	piAllItemMap: {},
    piAllMonstersMap: {},
    piAllLivestockMap: {},
	piAllMinigamesMap: {},

	//list of locations
	piAllLocationMap: {},
	piAllIslandMap: {},

	//List of Categories
	piItemCategories: {},

	//list of animals
	piMonsterList: {},
	piLivestockList: {},

	//list of Items
	piGrillFryList: {},
	piMiscDishList: {},
	piDrinkList: {},
	piCropsList: {},
	piCrystalsList: {},
	piFabricList: {},
	piFishList: {},
	piFlowerList: {},
	piGemsList: {},
	piHerbsList: {},
	piIngredientsList: {},
	piLumberList: {},
	piMiscList: {},
	piMonsterPartsList: {},
	piOresList: {},
	piRootsList: {},
	piPotionsList: {},
	piPowdersList: {},
	piProduceList: {},
	piSeedsList: {},
	piSticksList: {},
	piStonesList: {},
	piWildFoodList: {},

	//critters
	piBeesList: {},
	piBeetlesList: {},
	piButterfliesList: {},
	piCicadasList: {},
	piCricketsList: {},
	piDragonfliesList: {},
	piFirefliesList: {},
	piFrogsList: {},
	piLadybugsList: {},

	//special item categories
	piMineForgeList: {},

	//Weather Options: Sunny, Rainy, Cloudy, Thunderstorm, Snowy (Winter Only), Snowstorm (Winter Only), Typhoon (Summer Only), Blizzard, Hurricane
	weather: ["Sunny", "Rainy", "Cloudy", "Thunderstorm", "Snowy", "Snowstorm", "Typhoon", "Blizzard", "Hurricane"],

	//mining line descriptions
	tunnelDesc: "\nYou have fallen down a hole and discovered the Underground Tunnel connecting Arcadia and Leuda! " + 
					"Its existence is currently only known to guild members and a few other individuals– will you tell your friends about this? Or will you just keep this information to yourself….?",

	questionDesc: "\nYou have discovered... something. Message the mods or the main blog to see what you found.",

	greenGasDesc: "\nYou have gained 5 re-rolls! This bonus only stacks twice an AC - starting from the third time onward, it will have no further effect.",

	orangeGasDesc: "\nYour visibility has decreased! Your next roll will be a guaranteed \"FOUND NOTHING!\"",

	yellowGasDesc: "\nYou have become sick. Instead of mining 10 times, you can now only mine a max of 5. If you have already rolled 5 or more times, you cannot play the Mining minigame anymore this acvitiy period.",

	redGasDesc: "\nYou have been poisoned and lose 5HP. (You have 5 less rolls remaining for the mining minigame this activity period.)",

	encounterMonst: "\nYou've lost everything you've collected from mining so far, AND you cannot play the Mining minigame anymore this acvitiy period." +
					"\nYou may play the Monster Hunting minigame as a result of this roll.",

	mineHole:  "\nYou fall through a hole and lose 5HP. (You have 5 less rolls remaining for the mining minigame this activity period.)",

	//gardening lines
	driedUp: "Dried up! Welp, looks like you didn't give your plant enough water… now it's all dried up and withered. Shame on you, plants can be pretty thirsty, too!",
	
	overwatered: "Overwatered! Looks like you gave your plant a little too much to drink. Now it's all swelled up and drowned and… eugh, that's not so edible, is it…",
	
	eatenByStray: "Eaten by a stray! Looks like a wild animal/monster wandered by while you weren't looking, and ended up taking a nice, big bite out of your growing plant! No one wants to buy a half eaten crop, I'm sure.",

	gardenLineMapping: {},
	gardenReRollsMapping: {},

	//monster taming descriptions
	tamingSuccess: "You have successfully tamed the monster! You may only tame one monster per activity period.",

	deathCurse: "You have been inflicted with a strange curse that gradually saps you of health and energy over time. Your mood will also grow lower as time goes on, and not only will you feel constantly sick, you will also have an increase in violent tendencies and dark thoughts. This ailment may only be cured by employees at the **Dragon King Shrine** or **Celestia Church**.",

	attacked: "The monster has become irritated, and has attacked you. This can lead to one round of the Monster Hunting Minigame (not mandatory). You may also rp this result if you wish.",

	kidnapped: "The monster you were attempting to befriend has kidnapped you instead. Let’s hope there’s someone nearby to help you out...",

	knockedOut: "The monster has resisted all of your attempts to befriend it, and dealt a devastating blow in its anger- depleting all of your HP and rendering you unconscious. You may not play the Monster Taming Minigame any more this Activity Period.",

	statusCurse: "The monster might curse you, or maybe you’ll be cursed from running into some of those funky mushroom spores in your attempts to escape from said raging monster. How it happens is up to you, as long as it results in the given status ailment. ;)",

	//alchemy game stuff
	smallPotionExp: 25,
	mediumPotionExp: 50,
	largePotionExp: 100,

	//cooking game stuff
	smallDishExp: 25,
	mediumDishExp: 50,
	largeDishExp: 100
}
