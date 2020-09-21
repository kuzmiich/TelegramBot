import {bot} from "../bot";

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
