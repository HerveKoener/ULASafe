var tagService = {
	create : function(type, conf){
		var node = document.createElement(type);
		this.setAttr(node,conf);
		return node;
	},
	text : function(text){
		return document.createTextNode(text);
	},
	setAttr(node, conf){
		for(var prop in conf) {
			if(conf.hasOwnProperty(prop)){
				if(!conf[prop] || conf[prop] === ''){
					node.removeAttribute(prop);
				}else{
					node.setAttribute(prop,conf[prop]);
				}
			}
		}
	},
	_pref(id, key) {
		return "[id='"+id+key+"']";
	},
	addEvent(node, action, callback){
		node.addEventListener(action, callback);
	},
	find(view, id, selector){
		if(!selector){
			selector = '';
		}
		
		return document.querySelector(this._pref(view.id, id)+' '+selector);
	},
	findAll(view, id, selector){
		if(!selector){
			selector = '';
		}
		
		return document.querySelectorAll(this._pref(view.id, id)+' '+selector);
	},
	onCLick(view, id, callback){
		this.addEvent(this.find(view, id), 'click', callback);
	},
	error(view, message){
		this.cleanInfo(view);
		let node = this.create("div", {'class' : 'errorInfo'});
		node.appendChild(this.text(message));
		this.find(view, 'info').appendChild(node);
	},
	success(view, message){
		this.cleanInfo(view);
		let node = this.create("div", {'class' : 'successInfo'});
		node.appendChild(this.text(message));
		this.find(view, 'info').appendChild(node);
	},
	cleanInfo(view){
		this.find(view, 'info').innerHTML = '';
	}
}