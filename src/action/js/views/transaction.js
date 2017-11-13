var transaction = {
	id : 't-',
	name : 'transaction',
	current : null,
	display : function(key){
		if(signing.isLocked()){
			signing.display(function(){transaction.display(key);});
		}else{
			accountService.unlock(signing.getPassword());
			transaction.displayForm(key);
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
	displayForm : function(key){
		hideAll();
		show(transaction.name);
		tagService.cleanInfo(transaction);
		
		tagService.setAttr(tagService.find(transaction, "pagekeys"), {'style' : 'display: none;'});
		transaction.toogleForm(false);
		
		let from = tagService.find(transaction, "from");
		from.innerHTML = '';
		
		let keyPair = accountService.accounts().create({pubKey : key});
		keyPair = accountService.accounts().find(keyPair);
		if(keyPair){
			
			var abbr = tagService.create("abbr", {'id': transaction.id + key, 'title': key});
			abbr.appendChild(tagService.text(keyPair.id));
			from.appendChild(abbr);

			stellarGate.findFederation(
				key,
				function(pubKey){
					stellarGate.getBalance(pubKey, function(balance){transaction.displayBalance(key, balance);}, function(error){transaction.balanceError(key, error);});
				},
				transaction.federationError
			);
		}
		
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
			let key = (keyPair.pubKey !== '') ? keyPair.pubKey : keyPair.federation;
			var node = tagService.create("option", {'value': key});
			node.appendChild(tagService.text(keyPair.id));
			tagService.addEvent(node, 'click', function(){transaction.selectRecipient(key);});
			recipientsSelect.appendChild(node);
		});
	},
	selectRecipient : function(key){
		let alias = '';
		if(key !== 'new'){
			let keyPair = recipientManager.create({pubKey : key});
			keyPair = recipientManager.find(keyPair);
			alias = keyPair.id;
			tagService.setAttr(tagService.find(transaction, "removeRecipient"), {'style' : 'display: inline;'});
			tagService.setAttr(tagService.find(transaction, "recipients"), {'style' : 'display: inline-block; width: 85%;'});
		}else{
			tagService.setAttr(tagService.find(transaction, "recipients"), {'style' : 'display: block; width: 100%;'});
			tagService.setAttr(tagService.find(transaction, "removeRecipient"), {'style' : 'display: none;'});
		}
		transaction.updateRecipient(key, alias);
	},
	removeRecipient : function(){
		let to = tagService.find(transaction, "to").value;
		let keyPair = recipientManager.create({pubKey : to});
		recipientManager.remove(keyPair);
		transaction.selectRecipient('new');
		saveKeys(signing.getPassword());
		transaction.loadRecipients();
	},
	updateRecipient(key, alias){
		if(key === 'new'){
			tagService.find(transaction, "to").value = '';
			tagService.setAttr(tagService.find(transaction, "to"), {'disabled' : ''});
			tagService.find(transaction, "alias").value = '';
			tagService.setAttr(tagService.find(transaction, "alias"), {'disabled' : ''});
		}else{
			tagService.find(transaction, "to").value = key;
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
		transaction.call(stellarGate.sign, transaction.signed, transaction.sendError);
	},
	signed : function(signature){
		transaction.toogleForm(true);
		tagService.cleanInfo(transaction);
		tagService.find(transaction, "signature").value = signature.toXDR("base64");
	},
	send : function(){
		tagService.setAttr(tagService.find(transaction, "send").parentNode, {'style' : 'display: none;'});
	
		transaction.call(stellarGate.sendOrCreate, transaction.sent, transaction.sendError);
	},
	sent : function(){
		transaction.toogleForm(false);
		tagService.success(transaction, browserApi.i18n.getMessage("successSendXLM"));
		transaction.loadRecipients();
		var key = (transaction.current.pubKey !== '') ? transaction.current.pubKey : transaction.current.federation;
		stellarGate.findFederation(
			key,
			function(pubKey){
				stellarGate.getBalance(pubKey, function(balance){transaction.displayBalance(key, balance);}, function(error){transaction.balanceError(key, error);});
			},
			transaction.federationError
		);
	},
	call : function(stellarCall, success, error){
		let from = transaction.current.priKey;
		let alias = tagService.find(transaction, "alias").value;
		let to = tagService.find(transaction, "to").value;
		let amount = tagService.find(transaction, "amount").value;
		let memoType = tagService.find(transaction, "memoType", "option:checked").value;
		let memoValue = tagService.find(transaction, "memo").value;
		
		if(stellarGate.isValidPubKey(to) || stellarGate.isValidFederation(to)){
			if(alias != ''){
				let keyPair = accountService.accounts().create({
					id : alias,
					priKey : '',
					pubKey : to
				});
				recipientManager.push(keyPair);
				transaction.updateRecipient(to, alias);
			}
			
			saveKeys(signing.getPassword());
			if(stellarGate.isValidPriKey(from)){
				stellarGate.findFederation(
					to,
					function(pubKey){
						stellarCall(from, pubKey, amount, stellarGate.memo(memoType, memoValue), success, error);
					},
					transaction.federationError
				);
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
	sendError(error){
		transaction.toogleForm(false);
		tagService.error(transaction, browserApi.i18n.getMessage("errorSendXLM"));
	},
	federationError(address, error){
		transaction.toogleForm(false);
		tagService.error(transaction, browserApi.i18n.getMessage("errorFederation"));
	}
}

interfaces.push(transaction.name);