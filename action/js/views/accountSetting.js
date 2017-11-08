var accountSetting = {
	id : 'ac-',
	name : 'accountSetting',
	display : function(pubKey){
		if(signing.isLocked()){
			signing.display(function(){accountSetting.display(pubKey);});
		}else{
			hideAll();
			show(accountSetting.name);
			tagService.cleanInfo(accountSetting);
			
			accountService.unlock(signing.getPassword());
			let keyPair = accountService.accounts().find(pubKey);
			this.refreshSaveAccount(keyPair);
		}
	},
	refreshSaveAccount : function(keyPair){
		tagService.find(accountSetting, "name").value = keyPair.id;
		tagService.find(accountSetting, "pubkey").value = keyPair.pubKey;
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
		
		pubKeyText.appendChild(tagService.text(keyPair.pubKey));
		new QRCode(pubKeyQr, {text: keyPair.pubKey, width: 200, height: 200}); 
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
					encodeURIComponent(browserApi.i18n.getMessage("mailto", [body, keyPair.pubKey, keyPair.priKey]))
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
			var node = tagService.create("option", {'value': ''});
			node.appendChild(tagService.text(browserApi.i18n.getMessage("noAccount")));
			select.appendChild(node);
		}else{
			var node = tagService.create("option", {'value': ''});
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
		let id = tagService.find(accountSetting, "name").value;
		let priKey = tagService.find(accountSetting, "prikey").value;
		let pubKey = (priKey !== '')?stellarGate.getPubKey(priKey):tagService.find(accountSetting, "pubkey").value;
		
		let keyPair = {id:id, priKey:priKey, pubKey:pubKey};
		
		accountService.accounts().remove(pubKey);
		accountService.accounts().push(keyPair);
		
		accountSetting.refreshSaveAccount(keyPair);
	},
	inflation : function(){
		let priKey = tagService.find(accountSetting, "prikey").value;
		if(accountService.accounts().isValidPriKey(priKey)){
			stellarGate.joinInflationPool(priKey, accountSetting.joined, accountSetting.onError);
		}else{
			tagService.error(accountSetting, browserApi.i18n.getMessage("errorSecretNotValid"));
		}
	},
	joined(){
		tagService.info(accountSetting, browserApi.i18n.getMessage("successJoinPool"));
	},
	merge : function(){
		let from = tagService.find(accountSetting, "mergeFrom option:checked").value;
		if(from !== ''){
			stellarGate.merge(from, tagService.find(accountSetting, "pubkey").value, accountSetting.merged, accountSetting.mergeError);
		}
	},
	merged(){
		tagService.info(accountSetting, browserApi.i18n.getMessage("successMerge"));
		accountSetting.displayOtherAccount();
	},
	onError(error){
		console.log(error);
		tagService.error(accountSetting, browserApi.i18n.getMessage("errorJoinPool"));
	},
	mergeError(error){
		console.log(error);
		tagService.error(accountSetting, browserApi.i18n.getMessage("errorMerge"));
	}
};

interfaces.push(accountSetting.name);