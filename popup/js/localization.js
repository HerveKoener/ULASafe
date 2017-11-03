tagManager.find(home, "add").textContent = browserApi.i18n.getMessage("add");

tagManager.setAttr(tagManager.find(signing, "password"), {'placeholder' : browserApi.i18n.getMessage("password")});
tagManager.find(signing, "signin").textContent = browserApi.i18n.getMessage("signin");

tagManager.find(manageAccount, "home").textContent = browserApi.i18n.getMessage("home");
tagManager.find(manageAccount, "manageAccount").textContent = browserApi.i18n.getMessage("manageAccount");
tagManager.find(manageAccount, "updateAccount").textContent = browserApi.i18n.getMessage("updateOrRemoveAccount");
tagManager.find(manageAccount, "selectAll").textContent = browserApi.i18n.getMessage("selectAll");
tagManager.find(manageAccount, "removeTop").textContent = browserApi.i18n.getMessage("removeSelected");
tagManager.find(manageAccount, "removeBottom").textContent = browserApi.i18n.getMessage("removeSelected");
tagManager.find(manageAccount, "addAccount").textContent = browserApi.i18n.getMessage("addAccount");
tagManager.find(manageAccount, "new").textContent = browserApi.i18n.getMessage("copyPublicPrivate");
tagManager.find(manageAccount, "add").textContent = browserApi.i18n.getMessage("add");
tagManager.find(manageAccount, "create").textContent = browserApi.i18n.getMessage("createAccount");

tagManager.find(accountSetting, "home").textContent = browserApi.i18n.getMessage("home");
tagManager.find(accountSetting, "transaction").textContent = browserApi.i18n.getMessage("transaction");
tagManager.find(accountSetting, "accountSetting").textContent = browserApi.i18n.getMessage("accountSetting");
tagManager.find(accountSetting, "updateAccount").textContent = browserApi.i18n.getMessage("updateAccount");
tagManager.find(accountSetting, "name").textContent = browserApi.i18n.getMessage("alias");
tagManager.find(accountSetting, "prikey").textContent = browserApi.i18n.getMessage("privateKey");
tagManager.find(accountSetting, "pubkey").textContent = browserApi.i18n.getMessage("publicKey");
tagManager.find(accountSetting, "freeXLM").textContent = browserApi.i18n.getMessage("freeXLM");
tagManager.find(accountSetting, "inflation").textContent = browserApi.i18n.getMessage("inflation");
tagManager.find(accountSetting, "export").textContent = browserApi.i18n.getMessage("exportAccount");
tagManager.find(accountSetting, "print").textContent = browserApi.i18n.getMessage("print");
tagManager.find(accountSetting, "email").textContent = browserApi.i18n.getMessage("email");
tagManager.find(accountSetting, "email-subject").textContent = browserApi.i18n.getMessage("emailSubject");
tagManager.find(accountSetting, "email-body").textContent = browserApi.i18n.getMessage("emailBody");
tagManager.find(accountSetting, "paperWallet").textContent = browserApi.i18n.getMessage("paperWallet");
tagManager.find(accountSetting, "publicKey").textContent = browserApi.i18n.getMessage("publicKey");
tagManager.find(accountSetting, "privateKey").textContent = browserApi.i18n.getMessage("privateKey");

tagManager.find(transaction, "home").textContent = browserApi.i18n.getMessage("home");
tagManager.find(transaction, "accountSetting").textContent = browserApi.i18n.getMessage("accountSetting");
tagManager.find(transaction, "transaction").textContent = browserApi.i18n.getMessage("transaction");
tagManager.find(transaction, "fromLabel").textContent = browserApi.i18n.getMessage("from");
tagManager.setAttr(tagManager.find(transaction, "to"), {'placeholder' : browserApi.i18n.getMessage("to")});
tagManager.setAttr(tagManager.find(transaction, "alias"), {'placeholder' : browserApi.i18n.getMessage("alias")});
tagManager.setAttr(tagManager.find(transaction, "amount"), {'placeholder' : browserApi.i18n.getMessage("amount")});
tagManager.find(transaction, "memoTitle").textContent = browserApi.i18n.getMessage("memo");
tagManager.find(transaction, "none").textContent = browserApi.i18n.getMessage("none");
tagManager.setAttr(tagManager.find(transaction, "memo"), {'placeholder' : browserApi.i18n.getMessage("memo")});
tagManager.find(transaction, "send").textContent = browserApi.i18n.getMessage("send");