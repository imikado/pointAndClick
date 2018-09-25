
function Game(){
	this.tRoom=Array();
}
Game.prototype={
	"process":function(oData){
		this.processIntro(oData.intro);
		this.processListRooms(oData.listRoom);
	},
	"processIntro":function(oIntro){
		var divIntro=getById('intro');

		divIntro.innerHTML=oIntro.text.join("");
		//divIntro.style.background="url('"+oIntro.background+"') bottom no-repeat";
		divIntro.style.width=oIntro.width;
		divIntro.style.height=oIntro.height;
	},
	"processListRooms":function(tRoom){
		for(var i in tRoom){
			var oJsonRoom=tRoom[i];
			
			var oRoom=new Room(oJsonRoom.id);
			oRoom.setBackground(oJsonRoom.background);
			
			for(var j in oJsonRoom.listRectArea){
				
				var jsonRectArea=oJsonRoom.listRectArea[j];
				
				var oRectArea=new RectArea();
				oRectArea.setCoord(jsonRectArea.x,jsonRectArea.y);
				oRectArea.setDimensions(jsonRectArea.width,jsonRectArea.height);
				
				if(jsonRectArea.listOn){
				
					for(var k in jsonRectArea.listOn){
						
						var jsonOn=jsonRectArea.listOn[k];
						
						var oOn=new On();
						oOn.setVerb(jsonOn.verb);
						if(jsonOn.with){
							oOn.setWith(jsonOn.with);
						}
						oOn.setAction(jsonOn.action);
						
						oRectArea.addOn(oOn);
						
					}
					
				}
				
				oRoom.addRectArea(oRectArea);
				
				
			}
			
			this.tRoom.push(oRoom);
			
		}
	},
	"start":function(){
		
	}


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
	}
};

function RectArea(){
	this.x=0;
	this.y=0;
	this.width=0;
	this.height=0;
	this.tOn=Array();
}
RectArea.prototype={
	"setCoord":function(x,y){
		this.x=x;
		this.y=y;
	},
	"setDimensions":function(width,height){
		this.width=width;
		this.height=height;
	},
	"addOn":function(oOn){
		this.tOn.push(oOn);
	},
};

function Image(){
	this.x=0;
	this.y=0;
	this.width=0;
	this.height=0;
	this.src='';
	this.tOn=Array();
}
Image.prototype={
	"setCoord":function(x,y){
		this.x=x;
		this.y=y;
	},
	"setSrc":function(src){
		this.src=src;
	},
	"addOn":function(oOn){
		this.tOn.push(oOn);
	},
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
