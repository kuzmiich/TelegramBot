import {bot} from "../bot";

bot.onText(/\/currency/, function(msg){
	const fromId = msg.from.id;

	const requestURL = "https://www.nbrb.by/api/exrates/rates?periodicity=0";
	const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	const request = new XMLHttpRequest();
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