
function Game(){
	this.tRoom=Array();
	this.roomToStart='';

	this.verbSelected='';
	this.itemSelected='';
	this.withSelected='';

	this.roomSelected='';

	this.tEvent=Array();
	this.tInventory=Array();
	this.tImage=Array();

	this.tVerbs=Array();
}
Game.prototype={

	"selectVerb":function(verb){
		this.resetSelection();

		this.verbSelected=verb;

		this.processListVerbs(this.tVerbs)
	},
	"resetSelection":function(){
			this.verbSelected='';
			this.withSelected='';
			this.itemSelected='';

			this.processListVerbs(this.tVerbs);
			this.listInventory();
	},
	"selectWith":function(with_){
		this.withSelected=with_;

		this.listInventory();
	},
	"selectItem":function(item){

		console.log('selectItem '+item);

		this.itemSelected=item;

		if(this.verbSelected==''){
			this.message('Vous devez selectionner un verbe');
		}else if(this.getEvent([this.verbSelected,this.withSelected,this.itemSelected]) ){
			this.executeAction(this.getEvent([this.verbSelected,this.withSelected,this.itemSelected]) );
		}else if(this.getEvent([this.verbSelected,this.itemSelected]) ){
			this.executeAction(this.getEvent([this.verbSelected,this.itemSelected]) );
		}else{
			this.messageError('Je ne pense pas :(');
		}

		this.resetSelection();


	},
	"executeAction":function(tAction){
		if(tAction){
			for(var i in tAction){

				var oAction=tAction[i];

				if(oAction.funct=='addInventory'){
					this.addInventory(oAction.id);

					this.deleteImage(oAction.id);
				}else if(oAction.funct=='loadRoom'){
					this.loadRoom(oAction.room);

				}else if(oAction.funct=='message'){
					this.message(oAction.message);
				}else if(oAction.funct=='setState'){
					this.setState(oAction.fromRoom,oAction.id,oAction.state);

					this.reloadRoom();
				}
			}
		}

	},

	"setState":function(room,id,state){
		this.tRoom[room].setState(id,state);
	},

	"deleteImage":function(id){

		this.tRoom[this.roomSelected].deleteImage(id);

		this.reloadRoom();

	},

	"reloadRoom":function(){
			this.loadRoom(this.roomSelected);
	},

	"addInventory":function(id){
		this.tInventory.push(id);

		console.log('add '+id);

		this.listInventory();
	},

	"listInventory":function(){
		var html='';
		for(var i in this.tInventory){
			var id=this.tInventory[i];
			html+='<a ';

			if(this.withSelected==id){
				html+='class="selected"';
			}

			html+=' href="#" onclick="oGame.selectWith(\''+id+'\');return false"><img src="'+this.tImage[ id ].src+'"/></a>';
		}

		var divInventory=getById('inventory');
		divInventory.innerHTML=html;
	},


	"addEvent":function(tKey,oAction){

		if(!this.tEvent[ tKey.join('__') ]){
			this.tEvent[ tKey.join('__') ]=Array();
		}

		this.tEvent[ tKey.join('__') ].push(oAction);
	},

	"getEvent":function(tKey){
		if(this.tEvent[ tKey.join('__') ]){
			return this.tEvent[ tKey.join('__') ];
		}
		return null;
	},

	"process":function(oData){
		this.processIntro(oData.intro);
		//this.processListRooms(oData.listRoom);
		this.processListVerbs(oData.listVerbs);

		this.tVerbs=oData.listVerbs;

		this.roomToStart=oData.roomToStart;
	},
	"processIntro":function(oIntro){
		var divIntro=getById('intro');

		divIntro.innerHTML=oIntro.text.join("");
		divIntro.style.background="url('"+oIntro.background+"') bottom no-repeat";
		divIntro.style.width=oIntro.width;
		divIntro.style.height=oIntro.height;
	},
	"processListVerbs":function(tVerbs){
		var divVerbs=getById('verbs');
		if(divVerbs){
			var html='';
			for(var i in tVerbs){
				html+='<a href="#" ';

				if(this.verbSelected==tVerbs[i]){
					html+= 'class="selected"';
				}

				html+=' onclick="oGame.selectVerb(\''+tVerbs[i]+'\')">'+tVerbs[i]+'</a>';
			}
			divVerbs.innerHTML=html;
		}
	},

	"processRoom":function(oJsonRoom){
		var oRoom=new Room(oJsonRoom.id);
		oRoom.setBackground(oJsonRoom.background);

		for(var j in oJsonRoom.listRectArea){

			var jsonRectArea=oJsonRoom.listRectArea[j];

			oRoom.addRectArea(jsonRectArea);

			//this.processListEvent(jsonRectArea.listOn,jsonRectArea.id);


		}

		for(var k in oJsonRoom.listImage){

			var jsonImage=oJsonRoom.listImage[k];

			oRoom.addImage(jsonImage);

			//this.processListEvent(jsonImage.listOn,jsonImage.id);

			this.tImage[jsonImage.id]=jsonImage;

		}

		this.tRoom[oJsonRoom.id]=oRoom;

	},
	/*
	"processListRooms":function(tRoom){
		for(var i in tRoom){
			var oJsonRoom=tRoom[i];

			var oRoom=new Room(oJsonRoom.id);
			oRoom.setBackground(oJsonRoom.background);

			for(var j in oJsonRoom.listRectArea){

				var jsonRectArea=oJsonRoom.listRectArea[j];

				oRoom.addRectArea(jsonRectArea);

				this.processListEvent(jsonRectArea.listOn,jsonRectArea.id);


			}

			for(var k in oJsonRoom.listImage){

				var jsonImage=oJsonRoom.listImage[k];

				oRoom.addImage(jsonImage);

				this.processListEvent(jsonImage.listOn,jsonImage.id);

				this.tImage[jsonImage.id]=jsonImage;

			}
			this.tRoom[oJsonRoom.id]=oRoom;

		}
	},
	*/
	"processListEvent":function(listOn,id,room){
		if(listOn){
			for(var i in listOn){

				var oOn=listOn[i];
				oOn.action.id=id;
				oOn.action.fromRoom=room;

				if(oOn.with){
					this.addEvent( [oOn.verb,oOn.with,id],oOn.action);

				}else{
					this.addEvent( [oOn.verb,id],oOn.action);

				}

			}
		}
	},
	"hide":function(id){
		var div=getById(id);
		div.style.display='none';
	},
	"show":function(id){
		var div=getById(id);
		div.style.display='block';
	},
	"start":function(){
		this.hide('intro');
		this.show('game');

		this.loadRoom(this.roomToStart);
	},
	"readRoom":function(room){
		var requestURL='./data/'+room+'.json';

		console.log("readRoom "+requestURL);

		var oRequest = new XMLHttpRequest();
		oRequest.open('GET', requestURL,true);
		oRequest.responseType = 'json';
		oRequest.send();

		oRequest.onload = function() {
			var oData = oRequest.response;

			if(null==oData){
				alert('Error on load '+requestURL);
			}

			oGame.processRoom(oData);
			oGame.loadRoom(oData.id);
		}
	},
	"resetRoom":function(){
		this.tEvent=Array();
	},
	"loadRoom":function(room){

		if(!this.tRoom[room]){
			this.readRoom(room);
			return;
		}

		this.resetRoom();

		this.roomSelected=room;

		console.log('loadRoom '+room);

		var oRoom=this.tRoom[room];

		var divRoom=getById('game');
		divRoom.style.background='url(\''+oRoom.background+'\')';

		console.log(oRoom);

		var oSvg=new Svg();

		if(oRoom.tImage){
			console.log(oRoom.tImage);
			for(var i in oRoom.tImage){

				console.log('boucle image');

				var oImage=oRoom.tImage[i];

				this.processListEvent(oImage.listOn,oImage.id,room);

				oSvg.addImage({
					"id":oImage.id,
					"class":"clickable",
					"x":oImage.x,
					"y":oImage.y,
					"opacity":1,
					"src":oImage.src
				});


			}
		}

		var html=oSvg.getSvg();

		divRoom.innerHTML=html;

	},
	"message":function(text_){
		modalMessage(text_);
	},
	"messageError":function(text_){
		modalMessageError(text_);
	},


};

function Room(id){
	this.id=id;
	this.tRectArea=Array();
	this.tImage=Array();
}
Room.prototype={
	"setBackground":function(src){
		this.background=src;
	},
	"addRectArea":function(oRectArea){
		this.tRectArea.push(oRectArea);
	},
	"addImage":function(oImage){
		this.tImage.push(oImage);
	},
	"deleteImage":function(id){
		var newListImage=Array();
		for(var i in this.tImage){
			if(this.tImage[i].id!=id){
				newListImage.push(this.tImage[i]);
			}
		}
		this.tImage=newListImage;
	},
	"setState":function(id,state){
		var newListImage=Array();
		for(var i in this.tImage){

			var oImage=this.tImage[i];

			if(oImage.id==id){
				var oState=oImage.listState[state];

				console.log(oState);

				for(var key in oState ){
					oImage[key]=oState[key];
				}

			}
			newListImage.push(oImage);
		}
		this.tImage=newListImage;

	}
};



function On(){

}
On.prototype={
	"setVerb":function(sVerb){
			this.sVerb=sVerb;
	},
	"setWith":function(sWith){
			this.sWith=sWith;
	},
	"setAction":function(oAction){
			this.oAction=oAction;
	},
};


function getById(id_){
	return document.getElementById(id_);
}

var oGame=new Game();


function Svg(){
	this.svg='';
}
Svg.prototype={
	"addImage":function(oImage){
		this.svg+='<image class="clickable" ';

		this.svg+=' onclick="oGame.selectItem(\''+oImage.id+'\')" x="'+oImage.x+'" y="'+oImage.y+'"   opacity="'+oImage.opacity+'" xlink:href="'+oImage.src+'" />';

	},
	"getSvg":function(){

		return '<svg width="600" height="400" xmlns:xlink= "http://www.w3.org/1999/xlink"><style>.clickable { cursor: pointer; }</style>'+this.svg+'</svg>';
	}
};


function startIntro(){

	console.log('startIntro');

	var requestURL='./data/main.json';

	var oRequest = new XMLHttpRequest();
	oRequest.open('GET', requestURL,true);
	oRequest.responseType = 'json';
	oRequest.send();

	oRequest.onload = function() {
		var oData = oRequest.response;
		oGame.process(oData);
	}
}

function modalMessage(text_){
 showObject('myModal');
 getById('myModalTxt').innerHTML=text_;
 getById('myModalContent').style.border='8px solid darkgreen';
}

function modalMessageError(text_){
 showObject('myModal');
 getById('myModalTxt').innerHTML=text_;
 getById('myModalContent').style.border='8px solid darkred';
}


function showObject(id){
	getById(id).style.display='block';
}
function hideObject(id){
	getById(id).style.display='none';
}
