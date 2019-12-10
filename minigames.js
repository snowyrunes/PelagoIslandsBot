module.exports = class Minigames{

	constructor(name) {
		this.name = name;
    	this.itemConditions = {};
  	}

  	loadObtainables(){
  		this.itemConditions = {};
  	}


  	getItemConditions(itemName){
  		if(!Object.keys(this.itemConditions).includes(itemName)){
  			return null;
  		}else{
  			return this.name + " Minigame(" + this.itemConditions[itemName] + ")";
  		}
  	}

  	getObtainablesConditonString(itemName, conditionName){
  		if(!Object.keys(this.itemConditions).includes(itemName.toLowerCase())){
  			this.itemConditions[itemName.toLowerCase()] = conditionName;

  		}else{
  			this.itemConditions[itemName.toLowerCase()] = this.itemConditions[itemName.toLowerCase()] + ", " + conditionName;
  		}
  	}

}


