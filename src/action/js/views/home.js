var home = {
	id : 'h-',
	name : 'home',
	display : function(){
		hideAll();
		show(home.name);
		tagService.cleanInfo(home);
		signing.lock();
		
		tagService.find(home, 'currency').textContent = rateService.currency;
		rateService.getRate(home.displayRate, home.errorRate);
		
		var keysDiv = tagService.find(home, "keys");
		keysDiv.innerHTML = '';
		
		if(accountService.accounts().keyPairs.length === 0){
			keysDiv.appendChild(tagService.text(browserApi.i18n.getMessage("noAccount")));
		}
		
		accountService.accounts().keyPairs.forEach(function(keyPair){
			let row = tagService.create("div", {'class' : 'row'});
			let col = tagService.create("div", {'class' : 'col-xs-8'});
			row.appendChild(col);
			
			var node = tagService.create("a", {'id': home.id + keyPair.pubKey, 'href' : '#'});
			var abbr = tagService.create("abbr", {'title': keyPair.pubKey})
			
			abbr.appendChild(tagService.text(keyPair.id));
			node.appendChild(abbr);
			tagService.addEvent(node, 'click', function(){accountSetting.display(this.id.substring(home.id.length));});
			col.appendChild(node);
			keysDiv.appendChild(row);
			
			stellarGate.getBalance(keyPair.pubKey, home.displayBalance, home.onError);
		});
	},
	displayBalance(pubKey, balance){
		var node = tagService.find(home, pubKey);
		let col = tagService.create("div", {'class' : 'col-xs-4'});
		col.appendChild(tagService.text(Math.round(Number(balance))));
		node.parentNode.parentNode.appendChild(col);
	},
	displayRate(xbtRate, xlmRate){
		tagService.find(home, 'btc').textContent = xbtRate.toString().substr(0, 8);
		tagService.find(home, 'xlm').textContent = xlmRate.toString().substr(0, 8);
	},
	onError(pubKey, error){
		let val = 'Error';
		if(error.data.status === 404){
			val = 0;
		}else{
			tagService.error(home, error.data.statusText);
		}
		var node = tagService.find(home, pubKey);
		let col = tagService.create("div", {'class' : 'col-xs-4'});
		col.appendChild(tagService.text(val));
		node.parentNode.parentNode.appendChild(col);
	},
	errorRate(error){
		tagService.error(home, browserApi.i18n.getMessage("errorLoadRate"));
	}
};

interfaces.push(home.name);