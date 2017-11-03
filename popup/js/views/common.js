const interfaces = [];

function saveKeys(password){	
	let privateData = securityManager.getPrivateData(password);
	privateData.privateKeys = accountManager.accounts().toText();
	securityManager.setPrivateData(privateData, password);
	
	let publicData = securityManager.getPublicData();
	publicData.accounts = accountManager.accounts().exportPubKey();
	publicData.recipients = recipientManager.toText();
	securityManager.setPublicData(publicData);
	
	securityManager.save();
}

function pref(id, key) {
	return '#'+id+key;
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
