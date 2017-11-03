var accountManager = {
	_accounts : (new KeyPairManager()),
	_readOnly : null,
	lock : function(){
		if(!this._readOnly){
			let data = securityManager.getPublicData();
			this._accounts.init(data.roAccounts);
			this._readOnly = true;
		}
	},
	unlock : function(password){
		if(this.readOnly){
			let data = securityManager.getPrivateData(password);
			this._accounts.init(data.rwAccounts);
			this._readOnly = false;
		}
	},
	accounts : function(){
		return this._accounts;
	}
};