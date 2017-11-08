var rateService = {
	server : 'https://min-api.cryptocompare.com/data/pricemulti',
	currency : 'USD',
	init : function(currency){
		this.currency = currency;
	},
	getRate : function(success, error){
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) {
			   if (xmlhttp.status == 200) {
				let xlm = JSON.parse(xmlhttp.responseText).XLM[rateService.currency];
				let btc = JSON.parse(xmlhttp.responseText).BTC[rateService.currency];
				success(btc, xlm);
			   }else {
				   error(xmlhttp);
			   }
			}
		};

		xmlhttp.open("GET", rateService.server + '?fsyms=XLM,BTC&tsyms='+rateService.currency, true);
		xmlhttp.send();
	}
};