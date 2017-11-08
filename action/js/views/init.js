function updateUI(restoredSettings) {
	securityService.init(restoredSettings.ULASafe);
	
	let config = securityService.getConfig();
	rateService.init(config.currency);
	stellarGate.init(config);
	
	recipientManager.init(securityService.getPublicData().recipients);
	
	home.display();
}