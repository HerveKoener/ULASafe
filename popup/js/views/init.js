function updateUI(restoredSettings) {
	dataManager.setData(restoredSettings.ULASafe);
	
	rateManager.init(dataManager.currency);
	accountManager.init(dataManager.accounts);
	recipientManager.init(dataManager.recipients);
	stellarGate.init(
		dataManager.serverUrl,
		dataManager.isPublicNetwork,
		dataManager.inflationPool
	);
	home.display();
}