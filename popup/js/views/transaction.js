var transaction = {
	id : 't-',
	name : 'transaction',
	current : null,
	display : function(pubKey){
		if(signing.isLocked()){
			signing.display(function(){transaction.display(pubKey);});
		}else{
			accountManager.unlock(signing.getPassword());
			transaction.displayForm(pubKey);
		}
	},
	displayForm : function(pubKey){
		hideAll();
		show(transaction.name);
		tagManager.cleanInfo(transaction);
		
		let keyPair = accountManager.accounts().find(pubKey);
		let from = tagManager.find(transaction, "from");
		from.innerHTML = '';
		var abbr = tagManager.create("abbr", {'id': transaction.id + keyPair.pubKey, 'title': keyPair.pubKey});
		abbr.appendChild(tagManager.text(keyPair.id));
		from.appendChild(abbr);
		stellarGate.getBalance(keyPair.pubKey, transaction.displayBalance, transaction.balanceError);
		
		transaction.current = keyPair;
		
		var recipientsSelect = tagManager.find(transaction, "recipients");
		recipientsSelect.innerHTML = '';
		
		var node = tagManager.create("option", {'value': 'new'});
		node.appendChild(tagManager.text(browserApi.i18n.getMessage("newRecipient")));
		tagManager.addEvent(node, 'click', function(){transaction.selectrecipient('new');});
		recipientsSelect.appendChild(node);
		
		recipientManager.keyPairs.forEach(function(keyPair){
			var node = tagManager.create("option", {'value': keyPair.pubKey});
			node.appendChild(tagManager.text(keyPair.id));
			tagManager.addEvent(node, 'click', function(){transaction.selectrecipient(keyPair.pubKey);});
			recipientsSelect.appendChild(node);
		});
	},
	selectrecipient : function(pubKey){
		if(pubKey === 'new'){
			let keyPair = recipientManager.find(pubKey);
			tagManager.find(transaction, "to").value = '';
			tagManager.setAttr(tagManager.find(transaction, "to"), {'disabled' : ''});
			tagManager.find(transaction, "alias").value = '';
			tagManager.setAttr(tagManager.find(transaction, "alias"), {'disabled' : ''});
		}else{
			let keyPair = recipientManager.find(pubKey);
			tagManager.find(transaction, "to").value = keyPair.pubKey;
			tagManager.setAttr(tagManager.find(transaction, "to"), {'disabled' : 'disabled'});
			tagManager.find(transaction, "alias").value = keyPair.id;
			tagManager.setAttr(tagManager.find(transaction, "alias"), {'disabled' : 'disabled'});
		}
	},
	send : function(){
	
		let from = transaction.current.priKey;
		let alias = tagManager.find(transaction, "alias").value;
		let to = tagManager.find(transaction, "to").value;
		let amount = tagManager.find(transaction, "amount").value;
		let memoType = tagManager.find(transaction, "memoType option:checked").value;
		let memoValue = tagManager.find(transaction, "memo").value;
		
		if(accountManager.accounts().isValidPubKey(to) && alias != ''){
			recipientManager.push({id:alias, priKey:'', pubKey:to});
			saveKeys(signing.getPassword());
			if(accountManager.accounts().isValidPriKey(from)){
				stellarGate.send(from, to, amount, stellarGate.memo(memoType, memoValue), transaction.sent, transaction.onError);
			}else{
				tagManager.error(transaction, browserApi.i18n.getMessage("errorSecretNotValid"));
			}
		}else{
			tagManager.error(transaction, browserApi.i18n.getMessage("errorRecipientNotValid"));
		}
	},
	sent : function(){
		tagManager.success(transaction, browserApi.i18n.getMessage("successSendXLM"));
	},
	displayBalance(pubKey, balance){
		var node = tagManager.find(transaction, 'balance');
		node.innerHTML = '';
		node.appendChild(tagManager.text(Math.round(Number(balance))));
	},
	balanceError(pubKey, error){	
		let val = 'Error';
		if(error.data.status === 404){
			val = 0;
		}else{
			tagManager.error(transaction, error.data.statusText);
		}
		var node = tagManager.find(transaction, 'balance');
		node.innerHTML = '';
		node.appendChild(tagManager.text(val));
	},
	onError(error){
		tagManager.error(transaction, browserApi.i18n.getMessage("errorSendXLM"));
	}
}

interfaces.push(transaction.name);