var dataManager = {
	serverUrl : 'https://horizon.stellar.org',
	isPublicNetwork : true,
	inflationPool : 'GBLL6VZVTOSY7NADKK7KHXZFS7HDPDN7TX6T3XN4YIQYYSVYTHMQ6HBE',
	currency : 'USD',
	nonce : '',
	guardian : '',
	roAccounts: '',
	rwAccounts: '',
	recipients : '',
	init : function (data){
		this.setData(data);
	},
	setData : function(data){
		if(data){
			dataManager.serverUrl = data.serverUrl || dataManager.serverUrl;
			dataManager.isPublicNetwork = data.isPublicNetwork || dataManager.isPublicNetwork;
			dataManager.inflationPool = data.inflationPool || dataManager.inflationPool;
			dataManager.currency = data.currency || dataManager.currency;
			dataManager.nonce = data.nonce ||  dataManager.nonce;
			dataManager.guardian = data.guardian ||  dataManager.guardian;
			dataManager.roAccounts = data.roAccounts || dataManager.roAccounts;
			dataManager.rwAccounts = data.rwAccounts || dataManager.rwAccounts;
			dataManager.recipients = data.recipients || dataManager.recipients;
		}
	},
	getData : function(){
		return {
		  serverUrl : dataManager.serverUrl,
		  isPublicNetwork : dataManager.isPublicNetwork,
		  inflationPool : dataManager.inflationPool,
		  currency : dataManager.currency,
		  nonce : dataManager.nonce,
		  guardian : dataManager.guardian,
		  roAccounts: dataManager.roAccounts,
		  rwAccounts: dataManager.rwAccounts,
		  recipients : dataManager.recipients,
		}
	},
	save : function(){
		browserApi.storage.local.set({
			ULASafe: dataManager.getData()
		});
	},
}