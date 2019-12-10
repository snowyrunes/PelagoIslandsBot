//var botvars = require('./variables/vars');
//var lines = require('./variables/lines');
//var botfunct = require('./botfunct');
var Discord = require('discord.js');
var commaNumber = require('comma-number');
var logger = require('winston');
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();
var fs =require('fs');

module.exports = {

	export: function(colorMatches, channel){

		 Promise.resolve(getMsgs(channel)).then(function(value){
		 		console.log(value.length);

                var res = exportLogic(value, colorMatches, channel);
                channel.send(res);
                //divideMessage(res, channel);
            });

	},

	//args [messages collection, colors array string]
	

			
}

async function getMsgs(channel){
	const sum_messages = [];
    let last_id;

    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.fetchMessages(options);
        sum_messages.push(...messages.array());
        last_id = messages.last().id;

        if (messages.size != 100) {
            break;
        }
    }

    return sum_messages;
}

function exportLogic(msgCollection, colorMatches, channelUp){
		var compilation = "";
		var colorMap = getColors(colorMatches);
		var channel = channelUp.name;

		if(colorMap["msg"] != "Success"){
			return colorMap["msg"];
		}

		var re = new RegExp("<p>", 'g');

		var colorMapMap = colorMap["map"];

		var messages = Array.from(msgCollection.values());
		var z = "";
		
		for(var a = 0; a < messages.length; a++){
			z = md.render(messages[a].content);
			var username = messages[a].author.username;
			//console.log(z);

			if(Object.keys(colorMapMap).includes(username)){

				z = z.replace(re, "<p style=\"color:" + colorMapMap[username] +";\">");
			}
			compilation = z + "<hr>" + compilation;
		}


		//Promise.resolve( )&lt;@  &gt;

		//myString.replaceAll("#\?.*?;", "");

		var reUser = null;
		var reUserBang = null;

		//var reUser = new RegExp("^<@\s", "g");
		//var reUser = new RegExp("@(.*?)@gt\;", 'g');
		//myString.replaceAll("#\\?.*?;", "");
		//console.log(compilation.match(reUser));
		var membersArray = channelUp.guild.members.array();

		var membersMap = {};
		var mapBeg = "";
		var mapEnd = "";

		for(var i = 0; i< membersArray.length; i++){
			//reUser = new RegExp("@(.*)\&", 'g');
			mapBeg = "@" + membersArray[i].user.id + "\&";
			mapBegBang = "@!" + membersArray[i].user.id + "\&";
			mapEnd = "@" + membersArray[i].user.username + "\&";
			reUser = new RegExp(mapBeg, 'g');
			reUserBang = new RegExp(mapBegBang, 'g');

			compilation = compilation.replace(reUser, mapEnd);
			compilation = compilation.replace(reUserBang, mapEnd);			

			membersMap[mapBeg] = mapEnd;
		}
		/*Promise.resolve(channelUp.guild.fetchMembers()).then(function(value){
			console.log(value);
		})*/
		
		//RegExp"#\?.*?;"
		//logger.info(compilation);

		var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>PIBOT Export To Doc</title></head><body>";
	    var postHtml = "</body></html>";
	    var html = preHtml+compilation+postHtml;

	    var dt = new Date();
	    var dtString = "" + dt.getYear() + "-" + dt.getMonth() + "-" + dt.getDate();
	    var filename = 'log_exports\\'+ channel + '-' + dtString + '-Output.doc';

	    fs.writeFile(filename, html, (err) => { 
            // In case of a error throw err. 
            if (err) throw err; 
        });

        channelUp.send("Success.", { files: [filename] }); 
    
		//return compilation;
		return "No errors recorded.";
		
		//var outputArr = response.filter(msg => msg.author.id != '516752335998025773');
}

function getColors(userColorArray) {
  //[snowyrunes:blue, val:red];

  if(null == userColorArray || 'underfined' ==  userColorArray || "" == userColorArray){
  	var failMap = {};
 	failMap["map"] = {};
 	failMap["msg"] = "Success";
 	return failMap;
  }

 if(!(userColorArray.includes("[") && userColorArray.includes("]"))){
 	var failMap = {};
 	failMap["map"] = null;
 	failMap["msg"] = "Invalid Format. Expected: [username:color, username2:color2]. Got " + userColorArray;
 	return failMap;
 }

  var stringsOnly = userColorArray.replace("[", "");
  stringsOnly = stringsOnly.replace("]", "");

  var stringsArr = stringsOnly.split(",");

  return getParsedMap(stringsArr);

}

function getParsedMap(arr){
	var cleanStrArr =  arr.map(e => e.trim());
	var mappArr = cleanStrArr.map(mal => getMappingArr(mal));

	var parsedMap = {};
	var parsedMapObj = {};


	for (var i = 0; i< mappArr.length; i++){
		//console.log(mappArr[i][2]);
		if (mappArr[i][2] == "false"){
			parsedMapObj["map"] = null;
			parsedMapObj["msg"] = "Invalid color code on " + cleanStrArr[i];
			return parsedMapObj;
		}

		parsedMap[mappArr[i][0]] = mappArr[i][1];
	}


	parsedMapObj["map"] = parsedMap;
	parsedMapObj["msg"] = "Success";
	return parsedMapObj;	

}

//snowyrunes:blue
function getMappingArr(colonStr){
	var propArr = colonStr.split(":").map(e => e.trim());

	//console.log(propArr[1]);
	if(propArr.length > 2){
		propArr.push(isValidColor(propArr[1]));
	} else{
		propArr.push("");
		propArr.push("false");
	}

	return propArr;

}

//this is broken as hell right now
function isValidColor(colorCode){
	var reg = new RegExp("^#[0-9A-F]{6}");

	if(reg.test(colorCode.toLowerCase())){
		//console.log("true");
		return "true";
	}

	var styl = new Option().style;
	styl.color = colorCode;
	var test1 = styl.color == colorCode;
	//console.log(test1);
	return test1 + "";
}