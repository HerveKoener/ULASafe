const interfaces = [];

function saveKeys(){
	dataManager.accounts = accountManager.toText();
	dataManager.recipients = recipientManager.toText();
	dataManager.save();
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
