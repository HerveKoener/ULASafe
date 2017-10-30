var rateManager = {
	server : 'https://min-api.cryptocompare.com/data/pricemulti',
	currency : 'USD',
	init : function(currency){
		this.currency = currency;
	},
	getRate : function(success, error){
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
			   if (xmlhttp.status == 200) {
				let xlm = JSON.parse(xmlhttp.responseText).XLM[rateManager.currency];
				let btc = JSON.parse(xmlhttp.responseText).BTC[rateManager.currency];
				success(btc, xlm);
			   }else {
				   error(xmlhttp);
			   }
			}
		};

		xmlhttp.open("GET", rateManager.server + '?fsyms=XLM,BTC&tsyms='+rateManager.currency, true);
		xmlhttp.send();
	}
};