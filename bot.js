export const ch = require('cheerio');
export const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const Token = process.env.TOKEN;//
export const bot = new TelegramBot(Token, { polling: true });





// internetAvailable().then(function(){
// 	console.log("Internet available");
// }).catch(function(){
// 	console.clear();
// });


// bot.on( "ETELEGRAM" ,  ( err )  =>  console . log ( err ) ) ;
//
// bot.on("polling_error", (msg) => console.log(msg));