var signing = {
	id : 's-',
	name : 'signing',
	callback : null,
	display : function(callback){
		signing.callback = callback;
		if(signing.isLocked()){
			signing.displayForm();
		}else{
			unlock();
		}
	},
	displayForm : function(){
		hideAll();
		show(signing.name);
		tagManager.cleanInfo(signing);
	},
	lock : function(){
		tagManager.find(signing, 'sec').textContent = '';
		accountManager.lock();
	},
	unlock : function(){
		if(signing.isLocked()){
			let password = tagManager.find(signing, 'password').value;
			if(securityManager.check(password)){
				tagManager.find(signing, 'sec').textContent = password;
			};
		}
		
		if(!signing.isLocked()){
			signing.callback();
		}
	},
	isLocked : function(){
		if(securityManager.isActive()){
			return tagManager.find(signing, 'sec').textContent === '';
		}
		return false;
	},
	getPassword : function(){
		return tagManager.find(signing, 'sec').textContent;
	}
};

interfaces.push(signing.name);