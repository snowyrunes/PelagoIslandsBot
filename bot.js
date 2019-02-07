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


function divideMessage(madeMsg, channelId){
    //var ms = Math.ceil(((madeMsg.length)/2000)*2);
    var ms = 0;
    manageMessage(madeMsg, channelId, ms)

}

function manageMessage(madeMsg, channelId, ms){
    var msgLen = madeMsg.length;
        
    if (msgLen > 2000){
        if(madeMsg.includes("\n")){
            var madeMsgArray = madeMsg.split("\n");

            var splitOnLen = Math.floor((madeMsgArray.length)/2);

            if(splitOnLen > 0){
                var msgArrayTop = madeMsgArray.splice(0, splitOnLen);
                //var msgArrayBottom = madeMsgArray.splice(splitOnLen);
                var msgTop = msgArrayTop.join("\n");
                // sendMsg(msgTop, channelId);
                var redoMsg = madeMsgArray.join("\n");
 
                manageMessage(msgTop, channelId);    
                manageMessageTwo(redoMsg, channelId);                           

            }else {
                sendMsg("TOO BIG FOR DISCORD", channelId);
            }

        } else {
            sendMsg("TOO BIG FOR DISCORD", channelId); 
        }
    } else {
        sleepThenSend(madeMsg, channelId, ms); 
    }
    
}

function manageMessageTwo(madeMsg, channelId, ms){
    var msgLen = madeMsg.length;
        
    if (msgLen > 2000){
        if(madeMsg.includes("\n")){
            var madeMsgArray = madeMsg.split("\n");

            var splitOnLen = Math.floor((madeMsgArray.length)/2);

            if(splitOnLen > 0){
                var msgArrayTop = madeMsgArray.splice(0, splitOnLen);
                //var msgArrayBottom = madeMsgArray.splice(splitOnLen);
                var msgTop = msgArrayTop.join("\n");
                // sendMsg(msgTop, channelId);
                var redoMsg = madeMsgArray.join("\n");

                manageMessage(msgTop, channelId); 
                manageMessageTwo(redoMsg, channelId);               

            }else {
                sendMsg("TOO BIG FOR DISCORD", channelId);
            }

        } else {
            sendMsg("TOO BIG FOR DISCORD", channelId); 
        }
    } else {
        sleepThenSend(madeMsg, channelId, ms); 
    }
    
}


function sendMsg(outMsg, channelId){
    bot.sendMessage({
        to: channelId,
        message: outMsg
    });

}

async function sleepThenSend(madeMsg, channelId, ms){
   await sleep(1000 * ms)
   sendMsg(madeMsg, channelId)
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}