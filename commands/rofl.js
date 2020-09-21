import {bot} from "../bot";

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
