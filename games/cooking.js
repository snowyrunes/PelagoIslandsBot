const Minigame = require('./minigames');
var botvars = require('../variables/vars');
var botfunct = require('../botfunct');
var lines = require('../variables/lines');
var commaNumber = require('comma-number');

module.exports = class Cooking extends Minigame{

  	constructor(name) {
  		super(name);
      this.loadObtainables();
    }

  	loadObtainables(){
      super.loadObtainables;

      var dKeys = Object.keys(botvars.piCookingDishPreload);
      
      for(var i = 0; i< dKeys.length; i++){
        var minSize = botvars.piCookingDishPreload[dKeys[i]].recipeSize;

        switch(minSize.toLowerCase().trim()){
          case "universal":
          case "small":
            super.getObtainablesConditonString(dKeys[i], "Small Kitchen");
          case "medium":
            super.getObtainablesConditonString(dKeys[i], "Medium Kitchen");
          case "large":
            super.getObtainablesConditonString(dKeys[i], "Large Kitchen");
            break;
          default:
            console.log("ERROR: " + minSize);
            break;
        }
      }

  	}


  	cookOne(args){

      if(args.length < 1){
        return "Please provide kitchen size and the name of the dish. Example: pi!cookOne small kitchen, butter, [fails:success, disaster:success]"
      }
      
      var argsString = args.join(" ");
      var removeStringReg = argsString.match("\\[(.*?)\\]");
      var removeStringDetails = (null === removeStringReg) ? null : removeStringReg[1];

      var newargs = argsString.replace("[" + removeStringDetails +"]", "").split(",").map(a => a.trim().toLowerCase());

      if(newargs.length < 2){
        return "Please provide kitchen size and the name of the dish. Example: pi!cookOne small kitchen, butter, [fails:success, disaster:success]"
      }

      var kitchenNum = getKitchenNum(newargs[0]);
      var dishData = getDish(newargs[1]);
      var failsDish = getDish("failed dish");
      var disasterDish = getDish("disastrous dish");

      if(kitchenNum < 1){
        return "Invalid Kitchen Name: " + newargs[0];
      }

      if(null === dishData){
        return "The following dish is invalid or cannot be made in the Cooking minigame: " + newargs[1];
      }

      if(("Failed Dish" === dishData.name) || ("Disastrous Dish" === dishData.name)){
        return "You cannot intentionally cook a " + dishData.name + ". You must " + dishData.recipe.toLowerCase() + ".";
      }

      if(kitchenNum < getKitchenNum(dishData.recipeSize.toLowerCase())){
        return "You cannot cook a " + dishData.name + " with a " + getKitchenName(kitchenNum) + ".";
      }

      var lineOutput = "***Cooking Minigame (Single ReRoll Command):***\n";
      lineOutput += "*(For full minigame and rules, please use the pi!cooking command)*\n"
      lineOutput += "Culinarians can gain EXP and may replace five options- but only one can be replaced with \"shining\".\n";

      var lineOutputObj = {};

      var rollLine = getLineWithRemplacement(kitchenNum, removeStringDetails, lineOutputObj);
      //console.log(lineOutputObj);
      //console.log(rollLine);

      if(null === rollLine){
        return removeLinesErrorCatch(kitchenNum, removeStringDetails);
      }else {
        lineOutput += lineOutputObj.lineOutput;
      }

      lineOutput += "\nYou are re-rolling cooking a single **" + dishData.name + "** using a **" + getKitchenName(kitchenNum) + "**\n";
      lineOutput += "Remove the following items from your inventory (if you haven't from a previous roll): *" + getRecipe(dishData.recipe, 1) + "*\n\n";

      var price = 0;
      var exp = 0;

      var result = rollLine[botfunct.randomize(rollLine.length)];

      switch(result){
        case "success":
            price = parseInt(dishData.price);
            exp = getDishExp(dishData);
            lineOutput += "**Result:** Success! You have successfully made a(n) " + dishData.name + " worth " + commaNumber(price) + "G!\n";
            break;
        case "fails":
            price = parseInt(failsDish.price);
            lineOutput += "**Result:** Fails! You have unfortunately made a " + failsDish.name + " worth " + commaNumber(price) + "G!\n";
            exp = Math.round(getDishExp(dishData)/2);
            break;
        case "disaster":
            price = parseInt(disasterDish.price);
            exp = Math.round(getDishExp(dishData)/2);
            lineOutput += "**Result:** Disaster! You have unfortunately made a " + disasterDish.name + " worth " + commaNumber(price) + "G!\n";
            break;
        case "explodes":
            lineOutput += "**Result:** BOOM! Your dish blows up in your face. Nothing is salvagable.\n";
            break;
        case "fire":
            lineOutput += "**Result:** Whoops! Looks like you left the food on for a bit too long, and started a fire! How will you put it out? CAN you put it out?\n";
            break;
        case "shining":
            price = parseInt(dishData.shiningPrice);
            exp = getDishExp(dishData)*2;
            lineOutput += "**Result:** Wow! You crafted a Shining " + dishData.name + " worth a whopping " + commaNumber(price) + "G! (Use pi!item " + dishData.name + " for more details.)\n";
            break;
        default:
            return "ERROR";
      }

      lineOutput += "\nTotal EXP for Culinarians: " + exp;
      return lineOutput;
    }

    cooking(args){
      if(args.length < 1){
        return "Please provide kitchen size and the name of the dish. Example: pi!cooking small kitchen, butter, [fails:success, disaster:success]"
      }
      
      var argsString = args.join(" ");
      var removeStringReg = argsString.match("\\[(.*?)\\]");
      var removeStringDetails = (null === removeStringReg) ? null : removeStringReg[1];

      var newargs = argsString.replace("[" + removeStringDetails +"]", "").split(",").map(a => a.trim().toLowerCase());

      if(newargs.length < 3){
        return "Please provide kitchen size, number of dishes, and the name of the dish. Example: pi!cooking small kitchen, 10, butter, [fails:success, disaster:success]"
      }

      if(isNaN(newargs[1])){
        return "Please enter a number of dishes to cook. Ex: pi!cooking small kitchen, 10, butter"
      }

      var kitchenNum = getKitchenNum(newargs[0]);
      var dishData = getDish(newargs[2]);
      var failsDish = getDish("failed dish");
      var disasterDish = getDish("disastrous dish");
      var numDishes = parseInt(newargs[1]);

      if(numDishes < 1 || numDishes > 10){
        return "Invalid number of dishes (" + numDishes + "). You may cook up to 10 dishes per activity check."
      }


      if(kitchenNum < 1){
        return "Invalid Kitchen Name: " + newargs[0];
      }

      if(null === dishData){
        return "The following dish is invalid or cannot be made in the Cooking minigame: " + newargs[2];
      }

      if(("Failed Dish" === dishData.name) || ("Disastrous Dish" === dishData.name)){
        return "You cannot intentionally cook a " + dishData.name + ". You must " + dishData.recipe.toLowerCase() + ".";
      }

      if(kitchenNum < getKitchenNum(dishData.recipeSize.toLowerCase())){
        return "You cannot cook a " + dishData.name + " with a " + getKitchenName(kitchenNum) + ".";
      }

      var lineOutput = "***Cooking Minigame:***\n";
      lineOutput += "*You may cook a maximum of 10 dishes per check.*\n"
      lineOutput += "Culinarians can gain EXP and may replace five options- but only one can be replaced with \"shining\".\n";

      var lineOutputObj = {};

      var rollLine = getLineWithRemplacement(kitchenNum, removeStringDetails, lineOutputObj);
      //console.log(lineOutputObj);
      //console.log(rollLine);

      if(null === rollLine){
        return removeLinesErrorCatch(kitchenNum, removeStringDetails);
      }else {
        lineOutput += lineOutputObj.lineOutput;
      }

      lineOutput += "\nYou are cooking **"+ numDishes +" " + dishData.name + "(s)** using a **" + getKitchenName(kitchenNum) + "**\n";
      lineOutput += "Remove the following items from your inventory: *" + getRecipe(dishData.recipe, numDishes) + "*\n\n";

      var totalPrice = 0;
      var totalExp = 0;

      var totalFail = 0;
      var totalDisaster = 0;
      var totalSuccess = 0;
      var totalShining = 0;

      for(var i=0; i<numDishes; i++){
        var price = 0;
        var exp = 0;

        var result = rollLine[botfunct.randomize(rollLine.length)];

        switch(result){
          case "success":
              price = parseInt(dishData.price);
              exp = getDishExp(dishData);
              totalPrice += price;
              totalExp += exp;
              ++totalSuccess;

              lineOutput += "**Result:** A(n) " + dishData.name + " - " + commaNumber(price) + "G ("+exp +"EXP)\n";
              break;
          case "fails":
              price = parseInt(failsDish.price);
              exp = Math.round(getDishExp(dishData)/2);
              totalPrice += price;
              totalExp += exp;
              ++totalFail;

              lineOutput += "**Result:** A " + failsDish.name + " - " + commaNumber(price) + "G ("+exp +"EXP)\n";
              break;
          case "disaster":
              price = parseInt(disasterDish.price);
              exp = Math.round(getDishExp(dishData)/2);
              totalPrice += price;
              totalExp += exp;
              ++totalDisaster;

              lineOutput += "**Result:** A " + disasterDish.name + " - " + commaNumber(price) + "G ("+exp +"EXP)\n";
              break;
          case "explodes":
              lineOutput += "**Result:** BOOM! Your dish explodes in your face.\n";
              break;
          case "fire":
              lineOutput += "**Result:** Fire!\n";
              break;
          case "shining":
              price = parseInt(dishData.shiningPrice);
              exp = getDishExp(dishData)*2;
              totalPrice += price;
              totalExp += exp;
              ++totalShining;

              lineOutput += "**Result:** A Shining " + dishData.name + " - " + commaNumber(price) + "G ("+ exp +"EXP - Use pi!item " + dishData.name + " for more details.)\n";
              break;
          default:
              return "ERROR";
        }

      }
      
      //totals here
      lineOutput += getSubtotals(totalSuccess, totalFail, totalDisaster, totalShining, dishData, failsDish, disasterDish);

      lineOutput += "\nTotal for selling everything: " + commaNumber(totalPrice) + "G"
      lineOutput += "\nTotal EXP for Culinarians: " + commaNumber(totalExp) + " EXP";

      return lineOutput;
    }
}

function getSubtotals(totalSuccess, totalFail, totalDisaster, totalShining, dishData, failsDish, disasterDish){
  var lineOut = "";

  if(totalSuccess > 0){
    lineOut += "\nTotal "+ dishData.name + "s: " + totalSuccess + " (worth " + commaNumber(parseInt(dishData.price)*totalSuccess) + "G)";
  }

  if(totalFail > 0){
    lineOut += "\nTotal "+ failsDish.name + "es: " + totalFail + " (worth " + commaNumber(parseInt(failsDish.price)*totalFail) + "G)";
  }

  if(totalDisaster > 0){
    lineOut += "\nTotal "+ disasterDish.name + "es: " + totalDisaster + " (worth " + commaNumber(parseInt(disasterDish.price)*totalDisaster) + "G)";
  }

  if(totalShining > 0){
    lineOut += "\nTotal Shining "+ dishData.name + "s: " + totalShining + " (worth " + commaNumber(parseInt(dishData.shiningPrice)*totalShining) + "G)";
  }

  if((totalShining + totalSuccess + totalDisaster + totalFail) > 0){
    lineOut += "\n";
  }

  return lineOut;
}

function getKitchenNum(kSize){
  switch(kSize){
    case "small kitchen":
    case "small":
      return 1;
    case "medium kitchen":
    case "medium":
      return 2;
    case "large kitchen":
    case "large":
      return 3;
    default: 
      return -1;
  }
}

function getDishExp(dishData){
  var recipeSize = dishData.recipeSize.toLowerCase();

  switch(recipeSize){
    case "small":
        return botvars.smallDishExp;
    case "medium":
        return botvars.mediumDishExp;
    case "large":
        return botvars.largeDishExp;
    default:
        return -1;
  }
}

function getKitchenName(kNum){
  switch(kNum){
    case 1:
      return "Small Kitchen";
    case 2:
      return "Medium Kitchen";
    case 3:
      return "Large Kitchen";
    default: 
      return null;
  }
}

function getDish(dishName){
  if(!Object.keys(botvars.piCookingDishPreload).includes(dishName)){
    return null;
  }

  var dishData = botfunct.findItemRawDetails(dishName);

  if({} === dishData){
    return null;
  }

  return dishData;
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

function getRecipe(recipe, numbers){
  var recipeAdj = recipe;

  return getRecipeNumbers(recipeAdj.replace(/\s\+/g, ","), numbers);

}

function getLine(kNum){
  switch(kNum){
      case 1:
        return lines.smallKitchen;
      case 2:
        return lines.mediumKitchen;
      case 3:
        return lines.largeKitchen;
      default:
        return null;
  }

}

function getLineWithRemplacement(setNum, removeStringDetails, lineOutputObj){
    var lineToModify = Array.from(getLine(setNum));
    lineOutputObj["lineOutput"] = "";

    if(null === removeStringDetails){
      return lineToModify;
    }

    var removeArr = botfunct.splitCommaOrBar(removeStringDetails);

    var rollLineLower = null;
    var removeOpt = "";
    var replaceOpt = null;

    //indexes to ensure we don't replace what we have already replaced
    var replacedIndexes = [];

    var deletedArr = [];
    var replacedArr = [];
    var shiningReplaceCount = 0;

    for(var i = 0; i< removeArr.length; i++){
      removeOptUnsplit = removeArr[i].trim().toLowerCase();
      
      var removeOptArr = removeOptUnsplit.split(':').map(or => or.trim());
      var startIndex = [];

      //if not format of replacer:replace
      if(!(removeOptArr.length == 2)){
          return null;
      }

      removeOpt = removeOptArr[0];
      replaceOpt = removeOptArr[1];
      rollLineLower = lineToModify.map(r => r.toLowerCase().trim());

      switch(removeOpt){
        case "shining":
        case "success":
        case "fails":
        case "disaster":
        case "fire":
        case "explodes":
          break;
        default: 
            return null;
      }

      if(!rollLineLower.includes(removeOpt)){
        return null;
      } else{
        var index = findIndex(replacedIndexes, rollLineLower, removeOpt)
        //var index = rollLineLower.indexOf(removeOpt, (startIndex + 1));

        if(index == -1){
          return null;
        }


        deletedArr.push(lineToModify[index]);
        replacedArr.push(replaceOpt);
        lineToModify[index] = replaceOpt;

        switch(replaceOpt){
        case "shining":
          ++shiningReplaceCount;

          if (shiningReplaceCount > 1){
            return null;
          }
        case "success":
        case "fails":
        case "disaster":
        case "fire":
        case "explodes":
          replacedIndexes.push(index);
          break;
        default: 
            return null;
      }

      }
    }

    if(lineToModify.length < 1){
      return null;
    }

    lineOutputObj["lineOutput"] = "\n***Lines Replaced:*** [" + deletedArr.join(" | ") +"]\n"
                                    +"***Replaced With:*** ["+ replacedArr.join(" | ") +"]\n";
    
    return lineToModify;
  }

function removeLinesErrorCatch(setNum, removeStringDetails){
  var lineToModify = Array.from(getLine(setNum));
  var removeArr = botfunct.splitCommaOrBar(removeStringDetails);

  var rollLineLower = null;
  var removeOpt = "";
  var replaceOpt = null;

  //indexes to ensure we don't replace what we have already replaced
  var replacedIndexes = [];

  var deletedArr = [];
  var replacedArr = [];
  var shiningReplaceCount = 0;

  for(var i = 0; i< removeArr.length; i++){
    removeOptUnsplit = removeArr[i].trim().toLowerCase();
    var removeOptArr = removeOptUnsplit.split(':').map(or => or.trim());

    removeOptUnsplit = removeArr[i].trim().toLowerCase();
      
      var removeOptArr = removeOptUnsplit.split(':').map(or => or.trim());
      var startIndex = [];

      //if not format of replacer:replace
      if(!(removeOptArr.length == 2)){
          return "Invalid format. Expected: \"OptionToReplace:ReplaceOption\"\nResult: " + removeArr[i];
      }

      removeOpt = removeOptArr[0];
      replaceOpt = removeOptArr[1];

      rollLineLower = lineToModify.map(r => r.toLowerCase().trim());

      switch(removeOpt){
        case "shining":
        case "success":
        case "fails":
        case "disaster":
        case "fire":
        case "explodes":
          break;
        default: 
            return "Invalid removal option: " + removeOpt;
      }


      if(!rollLineLower.includes(removeOpt)){
        return "Error removing option **" + removeOpt + "** from remaining options:\n*[" + lineToModify.join(" | ") + "]*\n\nOriginal Line:\n*[" 
            + getLine(setNum).join(" | ") + "]*";
      } else{
        var index = findIndex(replacedIndexes, rollLineLower, removeOpt)
        //var index = rollLineLower.indexOf(removeOpt, (startIndex + 1));

        if(index == -1){
          return "ERROR: Could not find index which was not already replaced.\n"
              + "Error removing option **" + removeOpt + "** from remaining options:\n*[" + lineToModify.join(" | ") + "]*\n\nOriginal Line:\n*[" 
              + getLine(setNum).join(" | ") + "]*";
        }

        deletedArr.push(lineToModify[index]);
        replacedArr.push(replaceOpt);
        lineToModify[index] = replaceOpt;

        switch(replaceOpt){
        case "shining":
          ++shiningReplaceCount;

          if (shiningReplaceCount > 1){
            return "You may only replace only ONE option with \"shining\"!";
          }
        case "success":
        case "fails":
        case "disaster":
        case "fire":
        case "explodes":
          replacedIndexes.push(index);
          break;
        default: 
            return "Invalid replace option: "+ replaceOpt;
      }

      }
    }

  if(lineToModify.length < 1){
    return "Error: No lines left to roll";
  }

  return "Threw an error once, but cannot duplicate.";
}

function findIndex(replacedIndexes, linesToFind, replaceStr){
  for(var i =0; i< linesToFind.length; i++){
    if(!replacedIndexes.includes(i) && (replaceStr === linesToFind[i])){
      return i;
    }
  }
}