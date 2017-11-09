tagService.onCLick(home, "add", manageAccount.display);

tagService.onCLick(signing, "signin", signing.unlock);

tagService.onCLick(manageAccount, "home", home.display);
tagService.onCLick(manageAccount, "removeTop", manageAccount.removeKeys);
tagService.onCLick(manageAccount, "removeBottom", manageAccount.removeKeys);
tagService.onCLick(manageAccount, "selectAll", manageAccount.selectAll);
tagService.onCLick(manageAccount, "add", manageAccount.addKeys);
tagService.onCLick(manageAccount, "create", manageAccount.createKey);

tagService.onCLick(accountSetting, "home", home.display);
tagService.onCLick(accountSetting, "transaction", function(){transaction.display(tagService.find(accountSetting, "pubkey").value);});
tagService.onCLick(accountSetting, "merge", accountSetting.merge);
tagService.onCLick(accountSetting, "inflation", accountSetting.inflation);
tagService.onCLick(accountSetting, "print", accountSetting.print);


tagService.addEvent(tagService.find(accountSetting, 'name'), 'blur', accountSetting.saveKey);
tagService.addEvent(tagService.find(accountSetting, 'prikey'), 'blur', accountSetting.saveKey);
tagService.addEvent(tagService.find(accountSetting, 'pubkey'), 'blur', accountSetting.saveKey);

tagService.onCLick(transaction, "home", home.display);
tagService.onCLick(transaction, "accountSetting", function(){accountSetting.display(transaction.current.pubKey);});
tagService.onCLick(transaction, "switch", transaction.switchRecipient);
tagService.onCLick(transaction, "removeRecipient", transaction.removeRecipient);
tagService.onCLick(transaction, "sign", transaction.sign);
tagService.onCLick(transaction, "send", transaction.send);