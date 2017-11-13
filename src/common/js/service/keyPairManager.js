class KeyPairManager {
	constructor(){
		this.keyPairs = [];
	}
	init(text){
		this.clear();
		let str = text.split("|");
		for(let i =1; i < str.length; i++){
			/*
			this.oldInit(str[i]);
			/*/
				let first = str[i][0];
				if(first === '{'){
					this._newInit(str[i]);
				}else{
					this._oldInit(str[i]);
				}
			//*/
		}
	}
	_oldInit(str){
		let start = 0;
		let priKey = (str[0] === 'S')?str.substring(start, 56):'';
		start = (priKey.length>0)?priKey.length:0;
		let pubKey = str.substring(start, priKey.length+56);
		start = (priKey.length>0)?priKey.length+pubKey.length:pubKey.length;
		let id = str.substring(start, str.length);
		this.keyPairs.push({id:id, priKey: priKey, pubKey:pubKey, federation: '', inflation: ''});
	}
	_newInit(str){
		this.keyPairs.push(JSON.parse(str));
	}
	toText(){
		let text = '';
		this.keyPairs.forEach(function(record){
			text += '|' + JSON.stringify(record);
		});	
		return text;
	}
	exportPubKey(){
		let text = '';
		this.keyPairs.forEach(function(record){
			text += '|' + JSON.stringify({id: record.id, priKey: '', pubKey: record.pubKey, federation: record.federation, inflation: record.inflation});
		});	
		return text;
	}
	add(key){
		this._addPubKey(key);
		this._addPriKey(key);
		this._addFederation(key);
	}
	_addPubKey(key){
		if(!stellarGate.isValidPubKey(key)){
			return;
		}
		
		for(let i=0; i<this.keyPairs.length; i++){
			let record = this.keyPairs[i];
			if(record.pubKey === key){
				record.federation = '';
				return;
			}
		}
		
		this.keyPairs.push({id: key.substring(1, 6), priKey: '', pubKey: key, federation: '', inflation: ''});
	}
	_addPriKey(key){
		if(!stellarGate.isValidPriKey(key)){
			return;
		}
		let pubKey = stellarGate.getPubKey(key);
		
		for(let i=0; i<this.keyPairs.length; i++){
			let record = this.keyPairs[i];
			if(record.pubKey === pubKey){
				record.priKey = key;
				return;
			}
		}
		
		this.keyPairs.push({id: key.substring(1, 6), priKey: key, pubKey: pubKey, federation:'', inflation: ''});
	}
	_addFederation(key){
		if(!stellarGate.isValidFederation(key)){
			return;
		}
		
		for(let i=0; i<this.keyPairs.length; i++){
			let record = this.keyPairs[i];
			if(record.federation === key){
				record.pubKey = '';
				return;
			}
		}
		
		this.keyPairs.push({id: key.substring(0, 20), priKey: '', pubKey: '', federation: key, inflation: ''});
	}
	remove(keyPair){
		let tempKeyPairs = [];
		for(let i=0; i<this.keyPairs.length; i++){
			let key = this.keyPairs[i];
			if(!this._isSame(key, keyPair)){
				tempKeyPairs.push(key);
			}
		}
		this.keyPairs = tempKeyPairs;
	}
	find(keyPair){
		for(let i=0; i<this.keyPairs.length; i++){
			let key = this.keyPairs[i];
			if(this._isSame(key, keyPair)){
				return key;
			}
		}

		return undefined;
	}
	_isSame(first, second){
		if(first.pubKey === '' && second.pubKey === ''){
			return first.federation === second.federation;
		}else{
			return first.pubKey === second.pubKey;
		}
	}
	push(keyPair){
		if(!this.find(keyPair)){
			this.keyPairs.push(keyPair);
		}
	}
	clear(){
		this.keyPairs = [];
	}
	create(key){
		let pubKey = (key.priKey && key.priKey !== '')
			? stellarGate.getPubKey(key.priKey)
			: key.pubKey;
	
		let keyPair = {
			id: key.id || '',
			priKey: key.priKey || '',
			pubKey: pubKey || '',
			federation: '',
			inflation: key.inflation || ''
		};
		
		if(! stellarGate.isValidPubKey(keyPair.pubKey)){
			keyPair.pubKey = '';
			keyPair.federation = (key.federation && key.federation !== '') ? key.federation : pubKey;
		}
		
		return keyPair;
	}
};

var recipientManager = new KeyPairManager();