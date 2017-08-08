var Game = (function(){

	var instance = {};
	instance.humanHand = [];
	instance.humanTotal = 0;
	instance.aiHand = [];
	instance.aiTotal = 0;
	instance.gameOver = false;

	instance.handItem = Handlebars.compile('<li>{{card}}</li>');
	instance.output = Handlebars.compile('<p>The AI had {{ai}}. You {{status}}.</p>');

	instance.getValFromRaw = function(value){
		var val = value %13;
		var suit = Math.floor(value/13);

		var cardName = "";
		var suitName = "";

		if(val === 11){
	    	cardName = "Jack";
	    	val = 10;
	    }
	    else if(val === 12){
	    	cardName = "Queen";
	    	val = 10;
	    }
	    else if(val === 0){
	    	cardName = "King";
	    	val = 10;
	    }
	    else if(val === 1){
	    	cardName = "Ace";
	    }
	    else{
	    	cardName = val;
	    }

	    if(suit === 1){
	    	suitName = "Spades";
	    }
	    else if(suit === 2){
	    	suitName = "Hearts";
	    }
	    else if(suit === 3){
	    	suitName = "Diamonds";
	    }
	    else if(suit === 0 || 4){
	    	suitName = "Clubs";
	    }

	    var name = cardName + " of " + suitName;

		return {val: val, suit: suit, name: name};
	}

	instance.drawCard = function(hand){
		var rawVal = Math.floor(Math.random()*(52)+1);
		
		var card = {
			"rawValue": rawVal,
			"val": this.getValFromRaw(rawVal).val,
			"suit": this.getValFromRaw(rawVal).suit,
			"name": this.getValFromRaw(rawVal).name,
		}
		hand.push(card);
		if(hand == Game.humanHand){
			this.addCardHtml(card);
		}
	}

	instance.checkTotals = function(){
		this.humanTotal = 0;
		this.aiTotal = 0;
		for(var i = 0; i < this.humanHand.length; i++){
			this.humanTotal += (this.humanHand[i].val);
		}
		document.getElementById("currentTotal").innerHTML = this.humanTotal;
		for(var i = 0; i < this.aiHand.length; i++){
			this.aiTotal += (this.aiHand[i].val);
		}
		if(this.humanTotal > 21){
			this.stick();
			this.gameOver = true;
			$('#currentTotal').append(" BUST!");
		}
		document.getElementById("aiCards").innerHTML = this.aiHand.length;
	}

	instance.dealHands = function(){
		this.drawCard(this.humanHand);
		this.drawCard(this.humanHand);
		this.drawCard(this.aiHand);
		this.drawCard(this.aiHand);


		console.log("\n Your Hand:")
		for(var i = 0; i < this.humanHand.length; i++){
			console.log(this.humanHand[i].name);
		}
		this.checkTotals();
		console.log(this.humanTotal);
		while (this.aiTotal < 17){
			this.drawCard(this.aiHand)
			this.checkTotals();
		}
	}

	instance.checkBust = function(total){
		if(total > 21){
			return false;
		} else {
			return true;
		}
	}

	instance.addCardHtml = function(card){
		var hand = $('#currentHand');
		var html = this.handItem({card:card.name});
		hand.append($(html));
	}

	instance.hit = function(){
		if(this.gameOver){
			return;
		}
		Game.drawCard(Game.humanHand);
		this.checkTotals();
	}

	instance.stick = function(){
		if(this.humanTotal == this.aiTotal){
			var status = "Lose. The House wins draws";
		}
		if(this.humanTotal > this.aiTotal){
			if(this.checkBust(this.humanTotal)){
				var status = "Win";
			}
			else{
				if(this.aiTotal > 21){
					var status = "Lose. The House wins draws";
				} else {
					var status = "Lose";
				}
			}
		}
		else{
			if(this.checkBust(this.aiTotal)){
				var status = "Lose";
			} else{
				var status = "Win";
			}
		}
		var target = $('#output');
		target.empty();
		var html = this.output({ai: this.aiTotal, status: status});
		console.log(html);
		target.append($(html));
		this.gameOver = true;
	}

	return instance;

}());

function refreshWindow(){
	window.location.reload();
} 

window.onload = function(){
	console.log("BlackJack V2.0");
	Game.dealHands();
}