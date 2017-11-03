var accountSetting = {
	id : 'ac-',
	name : 'accountSetting',
	display : function(pubKey){
		if(signing.isLocked()){
			signing.display(function(){accountSetting.display(pubKey);});
		}else{
			hideAll();
			show(accountSetting.name);
			tagManager.cleanInfo(accountSetting);
			
			accountManager.unlock(signing.getPassword());
			let keyPair = accountManager.accounts().find(pubKey);
			this.refreshSaveAccount(keyPair);
		}
	},
	refreshSaveAccount : function(keyPair){
		tagManager.find(accountSetting, "name").value = keyPair.id;
		tagManager.find(accountSetting, "pubkey").value = keyPair.pubKey;
		tagManager.find(accountSetting, "prikey").value = keyPair.priKey;
	
		let pubKeyText = tagManager.find(accountSetting, 'savePubKey');
		let pubKeyQr = tagManager.find(accountSetting, 'savePubKeyQrcode');
		let priKeyText = tagManager.find(accountSetting, 'savePriKey');
		let priKeyQr = tagManager.find(accountSetting, 'savePriKeyQrcode');
		//let priKeyBrain = tagManager.find(accountSetting, 'savePriKeyBrain');
		
		pubKeyText.innerHTML = '';
		pubKeyQr.innerHTML = '';
		priKeyText.innerHTML = '';
		priKeyQr.innerHTML = '';
		//priKeyBrain.innerHTML = '';
		
		pubKeyText.appendChild(tagManager.text(keyPair.pubKey));
		new QRCode(pubKeyQr, {text: keyPair.pubKey, width: 200, height: 200}); 
		priKeyText.appendChild(tagManager.text(keyPair.priKey));
		new QRCode(priKeyQr, {text: keyPair.priKey, width: 200, height: 200}); 

		//TODO priKeyBrai
		this.displayEmail(keyPair);
		saveKeys(signing.getPassword());
	},
	displayEmail : function(keyPair) {
		let subject = tagManager.find(accountSetting, 'email-subject').textContent;
		let body = tagManager.find(accountSetting, 'email-body').innerHTML;
		tagManager.setAttr(tagManager.find(accountSetting, 'email'), {
			'href' : 'mailto:?subject='+subject+
					'&body='+
					encodeURIComponent(browserApi.i18n.getMessage("mailto", [body, keyPair.pubKey, keyPair.priKey]))
		});
	},
	print : function() {
		window.print();
	},
	saveKey : function() {
		let id = tagManager.find(accountSetting, "name").value;
		let priKey = tagManager.find(accountSetting, "prikey").value;
		let pubKey = (priKey !== '')?stellarGate.getPubKey(priKey):tagManager.find(accountSetting, "pubkey").value;
		
		let keyPair = {id:id, priKey:priKey, pubKey:pubKey};
		
		accountManager.accounts().remove(pubKey);
		accountManager.accounts().push(keyPair);
		
		accountSetting.refreshSaveAccount(keyPair);
	},
	inflation : function(){
		let priKey = tagManager.find(accountSetting, "prikey").value;
		if(accountManager.accounts().isValidPriKey(priKey)){
			stellarGate.joinInflationPool(priKey, accountSetting.joined, accountSetting.onError);
		}else{
			tagManager.error(accountSetting, browserApi.i18n.getMessage("errorSecretNotValid"));
		}
	},
	joined(){
		tagManager.info(accountSetting, browserApi.i18n.getMessage("successJoinPool"));
	},
	onError(error){
		console.log(error);
		tagManager.error(accountSetting, browserApi.i18n.getMessage("errorJoinPool"));
	}
};

interfaces.push(accountSetting.name);