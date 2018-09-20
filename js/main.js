
function Game(){

}
Game.prototype={
	"process":function(oData){
		this.processIntro(oData.intro);
	},
	"processIntro":function(oIntro){
		var divIntro=getById('intro');

		divIntro.innerHTML=oIntro.text.join("");
		divIntro.style.background="url('"+oIntro.background+"') bottom no-repeat";
		divIntro.style.width=oIntro.width;
		divIntro.style.height=oIntro.height;
	},
	"start":function(){
		
	}


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
