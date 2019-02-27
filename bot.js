var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var piVarInit = require('./dictionary');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

//Dictionaries
var methodDict = {};


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');

    piVarInit.initMethodDict(methodDict);
    piVarInit.initMethodArray();
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`   

    if (message.substring(0, 3) == 'pi!') {
        var args = message.split(" ");
        var cmd = args[0].toLowerCase().substring(3);

        if (!Object.keys(methodDict).includes(cmd)){
            bot.sendMessage({
                to: channelID,
                message: (cmd + " is not a valid command")
            });
            return;
        }

        args = args.splice(1);

        var botmsg = "";

        if (args.length > 0){
            botmsg = methodDict[cmd](args);

        }else {
            botmsg = methodDict[cmd]([]);
        }

        divideMessage(botmsg, channelID)
     }
});


async function divideMessage(madeMsg, channelId){
    //var ms = Math.ceil(((madeMsg.length)/2000)*2);
    var ms = 1;
    var msgArray = [];
    splitAndSend(madeMsg, channelId, ms, msgArray);
    //await sleep(1000);
}


async function splitAndSend(madeMsg, channelId, ms, madeMsgArray){
     var msgLen = madeMsg.length;

     if (msgLen > 1800){
        var madeMsgArrayTemp = madeMsg.split("\n");

            var splitOnLen = Math.floor((madeMsgArrayTemp.length)/2);

            if(splitOnLen > 0){
                var msgArrayTop = madeMsgArrayTemp.splice(0, splitOnLen);
                //var msgArrayBottom = madeMsgArray.splice(splitOnLen);
                madeMsgArray[madeMsgArray.length] = msgArrayTop.join("\n");
                // sendMsg(msgTop, channelId);
                var redoMsg = madeMsgArrayTemp.join("\n");

                splitAndSend(redoMsg, channelId, ms, madeMsgArray);


            }else {
                sendMsg("TOO BIG FOR DISCORD", channelId);
            }

     } else {
        madeMsgArray[madeMsgArray.length] = madeMsg;
        
        for(i = 0; i< madeMsgArray.length; i++){
            //sleepThenSend(madeMsgArray[i], channelId, ms, this.sendMes); 
            sendMsg(("```===[Message " + (i+1) + " of " + (madeMsgArray.length) + " ]===```\n" + madeMsgArray[i] + "\n\n"), channelId);
            await sleep(500);
        }
    }
}

function sendMsg(outMsg, channelId){
    bot.sendMessage({
        to: channelId,
        message: outMsg
    })
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

/*function sleepThenSend(madeMsg, channelId, ms, callback){
   //await sleep(1000 * ms)
   //await sleep(500);
   callback(madeMsg, channelId)
   //await sleep(1000);
}*/