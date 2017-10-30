function updateUI(restoredSettings) {
	dataManager.setData(restoredSettings.ULASafe);
	
	document.querySelector("#server").value = dataManager.serverUrl;
	document.querySelector("#inflationPool").value = dataManager.inflationPool;
	
	document.querySelector("#public").removeAttribute('selected');
	document.querySelector("#testnet").removeAttribute('selected');
	
	if(dataManager.isPublicNetwork){
		document.querySelector("#public").setAttribute('selected','selected');
	}else{
		document.querySelector("#testnet").setAttribute('selected','selected');
	}
	
	let currencies = document.querySelector("#currency")
	for(let i=0; i<currencies.length; i++){
		let node = currencies[i];
		if(node.value == dataManager.currency){
			node.setAttribute('selected','selected');
		}else{
			node.removeAttribute('selected');
		}
	}
}
function updateOptions() {
	dataManager.serverUrl = document.querySelector("#server").value;
	dataManager.isPublicNetwork = (document.querySelector("#serverType option:checked").value === 'public');
	dataManager.inflationPool = document.querySelector("#inflationPool").value;
	dataManager.currency = document.querySelector("#currency option:checked").value
  
	dataManager.save();
}

document.querySelector("#server").addEventListener("blur", updateOptions);
document.querySelector("#public").addEventListener("click", updateOptions);
document.querySelector("#testnet").addEventListener("click", updateOptions);
document.querySelector("#inflationPool").addEventListener("blur", updateOptions);
document.querySelector("#currency").addEventListener("blur", updateOptions);

document.querySelector("#op-title").textContent = browserApi.i18n.getMessage("option");
document.querySelector("#op-server").textContent = browserApi.i18n.getMessage("optionServer");
document.querySelector("#op-inflation").textContent = browserApi.i18n.getMessage("optionInflation");
document.querySelector("#op-currency").textContent = browserApi.i18n.getMessage("optionCurrency");

function onError(error){
	document.querySelector("#info").innerHTML = '<div class="errorInfo">Error when loading/saving options</div>';
}