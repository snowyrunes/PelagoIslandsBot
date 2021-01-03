const Minigame = require('./minigames');
var botvars = require('../variables/vars');
var botfunct = require('../botfunct');
var commaNumber = require('comma-number');

module.exports = class MonsterHunting extends Minigame {

	constructor(name) {
		super(name);
        this.loadObtainables();        
  	}

	loadObtainables(){
  		super.loadObtainables();

      var aKeys = Object.keys(botvars.piAllMonstersMapPreload);

  		for(var i = 0; i< aKeys.length; i++ ){
        var monsterData = botvars.piAllMonstersMapPreload[aKeys[i]];

        var dropsArr = getBaseDropsArr(monsterData.drops);

        if(!(null === dropsArr)){
          for(var j = 0; j< dropsArr.length; j++){
            super.getObtainablesConditonString(dropsArr[j], monsterData.name);
          }
        }
  		}
  	}
    

	monsterHunt(args){
    
    if(args.length < 1){
      return "Please provide monster name, location or island, and character level. Example: pi!monsterhunt duck, forest haven, 13"
    }
      
    var argsString = args.join(" ");
    var newargs = argsString.split(",").map(a => a.trim().toLowerCase());

    if(newargs.length < 3){
      return "Please provide monster name, location or island, and character level. Example: pi!monsterhunt duck, forest haven, 13"
    }

    if(isNaN(newargs[2])){
      return "Invalid LeveL: " + newargs[2];
    }

    var monsterName = newargs[0].trim().toLowerCase();
    var locationName = newargs[1].trim().toLowerCase();
    var level = parseInt(newargs[2]);

    var monsterObj = null;
    var locationObj = null;

    if(level < 1){
      return "Invalid level: " + level;
    }

    if(Object.keys(botvars.piAllMonstersMap).includes(monsterName)){
        monsterObj = botvars.piAllMonstersMap[monsterName];
    }else{
      return "Invalid monster name: " + monsterName;
    }

    if(Object.keys(botvars.piAllLocationMap).includes(locationName)){
        locationObj = botvars.piAllLocationMap[locationName];
    }else if((Object.keys(botvars.piAllIslandMap).includes(locationName))){
      locationObj = botvars.piAllIslandMap[locationName];
    }else{
      return "Invalid island/location name: " + locationName;
    }

    if(!locationObj.monsters.toLowerCase().split(",").map(m => m.trim()).includes(monsterObj.name.toLowerCase().trim())){
      return monsterObj.name + " cannot be found at " + locationObj.name;
    }

    var lineOutput = "***Monster Hunting Minigame:***\n";
    lineOutput += "*You may play this game a maximum of **three times** per activity check (unless triggered by another minigame).*\n\n"

    lineOutput += "You are hunting a(n) **" + monsterObj.name + "**. Location: **"+ locationObj.name +"**.\n";
    lineOutput += "Hunter Level: " + level + "\n\n";

    return lineOutput;


	}
}

function getHunterLine(hunterLevel){
  if(hunterLevel >= 1 && hunterLevel <= 3){
    return lines.level1To3HitLine;
  }else if (hunterLevel >= 4 && hunterLevel <= 6){
    return lines.level4To6HitLine;
  }else if(hunterLevel >= 7 && hunterLevel <= 9){
    return lines.level7To9HitLine;
  }else if(hunterLevel >= 10 && hunterLevel <=12){
    return lines.level10To12HitLine;
  }else if (hunterLevel >= 13){
    return lines.level13PlusHitLine;
  }else{
    return null;
  }
}

function getMonsterATKLine(monsterLevel){
  switch(monsterLevel){
    case "E":
      return lines.levelEHitLine;
    case "D":
      return lines.levelDHitLine;
    case "C":
      return lines.levelCHitLine;
    case "B":
      return lines.levelBHitLine;
    case "A":
      return lines.levelAHitLine;
    case "BOSS":
      return lines.levelBossHitLine;
    default:
      return null;
  }
}

function getEXPFromIsland(monsterLevel, locationObj){
  switch(monsterLevel){
    case "E":
      return locationObj.expE;
    case "D":
      return locationObj.expD;
    case "C":
      return locationObj.expC;
    case "B":
      return locationObj.expB
    case "A":
      return locationObj.expA;
    case "BOSS":
      return locationObj.expBoss;
    default:
      return null;
  }

}

function getBaseDropsArr(drops){
  if("N/A" === drops){
    return null;
  }

  var arrNotTranslated = drops.split(",").map(d => d.toLowerCase().trim());
  var arrTranslated = [];

  for(var i = 0; i< arrNotTranslated.length; i++){
    var arrDrop = arrNotTranslated[i];

    if(arrDrop.includes("(^")){
      arrDrop = arrDrop.split("(^")[0].trim();
    }

    arrTranslated.push(arrDrop);

  }

  return arrTranslated;

}