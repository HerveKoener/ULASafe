var dataService = {
	serverUrl : 'https://horizon.stellar.org',
	isPublicNetwork : true,
	passphrase : '',
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
			dataService.serverUrl = data.serverUrl || dataService.serverUrl;
			dataService.passphrase = data.passphrase || dataService.passphrase;
			dataService.inflationPool = data.inflationPool || dataService.inflationPool;
			dataService.currency = data.currency || dataService.currency;
			dataService.nonce = data.nonce ||  dataService.nonce;
			dataService.guardian = data.guardian ||  dataService.guardian;
			dataService.roAccounts = data.roAccounts || dataService.roAccounts;
			dataService.rwAccounts = data.rwAccounts || dataService.rwAccounts;
			dataService.recipients = data.recipients || dataService.recipients;
			
			if(data.isPublicNetwork !== false && data.isPublicNetwork !== true){
				dataService.isPublicNetwork = dataService.isPublicNetwork;
			}else{
				dataService.isPublicNetwork = data.isPublicNetwork;
			}
		}
	},
	getData : function(){
		return {
		  serverUrl : dataService.serverUrl,
		  isPublicNetwork : dataService.isPublicNetwork,
		  passphrase : dataService.passphrase,
		  inflationPool : dataService.inflationPool,
		  currency : dataService.currency,
		  nonce : dataService.nonce,
		  guardian : dataService.guardian,
		  roAccounts: dataService.roAccounts,
		  rwAccounts: dataService.rwAccounts,
		  recipients : dataService.recipients,
		}
	},
	save : function(){
		browserApi.storage.local.set({
			ULASafe: dataService.getData()
		});
	},
}