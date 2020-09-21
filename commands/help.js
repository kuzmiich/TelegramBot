import {bot} from "../bot";

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