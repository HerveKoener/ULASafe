var stellarGate = {
	server : null,
	inflationPool: null,
	init : function(config){
		this.server = new StellarSdk.Server(config.serverUrl);
		this.inflationPool = config.inflationPool;
		if(config.isPublicNetwork){
			StellarSdk.Network.usePublicNetwork(); 
		}else{
			StellarSdk.Network.useTestNetwork();
		}
		if(config.passphrase && config.passphrase !== ""){
			StellarSdk.Network.use(new StellarSdk.Network(config.passphrase)); 
		}
	},
	findFederation : function(address, success, error){
		if(this.isValidPubKey(address)){
			success(address);
		}else if(this.isValidFederation(address)){
			let server =address.split("*")[1];
			var xmlhttp = new XMLHttpRequest();

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				   if (xmlhttp.status == 200) {
						success(JSON.parse(xmlhttp.responseText).account_id);
				   }else {
					   error(address, {data : xmlhttp});
				   }
				}
			};
			xmlhttp.open("GET", 'https://' + server + '/federation?q=' + encodeURIComponent(address) + '&type=name', true);
			xmlhttp.send();
		}else{
			error(address, {data : { status : 404, statusText : 'Federation address not found' }});
		}
	},
	getBalance : function(pubKey, success, error){
		stellarGate.server.loadAccount(pubKey)
			.then(function(account){
				success(account.balances[0].balance);
			})
			.catch(function(exception){
				error(exception);
			});
	},
	merge : function(fromPriKey, toPubKey, success, error){
		var keypair = StellarSdk.Keypair.fromSecret(fromPriKey);
		let publicKey = keypair.publicKey();
		stellarGate.server.loadAccount(publicKey)
			.then(function(account){
				let transaction = new StellarSdk.TransactionBuilder(account)
					.addOperation(StellarSdk.Operation.accountMerge({
						destination: toPubKey,
					})).build();
				transaction.sign(keypair);
				
				return stellarGate.server.submitTransaction(transaction)
					.then(success)
					.catch(error);
			})
			.catch(error);
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
	sign : function(priKey, destination, amount, memo, success, error){
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
				success(transaction.toEnvelope());
			})
			.catch(error);
	},
	sendTransaction : function(envelope, success, error){
		let transaction = new Transaction(envelope);
		return stellarGate.server.submitTransaction(transaction)
			.then(success)
			.catch(error);
	},
	sendOrCreate : function(priKey, destination, amount, memo, success, error){
		stellarGate.server.loadAccount(destination)
			.then(function() {
				stellarGate.send(priKey, destination, amount, memo, success, error);
				next();
			})
			.catch(StellarSdk.NotFoundError, function (e) {
				stellarGate.create(priKey, destination, amount, memo, success, error);
				next();
			});
	},
	create : function(priKey, destination, amount, memo, success, error){
		var keypair = StellarSdk.Keypair.fromSecret(priKey);
		let publicKey = keypair.publicKey();
		stellarGate.server.loadAccount(publicKey)
			.then(function(account){
				let builder = new StellarSdk.TransactionBuilder(account)
					.addOperation(StellarSdk.Operation.createAccount({
						destination: destination,
						asset: StellarSdk.Asset.native(),
						startingBalance: amount.toString(),
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
	},
	isValidPriKey(priKey){
		return (priKey && (new RegExp(stellarGate.priKeyRegex())).test(priKey));
	},
	isValidPubKey(pubKey){
		return (pubKey && (new RegExp(stellarGate.pubKeyRegex())).test(pubKey));
	},
	isValidFederation(address){
		if(!address && address.split("*").length != 2){
			return false;
		}
		return (new RegExp(stellarGate.federatioRegex())).test(address);
	},
	priKeyRegex(){
		return 'S[A-Z|0-9]{55}';
	},
	pubKeyRegex(){
		return 'G[A-Z|0-9]{55}';
	},
	federatioRegex(){
		return '[^\\s<\\*>]+\\*[^\\*\\s\\/&$\\.\\?#]+\\.[^\\*\\s\\/$&\\?#]+';
	}
}