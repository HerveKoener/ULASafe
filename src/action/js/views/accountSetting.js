var accountSetting = {
	id : 'ac-',
	name : 'accountSetting',
	display : function(key){
		if(signing.isLocked()){
			signing.display(function(){accountSetting.display(key);});
		}else{
			hideAll();
			show(accountSetting.name);
			tagService.cleanInfo(accountSetting);
			
			accountService.unlock(signing.getPassword());
			let keyPair = accountService.accounts().create({pubKey:  key});
			keyPair = accountService.accounts().find(keyPair);
			tagService.setAttr(tagService.find(accountSetting, "inflation").parentNode, {'style' : ''});
			tagService.setAttr(tagService.find(accountSetting, "merge").parentNode, {'style' : ''});
			this.refreshSaveAccount(keyPair);
		}
	},
	refreshSaveAccount : function(keyPair){
		if(keyPair.inflation === securityService.getConfig().inflationPool){
			tagService.setAttr(tagService.find(accountSetting, "inflationForm"), {'style' : 'display: none;'});
		}else{
			tagService.setAttr(tagService.find(accountSetting, "inflationForm"), {'style' : ''});
		}
	
		let pubKey = (keyPair.pubKey !== '') ? keyPair.pubKey : keyPair.federation;
		tagService.find(accountSetting, "name").value = keyPair.id;
		tagService.find(accountSetting, "pubkey").value = pubKey;
		tagService.find(accountSetting, "prikey").value = keyPair.priKey;
	
		let pubKeyText = tagService.find(accountSetting, 'savePubKey');
		let pubKeyQr = tagService.find(accountSetting, 'savePubKeyQrcode');
		let priKeyText = tagService.find(accountSetting, 'savePriKey');
		let priKeyQr = tagService.find(accountSetting, 'savePriKeyQrcode');
		//let priKeyBrain = tagService.find(accountSetting, 'savePriKeyBrain');
		
		pubKeyText.innerHTML = '';
		pubKeyQr.innerHTML = '';
		priKeyText.innerHTML = '';
		priKeyQr.innerHTML = '';
		//priKeyBrain.innerHTML = '';
		
		pubKeyText.appendChild(tagService.text(pubKey));
		new QRCode(pubKeyQr, {text: pubKey, width: 200, height: 200}); 
		priKeyText.appendChild(tagService.text(keyPair.priKey));
		new QRCode(priKeyQr, {text: keyPair.priKey, width: 200, height: 200}); 

		//TODO priKeyBrai
		this.displayEmail(keyPair);
		saveKeys(signing.getPassword());
		
		accountSetting.displayOtherAccount();
	},
	displayEmail : function(keyPair) {
		let subject = tagService.find(accountSetting, 'email-subject').textContent;
		let body = tagService.find(accountSetting, 'email-body').innerHTML;
		tagService.setAttr(tagService.find(accountSetting, 'email'), {
			'href' : 'mailto:?subject='+subject+
					'&body='+
					encodeURIComponent(browserApi.i18n.getMessage("mailto", [body, (keyPair.pubKey !== '') ? keyPair.pubKey : keyPair.federation, keyPair.priKey]))
		});
	},
	displayOtherAccount : function(){
		var select = tagService.find(accountSetting, "mergeFrom");
		select.innerHTML = '';
		var current = tagService.find(accountSetting, "prikey").value;
		var otherAccounts = [];

		accountService.accounts().keyPairs.forEach(function(keyPair){
			if(keyPair.priKey !== '' && keyPair.priKey !== current){
				otherAccounts.push(keyPair);
			}
		});
		
		if(otherAccounts.length === 0){
			var node = tagService.create("option", {'value': 'noAccount'});
			node.appendChild(tagService.text(browserApi.i18n.getMessage("noAccount")));
			select.appendChild(node);
		}else{
			var node = tagService.create("option", {'value': 'noAccount'});
			node.appendChild(tagService.text(browserApi.i18n.getMessage("seeMore")));
			select.appendChild(node);
			
			otherAccounts.forEach(function(keyPair){
				if(keyPair.priKey !== '' && keyPair.priKey !== current){
					var node = tagService.create("option", {'value': keyPair.priKey});
					node.appendChild(tagService.text(keyPair.id));
					select.appendChild(node);
				}
			});
		}
	},
	print : function() {
		window.print();
	},
	saveKey : function() {
		let keyPair = accountService.accounts().create({
			id : tagService.find(accountSetting, "name").value,
			priKey : tagService.find(accountSetting, "prikey").value,
			pubKey : tagService.find(accountSetting, "pubkey").value
		});
		
		accountService.accounts().remove(keyPair);
		accountService.accounts().push(keyPair);
		
		accountSetting.refreshSaveAccount(keyPair);
	},
	inflation : function(){
		let priKey = tagService.find(accountSetting, "prikey").value;
		if(stellarGate.isValidPriKey(priKey)){
			tagService.setAttr(tagService.find(accountSetting, "inflation").parentNode, {'style' : 'display: none;'});
			stellarGate.joinInflationPool(priKey, accountSetting.joined, accountSetting.inflationError);
		}else{
			tagService.error(accountSetting, browserApi.i18n.getMessage("errorSecretNotValid"));
		}
	},
	joined(){
		tagService.setAttr(tagService.find(accountSetting, "inflation").parentNode, {'style' : ''});
		tagService.success(accountSetting, browserApi.i18n.getMessage("successJoinPool"));
		
		let keyPair = accountService.accounts().create({pubKey:  tagService.find(accountSetting, "pubkey").value});
		keyPair = accountService.accounts().find(keyPair);
		keyPair.inflation = securityService.getConfig().inflationPool;
		accountSetting.refreshSaveAccount(keyPair);
	},
	merge : function(){
		let from = tagService.find(accountSetting, 'mergeFrom', 'option:checked').value;
		if(from !== 'noAccount'){
			tagService.setAttr(tagService.find(accountSetting, "merge").parentNode, {'style' : 'display: none;'});
			
			stellarGate.findFederation(
				tagService.find(accountSetting, "pubkey").value,
				function(pubkey){
					stellarGate.merge(from, pubkey, accountSetting.merged, accountSetting.mergeError);
				},
				accountSetting.federationError
			);
		}
	},
	merged(){
		tagService.success(accountSetting, browserApi.i18n.getMessage("successMerge"));
		tagService.setAttr(tagService.find(accountSetting, "merge").parentNode, {'style' : ''});
		accountSetting.displayOtherAccount();
	},
	inflationError(error){
		tagService.error(accountSetting, browserApi.i18n.getMessage("errorJoinPool"));
		tagService.setAttr(tagService.find(accountSetting, "inflation").parentNode, {'style' : ''});
	},
	mergeError(error){
		tagService.error(accountSetting, browserApi.i18n.getMessage("errorMerge"));
		tagService.setAttr(tagService.find(accountSetting, "merge").parentNode, {'style' : ''});
	},
	federationError(address, error){
		tagService.error(accountSetting, browserApi.i18n.getMessage("errorFederation"));
		tagService.setAttr(tagService.find(accountSetting, "merge").parentNode, {'style' : ''});
		tagService.setAttr(tagService.find(accountSetting, "inflation").parentNode, {'style' : ''});
	}
};

interfaces.push(accountSetting.name);