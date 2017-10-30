tagManager.onCLick(home, "add", manageAccount.display);

tagManager.onCLick(manageAccount, "home", home.display);
tagManager.onCLick(manageAccount, "removeTop", manageAccount.removeKeys);
tagManager.onCLick(manageAccount, "removeBottom", manageAccount.removeKeys);
tagManager.onCLick(manageAccount, "selectAll", manageAccount.selectAll);
tagManager.onCLick(manageAccount, "add", manageAccount.addKeys);
tagManager.onCLick(manageAccount, "create", manageAccount.createKey);

tagManager.onCLick(accountSetting, "home", home.display);
tagManager.onCLick(accountSetting, "transaction", function(){transaction.display(tagManager.find(accountSetting, "pubkey").value);});
tagManager.onCLick(accountSetting, "inflation", accountSetting.inflation);
tagManager.onCLick(accountSetting, "print", accountSetting.print);


tagManager.addEvent(tagManager.find(accountSetting, 'name'), 'blur', accountSetting.saveKey);
tagManager.addEvent(tagManager.find(accountSetting, 'prikey'), 'blur', accountSetting.saveKey);
tagManager.addEvent(tagManager.find(accountSetting, 'pubkey'), 'blur', accountSetting.saveKey);

tagManager.onCLick(transaction, "home", home.display);
tagManager.onCLick(transaction, "accountSetting", function(){accountSetting.display(transaction.current.pubKey);});
tagManager.onCLick(transaction, "send", transaction.send);