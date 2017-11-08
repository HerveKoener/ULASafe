tagService.find(home, "add").textContent = browserApi.i18n.getMessage("add");

tagService.setAttr(tagService.find(signing, "password"), {'placeholder' : browserApi.i18n.getMessage("password")});
tagService.find(signing, "signin").textContent = browserApi.i18n.getMessage("signin");

tagService.find(manageAccount, "home").textContent = browserApi.i18n.getMessage("home");
tagService.find(manageAccount, "manageAccount").textContent = browserApi.i18n.getMessage("manageAccount");
tagService.find(manageAccount, "updateAccount").textContent = browserApi.i18n.getMessage("updateOrRemoveAccount");
tagService.find(manageAccount, "selectAll").textContent = browserApi.i18n.getMessage("selectAll");
tagService.find(manageAccount, "removeTop").textContent = browserApi.i18n.getMessage("removeSelected");
tagService.find(manageAccount, "removeBottom").textContent = browserApi.i18n.getMessage("removeSelected");
tagService.find(manageAccount, "addAccount").textContent = browserApi.i18n.getMessage("addAccount");
tagService.find(manageAccount, "new").textContent = browserApi.i18n.getMessage("copyPublicPrivate");
tagService.find(manageAccount, "add").textContent = browserApi.i18n.getMessage("add");
tagService.find(manageAccount, "create").textContent = browserApi.i18n.getMessage("createAccount");

tagService.find(accountSetting, "home").textContent = browserApi.i18n.getMessage("home");
tagService.find(accountSetting, "transaction").textContent = browserApi.i18n.getMessage("transaction");
tagService.find(accountSetting, "accountSetting").textContent = browserApi.i18n.getMessage("accountSetting");
tagService.find(accountSetting, "updateAccount").textContent = browserApi.i18n.getMessage("updateAccount");
tagService.find(accountSetting, "name").textContent = browserApi.i18n.getMessage("alias");
tagService.find(accountSetting, "prikey").textContent = browserApi.i18n.getMessage("privateKey");
tagService.find(accountSetting, "pubkey").textContent = browserApi.i18n.getMessage("publicKey");
tagService.find(accountSetting, "freeXLM").textContent = browserApi.i18n.getMessage("freeXLM");
tagService.find(accountSetting, "inflation").textContent = browserApi.i18n.getMessage("inflation");
tagService.find(accountSetting, "export").textContent = browserApi.i18n.getMessage("exportAccount");
tagService.find(accountSetting, "print").textContent = browserApi.i18n.getMessage("print");
tagService.find(accountSetting, "email").textContent = browserApi.i18n.getMessage("email");
tagService.find(accountSetting, "email-subject").textContent = browserApi.i18n.getMessage("emailSubject");
tagService.find(accountSetting, "email-body").textContent = browserApi.i18n.getMessage("emailBody");
tagService.find(accountSetting, "paperWallet").textContent = browserApi.i18n.getMessage("paperWallet");
tagService.find(accountSetting, "publicKey").textContent = browserApi.i18n.getMessage("publicKey");
tagService.find(accountSetting, "privateKey").textContent = browserApi.i18n.getMessage("privateKey");
tagService.find(accountSetting, "mergeAccount").textContent = browserApi.i18n.getMessage("mergeAccount");
tagService.find(accountSetting, "merge").textContent = browserApi.i18n.getMessage("merge");

tagService.find(transaction, "home").textContent = browserApi.i18n.getMessage("home");
tagService.find(transaction, "accountSetting").textContent = browserApi.i18n.getMessage("accountSetting");
tagService.find(transaction, "transaction").textContent = browserApi.i18n.getMessage("transaction");
tagService.find(transaction, "fromLabel").textContent = browserApi.i18n.getMessage("from");
tagService.setAttr(tagService.find(transaction, "to"), {'placeholder' : browserApi.i18n.getMessage("to")});
tagService.setAttr(tagService.find(transaction, "alias"), {'placeholder' : browserApi.i18n.getMessage("alias")});
tagService.setAttr(tagService.find(transaction, "amount"), {'placeholder' : browserApi.i18n.getMessage("amount")});
tagService.find(transaction, "memoTitle").textContent = browserApi.i18n.getMessage("memo");
tagService.find(transaction, "none").textContent = browserApi.i18n.getMessage("none");
tagService.setAttr(tagService.find(transaction, "memo"), {'placeholder' : browserApi.i18n.getMessage("memo")});
tagService.find(transaction, "sign").textContent = browserApi.i18n.getMessage("sign");
tagService.find(transaction, "send").textContent = browserApi.i18n.getMessage("send");