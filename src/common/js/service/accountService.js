var accountService = {
	_accounts : (new KeyPairManager()),
	_readOnly : undefined,
	lock : function(){
		if(this._readOnly !== true){
			let data = securityService.getPublicData();
			this._accounts.init(data.roAccounts);
			this._readOnly = true;
		}
	},
	unlock : function(password){
		if(this._readOnly === true){
			let data = securityService.getPrivateData(password);
			this._accounts.init(data.rwAccounts);
			this._readOnly = false;
		}
	},
	accounts : function(){
		return this._accounts;
	}
};