//  Libraries
const ch = require('cheerio');
const fs = require('fs');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const request = new XMLHttpRequest();

// node-telegram-bot-api
const TelegramBot = require('node-telegram-bot-api');
const Token = process.env.TOKEN;//
const bot = new TelegramBot(Token, { polling: true });


/*----  rofl  ----*/
bot.onText(/\/rofl/, function(msg){
	const fromId = msg.from.id;
	const roflURL = "https://www.anekdot.ru/random/anekdot/";

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
/*----  /rofl  ----*/

/*----  news  ----*/
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

bot.onText(/\/news/, function(msg){
	const fromId = msg.from.id;
	UrlSite = "https://news.tut.by";

	request.open('GET', UrlSite);
	request.send();

	request.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200) {
			const html = request.responseText;
			const $ = ch.load(html);
			const links = $('a.entry__link').map((i, x) => $(x).attr('href')).toArray();

			const lstLinks = filterArr(links);

			let i = 0;
			const countNews = 10;
			while(i < countNews)
			{
				request.open('GET', lstLinks[i]);
				request.send();

				request.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						const html = request.responseText;
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
/*----  /news  ----*/

/*----  currency  ----*/
bot.onText(/\/currency/, function(msg){
	const fromId = msg.from.id;

	const currencyURL = "https://www.nbrb.by/api/exrates/rates?periodicity=0";
	request.open('GET', requestURL);

	request.responseType = 'json';
	request.send();
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
});
/*----  /currency  ----*/

/*----  remind  ----*/
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
/*----  /remind  ----*/

/*----  help  ----*/
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
/*----  /help  ----*/

/*----  message  ----*/
bot.on('message', function (msg) {
	const chatId = msg.chat.id; // Берем ID чата (не отправителя)
	const path = 'img/';
	let lstImg = [];

	fs.readdirSync(path).forEach(file => {
	  lstImg.push(file);
	})

	const photo = 'img/' + lstImg[Math.floor(Math.random() * (lstImg.length - 1))];
	bot.sendPhoto(chatId, photo, { caption: 'Лови котейку' });

});
/*----  /message  ----*/

// bot.on( "ETELEGRAM" ,  ( err )  =>  console . log ( err ) ) ;
// bot.on("polling_error", (msg) => console.log(msg));