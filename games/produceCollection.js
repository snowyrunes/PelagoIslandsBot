const Minigame = require('./minigames');
var botvars = require('../variables/vars');
var botfunct = require('../botfunct');
var commaNumber = require('comma-number');

module.exports = class ProduceCollection extends Minigame {

	constructor(name) {
		super(name);
        this.loadObtainables();        
  	}

	loadObtainables(){
  		super.loadObtainables();

        var aKeys = Object.keys(botvars.piAllMonstersMap);
        //console.log(aKeys);

  		for(var i = 0; i< aKeys.length; i++ ){
            var monsterData = botvars.piAllMonstersMap[aKeys[i]];
	  		super.getObtainablesConditonString(monsterData.produce, monsterData.name);
  		}

      var lKeys = Object.keys(botvars.piAllLivestockMap);

      for(var i = 0; i< lKeys.length; i++ ){

        var livestockData = botvars.piAllLivestockMap[lKeys[i]];
        super.getObtainablesConditonString(livestockData.produce, livestockData.name);
      }

  	}
    

	produceCollection(args){
		if(args.length < 1 ){
			return "Please provide a monster or livestock."
		}

		var lineOutput = "***Produce Collection Minigame:***\n\n";
		var totalPrice = 0;

    var livestockArr = args.join(" ").split(",");

    for(var i = 0; i < livestockArr.length; i++){
      var lName = livestockArr[i].trim().toLowerCase();
      var lmObj = null;
      
      if(Object.keys(botvars.piAllLivestockMap).includes(lName)){
        lmObj = botvars.piAllLivestockMap[lName];

      }else if(Object.keys(botvars.piAllMonstersMap).includes(lName)){
        lmObj = botvars.piAllMonstersMap[lName];
      }
      else {
          return "Invalid livestock/monster name: " + lName;
      }

      var prodNum = botfunct.randomize(7) + 1;

      var prodPrice = botfunct.findItemRawDetails(lmObj.produce).price;

      lineOutput = lineOutput + "Your **" + lmObj.name + "** produced **" + prodNum + " "  + lmObj.produce + "(s)**, worth " + commaNumber(prodPrice) + "G each ("+ commaNumber(prodPrice*prodNum) + "G for all "+ prodNum+ " of them).\n"

      totalPrice += (prodPrice*prodNum);
    }

		return lineOutput + "\nTotal for selling everything: " + commaNumber(totalPrice) + "G";
	}
}