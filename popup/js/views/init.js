function updateUI(restoredSettings) {
	securityManager.init(restoredSettings.ULASafe);
	
	let config = securityManager.getConfig();
	rateManager.init(config.currency);
	stellarGate.init(
		config.serverUrl,
		config.isPublicNetwork,
		config.inflationPool
	);
	
	recipientManager.init(securityManager.getPublicData().recipients);
	
	home.display();
}