var securityService = {
	init : function (data){
		dataService.init(data);
	},
	isActive : function(){
		return dataService.nonce !== '';
	},
	check : function(password){
		return !this.isActive() || 'guardian' === this._decrypt(dataService.guardian, password);
	},
	setPublicData : function(data){
		if(data){
			dataService.roAccounts = data.roAccounts;
			dataService.recipients = data.recipients;
		}
	},
	getPublicData : function(){
		return {
		  roAccounts: dataService.roAccounts,
		  recipients : dataService.recipients,
		}
	},
	setPrivateData : function(data, password){
		if(data){
			dataService.rwAccounts = this._encrypt(data.rwAccounts, password);
		}
	},
	getPrivateData : function(password){
		return {
			rwAccounts: this._decrypt(dataService.rwAccounts, password),
		}
	},
	setConfig : function(data){
		if(data){
			dataService.serverUrl = data.serverUrl;
			dataService.isPublicNetwork = data.isPublicNetwork;
			dataService.passphrase = data.passphrase;
			dataService.inflationPool = data.inflationPool;
			dataService.currency = data.currency;
		}
	},
	getConfig : function(){
		return {
		  serverUrl : dataService.serverUrl,
		  isPublicNetwork : dataService.isPublicNetwork,
		  passphrase : dataService.passphrase,
		  inflationPool : dataService.inflationPool,
		  currency : dataService.currency,
		}
	},
	changePassword : function(oldPassword, newPassword){
		if(this.check(oldPassword)){
			let data = this.getPrivateData(oldPassword);
			
			if(newPassword === ''){
				dataService.nonce = '';
				dataService.guardian = 'guardian';
			}else{
				dataService.nonce = stellarGate.genPriKey();
				dataService.guardian = this._encrypt('guardian', newPassword);
			}
			
			this.setPrivateData(data, newPassword);
			return true;
		}
		return false;
	},
	save : function(){
		browserApi.storage.local.set({
			ULASafe: dataService.getData()
		});
	},
	_encrypt : function(data, password){
		if(this.isActive()){
			let key = this._stringToUint8Array(password, dataService.nonce, 32);
			let nonce = this._stringToUint8Array(dataService.nonce, '', 24);
			let cryptedData = this._stringToUint8Array(data, '',data.length);
			
			return this._toHex(nacl.secretbox(cryptedData, nonce, key));
		}
		
		return data;
	},
	_decrypt : function(data, password){
		if(data !== '' && this.isActive()){
			let key = this._stringToUint8Array(password, dataService.nonce, 32);
			let nonce = this._stringToUint8Array(dataService.nonce, '', 24);
			return new TextDecoder("utf-8").decode(nacl.secretbox.open(this._fromHex(data), nonce, key));
		}
		
		return data;
	},
	_stringToUint8Array : function(str, pad, length){
		return new TextEncoder("utf-8").encode(str+pad).slice(0,length);
	},
	_toHex : function(byteArray) {
	  return Array.from(byteArray, function(byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2);
	  }).join('');
	},
	_fromHex : function(str) { 
		return Uint8Array.from(str.match(/.{2}/g), function(val) {return parseInt(val, 16)});
	}
}