var stellarGate = {
	server : null,
	inflationPool: null,
	init : function(serverUrl, isPublicNetwork, inflationPool){
		this.server = new StellarSdk.Server(serverUrl);
		this.inflationPool = inflationPool;
		if(isPublicNetwork){
			StellarSdk.Network.usePublicNetwork(); 
		}else{
			StellarSdk.Network.useTestNetwork();
		}
	},
	getBalance : function(pubKey, success, error){
		stellarGate.server.loadAccount(pubKey)
			.then(function(account){
				success(pubKey, account.balances[0].balance);
			})
			.catch(function(exception){
				error(pubKey, exception);
			});
	},
	joinInflationPool : function(priKey, success, error){
		var keypair = StellarSdk.Keypair.fromSecret(priKey);
		let publicKey = keypair.publicKey();
		stellarGate.server.loadAccount(publicKey)
			.then(function(account){
				let transaction = new StellarSdk.TransactionBuilder(account)
					.addOperation(StellarSdk.Operation.setOptions({
						inflationDest: stellarGate.inflationPool,
					})).build();
				transaction.sign(keypair);
				
				return stellarGate.server.submitTransaction(transaction)
					.then(success)
					.catch(error);
			})
			.catch(error);
	},
	send : function(priKey, destination, amount, memo, success, error){
		var keypair = StellarSdk.Keypair.fromSecret(priKey);
		let publicKey = keypair.publicKey();
		stellarGate.server.loadAccount(publicKey)
			.then(function(account){
				let builder = new StellarSdk.TransactionBuilder(account)
					.addOperation(StellarSdk.Operation.payment({
						destination: destination,
						asset: StellarSdk.Asset.native(),
						amount: amount.toString(),
					}));
				if(memo){
					builder = builder.addMemo(memo);
				}
				let transaction = builder.build();
				transaction.sign(keypair);
				
				return stellarGate.server.submitTransaction(transaction)
					.then(success)
					.catch(error);
			})
			.catch(error);
	},
	memo : function(type, value){
		switch(type){
			case 'text' : return StellarSdk.Memo.text(value);
			case 'hash' : return StellarSdk.Memo.hash(value);
			case 'id' : return StellarSdk.Memo.id(value);
			case 'return' : return StellarSdk.Memo.returnHash(value);
			default: return StellarSdk.Memo.none();
		}
	},
	genPriKey : function(){
		let keypair = StellarSdk.Keypair.random(); 
		return keypair.secret();
	},
	getPubKey : function(priKey){
		let keypair = StellarSdk.Keypair.fromSecret(priKey);
		return keypair.publicKey();
	}
}