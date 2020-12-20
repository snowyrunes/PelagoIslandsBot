const Minigame = require('./minigames');
var botvars = require('../variables/vars');
var botfunct = require('../botfunct');
var lines = require('../variables/lines');
var commaNumber = require('comma-number');

module.exports = class Alchemy extends Minigame{

  	constructor(name) {
  		super(name);
      this.loadObtainables();
    }

  	loadObtainables(){
      super.loadObtainables;

  		var pKeys = Object.keys(botvars.piPotionsPreload);
      
      for(var i = 0; i< pKeys.length; i++){
        if(botvars.piPotionsPreload[pKeys[i]].recipe.toUpperCase().trim() != "N/A" ){

          var minSize = botvars.piPotionsPreload[pKeys[i]].pSize;
          switch(minSize.toLowerCase().trim()){
            case "small":
              super.getObtainablesConditonString(pKeys[i], "Small Chemisty Set");
            case "medium":
              super.getObtainablesConditonString(pKeys[i], "Medium Chemisty Set");
            case "large":
              super.getObtainablesConditonString(pKeys[i], "Large Chemistry Set");
              break;
            default:
              console.log("ERROR");
              break;
          }
        }
      }

  	}


  	alchemyOne(args){
      if(args.length < 1){
        return "Please provide type of chemistry set and the name of the potion. Example: pi!alchemyOne small, object x"
      }

      var argsString = args.join(" ");
      var removeStringReg = argsString.match("\\[(.*?)\\]");

      var removeStringDetails = (null === removeStringReg) ? null : removeStringReg[1];

      var newargs = argsString.replace("[" + removeStringDetails +"]", "").split(",").map(a => a.trim());

      if(newargs.length < 2){
        return "Please provide type of chemistry set and the name of the potion. Example: pi!alchemyOne small, object x"
      }

      var potionName = newargs[1].toLowerCase().trim();
      var setSize = newargs[0].toLowerCase().trim();
      var setNum = getSetNum(setSize);

      if(setNum < 1){
        return "Invalid chemistry set size: " + newargs[0];
      }

      if(!isAlchemyPotion(potionName)){
        return newargs[1] + " cannot be made with the Alchemy minigame, or is an invalid potion name.";
      }

      var lineOutput = "***Alchemy Minigame (Single ReRoll Command):***\n";
      lineOutput += "*(For full minigame and rules, please use the pi!alchemy command)*\n"
      lineOutput += "Alchemists (and related classes) can remove five options.\n";

      var price = 0;
      var exp = 0;
      var lineOutputObj = {}
      var potionObj = botvars.piPotionsList[potionName];
      var resultPotionObj = potionObj;

      var potionMinSize = getSetNum(potionObj.pSize.toLowerCase().trim());

      if(potionMinSize > setNum){
        return "You cannot alchemize a " + potionObj.name + " with a " + getSetFromNum(setNum);
      }

      if("object xx" === potionObj.name.toLowerCase().trim()){
        return "You cannot intentionally alchemize Object XX. You must fail at alchemizing Object X";
      }

      var rollLine = getLineWithRemoval(setNum, removeStringDetails, lineOutputObj);

      if(null === rollLine){
        return removeLinesErrorCatch(setNum, removeStringDetails);
      }else {
        lineOutput += lineOutputObj.lineOutput;
      }

      lineOutput += "\nYou are re-rolling alchemizing a single **" + potionObj.name + " ** using a **" + getSetFromNum(setNum) + "**\n";
      lineOutput += "Remove the following items from your inventory (if you haven't from a previous roll): *" + getRecipe(potionObj.recipe, 1) + "*\n\n";

      var result = rollLine[botfunct.randomize(rollLine.length)];

      switch(result){
        case "success":
          price = resultPotionObj.price;
          exp = getEXP(potionObj.pSize.toLowerCase().trim());
          lineOutput += "**Result:** Success! You alchemized a(n) " + resultPotionObj.name + " worth " + commaNumber(price) + "G\n";
          lineOutput += "Alchemists earn " + commaNumber(exp) + " EXP.\n"
          break;
        case "fails":
          if("object x" === potionName){
            resultPotionObj =  botvars.piPotionsList["object xx"];
          }else{
            resultPotionObj =  botvars.piPotionsList["object x"];
          }
          price = resultPotionObj.price;
          exp = Math.round(getEXP(potionObj.pSize.toLowerCase().trim())/2);
          lineOutput += "**Result:** Failure! Instead of a(n) " + potionObj.name  +", you alchemized an " + resultPotionObj.name + " worth " + commaNumber(price) + "G\n";
          lineOutput += "Alchemists earn " + commaNumber(exp) + " EXP.\n\n"
          break;
        case "explodes":
          lineOutput += "**Result: ** BOOM! The concoction explodes in your face. Hopefully the fumes don't wind up affecting you somehow...\n";
          lineOutput += "Alchemists earn " + commaNumber(exp) + " EXP.\n"
          break;
        default: 
          return "ERROR: Result " + result;
      }

      return lineOutput;
    }

    alchemy(args){

      if(args.length < 1){
        return "Please provide type of chemistry set, the number of potions, and the name of the potion. Example: pi!alchemy small, 10, object x"
      }

      var argsString = args.join(" ");
      var removeStringReg = argsString.match("\\[(.*?)\\]");

      var removeStringDetails = (null === removeStringReg) ? null : removeStringReg[1];

      var newargs = argsString.replace("[" + removeStringDetails +"]", "").split(",").map(a => a.trim());

      if(newargs.length < 3 || isNaN(newargs[1])){
        return "Please provide type of chemistry set, the number of potions, and the name of the potion. Example: pi!alchemy small, 10, object x"
      }

      if(newargs[1] > 10){
        return "You may not alchemize more than 10 potions per Activity Check.";
      }

      var potionName = newargs[2].toLowerCase().trim();
      var setSize = newargs[0].toLowerCase().trim();
      var setNum = getSetNum(setSize);

      if(setNum < 1){
        return "Invalid chemistry set size: " + newargs[0];
      }

      if(!isAlchemyPotion(potionName)){
        return newargs[2] + " cannot be made with the Alchemy minigame, or is an invalid potion name.";
      }

      var lineOutput = "***Alchemy Minigame:***\n";
      lineOutput += "You may alchemize a maximum of 10 potions per Activity Check.\n"
      lineOutput += "Alchemists (and related classes) can remove five options.\n";

      var totalPrice = 0;
      var totalExp = 0;
      var totalSuccess = 0;
      var totalX = 0;
      var totalXX = 0;

      var lineOutputObj = {}
      var potionObj = botvars.piPotionsList[potionName];
      var resultPotionObj = potionObj;

      var potionMinSize = getSetNum(potionObj.pSize.toLowerCase().trim());

      if(potionMinSize > setNum){
        return "You cannot alchemize a " + potionObj.name + " with a " + getSetFromNum(setNum);
      }

      if("object xx" === potionObj.name.toLowerCase().trim()){
        return "You cannot intentionally alchemize Object XX. You must fail at alchemizing Object X";
      }

      var rollLine = getLineWithRemoval(setNum, removeStringDetails, lineOutputObj);

      if(null === rollLine){
        return removeLinesErrorCatch(setNum, removeStringDetails);
      }else {
        lineOutput += lineOutputObj.lineOutput;
      }

      lineOutput += "\nYou are alchemizing **"+ newargs[1] + " " + potionObj.name + "(s) ** using a **" + getSetFromNum(setNum) + "**\n";
      lineOutput += "Remove the following items from your inventory: *" + getRecipe(potionObj.recipe, newargs[1]) + "*\n\n";

      for(var i = 0; i<newargs[1]; i++){
        var result = rollLine[botfunct.randomize(rollLine.length)];
        var price = 0;
        var exp = 0;

        resultPotionObj = potionObj;

        switch(result){
          case "success":
            price = parseInt(resultPotionObj.price);
            totalPrice += price;

            exp = getEXP(potionObj.pSize.toLowerCase().trim());
            totalExp += exp;
            totalSuccess++;

            lineOutput += "**Result:** Success! One " + resultPotionObj.name + " worth " + commaNumber(price) + "G ("+ commaNumber(exp) +" EXP)\n";
            break;
          case "fails":
            if("object x" === potionName){
              resultPotionObj =  botvars.piPotionsList["object xx"];
              totalXX++;
            }else{
              resultPotionObj =  botvars.piPotionsList["object x"];
              totalX++;
            }
            price = parseInt(resultPotionObj.price);
            totalPrice += price;

            exp = Math.round(getEXP(potionObj.pSize.toLowerCase().trim())/2);
            totalExp += exp;

            lineOutput += "**Result:** Failure! One " + resultPotionObj.name + " worth " + commaNumber(price) + "G ("+ commaNumber(exp) +" EXP)\n";
            break;
          case "explodes":
            lineOutput += "**Result: ** BOOM! The concoction explodes in your face. (0 EXP)\n";
            break;
          default: 
            return "ERROR: Result " + result;
        }

      }

      lineOutput += getIndividualTotals(totalSuccess, totalX, totalXX, potionName);
      lineOutput += "\nTotal for selling everything: " + commaNumber(totalPrice) + "G"
      lineOutput += "\nTotal EXP for Alchemists: " + commaNumber(totalExp) + " EXP";
      
      return lineOutput;

    }

}

function isAlchemyPotion(potionName){
  if(!Object.keys(botvars.piPotionsList).includes(potionName)){
    return false;
  }

  if("N/A" === botvars.piPotionsList[potionName].recipe.toUpperCase().trim()){
    return false;
  }

  return true;
}

function getSetNum(setSize){
  switch(setSize){
    case "small chemistry set":
    case "small set":
    case "small":
      return 1;
    case "medium chemistry set":
    case "medium set":
    case "medium":
      return 2;
    case "large chemistry set":
    case "large set":
    case "large":
      return 3;
    default: 
      return -1;
  }
}

function getLine(setNum){
  switch(setNum){
      case 1:
        return lines.smallChemistrySet;
      case 2:
        return lines.mediumChemistrySet;
      case 3:
        return lines.largeChemistrySet;
      default:
        return null;
  }

}

function getEXP(pSize){
  switch(pSize){
      case "small":
        return botvars.smallPotionExp;
      case "medium":
        return botvars.mediumPotionExp;
      case "large":
        return botvars.largePotionExp;
      default:
        return -1;
  }
}

function getSetFromNum(setNum){
  switch(setNum){
      case 1:
        return "Small Chemistry Set";
      case 2:
        return "Medium Chemistry Set";
      case 3:
        return "Large Chemistry Set";
      default:
        return null;
  }
}

function getRecipe(recipe, numbers){
  var recipeAdj = recipe;

  if(recipe.includes("**OR**")){
    var index = recipe.indexOf("**OR**");
    recipeAdj = recipeAdj.substring(0,index);
  }

  return getRecipeNumbers(recipeAdj.replace(/\s\+/g, ","), numbers);

}

function getRecipeNumbers(recipeLine, numbers){
  var recipeArr = recipeLine.split(",").map(arr => arr.trim());

  for(var i = 0; i < recipeArr.length; i++){
    var replaceString = recipeArr[i];

    if(recipeArr[i].includes("(x")){
      var ogNum = recipeArr[i].match("\\(x(.*?)\\)");
      recipeArr[i] = recipeArr[i].replace("(x" + ogNum[1] + ")", "(x"+ (ogNum[1]*numbers) +")");
    }else{
      recipeArr[i] = recipeArr[i] + " (x"+ numbers + ")";
    }
  }

  return recipeArr.join(", ");
}

function getIndividualTotals(totalSuccess, totalX, totalXX, potionName){
  var output = "";

  if(totalSuccess > 0){
    output += "\nTotal " + botvars.piPotionsList[potionName].name + "s: " + totalSuccess + " (worth " 
      + (commaNumber(totalSuccess * parseInt(botvars.piPotionsList[potionName].price))) + "G)";
  }

  if(totalX > 0){
    output += "\nTotal " + botvars.piPotionsList["object x"].name + "s: " + totalX + " (worth " 
      + (commaNumber(totalX * parseInt(botvars.piPotionsList["object x"].price))) + "G)";
  }

  if(totalXX > 0){
    output += "\nTotal " + botvars.piPotionsList["object xx"].name + "s: " + totalXX + " (worth " 
      + (commaNumber(totalXX * parseInt(botvars.piPotionsList["object xx"].price))) + "G)";
  }

  if( totalSuccess + totalX + totalXX > 0){
    output+= "\n";
  }

  return output;
}

function getLineWithRemoval(setNum, removeStringDetails, lineOutputObj){
    var lineToModify = Array.from(getLine(setNum));
    lineOutputObj["lineOutput"] = "";

    if(null === removeStringDetails){
      return lineToModify;
    }

    var removeArr = botfunct.splitCommaOrBar(removeStringDetails);

    var rollLineLower = null;
    var removeOpt = "";
    var index = -1;
    var deletedArr = [];

    for(var i = 0; i< removeArr.length; i++){
      removeOpt = removeArr[i].trim().toLowerCase();
      rollLineLower = lineToModify.map(r => r.toLowerCase().trim());

      if(!rollLineLower.includes(removeOpt)){
        return null;
      } else{
        index = rollLineLower.indexOf(removeOpt);
        deletedArr.push(lineToModify.splice(index, 1)); //removes the option from array only once.
      }
    }

    if(lineToModify.length < 1){
      return null;
    }

    lineOutputObj["lineOutput"] = "\n***Lines Removed:*** [" + deletedArr.join(" | ") +"]\n";
    
    return lineToModify;
  }

function removeLinesErrorCatch(setNum, removeStringDetails){
  var lineToModify = Array.from(getLine(setNum));
  var removeArr = botfunct.splitCommaOrBar(removeStringDetails);

  var rollLineLower = null;
  var removeOpt = "";
  var index = -1;

  for(var i = 0; i< removeArr.length; i++){
    removeOpt = removeArr[i].trim().toLowerCase();
    rollLineLower = lineToModify.map(r => r.toLowerCase().trim());

    if(!rollLineLower.includes(removeOpt)){
      return "Error removing option **" + removeOpt + "** from remaining options:\n*[" + lineToModify.join(" | ") + "]*\n\nOriginal Line:\n*[" 
        + getLine(setNum).join(" | ") + "]*";
    } else{
      index = rollLineLower.indexOf(removeOpt);
      lineToModify.splice(index, 1); //removes the option from array only once.
    }
  }

  if(lineToModify.length < 1){
    return "Error: No lines left to roll";
  }

  return "Threw an error once, but cannot duplicate.";
}

