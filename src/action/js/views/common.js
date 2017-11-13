const interfaces = [];

function saveKeys(password){	
	let privateData = securityService.getPrivateData(password);
	privateData.rwAccounts = accountService.accounts().toText();
	securityService.setPrivateData(privateData, password);
	
	let publicData = securityService.getPublicData();
	publicData.roAccounts = accountService.accounts().exportPubKey();
	publicData.recipients = recipientManager.toText();
	securityService.setPublicData(publicData);
	
	securityService.save();
}

function hideAll(){
	interfaces.forEach(function(id){
		hide(id);
	});
}

function hide(id){
	document.querySelector('#' + id).setAttribute('style','display:none;');
}

function show(id){
	document.querySelector('#' + id).setAttribute('style','display:block;');
}

function onError(e) {
  console.error(e);
}
