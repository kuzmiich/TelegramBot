const ch = require('cheerio');
const fs = require('fs');
const internetAvailable = require("internet-available");
const TelegramBot = require('node-telegram-bot-api');
const Token = "1143128842:AAGDGbRUczDz4dNa68fNGp53yB1YYCUmF94";//process.env.TOKEN
const bot = new TelegramBot(Token, { polling: true });


internetAvailable().then(function(){
console.log("Internet available");
}).catch(function(){
console.clear();
});

bot.onText(/\/currency/, function(msg){
	const fromId = msg.from.id;

	const requestURL = "https://www.nbrb.by/api/exrates/rates?periodicity=0";
	const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	const request = new XMLHttpRequest();
	request.open('GET', requestURL);
	
	function currencyList(ArrayObj)
	{
		const requiredId = [145, 292, 298];
		let message = "";
		for (let i=0;i < ArrayObj.length;i++)
		{
			if (requiredId.includes(ArrayObj[i]["Cur_ID"]))
			{
				message += `${ArrayObj[i]["Cur_Name"]} ${ArrayObj[i]["Cur_Scale"]} : ${ArrayObj[i]["Cur_OfficialRate"]}\n`;
			}
		}
		return message;
	}
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let ArrayObj = JSON.parse(request.responseText); // get the string from the response
			
			bot.sendMessage(fromId, currencyList(ArrayObj));
		}
	}
	request.responseType = 'json';
	request.send();
});

bot.onText(/\/rofl/, function(msg){
	const fromId = msg.from.id;
	const roflURL = "https://www.anekdot.ru/random/anekdot/";
	const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	const request = new XMLHttpRequest();
	request.open('GET', roflURL);
	request.send();

	request.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200) {
			const html = request.responseText;
			const $ = ch.load(html);
			const rofl = $('div.text').eq(0).text();

			bot.sendMessage(fromId, rofl);
		}
	}
});

bot.onText(/\/news/, function(msg){
	const fromId = msg.from.id;
	URLSite = "https://news.tut.by";
	
	const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	const request = new XMLHttpRequest();
	request.open('GET', URLSite);
	request.send();

	request.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200) {
			const html = request.responseText;
			const $ = ch.load(html);
			const links = $('a.entry__link').map((i, x) => $(x).attr('href')).toArray();

			function filterArr(links){
				let editLinks = [];
				let i = 0;
				while(i < Math.floor(links.length / 2))
				{
					editLinks.push(links[i]);
					i += 2;
				}
				return editLinks;
			}
			const lstLinks = filterArr(links);

			let i = 0;
			const countNews = 5;
			while(i < countNews)
			{
				const query = new XMLHttpRequest();
				query.open('GET', lstLinks[i]);
				query.send();

				query.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						const html = query.responseText;
						const $ = ch.load(html);
						const tag = $('div#article_body').text().replace("\n", " ");

						bot.sendMessage(fromId, tag);
					}
				}
				i++;
			}
		}
	}
	bot.sendMessage(fromId, "Новости");
});

bot.on('message', function (msg) {
	const chatId = msg.chat.id; // Берем ID чата (не отправителя)
	const path = 'img/';
	let lstImg = [];

	fs.readdirSync(path).forEach(file => {
	  lstImg.push(file);
	})

	const photo = 'img/' + lstImg[Math.floor(Math.random() * (lstImg.length-1))];
	bot.sendPhoto(chatId, photo, { caption: 'Лови котейку' });
    
});


let notes = [];

bot.onText(/\/remind (.+) в (.+)/, function (msg, match) {
    const userId = msg.from.id;
    const text = match[1];
    const time = match[2];

    notes.push({ 'uid': userId, 'time': time, 'text': text });

    bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)');
});

setInterval(function(){
    const timeZone = 3;
    for (let i = 0; i < notes.length; i++) {
	    const curDate = new Date().getHours() + timeZone + ':' + new Date().getMinutes();
	    if (notes[i]['time'] === curDate) {
	      bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
	      notes.splice(i, 1);
	    }
  }
}, 1000);

bot.onText(/\/help/, function(msg){
	let fromId = msg.from.id;
	const info = `-----Справочник-----
				/help - помощь
				/remind {command} в {time}- напоминалка на определенное время
				/currency - курс валют
				/rofl - кидает рофл!10 из 10)))
				/news - актуальные новости`
	bot.sendMessage(fromId, info);
});

bot.on( "ETELEGRAM" ,  ( err )  =>  console . log ( err ) ) ;

bot.on("polling_error", (msg) => console.log(msg));