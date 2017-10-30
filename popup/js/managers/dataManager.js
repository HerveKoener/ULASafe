var dataManager = {
	accounts: '',
	serverUrl : 'https://horizon.stellar.org',
	inflationPool : 'GBLL6VZVTOSY7NADKK7KHXZFS7HDPDN7TX6T3XN4YIQYYSVYTHMQ6HBE',
	isPublicNetwork : true,
	recipients : '',
	currency : 'USD',
	nonce : '',
	guardian : '',
	setData : function(data){
		if(data){
			dataManager.accounts = data.accounts || dataManager.accounts;
			dataManager.serverUrl = data.serverUrl || dataManager.serverUrl;
			dataManager.inflationPool = data.inflationPool || dataManager.inflationPool;
			dataManager.isPublicNetwork = data.isPublicNetwork || dataManager.isPublicNetwork;
			dataManager.recipients = data.recipients || dataManager.recipients;
			dataManager.currency = data.currency || dataManager.currency;
			dataManager.nonce = data.nonce ||  '';
			dataManager.guardian = data.guardian ||  '';
		}
	},
	getData : function(){
		return {
		  accounts: dataManager.accounts,
		  serverUrl : dataManager.serverUrl,
		  inflationPool : dataManager.inflationPool,
		  isPublicNetwork : dataManager.isPublicNetwork,
		  recipients : dataManager.recipients,
		  currency : dataManager.currency,
		  nonce : dataManager.nonce,
		  guardian : dataManager.guardian,
		}
	},
	save : function(){
		browserApi.storage.local.set({
			ULASafe: dataManager.getData()
		});
	},
}