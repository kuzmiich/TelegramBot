import {bot, ch} from "../bot";

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