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
		tagService.cleanInfo(signing);
	},
	lock : function(){
		tagService.find(signing, 'sec').textContent = '';
		accountService.lock();
	},
	unlock : function(){
		if(signing.isLocked()){
			let password = tagService.find(signing, 'password').value;
			if(securityService.check(password)){
				tagService.find(signing, 'sec').textContent = password;
			};
		}
		
		if(!signing.isLocked()){
			signing.callback();
		}
	},
	isLocked : function(){
		if(securityService.isActive()){
			return tagService.find(signing, 'sec').textContent === '';
		}
		return false;
	},
	getPassword : function(){
		return tagService.find(signing, 'sec').textContent;
	}
};

interfaces.push(signing.name);