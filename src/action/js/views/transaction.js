var transaction = {
	id : 't-',
	name : 'transaction',
	current : null,
	display : function(pubKey){
		if(signing.isLocked()){
			signing.display(function(){transaction.display(pubKey);});
		}else{
			accountService.unlock(signing.getPassword());
			transaction.displayForm(pubKey);
		}
	},
	loadPagePublicKeys(){		
		browserApi.tabs.query({active: true, currentWindow: true}, function(tabs) {
			browserApi.tabs.sendMessage(tabs[0].id, {type: "findPubKeys"}, function(pubKeys) {
				let field = tagService.find(transaction, "pagekeys");
				field.innerHTML = '';
				
				let option = tagService.create("option", {'value' : ''});
				option.appendChild(tagService.text(browserApi.i18n.getMessage("newRecipient")));
				tagService.addEvent(option, 'click', function(){transaction.updateRecipient('new', '');});
				field.appendChild(option);
					
				if(pubKeys){
					pubKeys.forEach(function(pubKey){
						let option = tagService.create("option", {'value' :pubKey});
						option.appendChild(tagService.text(pubKey.substring(0, 25)+' ...'));
						tagService.addEvent(option, 'click', function(){transaction.updateRecipient(pubKey, '');});
						field.appendChild(option);
					});
				}
			});
		});
	},
	displayForm : function(pubKey){
		hideAll();
		show(transaction.name);
		tagService.cleanInfo(transaction);
		
		tagService.setAttr(tagService.find(transaction, "pagekeys"), {'style' : 'display: none;'});
		transaction.toogleForm(false);
		
		let keyPair = accountService.accounts().find(pubKey);
		let from = tagService.find(transaction, "from");
		from.innerHTML = '';
		var abbr = tagService.create("abbr", {'id': transaction.id + keyPair.pubKey, 'title': keyPair.pubKey});
		abbr.appendChild(tagService.text(keyPair.id));
		from.appendChild(abbr);
		stellarGate.getBalance(keyPair.pubKey, transaction.displayBalance, transaction.balanceError);
		
		transaction.current = keyPair;
		
		transaction.loadRecipients();
	},
	loadRecipients(){
		var recipientsSelect = tagService.find(transaction, "recipients");
		recipientsSelect.innerHTML = '';
		
		var node = tagService.create("option", {'value': 'new'});
		node.appendChild(tagService.text(browserApi.i18n.getMessage("newRecipient")));
		tagService.addEvent(node, 'click', function(){transaction.selectRecipient('new');});
		recipientsSelect.appendChild(node);
		
		recipientManager.keyPairs.forEach(function(keyPair){
			var node = tagService.create("option", {'value': keyPair.pubKey});
			node.appendChild(tagService.text(keyPair.id));
			tagService.addEvent(node, 'click', function(){transaction.selectRecipient(keyPair.pubKey);});
			recipientsSelect.appendChild(node);
		});
	},
	selectRecipient : function(pubKey){
		let alias = '';
		if(pubKey !== 'new'){
			let keyPair = recipientManager.find(pubKey);
			alias = keyPair.id;
			tagService.setAttr(tagService.find(transaction, "removeRecipient"), {'style' : 'display: inline;'});
			tagService.setAttr(tagService.find(transaction, "recipients"), {'style' : 'display: inline-block; width: 85%;'});
		}else{
			tagService.setAttr(tagService.find(transaction, "recipients"), {'style' : 'display: block; width: 100%;'});
			tagService.setAttr(tagService.find(transaction, "removeRecipient"), {'style' : 'display: none;'});
		}
		transaction.updateRecipient(pubKey, alias);
	},
	removeRecipient : function(){
		let to = tagService.find(transaction, "to").value;
		recipientManager.remove(to);
		transaction.selectRecipient('new');
		saveKeys(signing.getPassword());
		transaction.loadRecipients();
	},
	updateRecipient(pubKey, alias){
		if(pubKey === 'new'){
			tagService.find(transaction, "to").value = '';
			tagService.setAttr(tagService.find(transaction, "to"), {'disabled' : ''});
			tagService.find(transaction, "alias").value = '';
			tagService.setAttr(tagService.find(transaction, "alias"), {'disabled' : ''});
		}else{
			tagService.find(transaction, "to").value = pubKey;
			tagService.setAttr(tagService.find(transaction, "to"), {'disabled' : 'disabled'});
			tagService.find(transaction, "alias").value = alias;
			if(alias !== ''){
				tagService.setAttr(tagService.find(transaction, "alias"), {'disabled' : 'disabled'});
			}
		}
	},
	switchRecipient(){
		transaction.updateRecipient('new', '');
		tagService.setAttr(tagService.find(transaction, "removeRecipient"), {'style' : 'display: none;'});
		if(tagService.find(transaction, "switch").checked){
			tagService.setAttr(tagService.find(transaction, "recipients"), {'style' : 'display: block; width: 100%;'});
			tagService.setAttr(tagService.find(transaction, "pagekeys"), {'style' : 'display: none;'});
		}else{
			tagService.setAttr(tagService.find(transaction, "recipients"), {'style' : 'display: none;'});
			tagService.setAttr(tagService.find(transaction, "pagekeys"), {'style' : 'display: block;'});
			transaction.loadPagePublicKeys();
		}
	},
	sign : function(){
		transaction.call(stellarGate.sign, transaction.signed, transaction.onError);
	},
	signed : function(signature){
		transaction.toogleForm(true);
		tagService.cleanInfo(transaction);
		tagService.find(transaction, "signature").value = signature.toXDR("base64");
	},
	send : function(){
		tagService.setAttr(tagService.find(transaction, "send").parentNode, {'style' : 'display: none;'});
	
		transaction.call(stellarGate.sendOrCreate, transaction.sent, transaction.onError);
	},
	sent : function(){
		transaction.toogleForm(false);
		tagService.success(transaction, browserApi.i18n.getMessage("successSendXLM"));
		transaction.loadRecipients();
		stellarGate.getBalance(transaction.current.pubKey, transaction.displayBalance, transaction.balanceError);
	},
	call : function(stellarCall, success, error){
		let from = transaction.current.priKey;
		let alias = tagService.find(transaction, "alias").value;
		let to = tagService.find(transaction, "to").value;
		let amount = tagService.find(transaction, "amount").value;
		let memoType = tagService.find(transaction, "memoType option:checked").value;
		let memoValue = tagService.find(transaction, "memo").value;
		
		if(accountService.accounts().isValidPubKey(to)){
			if(alias != ''){
				recipientManager.push({id:alias, priKey:'', pubKey:to});
				transaction.updateRecipient(to, alias);
			}
			
			saveKeys(signing.getPassword());
			if(accountService.accounts().isValidPriKey(from)){
				stellarCall(from, to, amount, stellarGate.memo(memoType, memoValue), success, error);
			}else{
				tagService.error(transaction, browserApi.i18n.getMessage("errorSecretNotValid"));
			}
		}else{
			tagService.error(transaction, browserApi.i18n.getMessage("errorRecipientNotValid"));
		}
	},
	toogleForm(disable){
		let disabled = disable ? 'disabled' : '';
		tagService.setAttr(tagService.find(transaction, "switch"), {'disabled' : disabled});
		tagService.setAttr(tagService.find(transaction, "recipients"), {'disabled' : disabled, 'style' : 'display: block; width: 100%;'});
		tagService.setAttr(tagService.find(transaction, "pagekeys"), {'disabled' : disabled});
		tagService.setAttr(tagService.find(transaction, "to"), {'disabled' : disabled});
		tagService.setAttr(tagService.find(transaction, "alias"), {'disabled' : disabled});
		tagService.setAttr(tagService.find(transaction, "amount"), {'disabled' : disabled});
		tagService.setAttr(tagService.find(transaction, "memoType"), {'disabled' : disabled});
		tagService.setAttr(tagService.find(transaction, "memo"), {'disabled' : disabled});
		
		let displaySign = disable ? 'none' : 'block';
		tagService.setAttr(tagService.find(transaction, "sign").parentNode, {'style' : 'display: '+displaySign+';'});
		let displaySend = disable ? 'block' : 'none';
		tagService.setAttr(tagService.find(transaction, "signature").parentNode, {'style' : 'display: '+displaySend+';'});
		tagService.setAttr(tagService.find(transaction, "send").parentNode, {'style' : 'display: '+displaySend+';'});
		tagService.setAttr(tagService.find(transaction, "removeRecipient"), {'style' : 'display: none;'});
	},
	displayBalance(pubKey, balance){
		var node = tagService.find(transaction, 'balance');
		node.innerHTML = '';
		node.appendChild(tagService.text(Math.round(Number(balance))));
	},
	balanceError(pubKey, error){	
		let val = 'Error';
		if(error.data.status === 404){
			val = 0;
		}else{
			tagService.error(transaction, error.data.statusText);
		}
		var node = tagService.find(transaction, 'balance');
		node.innerHTML = '';
		node.appendChild(tagService.text(val));
	},
	onError(error){
		transaction.toogleForm(false);
		tagService.error(transaction, browserApi.i18n.getMessage("errorSendXLM"));
	}
}

interfaces.push(transaction.name);