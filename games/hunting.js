const Minigame = require('./minigames');
var botvars = require('../variables/vars');
var botfunct = require('../botfunct');
var lines = require('../variables/lines');
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
    

	attack(args){
    if(args.length < 1){
      return "Please provide your character level. Example: pi!attack 13"
    }

    var argsString = args.join(" ").toLowerCase().trim();
    
    if(isNaN(argsString)){
      return "Invalid Level: " + argsString;
    }

    var attackLine = getHunterLine(argsString);
    return attackLine[botfunct.randomize(attackLine.length)];
  }

  monsterAttack(args){
    if(args.length < 1){
      return "Please provide monster name. Example: pi!monsterAttack E"
    }

    var argsString = args.join(" ").toLowerCase().trim();
    var monsterObj = null;

    if(Object.keys(botvars.piAllMonstersMap).includes(argsString)){
        monsterObj = botvars.piAllMonstersMap[argsString];
    }else{
      return "Invalid monster name: " + argsString;
    }

    var attackLine = getMonsterATKLine(botvars.piAllMonstersMap[argsString].mLevel);

    if(null === attackLine){
      return "Invalid Monster Level: " + argsString;
    }

    return attackLine[botfunct.randomize(attackLine.length)];
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
      return "Invalid Level: " + newargs[2];
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
    lineOutput += "*You may play this game a maximum of **three times** per activity check (unless triggered by another minigame). Note that **Boss** monsters can only be fought **once** per check.*\n\n"

    lineOutput += "You are hunting a(n) **" + monsterObj.name + "**. Location: **"+ locationObj.name +"**.";

    if("Typhoon" === monsterObj.name){
      lineOutput += " __*Special Note:*__ Typhoons can only be hunted during Blizzards or Hurricanes."
    }

    lineOutput += "\n";

    lineOutput += "Hunter Level: **" + level + "**\n\n";

    

    var userLine = getHunterLine(level);
    var monsterLine = getMonsterATKLine(monsterObj.mLevel);

    var userHits = 0;
    var monsterHits = 0;
    var monsterHitArray = [];
    var userHitArray = [];

    var expEarned = getEXPFromIsland(monsterObj.mLevel, locationObj);

    if(null === expEarned){
      return "Error! " + monsterObj.mLevel + " " + locationObj.name;
    }

    for(var i =0; i< 5; i++){
      var uResult = userLine[botfunct.randomize(userLine.length)];
      var mResult = monsterLine[botfunct.randomize(monsterLine.length)];

      if("HIT" === uResult){
        userHits++;
      }

      userHitArray.push(uResult);

      if("HIT" === mResult){
        monsterHits++;
      }

      monsterHitArray.push(mResult);
    }

    lineOutput += "**Your Attacks:** " + userHitArray.join(", ") + " **(" + userHits + " Hits)**\n";
    lineOutput += "**Monster's Attacks:** " + monsterHitArray.join(", ") + " **(" + monsterHits + " Hits)**\n\n";

    var huntWinner = "";

    if(userHits == monsterHits){
      var tideBreaker = botfunct.randomFromLine([monsterObj.name + ", " + "You"]);

      lineOutput += "It's a tie!\nTidebreaker " + tideBreaker + "!\n\n";

      if(tideBreaker === "Result: " + monsterObj.name){
        expEarned = expEarned/2;
        huntWinner = monsterObj.name;
      }else{
        huntWinner = "You";
      }

    }else{

      if(userHits < monsterHits){
        huntWinner = monsterObj.name;
        expEarned = expEarned/2;
      }else{
        huntWinner = "You";
      }

    }

    lineOutput += "Winner: **"+ huntWinner + "**!\n"

    lineOutput += "EXP Earned: **" + expEarned + " EXP**\n";

    if("You" === huntWinner){
      lineOutput += "\n**Drop Items**\n";

      var dropArray = monsterObj.drops.split(",").map(a => a.trim().toLowerCase());
      var dropItemArray = [];
      var priceArray = [];
      var dropPriceTotal = 0;

      for(var i = 0; i< dropArray.length; i++){
        var dropObj = null;
        var dropPrice = 0;

        if(dropArray[i].includes("(^") && dropArray[i].includes("%)")){
          var splitArr = dropArray[i].split("(^").map(a => a.replace("%)", "").trim());

          if(isNaN(splitArr[1])){
            return "ERROR: Percentage " + splitArr[1];
          }

          var randomPercent = botfunct.randomize(100) + 1;
          
          //console.log(randomPercent);

          if(parseInt(splitArr[1]) >= randomPercent){
            dropObj = botvars.piAllItemMap[splitArr[0]];

            if(null === dropObj){
              return "ERROR: " + dropArray[i];
            }

            if(null === dropObj.price || undefined === dropObj.price || isNaN(dropObj.price)){
              console.log
              return "ERROR: Price of " + dropObj.price;
            }

            dropItemArray.push(dropObj.name);
            priceArray.push(parseInt(dropObj.price));
            dropPriceTotal = dropPriceTotal + parseInt(dropObj.price);

          }

        }else{
          dropObj = botvars.piAllItemMap[dropArray[i]];

          if(null === dropObj){
            return "ERROR: " + dropArray[i];
          }

          if(null === dropObj.price || undefined === dropObj.price || isNaN(dropObj.price)){
            console.log
            return "ERROR: Price of " + dropObj.price;
          }

          dropItemArray.push(dropObj.name);
          priceArray.push(parseInt(dropObj.price));
          dropPriceTotal = dropPriceTotal + parseInt(dropObj.price);

        }
      }

      for(var i=0; i< dropItemArray.length; i++){
        lineOutput += dropItemArray[i] + " (" + commaNumber(priceArray[i]) + "G)\n"
      }

      lineOutput += "\n**Total Items:** " + dropItemArray.join(", ")+"\n";
      lineOutput += "**Total For Selling Everything:** " + commaNumber(dropPriceTotal) + "G";


    }

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