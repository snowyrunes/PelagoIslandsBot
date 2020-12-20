const Minigame = require('./minigames');
var botvars = require('../variables/vars');
var botfunct = require('../botfunct');
var lines = require('../variables/lines');
var commaNumber = require('comma-number');

module.exports = class Gardening extends Minigame{
  constructor(name) {
      super(name);
      this.loadObtainables();

      botvars.gardenLineMapping[1] = lines.rustyWateringCanLine;
      botvars.gardenLineMapping[2] = lines.ordinaryWateringCanLine;
      botvars.gardenLineMapping[3] = lines.copperWateringCanLine;
      botvars.gardenLineMapping[4] = lines.silverWateringCanLine;
      botvars.gardenLineMapping[5] = lines.goldWateringCanLine;
      botvars.gardenLineMapping[6] = lines.mysticWateringCanLine;

      botvars.gardenReRollsMapping[1] = 0;
      botvars.gardenReRollsMapping[2] = 2;
      botvars.gardenReRollsMapping[3] = 3;
      botvars.gardenReRollsMapping[4] = 4;
      botvars.gardenReRollsMapping[5] = 7;
      botvars.gardenReRollsMapping[6] = 10;

  }

  loadObtainables(){
      super.loadObtainables();

      var sKeys = Object.keys(botvars.piSeedsPreload);

      for(var i = 0; i< sKeys.length; i++){
        var seedData = botvars.piSeedsPreload[sKeys[i]];
        var floraName = seedData.name.replace(" Seeds", "").trim();

        super.getObtainablesConditonString(floraName, seedData.season);

      }
  }

  gardenOne(args){

    if(args.length < 1){
      return "Please provide type of seed and type of watering can. Example: pi!gardenOne winter, apple, rusty watering can"
    }

    var argsString = args.join(" ");
    var removeStringReg = argsString.match("\\[(.*?)\\]");

    var removeStringDetails = (null === removeStringReg) ? null : removeStringReg[1];

    var newargs = argsString.replace("[" + removeStringDetails +"]", "").split(",").map(a => a.trim());

    if(newargs.length < 3){
      return "Please provide type of seed and type of watering can. Example: pi!gardenOne winter, apple, rusty watering can"
    }

    var canLevel = getWateringCanLevel(newargs[2])

    if(0 ==canLevel){
      return "Invalid Watering Can Name: " + newargs[2];
    }

    var floraName = newargs[1];
    var seedName = floraName+ " Seeds";
    var seedData = getSeed(seedName.toLowerCase());
    var cropResult = getCropOrFlower(floraName.toLowerCase());
    var seasonIn = newargs[0].toLowerCase().trim();

    if(null === seedData){
      return "\"" + floraName + " Seeds\" do not exist.";
    }

    if(null === cropResult){
      return "Could not find Crop or Flower: " + floraName;
    }

    if(!validateSeason(getSeason(seasonIn).toLowerCase(), seedData)){
      return "Cannot grow " + seedData.name + " in season: " + newargs[0];
    }

    var lineOutput = "***Gardening Minigame (Single ReRoll Command):***\n";
    lineOutput += "*(For full minigame and rules, please use the pi!gardening command)*\n"
    lineOutput += "Grass/Earth mages can remove two options. Earthmates can remove three options. People who are both can remove **five** options.\n";

    var price = 0;
    var lineOutputObj = {}

    var rollLine = getLine(canLevel, removeStringDetails, lineOutputObj);

    if(null === rollLine){
      return removeLinesErrorCatch(canLevel, removeStringDetails);
    }else {
      lineOutput += lineOutputObj.lineOutput;
    }

    var result = rollLine[botfunct.randomize(rollLine.length)];


    lineOutput = lineOutput + "\nYou are re-rolling growing a single **" + cropResult.name + " Seed** during **"+ getSeason(seasonIn) +"** using a(n) **" + getNameFromLevel(canLevel) + "**\n\n";

    switch(result){
      case "success":
        price = cropResult.price;
        break;
      case "poor":
        price = cropResult.poorPrice;
        break;
      case "overgrown":
        price = cropResult.overgrownPrice;
        break;
      case "golden":
        price = cropResult.goldenPrice;
        break;
      default:
        break;
    }

    lineOutput = lineOutput + "**Result:** " + getResultText(price, result, cropResult.name);

    return lineOutput;

  }

  gardening(args){

    if(args.length < 1){
      return "Please provide location, number of seeds, type of seed, and type of watering can. Example: pi!gardening leuda, 5, apple, rusty watering can";
    }

    var argsString = args.join(" ");
    var removeStringReg = argsString.match("\\[(.*?)\\]");

    var removeStringDetails = (null === removeStringReg) ? null : removeStringReg[1];

    var newargs = argsString.replace("[" + removeStringDetails +"]", "").split(",").map(a => a.trim());

    if((newargs.length < 5) || isNaN(newargs[2])){
      return "Please provide location, season, number of seeds, type of seed, and type of watering can. Example: pi!gardening leuda, winter, 5, apple, rusty watering can";
    }

    var locationNum= getLocationNum(newargs[0]);

    if(0 == locationNum){
      return "Invalid Location: " + newargs[0];
    }

    var canLevel = getWateringCanLevel(newargs[4])

    if(0 ==canLevel){
      return "Invalid Watering Can Name : " + newargs[4];
    }

    var maxNum = 5;

    if(2 == locationNum){
      maxNum = 10;
    }

    if(1 == locationNum && newargs[2] > 5){
      return "You cannot plant more than 5 seeds on Leuda per check.";
    } else if(newargs[2] > 10){
      return "You cannot plant more than 10 seeds on Arcadia per check.";
    }

    var floraName = newargs[3];
    var seedName = floraName + " Seeds";
    var seedData = getSeed(seedName.toLowerCase());
    var cropResult = getCropOrFlower(floraName.toLowerCase());
    var seasonIn = newargs[1].toLowerCase().trim();

    if(null === seedData){
      return "\"" + floraName + " Seeds\" do not exist.";
    }

    if(null === cropResult){
      return "Could not find Crop or Flower: " + floraName;
    }

    if(!validateSeason(getSeason(seasonIn).toLowerCase(), seedData)){
      return "Cannot grow " + seedData.name + " in season: " + newargs[1];
    }

    var lineOutput = "***Gardening Minigame:***\n";
    lineOutput += "*(Grass/Earth mages can remove two options. Earthmates can remove three options. People who are both can remove five options.)*\n\n";
    lineOutput += "You are growing **" + newargs[2] + " " + seedData.name + "** on **" + getLocationName(locationNum) + "** during **"+ getSeason(seasonIn) 
      + "** with a(n) **" + getNameFromLevel(canLevel) + "**\n";

    lineOutput += "You may plant a maximum of **" + maxNum + " seeds** of any kind this check.\n";
    lineOutput += "You get **" + botvars.gardenReRollsMapping[canLevel] + " rerolls** from using your "+ getNameFromLevel(canLevel) + ".\n";
  
    var totalPrice = 0;
    var totalNormal =0;
    var totalPoor = 0;
    var totalOvergrown = 0;
    var totalGolden = 0;

    var lineOutputObj = {}

    var rollLine = getLine(canLevel, removeStringDetails, lineOutputObj);

    if(null === rollLine){
      return removeLinesErrorCatch(canLevel, removeStringDetails);
    } else {
      lineOutput += lineOutputObj.lineOutput;
    }

    lineOutput += "\n";
    

    for(var i =0; i<newargs[2]; i++){
      var result = rollLine[botfunct.randomize(rollLine.length)];
      var price = 0;

      switch(result){
      case "success":
        price = cropResult.price;
        totalNormal++;
        break;
      case "poor":
        price = cropResult.poorPrice;
        totalPoor++;
        break;
      case "overgrown":
        price = cropResult.overgrownPrice;
        totalOvergrown++;
        break;
      case "golden":
        price = cropResult.goldenPrice;
        totalGolden++;
        break;
      case "dried up":
        break;
      case "overwatered":
        break;
      case "eaten by stray":
        break;
      default:
        break;
    }

    totalPrice = totalPrice + parseInt(price);
    lineOutput = lineOutput + "**Result "+ (i+1) +":** " + getResultText(price, result, cropResult.name) + "\n";

    }

    lineOutput += "\n" + getTotalCategories(cropResult, totalNormal, totalPoor, totalOvergrown, totalGolden, totalPrice);

    return lineOutput;

  }

}

//function 

function getTotalCategories(cropObj, totalNormal, totalPoor, totalOvergrown, totalGolden, totalPrice){
  var outputLine = "";

  if(totalNormal > 0){
    outputLine += "Total " + cropObj.name + "s: **" + totalNormal + "** *(" + commaNumber(cropObj.price * totalNormal) + "G)*\n"
  }

  if(totalPoor > 0){
    outputLine += "Total Poor " + cropObj.name + "s: **" + totalPoor + "** *(" + commaNumber(cropObj.poorPrice * totalPoor) + "G)*\n"
  }

  if(totalOvergrown > 0){
    outputLine += "Total Overgrown " + cropObj.name + "s: **" + totalOvergrown + "** *(" + commaNumber(cropObj.overgrownPrice * totalOvergrown) + "G)*\n"
  }

  if(totalGolden > 0){
    outputLine += "Total Golden " + cropObj.name + "s: **" + totalGolden + "** *(" + commaNumber(cropObj.goldenPrice * totalGolden) + "G)*\n"
  }

  outputLine += "\n Total for selling everything: " + commaNumber(totalPrice) + "G";

  return outputLine;

}

function getSeed(seedName){
    if(Object.keys(botvars.piSeedsList).includes(seedName.toLowerCase())){
      return botvars.piSeedsList[seedName];
    }else{
      return null;
    }
  }

function getCropOrFlower(floraName){
    if(Object.keys(botvars.piCropsList).includes(floraName)){
      return botvars.piCropsList[floraName];

    }else if (Object.keys(botvars.piFlowerList).includes(floraName)){
      return botvars.piFlowerList[floraName];

    }else if(Object.keys(botvars.piHerbsList).includes(floraName)){
      return botvars.piHerbsList[floraName];
    }else {
      return null;
    }

  }

function getResultText(price, result, crop){
  switch(result){
      case "success":
        return "Success! You grew a(n) *" + crop + "* worth *" + commaNumber(price) + "G*";
      case "poor":
        return "You grew a *Poor " + crop + "* worth only *" + commaNumber(price) + "G*";
      case "overgrown":
        return "Nice! You grew an *Overgrown " + crop + "* worth *" + commaNumber(price) + "G*";
      case "golden":
        return "Wow! You grew a *Golden " + crop + "* worth a whopping *" + commaNumber(price) + "G*";
      case "dried up":
        return botvars.driedUp;
      case "overwatered":
        return botvars.overwatered;
      case "eaten by stray":
        return botvars.eatenByStray;
      default:
        return "ERROR.";
    }

}

function getLocationNum(location){
    switch(location.toLowerCase()){
      case "leuda":
        return 1;
      case "arcadia":
        return 2;
      default:
        return 0;
    }
  }

function getLocationName(locationNum){
    switch(locationNum){
      case 1:
        return "Leuda";
      case 2:
        return "Arcadia";
      default:
        return null;
    }
  }

function getSeason(seasonName){
  switch(seasonName.toLowerCase().trim()){
    case "spring":
      return "Spring";
    case "summer":
      return "Summer";
    case "fall":
    case "autumn":
      return "Fall";
    case "winter":
      return "Winter";
    default:
      return "Invalid Season";
  }
}

function getLine(canLevel, removeStringDetails, lineOutputObj){
    var lineToModify = Array.from(botvars.gardenLineMapping[canLevel]);
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

function validateSeason(season, seed){
  var seasonArr = seed.season.split(",").map(s => s.toLowerCase().trim());

  if(seasonArr.includes(season)){
    return true;
  }

  return false;
}

function removeLinesErrorCatch(canLevel, removeStringDetails){
  var lineToModify = Array.from(botvars.gardenLineMapping[canLevel]);
  var removeArr = botfunct.splitCommaOrBar(removeStringDetails);

  var rollLineLower = null;
  var removeOpt = "";
  var index = -1;

  for(var i = 0; i< removeArr.length; i++){
    removeOpt = removeArr[i].trim().toLowerCase();
    rollLineLower = lineToModify.map(r => r.toLowerCase().trim());

    if(!rollLineLower.includes(removeOpt)){
      return "Error removing option **" + removeOpt + "** from remaining options:\n*[" + lineToModify.join(" | ") + "]*\n\nOriginal Line:\n*[" 
        + botvars.gardenLineMapping[canLevel].join(" | ") + "]*";
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

function getNameFromLevel(canLevel){
    switch(canLevel){
      case 1:
        return "Rusty Watering Can";
      case 2:
        return "Ordinary Watering Can";
      case 3:
        return "Copper Watering Can";
      case 4:
        return "Silver Watering Can";
      case 5:
        return "Gold Watering Can";
      case 6:
        return "Mystic Watering Can";
      default:
        return null;
    }
  }

function getWateringCanLevel(canName){
    switch(canName.toLowerCase()){
    case "rusty watering can":
    case "rusty can":
    case "rusty":
      return 1;
    case "ordinary watering can":
    case "ordinary can":
    case "watering can":
    case "ordinary":
      return 2;
    case "copper watering can":
    case "copper can":
    case "copper":
      return 3;
    case "silver watering can":
    case "silver can":
    case "silver":
      return 4;
    case "gold watering can":
    case "gold can":
    case "gold":
      return 5;
    case "mystic watering can":
    case "mystic can":
    case "mystic":
      return 6;
    default:
      return 0;
  }
  }


