var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var piVarInit = require('./dictionary');
var fs =require('fs');


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

const bot = new Discord.Client();
bot.login(auth.token);

//Dictionaries
var methodDict = {};


bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');

    piVarInit.initMethodArray();
    piVarInit.initMethodDict(methodDict);
});

bot.on('message', inMsg => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with 'pi!' 
    var message = inMsg.content;
    var author = inMsg.author;
    var channel = inMsg.channel;

    if (message.substring(0, 3) == 'pi!') {
        var args = message.split(" ");
        var cmd = args[0].toLowerCase().substring(3);

        args = args.splice(1);

        if (cmd == "export"){
            //args.unshift(inMsg, channel);
            methodDict[cmd](args.join(" "), channel);
            return;

        }

        if (!Object.keys(methodDict).includes(cmd)){
            inMsg.channel.send(cmd + " is not a valid command");
            return;
        }

        var botmsg = "";

        if (args.length > 0){
            botmsg = methodDict[cmd](args);

        }else {
            botmsg = methodDict[cmd]([]);
        }

        //messages must be divided in order to send.
        divideMessage(botmsg, channel)
     }
});


async function divideMessage(madeMsg, channel){
    var ms = 1;
    var msgArray = [];


    if (madeMsg.length > 1800){
        var madeMsgArrayTemp = madeMsg.split("\n");
        var splitOnLen = Math.floor((madeMsgArrayTemp.length)/2);
        var msgArrayTop = madeMsgArrayTemp.splice(0, splitOnLen);
        var newTop = msgArrayTop.join("\n");
        var msgArrayBottom =  madeMsgArrayTemp;//madeMsgArrayTemp.splice(1, splitOnLen);
        msgArrayBottom.unshift("---");
        var newBottom = msgArrayBottom.join("\n");

        splitCombo(newTop, newBottom, channel);

    }else{
        channel.send(madeMsg)
    }
}


async function splitCombo(topHalfMsg, bottomHalfMsg, channel){

    //console.log("NEW TOP: " + topHalfMsg + ", NEW BOTTOM: " + bottomHalfMsg);
    if (topHalfMsg.length > 1800){
        splitOnly(topHalfMsg).then(function(result){ 
            console.log("ORG TOP: " + topHalfMsg + "NEW TOP" + result[0] + "NEW BOTTOM" + result[1]);
            splitCombo(result[0], result[1], channel);
        });
        
    } else {
        channel.send(topHalfMsg);
    }

    if (bottomHalfMsg.length > 1800){
        splitOnly(bottomHalfMsg).then(function(result){
            splitCombo(result[0], result[1], channel);
        });
    } else {
        channel.send(bottomHalfMsg);
    }

 
}

async function splitOnly(msgToSplit){

    var madeMsgArrayTemp = msgToSplit.split("\n");
    console.log(madeMsgArrayTemp.length);
    var splitOnLen = Math.floor((madeMsgArrayTemp.length)/2);
    var retArray;

    if(splitOnLen > 0){
            var msgArrayTop = madeMsgArrayTemp.splice(0, splitOnLen);
            var newTop = msgArrayTop.join("\n");
            console.log(msgArrayTop.length);
            console.log("NEW TOP" + newTop);
            //var msgArrayBottom = madeMsgArrayTemp.splice(0, splitOnLen);
            var newBottom = madeMsgArrayTemp.join("\n");

            console.log(madeMsgArrayTemp.length);
            console.log("NEW BOTTOM" + newBottom);
            retArray = [newTop, newBottom];

        //console.log("NEW TOP: " + newTop);
        //console.log("NEW BOT: " + newBottom);
        //console.log("ORIGINAL " + msgToSplit + ", NEW TOP: " + newTop + ", NEW BOTTOM: " + newBottom);
        return retArray;
    }else {
        console.log("TOO BIG");
            retArray =  ["TOO BIG FOR DISCORD", "TOO BIG FOR DISCORD"];
            return retArray;
     }

}


async function splitAndSend(madeMsg, channel, ms, madeMsgArray){
     var msgLen = madeMsg.length;

     if (msgLen > 1800){
        var madeMsgArrayTemp = madeMsg.split("\n");

            var splitOnLen = Math.floor((madeMsgArrayTemp.length)/2);

            if(splitOnLen > 0){
                var msgArrayTop = madeMsgArrayTemp.splice(0, splitOnLen);
                //var msgArrayBottom = madeMsgArray.splice(splitOnLen);
                madeMsgArray[madeMsgArray.length] = msgArrayTop.join("\n");
                // sendMsg(msgTop, channel);
                var redoMsg = madeMsgArrayTemp.join("\n");

                splitAndSend(redoMsg, channel, ms, madeMsgArray);


            }else {
                sendMsg("TOO BIG FOR DISCORD", channel);
            }

     } else {
        madeMsgArray[madeMsgArray.length] = madeMsg;
        
        for(i = 0; i< madeMsgArray.length; i++){
            //sleepThenSend(madeMsgArray[i], channelId, ms, this.sendMes); 
            sendMsg(("```===[Message " + (i+1) + " of " + (madeMsgArray.length) + " ]===```\n" + madeMsgArray[i] + "\n\n"), channel);
            await sleep(500);
        }
    }
}

function sendMsg(outMsg, channel){
    channel.send(outMsg);
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}