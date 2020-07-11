const Minigame = require('./minigames');
var botvars = require('../variables/vars');
var botfunct = require('../botfunct');
var commaNumber = require('comma-number');
var lines = require('../variables/lines');

module.exports = class Taming extends Minigame {

	constructor(name) {
		super(name);
        this.loadObtainables();        
  	}

	loadObtainables(){
  		super.loadObtainables();

        var iKeys = Object.keys(botvars.piMonsterIslandMapPreload);
        var lKeys = Object.keys(botvars.piMonsterLocationMapPreload);
        //console.log(iKeys);
        //console.log(lKeys);

  		for(var i = 0; i< iKeys.length; i++ ){
            var islandData = botvars.piMonsterIslandMapPreload[iKeys[i]];
            var islandMonsterList = islandData.monsters.split(",");
            for(var j = 0; j< islandMonsterList.length; j++){
              super.getObtainablesConditonString(islandMonsterList[j].trim().toLowerCase(), islandData.name);
            }
	  		
  		}

      for(var i = 0; i< lKeys.length; i++ ){
        var locationData = botvars.piMonsterLocationMapPreload[lKeys[i]];
            var locationMonsterList = locationData.monsters.split(",");
            for(var j = 0; j< locationMonsterList.length; j++){
              super.getObtainablesConditonString(locationMonsterList[j].trim().toLowerCase(), locationData.name);
            }
      }

  	}
    

	tameOne(args){
    //console.log(args);
		if(args.length < 1 ){
			return "Invalid Params. Requires at least a monster name and island/location, separated by comma. Sample: \"pi!tameOne **Hornet**, **Leuda Mines**, **[Ignored, Ignored, Success!]**\"";
		}

    var argsString = args.join(" ");
    var argsString2 = [];

    var removeArray = [];
    var monsterName = "";
    var locationName = "";
    var monster = null;
    var location = null;

    var removeStringDetails = argsString.match("\\[(.*?)\\]");

    if(null == removeStringDetails){
      argsString2 = argsString.split(",");

      //console.log(argsString2);
      if(argsString2.length < 2){
        return "Invalid Params. Requires at least a monster name and island/location. Sample: \"pi!tameOne **Hornet**, **Leuda Mines**, **[Ignored | Ignored | Success!]**\"";
      }

      monsterName = argsString2[0].trim().toLowerCase();
      locationName = argsString2[1].trim().toLowerCase()

    }else{
        removeArray= removeStringDetails[1].split("|");
        argsString2 = argsString.replace(removeStringDetails[0], "").split(",");

        if(argsString2.length < 2){
          return "Invalid Params. Requires at least a monster name and island/location. Sample: \"pi!tameOne **Hornet**, **Leuda Mines**, **[Ignored | Ignored | Success!]**\"";
        }

        monsterName = argsString2[0].trim().toLowerCase();
        locationName = argsString2[1].trim().toLowerCase()

    }

    if(Object.keys(botvars.piAllMonstersMap).includes(monsterName)){
        monster = botvars.piAllMonstersMap[monsterName];
    }else{
      return "Invalid monster name: " + monsterName;
    }

    if(Object.keys(botvars.piAllLocationMap).includes(locationName)){
        location = botvars.piAllLocationMap[locationName];
    }else if((Object.keys(botvars.piAllIslandMap).includes(locationName))){
      location = botvars.piAllIslandMap[locationName];
    }else{
      return "Invalid island/location name: " + locationName;
    }

    if(!location.monsters.toLowerCase().split(",").map(m => m.trim()).includes(monster.name.toLowerCase().trim())){
      return monster.name + " cannot be found at " + location.name;
    }

    return tameMonsterOnce(monster, location, removeArray);

	}

  taming(args){
    //console.log(args);
    if(args.length < 1 ){
      return "Invalid Params. Requires at least a monster name and island/location, separated by comma. Sample: \"pi!taming **Hornet**, **Leuda Mines**, **[Ignored | Ignored | Success!]**\"";
    }

    var argsString = args.join(" ");
    var argsString2 = [];

    var removeArray = [];
    var monsterName = "";
    var locationName = "";
    var monster = null;
    var location = null;

    var removeStringDetails = argsString.match("\\[(.*?)\\]");

    if(null == removeStringDetails){
      argsString2 = argsString.split(",");

      //console.log(argsString2);
      if(argsString2.length < 2){
        return "Invalid Params. Requires at least a monster name and island/location. Sample: \"pi!taming **Hornet**, **Leuda Mines**, **[Ignored, Ignored, Success!]**\"";
      }

      monsterName = argsString2[0].trim().toLowerCase();
      locationName = argsString2[1].trim().toLowerCase()

    }else{
        removeArray= removeStringDetails[1].split("|");
        argsString2 = argsString.replace(removeStringDetails[0], "").split(",");

        if(argsString2.length < 2){
          return "Invalid Params. Requires at least a monster name and island/location. Sample: \"pi!tameOne **Hornet**, **Leuda Mines**, **[Ignored | Ignored | Success!]**\"";
        }

        monsterName = argsString2[0].trim().toLowerCase();
        locationName = argsString2[1].trim().toLowerCase()

    }

    if(Object.keys(botvars.piAllMonstersMap).includes(monsterName)){
        monster = botvars.piAllMonstersMap[monsterName];
    }else{
      return "Invalid monster name: " + monsterName;
    }

    if(Object.keys(botvars.piAllLocationMap).includes(locationName)){
        location = botvars.piAllLocationMap[locationName];
    }else if((Object.keys(botvars.piAllIslandMap).includes(locationName))){
      location = botvars.piAllIslandMap[locationName];
    }else{
      return "Invalid island/location name: " + locationName;
    }

    if(!location.monsters.toLowerCase().split(",").map(m => m.trim()).includes(monster.name.toLowerCase().trim())){
      return monster.name + " cannot be found at " + location.name;
    }

    return tameMonsterMultiAttempt(monster, location, removeArray);

  }
}
function tameMonsterOnce(monsterObj, locationObj, removeLinesArr){

  var rollLines = getMonsterLine(monsterObj.mLevel.toUpperCase().trim());
  var rollTemp = null;
  var linesRemoved = "";
  var totalExp = 0;
  var totalGLost = 0;

  if(!(null == removeLinesArr) && removeLinesArr.length > 0){
    rollTemp = removeLines(rollLines, removeLinesArr);

    if(null == rollTemp){
      return removeLinesErrorCatch(rollLines, removeLinesArr);
    }else{
      rollLines = rollTemp;
      linesRemoved = "\n***Lines Removed:*** [" + removeLinesArr.join(" | ") + "]\n";
    }
  }


  var lineOutput = "***Taming Minigame:***\n";

  lineOutput = lineOutput +"You are taming a(n) **" + monsterObj.name + "**. Location: **"+ locationObj.name +"**.\n";
  lineOutput = lineOutput + "*(Beastmasters can remove five options. Earthmates can remove three options. People who are both can remove eight options.)*\n";

  //if lines removed
  lineOutput = lineOutput + linesRemoved + "\n";

  var tameOneResult = rollLines[botfunct.randomize(rollLines.length)];

  lineOutput = lineOutput + "**Result:** ***" + tameOneResult + "***";

  switch(tameOneResult.toUpperCase()){
    case "SUCCESS!":
      totalExp = totalExp + Number(getEXPFromIsland(monsterObj.mLevel.toUpperCase(), locationObj));
      lineOutput = lineOutput + " - " + botvars.tamingSuccess + "\n";
      return totalReturnLine(lineOutput,totalExp,totalGLost)
    case "IGNORED":
      break;
    case "ATTACKED AND LOST 5000G":
      lineOutput = lineOutput + " - " + botvars.attacked;
      totalGLost = totalGLost + 5000;
      break;
    case "ATTACKED AND LOST 1000G":
      lineOutput = lineOutput + " - " + botvars.attacked;
      totalGLost = totalGLost + 1000;
      break;
    case "ATTACKED AND LOST 2000G":
      lineOutput = lineOutput + " - " + botvars.attacked;
      totalGLost = totalGLost + 2000;
      break;
    case "ATTACKED AND LOST 10000G":
      lineOutput = lineOutput + " - " + botvars.attacked;
      totalGLost = totalGLost + 10000;
      break;
    case "ATTACKED":
      lineOutput = lineOutput + " - " + botvars.attacked;
      break;
    case "CURSED WITH POISON":
    case "CURSED WITH PARALYSIS":
    case "CURSED WITH SICKNESS":
    case "CURSED WITH SILENCE":
    case "INFLICTED WITH CONFUSION":
      lineOutput = lineOutput + " - " + botvars.statusCurse;
      break;
    case "DEATH CURSE":
      lineOutput = lineOutput + " - " + botvars.deathCurse;
      break;
    case "KIDNAPPED":
      lineOutput = lineOutput + " - " + botvars.kidnapped;
      break;
    case "KNOCKED OUT INSTANTLY":
      lineOutput = lineOutput + " - " + botvars.knockedOut + "\n";
      return totalReturnLine(lineOutput,totalExp,totalGLost)
    default:
      return "An error occurred with result: " + tameOneResult;
  }

  lineOutput = lineOutput + "\n";


  return totalReturnLine(lineOutput,totalExp,totalGLost);
}

function tameMonsterMultiAttempt(monsterObj, locationObj, removeLinesArr){
  var rollLines = getMonsterLine(monsterObj.mLevel.toUpperCase().trim());
  var rollTemp = null;
  var linesRemoved = "";
  var totalExp = 0;
  var totalGLost = 0;

  if(!(null == removeLinesArr) && removeLinesArr.length > 0){
    rollTemp = removeLines(rollLines, removeLinesArr);

    if(null == rollTemp){
      return removeLinesErrorCatch(rollLines, removeLinesArr);
    }else{
      rollLines = rollTemp;
      linesRemoved = "\n***Lines Removed:*** [" + removeLinesArr.join(" | ") + "]\n";
    }
  }


  var lineOutput = "***Taming Minigame:***\n";

  lineOutput = lineOutput +"You are taming a(n) **" + monsterObj.name + "**. Location: **"+ locationObj.name +"**.\n";
  lineOutput = lineOutput + "*(Beastmasters can remove five options. Earthmates can remove three options. People who are both can remove eight options.)*\n";

  //if lines removed
  lineOutput = lineOutput + linesRemoved + "\n";
  var tameOneResult = "";

  for(var i=1; i<6; i++){
    tameOneResult = rollLines[botfunct.randomize(rollLines.length)];

  lineOutput = lineOutput + "**Roll " + i + ":** ***" + tameOneResult + "***";

  switch(tameOneResult.toUpperCase()){
    case "SUCCESS!":
      totalExp = totalExp + Number(getEXPFromIsland(monsterObj.mLevel.toUpperCase(), locationObj));
      lineOutput = lineOutput + " - " + botvars.tamingSuccess + "\n";
      return totalReturnLine(lineOutput,totalExp,totalGLost)
    case "IGNORED":
      break;
    case "ATTACKED AND LOST 5000G":
      lineOutput = lineOutput + " - " + botvars.attacked;
      totalGLost = totalGLost + 5000;
      break;
    case "ATTACKED AND LOST 1000G":
      lineOutput = lineOutput + " - " + botvars.attacked;
      totalGLost = totalGLost + 1000;
      break;
    case "ATTACKED AND LOST 2000G":
      lineOutput = lineOutput + " - " + botvars.attacked;
      totalGLost = totalGLost + 2000;
      break;
    case "ATTACKED AND LOST 10000G":
      lineOutput = lineOutput + " - " + botvars.attacked;
      totalGLost = totalGLost + 10000;
      break;
    case "ATTACKED":
      lineOutput = lineOutput + " - " + botvars.attacked;
      break;
    case "CURSED WITH POISON":
    case "CURSED WITH PARALYSIS":
    case "CURSED WITH SICKNESS":
    case "CURSED WITH SILENCE":
    case "INFLICTED WITH CONFUSION":
      lineOutput = lineOutput + " - " + botvars.statusCurse;
      break;
    case "DEATH CURSE":
      lineOutput = lineOutput + " - " + botvars.deathCurse;
      break;
    case "KIDNAPPED":
      lineOutput = lineOutput + " - " + botvars.kidnapped;
      break;
    case "KNOCKED OUT INSTANTLY":
      lineOutput = lineOutput + " - " + botvars.knockedOut + "\n";
      return totalReturnLine(lineOutput,totalExp,totalGLost)
    default:
      return "An error occurred with result: " + tameOneResult;
  }

  lineOutput = lineOutput + "\n";

  }



  return totalReturnLine(lineOutput,totalExp,totalGLost);
}

function getMonsterLine(monsterLevel){
  switch(monsterLevel){
    case "E":
      return lines.tameLevelE;
    case "D":
      return lines.tameLevelD;
    case "C":
      return lines.tameLevelC;
    case "B":
      return lines.tameLevelB
    case "A":
      return lines.tameLevelA;
    case "BOSS":
      return lines.tameLevelBoss;
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

function removeLines(rollLine, removeArr){
  var rollLine2 = Array.from(rollLine);
  var rollLine2Lower = null;
  var removeOpt = "";
  var index = -1;

  for(var i = 0; i< removeArr.length; i++){
    removeOpt = removeArr[i].trim().toLowerCase();
    rollLine2Lower = rollLine2.map(r => r.toLowerCase().trim());

    if(!rollLine2Lower.includes(removeOpt)){
      return null;
    } else{
      index = rollLine2Lower.indexOf(removeOpt);
      rollLine2.splice(index, 1); //removes the option from array only once.
    }
  }

  return rollLine2;
}

function removeLinesErrorCatch(rollLine, removeArr){
  var rollLine2 = Array.from(rollLine);
  var rollLine2Lower = null;
  var removeOpt = "";
  var index = -1;

  for(var i = 0; i< removeArr.length; i++){
    removeOpt = removeArr[i].trim().toLowerCase();
    rollLine2Lower = rollLine2.map(r => r.toLowerCase().trim());

    if(!rollLine2Lower.includes(removeOpt)){
      return "Error removing option **" + removeOpt + "** from remaining options:\n*[" + rollLine2.join(" | ") + "]*\n\nOriginal Line:\n*[" 
        + rollLine.join(" | ") + "]*";
    } else{
      index = rollLine2Lower.indexOf(removeOpt);
      rollLine2.splice(index, 1); //removes the option from array only once.
    }
  }

  return "Threw an error once, but cannot duplicate.";
}

function totalReturnLine(lineOutput, totalEXP, totalGLost){
  return lineOutput + "\nTotal Money Lost: *" + commaNumber(totalGLost) + "G*"+ "\nTotal EXP for Beastmasters: *" + commaNumber(totalEXP) + "*";
}