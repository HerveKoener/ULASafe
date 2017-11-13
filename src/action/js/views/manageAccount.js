var manageAccount = {
	id : 'ma-',
	name : 'manageAccount',
	display : function(){
		if(signing.isLocked()){
			signing.display(function(){manageAccount.display();});
		}else{
			hideAll();
			show(manageAccount.name);
			tagService.cleanInfo(manageAccount);
			
			accountService.unlock(signing.getPassword());
			manageAccount.refreshKeys();
		}
	},
	refreshKeys : function(){
		var keysDiv = tagService.find(manageAccount, "keys");
		keysDiv.innerHTML = '';
		accountService.accounts().keyPairs.forEach(function(keyPair){	
			var pubKey = (keyPair.pubKey !== '') ? keyPair.pubKey : keyPair.federation;
			var node = tagService.create("label", {'id': manageAccount.id+pubKey, 'class' : 'checkbox'});
			node.appendChild(tagService.create("input", {'type': 'checkbox', 'value' : pubKey}));
			
			var children = [
				tagService.create("input", {'type': 'text', 'value' : keyPair.id, 'class' : 'form-control'}),
				tagService.create("input", {'type': 'text', 'value' : pubKey, 'class' : 'form-control'}),
				tagService.create("input", {'type': 'text', 'value' : keyPair.priKey, 'class' : 'form-control'})
			];
			
			children.forEach(function(child){
				tagService.addEvent(child, 'blur', manageAccount.saveKeys);
				node.appendChild(child);
			});
			keysDiv.appendChild(node);
		});
		
		saveKeys(signing.getPassword());
	},
	removeKeys : function() {
		let inputs = tagService.findAll(manageAccount, 'keys', "input[type='checkbox']");
		for(let i = 0; i < inputs.length; i++) {
			if(inputs[i].checked == true){
				let keyPair = accountService.accounts().create({pubKey : inputs[i].value});
				accountService.accounts().remove(keyPair);
			}
		}
		manageAccount.refreshKeys();
	},
	saveKeys : function() {
		let node = tagService.find(manageAccount, 'keys');
		accountService.accounts().clear();
		node.childNodes.forEach(function(child){
			let keyPair = accountService.accounts().create({
				id : child.childNodes[1].value,
				priKey : child.childNodes[3].value,
				pubKey : child.childNodes[2].value
			});
			accountService.accounts().push(keyPair);
		});
		
		manageAccount.refreshKeys();
	},
	toKeyList : function(text){
		let keys = new Set();
		let rg = '(' + stellarGate.priKeyRegex() + ')|(' + stellarGate.pubKeyRegex() + ')|(' + stellarGate.federatioRegex()+')';
		var regex = new RegExp(rg, 'g');
		let match = regex.exec(text);
		
		while (match != null) {
		  keys.add(match[0]);
		  match = regex.exec(text);
		}
		
		return keys;
	},
	addKeys : function() {
		var newKeys = tagService.find(manageAccount, 'new');
		let keys = manageAccount.toKeyList(newKeys.value);
		keys.forEach(function(key){
			accountService.accounts().add(key);
		});
		manageAccount.refreshKeys();
		newKeys.value = '';
	},
	createKey : function() {
		accountService.accounts().add(stellarGate.genPriKey());
		manageAccount.refreshKeys();
	},
	selectAll : function() {
		let inputs = tagService.findAll(manageAccount, 'keys', "input[type='checkbox']");
		for(let i = 0; i < inputs.length; i++) {
			inputs[i].checked = true;
		}
	}
};

interfaces.push(manageAccount.name);