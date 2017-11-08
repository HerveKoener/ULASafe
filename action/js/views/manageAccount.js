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
			var node = tagService.create("label", {'id': manageAccount.id+keyPair.pubKey, 'class' : 'checkbox'});
			node.appendChild(tagService.create("input", {'type': 'checkbox', 'value' : keyPair.pubKey}));
			
			var children = [
				tagService.create("input", {'type': 'text', 'value' : keyPair.id, 'class' : 'form-control'}),
				tagService.create("input", {'type': 'text', 'value' : keyPair.pubKey, 'class' : 'form-control'}),
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
		let inputs = tagService.findAll(manageAccount, "keys input[type='checkbox']");
		for(let i = 0; i < inputs.length; i++) {
			if(inputs[i].checked == true){
				accountService.accounts().remove(inputs[i].value);
			}
		}
		manageAccount.refreshKeys();
	},
	saveKeys : function() {
		let node = tagService.find(manageAccount, 'keys');
		accountService.accounts().clear();
		node.childNodes.forEach(function(child){
			let id = child.childNodes[1].value;
			let priKey = child.childNodes[3].value;
			let pubKey = (priKey !== '')?stellarGate.getPubKey(priKey):child.childNodes[2].value;
			accountService.accounts().push({id:id, priKey:priKey, pubKey:pubKey});
		});
		
		manageAccount.refreshKeys();
	},
	toKeyList : function(text){
		let str = text.split("");
		let keys = [];
		let key = '';
		let findNewKey = true;
		let counter = 0;
		for(let i =0; i < str.length; i++){
			let character = str[i];
			if(findNewKey && (character === 'G' || character === 'S')){
				findNewKey = false;
				key = character;
				counter=1;
			}else if(counter < 56){
				key+= character;
				counter++;
				if(counter == 56){
					keys.push(key);
					findNewKey = true;
				}
			}
		}
		return keys;
	},
	addKeys : function() {
		var newKeys = document.querySelector(pref(manageAccount.id, "new"));
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
		let inputs = document.querySelectorAll(pref(manageAccount.id, "keys input[type='checkbox']"));
		for(let i = 0; i < inputs.length; i++) {
			inputs[i].checked = true;
		}
	}
};

interfaces.push(manageAccount.name);