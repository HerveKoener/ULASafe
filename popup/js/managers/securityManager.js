var securityManager = {
	init : function (data){
		dataManager.init(data);
	},
	isActive : function(){
		return dataManager.nonce !== '';
	},
	check : function(password){
		return !this.isActive() || 'guardian' === this._decrypt(dataManager.guardian, password);
	},
	setPublicData : function(data){
		if(data){
			dataManager.roAccounts = data.roAccounts;
			dataManager.recipients = data.recipients;
		}
	},
	getPublicData : function(){
		return {
		  roAccounts: dataManager.roAccounts,
		  recipients : dataManager.recipients,
		}
	},
	setPrivateData : function(data, password){
		if(data){
			dataManager.rwAccounts = this._crypt(data.rwAccounts, password);
		}
	},
	getPrivateData : function(password){
		return {
			rwAccounts: this._decrypt(dataManager.rwAccounts, password),
		}
	},
	setConfig : function(data){
		if(data){
			dataManager.serverUrl = data.serverUrl;
			dataManager.isPublicNetwork = data.isPublicNetwork;
			dataManager.inflationPool = data.inflationPool;
			dataManager.currency = data.currency;
		}
	},
	getConfig : function(){
		return {
		  serverUrl : dataManager.serverUrl,
		  isPublicNetwork : dataManager.isPublicNetwork,
		  inflationPool : dataManager.inflationPool,
		  currency : dataManager.currency,
		}
	},
	changePassword : function(oldPassword, newPassword){
		if(this.check(oldPassword)){
			let data = this.getPrivateData(oldPassword);
			
			if(newPassword === ''){
				dataManager.nonce = '';
				dataManager.guardian = 'guardian';
			}else{
				dataManager.nonce = stellarGate.genPriKey();
				dataManager.guardian = this._crypt('guardian', newPassword);
			}
			
			this.setPrivateData(data, newPassword);
			return true;
		}
		return false;
	},
	save : function(){
		browserApi.storage.local.set({
			ULASafe: dataManager.getData()
		});
	},
	_crypt : function(data, password){
		if(this.isActive()){
			let key = this._stringToUint8Array(password, dataManager.nonce, 32);
			let nonce = this._stringToUint8Array(dataManager.nonce, '', 24);
			let cryptedData = this._stringToUint8Array(data, '',data.length);
			
			return this._toHex(nacl.secretbox(cryptedData, nonce, key));
		}
		
		return data;
	},
	_decrypt : function(data, password){
		if(data !== '' && this.isActive()){
			let key = this._stringToUint8Array(password, dataManager.nonce, 32);
			let nonce = this._stringToUint8Array(dataManager.nonce, '', 24);
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