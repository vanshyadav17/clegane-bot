
//CLEGANE-BOT by u/exinq aka Emperio

const { CommentStream } = require("snoostorm");
const { SubmissionStream } = require("snoostorm");

require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

const config = require('./config.json');
const fs = require('fs');


function saveConfig(){
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 1));
}

const doNotReplyPlayers = config.doNotReplyPlayers;
const possibleReplies = config.possibleReplies;
const triggers = config.triggers;

const r = new Snoowrap({
	userAgent: 'bot-clegane(u/exinq)-2',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS
});


const comments = new CommentStream(r, { subreddit: "freefolk", limit: 10, pollTime: 4000 });

comments.on("item", (comment) => {

    console.log('');
    console.log('');
    console.log(comment.body);
    console.log('by ' + comment.author.name);


    if(comment.body === config.optinCommand){
        if(config.doNotReplyPlayers.indexOf(comment.author.name) > -1){
            comment.reply("I will now be triggered by your comments, cunt.");
            config.doNotReplyPlayers.splice(config.doNotReplyPlayers.indexOf(comment.author.name));
            saveConfig();
        }
        else{
            comment.reply("You are already opted-in, cunt.")
        }
        return;
    }

    if(comment.author.name === process.env.REDDIT_USER){
        return;
    }

    if(doNotReplyPlayers.indexOf(comment.author.name) > -1){
        return;
    }


    if(comment.body === config.optoutCommand){
        config.doNotReplyPlayers.push(comment.author.name);
        saveConfig();
        comment.reply("You have opted out from me, cunt");
        return;
    }

    if(!doesContain(comment.body, triggers)){
        return;
    }

    var randomNumber = Math.floor(Math.random()*possibleReplies.length);
    const messagetoSend = possibleReplies[randomNumber];

    comment.reply(messagetoSend);
    return;

});

//UTIL

function doesContain(content, triggers){
    let isTrue = false;
    triggers.forEach((item, index) => {
        if(content.includes(item)){
            isTrue = true;
        }
    });
    return isTrue;
}



