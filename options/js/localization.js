document.querySelector("#op-title").textContent = browserApi.i18n.getMessage("option");
document.querySelector("#op-server").textContent = browserApi.i18n.getMessage("optionServer");
document.querySelector("#op-inflation").textContent = browserApi.i18n.getMessage("optionInflation");
document.querySelector("#op-currency").textContent = browserApi.i18n.getMessage("optionCurrency");

document.querySelector("#op-password").textContent = browserApi.i18n.getMessage("optionPassword");
document.querySelector("#oldPassword").setAttribute('placeholder',  browserApi.i18n.getMessage("optionOldPassword"));
document.querySelector("#newPassword").setAttribute('placeholder',  browserApi.i18n.getMessage("optionNewPassword"));