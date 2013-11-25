var codepiano = function(){
	return new codepiano.prototype.init();
};
/**
 * @param objApp IWizExplorerApp对象
 */
 (function(objApp){
	codepiano.fn = codepiano.prototype = {
		/* 构造器，调用init方法 */
		constructor : codepiano,
		/* 初始化方法 */
		init : function(){
		 	this.SELF_FILE_NAME = 'wiz-plugin-tool.js';
		 	this.objApp = objApp;
			/* IWizExplorerWindow对象 */
			this.objWindow = objApp.Window;
			/* IWizDocument对象 */
			this.objDocument = this.objWindow.CurrentDocument;
			/* 当前文档DOM对象 */
			this.noteDocument = this.objWindow.CurrentDocumentHtmlDocument;
			/* 当前文档Window对象 */
			this.noteWindow = this.noteDocument.defaultView;
			/* 本文件所在路径，以此路径作为插件路径 */
			this.pluginPath = objApp.CurPluginAppPath || objApp.GetPluginPathByScriptFileName(this.SELF_FILE_NAME);
		},
		/* 引入js文件 */
		addJs : function(path, callback){
			var scriptTag = this.appendChild('head', codepiano.createElement('script', {'type':'text/javascript', 'src':this.normalizePath(path)}));
			if(callback && typeof callback === "function"){
				scriptTag.onload = callback;
			}
		},
		/* 根据依赖加载js文件 */
		addJsWithDependency : function(matrix, smithes, oracle){
			/* 
			 * onload指向的匿名函数调用时，this指的不再是codepiano对象
			 * 而是onload的Html Element对象，所以需要使用闭包，保留对象引用
			 */
			var that = this;
			this.addJs(matrix, function(){
				var smith;
				for(smith in smithes){
					that.addJs(smithes[smith]);
				}	
				oracle.apply(window);
			});
		},
		/* 引入css文件 */
		addCss : function(path){
			return this.appendChild('head', this.createElement('link', {'type':'text/css', 'rel':'stylesheet', 'href':this.normalizePath(path)}));
		},
		/* 拼接本地文件路径 */
		normalizePath : function(path){
			return ("file:///" + this.pluginPath + path).replace(/\\/g, '/');
		},
		/* 选择元素 */
		selectElement : function(name){
			if(typeof name === 'string' && name.charAt(0) === '#'){
				return this.noteDocument.getElementById(name);
			}else{
				return this.noteDocument.getElementsByTagName(name);
			}
		},
		/* 创建元素 */
		createElement : function(name, props){
			var element = this.noteDocument.createElement(name);
			if(props){
				var key;
				for(key in props){
					element[key] = props[key];
				}
			}
			return element;
		},
		/* 插入元素 */
		appendChild : function(parent, child){
			if(parent && typeof parent === 'string'){
				parent = this.selectElement(parent)[0];
			}
			return parent.appendChild(child);
		}
	};
	codepiano.fn.init.prototype = codepiano.fn;
 })(typeof WizExplorerApp !== 'undefined' ? WizExplorerApp : typeof objApp !== 'undefined' ? objApp : window.external);