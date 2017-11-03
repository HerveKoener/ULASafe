var home = {
	id : 'h-',
	name : 'home',
	display : function(){
		hideAll();
		show(home.name);
		tagManager.cleanInfo(home);
		signing.lock();
		
		tagManager.find(home, 'currency').textContent = rateManager.currency;
		rateManager.getRate(home.displayRate, home.errorRate);
		
		var keysDiv = tagManager.find(home, "keys");
		keysDiv.innerHTML = '';
		
		if(accountManager.accounts().keyPairs.length === 0){
			keysDiv.appendChild(tagManager.text(browserApi.i18n.getMessage("noAccount")));
		}
		
		accountManager.accounts().keyPairs.forEach(function(keyPair){
			let row = tagManager.create("div", {'class' : 'row'});
			let col = tagManager.create("div", {'class' : 'col-xs-8'});
			row.appendChild(col);
			
			var node = tagManager.create("a", {'id': home.id + keyPair.pubKey, 'href' : '#'});
			var abbr = tagManager.create("abbr", {'title': keyPair.pubKey})
			
			abbr.appendChild(tagManager.text(keyPair.id));
			node.appendChild(abbr);
			tagManager.addEvent(node, 'click', function(){accountSetting.display(this.id.substring(home.id.length));});
			col.appendChild(node);
			keysDiv.appendChild(row);
			
			stellarGate.getBalance(keyPair.pubKey, home.displayBalance, home.onError);
		});
	},
	displayBalance(pubKey, balance){
		var node = tagManager.find(home, pubKey);
		let col = tagManager.create("div", {'class' : 'col-xs-4'});
		col.appendChild(tagManager.text(Math.round(Number(balance))));
		node.parentNode.parentNode.appendChild(col);
	},
	displayRate(xbtRate, xlmRate){
		tagManager.find(home, 'btc').textContent = xbtRate.toString().substr(0, 8);
		tagManager.find(home, 'xlm').textContent = xlmRate.toString().substr(0, 8);
	},
	onError(pubKey, error){
		let val = 'Error';
		if(error.data.status === 404){
			val = 0;
		}else{
			tagManager.error(home, error.data.statusText);
		}
		var node = tagManager.find(home, pubKey);
		let col = tagManager.create("div", {'class' : 'col-xs-4'});
		col.appendChild(tagManager.text(val));
		node.parentNode.parentNode.appendChild(col);
	},
	errorRate(error){
		tagManager.error(home, browserApi.i18n.getMessage("errorLoadRate"));
	}
};

interfaces.push(home.name);