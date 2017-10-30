class KeyPairManager {
	constructor(){
		this.keyPairs = [];
	}
	init(text){
		this.keyPairs = [];
		let str = text.split("|");
		for(let i =1; i < str.length; i++){
			let start = 0;
			let priKey = (str[i][0] === 'S')?str[i].substring(start, 56):'';
			start = (priKey.length>0)?priKey.length-1:0;
			let pubKey = str[i].substring(start, priKey.length+56);
			start = (priKey.length>0)?priKey.length+pubKey.length-1:pubKey.length;
			let id = str[i].substring(start, str[i].length);
			this.keyPairs.push({id:id, priKey: priKey, pubKey:pubKey});
		}
	}
	toText(){
		let text = '';
		this.keyPairs.forEach(function(record){
			text += '|' + record.priKey + record.pubKey + record.id;
		});	
		return text;
	}
	add(key){
		if(key[0] !== 'G' && key[0] !== 'S'){
			return;
		}
	
		let pubKey = (key[0] === 'G')? key: stellarGate.getPubKey(key);
		let priKey = (key[0] === 'G')? '': key;
		var found = false;
		
		this.keyPairs.forEach(function(record){
			if(record.pubKey === pubKey){
				if(priKey !== ''){
					record.priKey = priKey;
				}
				found = true;
				return;
			}
		});	
		
		if(!found){
			this.keyPairs.push({id: key.substring(1, 6), priKey: priKey, pubKey: pubKey});
		}
	}
	remove(pubKey){
		let tempKeyPairs = [];
		this.keyPairs.forEach(function(keyPair){
			if(keyPair.pubKey != pubKey){
				tempKeyPairs.push(keyPair);
			}
		});	
		this.keyPairs = tempKeyPairs;
	}
	find(pubKey){
		for(let i = 0 ; i < this.keyPairs.length; i++){
			if(this.keyPairs[i].pubKey === pubKey){
				return this.keyPairs[i];
			}
		}
	}
	push(keyPair){
		this.keyPairs.push(keyPair);
	}
	clear(){
		this.keyPairs = [];
	}
	isValidPriKey(priKey){
		return (priKey && priKey[0] === 'S' && priKey.length == 56);
	}
	isValidPubKey(priKey){
		return (priKey && priKey[0] === 'G' && priKey.length == 56);
	}
};

var accountManager = new KeyPairManager();
var recipientManager = new KeyPairManager();