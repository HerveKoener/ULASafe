browserApi.storage.local.get().then(updateUI, onError);
function updateUI(restoredSettings) {
	securityService.init(restoredSettings.ULASafe);
	
	let config = securityService.getConfig();
	
	document.querySelector("#server").value = config.serverUrl;
	document.querySelector("#passphrase").value = config.passphrase;
	document.querySelector("#inflationPool").value = config.inflationPool;
	
	document.querySelector("#public").removeAttribute('selected');
	document.querySelector("#testnet").removeAttribute('selected');
	
	if(config.isPublicNetwork){
		document.querySelector("#public").setAttribute('selected','selected');
	}else{
		document.querySelector("#testnet").setAttribute('selected','selected');
	}
	
	let currencies = document.querySelector("#currency")
	for(let i=0; i<currencies.length; i++){
		let node = currencies[i];
		if(node.value == config.currency){
			node.setAttribute('selected','selected');
		}else{
			node.removeAttribute('selected');
		}
	}
	
	if(! securityService.isActive()){
		document.querySelector("#oldPassword").setAttribute('disabled','disabled');
	}
}
function updateConfig() {
	let config = {
		serverUrl : document.querySelector("#server").value,
		isPublicNetwork : (document.querySelector("#serverType option:checked").value === 'public'),
		passphrase : document.querySelector("#passphrase").value,
		inflationPool : document.querySelector("#inflationPool").value,
		currency : document.querySelector("#currency option:checked").value,
	};
	securityService.setConfig(config);
	securityService.save();
}

function updatePassword() {
	let oldPassword = document.querySelector("#oldPassword").value;
	let newPassword = document.querySelector("#newPassword").value;
	document.querySelector("#infoPassword").innerHTML = '';
	if(securityService.changePassword(oldPassword, newPassword)){
		securityService.save();
		document.querySelector("#oldPassword").value = newPassword;
		document.querySelector("#newPassword").value = '';
		
		document.querySelector("#infoPassword").innerHTML = '<div class="successInfo">Ok</div>';
	}else{
		document.querySelector("#infoPassword").innerHTML = '<div class="successInfo">Error</div>';
	}
}

document.querySelector("#server").addEventListener("blur", updateConfig);
document.querySelector("#public").addEventListener("click", updateConfig);
document.querySelector("#testnet").addEventListener("click", updateConfig);
document.querySelector("#passphrase").addEventListener("blur", updateConfig);
document.querySelector("#inflationPool").addEventListener("blur", updateConfig);
document.querySelector("#currency").addEventListener("blur", updateConfig);
document.querySelector("#newPassword").addEventListener("blur", updatePassword);


function onError(error){
	document.querySelector("#info").innerHTML = '<div class="errorInfo">Error when loading/saving options</div>';
}