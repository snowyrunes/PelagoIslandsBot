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

        /*if("todd" == cmd){
            channel.send('Ş̷̛̛̛̛̛͖̗̲̺̮̫̠̦͚͎͈̮̳̱̳̜̟̝͕̺̖͎̼̐̈̒̾͛͋́̀̄̀͒̀̓͐̽͋́̅̏̇̓͂̿͗̂̏̋̑̋̆͑̈̀̀͆̌͂͊́̍́̍̈́̽̅͆̇̐̉̄͂͌̀̈̋̈́̓̊̌̒̊̃̅̓̓͒̈́̃̏͗̌̆̎͒̾̉͑̓́͊̉͛̈́͂̾̇̔̃͌̍̇̇̈́̔̀͊̓̒̀̆̉̄̏̂̈́̀̋̇̿̅̂͑͒͋͋̇̏̾̇̄͋͛̈́͛̀̔̀̊͆̾̓̂̿͊̾͐͒̎̓͌̌̋̾͆͌̀̓͂̽̅̊͊͛͌̈́̿͐͊̑̊̿̿̌̽̉̆͘̕̚̕͘̕̕̕̚̕̕̕̚͘̚͜͜͠͠͝͝͝͠͠͝͠͝͝͝͝͝͝͝͠k̶̨̡̧̢̨̢̢̧̧̢̨̧̨̢̡̡̨̨̢̧̢̧̡̨̧̢̨̢̢̧̛̛̛̛̛̛̛̝̦̭̹̤̫̯̺̜̟͉̙͓̯̝͎̤̬̪̣̳͙̹͙͖̖̩̪̝̮̖͚̮͇͕̰̥̬͙̥͍͍̻̯̟̟̭̻̬̫͕͕̖̦͉̲̘͎͍̭̘̝̞̠̤̥͖̘͔̟̬̺͇̤̼͖̳̘͈̤̤̩͓̪͕̫͖̪̺̖̝͙̠̪̳͇̠̮̭̫̩̙̲̩̱̱̱̖̹̲̰̹͕̫̬̠̜̗̻̣̻̯̞̖̜͖̜̘̗̥̹͇̮̗͇̤̰̬̜̞͚͈̻͉̗͈̰͓͈͔̺̗̞̲̜̞̗̰̳͔̤̳̫͎̭̜̥̻̯͓̼͔̬͓̞̗͓̯̥͉͕̼̮͇̤̤̙̺̝̥̳͕̰̾͑̒̇̀͑̈́̑̄͒̋͂͐̅̎͛̿͗̓̑̑̈́̋͌̐͂͂̈́͛͊̓́̐̈̍̀͂͋͒̄̌̏̃͒̇́͐͂̒̿͊́͐̃̈̒̀̈́̍̀̾̃͛̍̃̄̀͋̄͋̀̎̊̋̌͒͛̋̄̃̽́̈́͊̎͆̓͌͑́̾͐͌̆̇͒̐̆̐͌̏̊̊̇̍̂̉̑͊̈̀̈́̈́͛̈́̓͑̄͒̀̿̋̿̅́̽͗̆̀́̊̐̎́̅͛̊̍̒͊̃̈́̀͒̿̀̾̈̇̑̑͒̔̆̎͗̇̽̇͒̾͂̋̎̾̑̂̐̽́̓̈́̀̂́͑̔̀̄̃̅̐̀̅̔͒͗̅̊̆̑̈́̀̂͂͐́̑́̔͂͊̂͊̉̿̀̊́͑̂͌̏̿͌̈́̑͊̓̉̂̇͛͂̃͘̕̕̚̚̕͘̚̕̚̕̚͘̚̚͜͜͜͜͜͜͝͝͝͝͝͝͝͠͝͠͝͠͠͠͝͝͝͝͠͝ͅͅͅͅỷ̶̨̧̨̨̡̨̡̢̨̨̢̢̢̢̛̛̛̤͔̞̞̬̜̠͍͇̤̬͇̣̘̳̪̱̥̖͓̮̞̙̣̰̯̳̳͍͎̣̻̬̩͕͓͚̩̲̬͓̥̳͉̝̯̮̱̟̯̠̪͈͖̥̣͎̘̙̭̖͈͔̭͎̫̟̯͈͔̰͉̘͖̱͓͖̫̦̟̝̫̙̻̗̖̬̖͍͈̘͙̗̩̰̝̯̥̱̰̯̣̤̼͖̤̥̙̰̭̘̰͈͇͚̻͈͓͖̼͎͈̟̭͈̰̩͉̗͔͍͓̼͇̰̱̣̞͍̳̘̘̺͎̤͚̤̰̜͉̣̝̞̗̭̱̮͚̙̹͙̞͙̮̯̥̘̘̣̪̣̂̍̔̊̓̀͌͂̄͗̆͂͆̈́͂̇̿̓̾͊̎͆̓̅̍̋͛̋̀͐̉̐̐͋̿͊̀̓̓̃͊̋͗̽̆̃̀̄̌̐͊̃͗͂̀̓̈̉̋̀̆͒̑̏̎̓̋̋̈́̐̏̽̆͂̓̓͒̈́̏̆̎̇̊̍̊͊̊̾̀͋̉̈́̈́̅͛͗́̆́̓̈́̈́̽̽͂̈́̍̄̎͑̎̀͗̆̀̌̅̌̈́̋̎̒͑͌̆̔́̒̽̌̊̾͗̇̄͆̆̑̏̐̆̈͆̂̆͌̌̊̑̋̇̾̃͂́̋͛͑̀͊͗̈́̆̋̓̃͐̈́͐̈́̿̔̓̅̃͐̔̃͛̉̄̏̀̍̈̊͋̈́͒́͋̇̊͘͘͘̕̚͘̕̚̕͘̚̚̕̕̕͘͜͜͜͜͜͠͝͝͝͝͝͝͝͝͝͝͝͝͝͝͠͝͝ͅͅͅͅͅr̵̨̧̨̢̢̡̧̧̨̨̡̨̧̡̧̨̢̡̡̢̧̢̛̛̛̛̛͚̠̪̙̗̯̼̤̞̰͎̰̳̜̯̗͈̙̻̤̫͈̮͔͚̮̺͕̼͍̝̳͈̯̥͔̲̩̙͕͕̫̠̯̜͖̟͚͓̬̜̥͕̳̲̘̣̬͖̦̙̝͖̳̗̙̗͎͙̞̠̙̖͓̹̺̻̲̜̹̟͓̫̣̞̳͕͈͙̣̰̻̝̥̭̩̹̠̖̥̖̘̼͙̯͎̹̘̞̱̜̤̘̫̤̳̹̝̘̜̩̞̭̥̻̟͙̳͈͚̗͕͉͙̙̲͔̠̣̙͎̮̜̭̹̠̟̠͚͕̜̫͚͇̥̘̤̠̟̦̠̰͍͚͔͇̰̰̺̲̰͍͓̝̭͈̱̺͚̺̺̲̞͍̦̥͍̰̖͇͉͇̞̦̞͕̭͕̙̩̬͖̗̜͉͕̫̙̞͕̬̺̟̼̻̹̮͇͙̳͖̞̥͕̦͍̦͇̲̥̱͓̱̤̭̙̪͍̩̪̂̊͆̃́̐̒͒̂̂̄̇̌̎̌̄̉̅̈́̿̒̽̈́̃̓̑̍͊́̐̑̃͌͗̓́͊͂́͗̒̒̓͌̉̈͌́̓̾̍͗̒͛̇̌̇͑́̊̀̎͋̍̎́̆̌̋̑̍͑̃̑͗͋̅͗̍̔͌͂̌̃̒̋̓̓̈́͐͌̑̿̋̊̀̃̏̐̔̐̒͗̇̅̒̃͂̐̃̌̈̎̒̓͋͋̋̊̌́̎̀̌͋̋̈̿̉̄͋̓̃̽̉̃̀̆̈́̇͌̃̽̒͑͛̈̐̽̓͌̀͊̀̾̽̂͒̈̐́̓̉̽̔̎̊̀̂̈́͌̍͒́̂̒̌͛̿̓́̆̅̀̇͗͑̓̃̂̈́̈́̂̌͗̈́͋̈́͋̅͑̃̑̍̑̓̑̈́̆͋́̈́̎́̈́́͛̓͌̒̃̉̂̈̀͘͘̕̚͘͘͘̕͘̕͘͘͘͘͘͘͘̕͘͜͜͜͜͝͝͠͝͝͠͠͠͝͠͠͝͝͝͝͠͝ͅî̴̡̢̧̢̧̨̡̢̡̡̨̛̦͇̖͙̞̗̳̣̣̭̹͖̝̖̣͓͙̣͖͔͖̥̹̙̝͙̼͚̳̬̣̖͉̤͓̘͕͚̟̯̬̝͇͚̹͙͕̦̼̪̖̟̯͇͙̰̼̞͈̝̻̫͇̥̬̠͉̝͙̦̯̞͎̘͖̤͙̼͕̠̤̜͈̭͍͈͖͎͕͔̝̖̰̼̺̭͚͙̮͕͎̝̩̺͈̪̣̣͚̰̭̳̪̮̒́͂̑̑̔͂͋̽̾̀͊̈́͐͒̇̋̀͗̀́̈́͂͐͑̎͛̾͆̃̏͗̔̈͌̓́̒͐̎̔͑͋̿͂̎̉̇̐̅̏̈́̒͆̀̂͂͑̉̈́̎̉̽͗̂͐́̒̓̏͐͗͑̆͑͊́͂̆̓͆͋̇̈́̀̆̊̐̎̇̈̉͛̓͗̂͗̎͋̏͐͛̈́̽͐̌́̿̈̄͑̇͂̒͑̀̑̽͋̂̐̉̊̑͐̇̊̕͘̚̚͘͘͘͘͜͜͠͝͝͝͝m̴̧̢̨̡̡̧̡̧̢̨̡̡̧̡̢̧̧̧̨̨̧̡̧̨̧̡̨̛̛̛̛̛̛̛̛͍͔̻̯͕̲̼͓̦̺̘͔̱͓̙̰̱̤͉̭͓̳̱̫͖͍͈̝̞̟̬̬̭̖͚̮͍̝̭̠̞̱͈̞̩̣̹̩͓̱̼̩̺̫̱̠̹̺͍̞͉̗̳̩̗̩̰̬̹̬̱͔̫̲̻̱̦̞̙͍̣͈̲͚͎̙͙̯̪̜̱̣̰̣̪͙̻̠͙̤̤͙̟̳͓̠͕̪͉̪̹̫̙̥̳͎͕̪̝̲̥̥̯̤̳͈͕̱̯͚̼̻̫͉̭̘̠̞͇͈̹̳̯̞̫͈͔̹̻̱̬͔̜͈͚̯̯̞̟͇̯̥͔͓͔̮͉̦̙̱̠̣͓̰͓̠̻͔̯͖͔͇̮̝̻̰͔̬̫̪̯͉̝̘͈̫̼̘̖̭̤̗̮͇̻̮͔̳͍̪̠̼̗͇̬̖̰̥̹͖̮͔̬̳͎̦̫͍̪͙̠͚̦̞̟̱̱̼̭̟͗̽̉̎̀̋͒̋̏̉̅̆̈̇͂̆̉̔̓̿̿̂̐͂̐̎͋̽̀̂͂͆̆͗́̈́͐͂̒̊͒͊͐͒͂̾̏̇̎̏̔̃̽̓̒̔̂́̄͐̾̈́̂̂̎̽̀̈́̍̄̏͐̌͊͋̄͋̋̓̈́̈́̃̈̾͊͐̂̈́̊́̒̑̽͑̃͒̂̀͂̃͐̋͗̀̀́̂̈́̽̔̌̈́͊̉̂̀̀͑̄̅͋͛͆̆̎͂͐͑̀͆̄̄͑̔́̊́͂̿̂̎̇̔̾͌͊̾̄̾̿̒͒̓͗̅̾̄͆̔̆̑̔͌̐̃͆̉̐̉͋̄̏̄̒̐̈́̓̽̏͒̍̋͐̎́̃̐̊͗̀̓̓̆̇̎̔̌́̎̋͒́̿͋́͆̍̿̉͂́͆͌̅̑͂͂̊̃̆̈́͑̋́̏͊̇̅̄̉̄͑̀͛̑̍̒̍̀͋̌͒͗̍̔̽̐͆͆̕̕͘͘͘̚̚̚͘̕̚̚̚͘͘͘͜͜͜͜͝͝͝͝͝͠͝͝͝͠͠͝͠͝͝͠͝͝͝͝ͅͅͅ', {
                files: [
                    "./todd.jpg"
                ]
            });

            channel.send("")

            return;
        }*/

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
        //divideMessage(botmsg, channel)
        var returnArray = [];
        divideMessage(botmsg, channel, 1, returnArray);
     }
});


async function divideMessage(madeMsg, channel, ms, returnArray){
    
    divideMessage2(madeMsg, channel, ms, returnArray);

    for(var i = 0; i< returnArray.length; i++){
        channel.send(returnArray[i]);
    }
}
async function divideMessage2(madeMsg, channel, ms, returnArray){
    var msgArray = [];

    if (madeMsg.length > 1800){
        var madeMsgArrayTemp = madeMsg.split("\n");
        var splitOnLen = Math.floor((madeMsgArrayTemp.length)/2);
        var msgArrayTop = madeMsgArrayTemp.splice(0, splitOnLen);
        var newTop = msgArrayTop.join("\n");
        var msgArrayBottom =  madeMsgArrayTemp;//madeMsgArrayTemp.splice(1, splitOnLen);
        msgArrayBottom.unshift("_");
        var newBottom = msgArrayBottom.join("\n");

        ms = divideMessage2(newTop, channel, ms, returnArray);
        ms = divideMessage2(newBottom, channel, ms, returnArray);

    }else{
        returnArray.push(madeMsg);
        ms = ms + 1;
        return ms;
    }

    return ms;
}




/*function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}*/