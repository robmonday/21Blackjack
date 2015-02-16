console.log("------------------------");

var dealCount = 0; //indicates the last card dealt from the in shuffled deck
var handCount = 0;
var wager = 5;
var inPlay = true;
$("#wager").val(wager);
var wallet = 100;
$("#wallet").val(wallet);

function Player (name) { //player class
  this.name = name;
  this.hand = [];
  this.score = 0;
}

var hit = function(playerName) {
  console.log("--"+playerName.name+" hit--");
  if(checkWager()){
    deal(playerName);
  } else {
    return;//stop
  }
};

var stay = function(playerName) {
  //console.log("--stay--");
  if(checkWager()){
    finalize(playerName);
  } else {
    return;
  }
};

var deal = function(playerName) {
  if(dealCount===52){ //when out of cards, reshuffle
    $("#message").text(message("shuffle")).show(500).delay(1000).hide(200);
    deck = shuffleDeck();
    dealCount = 0;
  }
  dealCount++;
  console.log("card #"+dealCount+" to "+playerName.name);
  var newCard = deck[dealCount-1]; 
  //console.log("card #"+newCard);
  playerName.hand.push(newCard); //add card to hand
  evaluate(playerName);
};
  
var scoreCard = function(cardNum) {
  var points = cardNum%13;
  if(points===1){
    points = 11; //ace
  } else if(points>10 || points===0) { //remember kings show as zeros
    points = 10; //face cards
  }
  return points;
};

var scoreHand = function(playerName){ //scores AND displays
  var scoreSum = 0;
  $("#"+playerName.name+"Cards").empty();
  for(i=0;i<playerName.hand.length;i++){
    var cardPts = scoreCard(playerName.hand[i]);
    scoreSum += cardPts;
    //console.log("card "+(i+1)+": "+ cardPts);
    suit = identify(playerName.hand[i])[1];
    number = identify(playerName.hand[i])[0];    
    cardRank = number+" "+suit;
    //console.log(suit+", "+number+", "+cardRank);
    $("#"+playerName.name+"Cards").append('<li><a class="card rank-'+cardRank+'" href="#"><span class="rank">'+number+'</span><span class="suit">&'+suit+';</span></a></li>');
  } 
  return scoreSum;
};

var evaluate = function(playerName){
  playerName.score = scoreHand(playerName);
 // console.log(playerName);
  var message = "";
  if(playerName.score>21){
    message = " - BUST";
  } else if(playerName.hand.length>=5){
    message = " - 5 CARDS";
  }
  $("#"+playerName.name+"Score").val(playerName.score+message);  
  if((player1.score>21 || player1.hand.length>=5) && inPlay===true){ //this code is NOT for dealer
    inPlay = false;
    finalize(playerName);
  }
  //console.log(playerName.name+"'s hand: "+playerName.hand);
  //console.log(playerName.name+"'s score: "+playerName.score);
};

var finalize = function(playerName){
  
  dealerFinish();
    
  //create results matrix
  var resultArr = [];
  if(player1.score>21){resultArr.push("Y");} else {resultArr.push("N");}
  if(dealer.score>21){resultArr.push("Y");} else {resultArr.push("N");}
  if(player1.hand.length>=5){resultArr.push("Y");} else {resultArr.push("N");}
  if(dealer.hand.length>=5){resultArr.push("Y");} else {resultArr.push("N");}
  var resultCode = resultArr.join();
  //alert(resultArr);
  
  switch(resultCode){
    case "Y,Y,Y,Y": 
      resultStr="tie";
      break;
    case "Y,Y,N,Y": 
      resultStr="tie";
      break;
    case "Y,Y,Y,N": 
      resultStr="tie";
      break;
    case "Y,Y,N,N": 
      resultStr="tie";
      break;
    case "N,N,Y,Y": 
      resultStr="tie";
      break;
    case "N,Y,Y,Y": 
      resultStr="win";
      break;
    case "N,Y,Y,N": 
      resultStr="win";
      break;
    case "N,Y,N,Y": 
      resultStr="win";
      break;
    case "N,Y,N,N": 
      resultStr="win";
      break;
    case "N,N,Y,N": 
      resultStr="win";
      break;
    case "Y,N,Y,Y": 
      resultStr="lose";
      break;
    case "Y,N,N,Y": 
      resultStr="lose";
      break;
    case "Y,N,Y,N": 
      resultStr="lose";
      break;
    case "Y,N,N,N": 
      resultStr="lose";
      break;
    case "N,N,N,Y": 
      resultStr="lose";
      break;
    default:
      if(player1.score>dealer.score){
        resultStr="win";
      } else if(player1.score<dealer.score) {
        resultStr="lose";
      } else {
        resultStr="tie";
      }
  }
  //alert(resultStr);
  //$("#player1Score").val(player1.score);
  if(resultStr==="win"){
    wallet = wallet + Number(wager); 
    $("#message").text(message("win")).show(500).delay(1000).hide(200);
    //alert("You Win! :-D");
  } else if (resultStr==="lose"){
    wallet = wallet - Number(wager); 
    //alert("You Lose :-(");
  } else {
    alert("Its a tie.");
  }
  $("#wallet").val(wallet);
   checkGameOver();
  $("#hit").hide(200); 
  $("#stay").hide(200); 
};

var dealerFinish = function() { 
  while(dealer.score<17){
    hit(dealer);  
  }
};

var checkGameOver = function(){
  //console.log("checkGameOver() running.");
  if(wallet<1){
    $("#wallet").addClass("required");
    alert("You are bankrupt!!!");
    $(".showDuringGame").hide(0);
    $("#gameover").text("GAME OVER").show(200);
  } else {
    $("#newgame").fadeIn(800);
  }
};

var message = function(result){
  var possible; var rand;
  if(result==="win"){
    possible = ["You rock my socks off!","You da bomb!","Ooooooohhhh YEEEAAAHHHH!","Good job...I guess.","How did you win again?!","Good job, Blackjack Jedi!","BOOM goes the dynamite!","You're a winner!"];
    rand = Math.floor(Math.random()*possible.length);
    return possible[rand];
  } else if(result==="shuffle"){
    possible = ["Just ran out of cards, so I am re-shuffling...!","Shuffling now...","Time to shuffle...","Shuffling...","Used all 52 cards. Time for a new deck.."];
    rand = Math.floor(Math.random()*possible.length);
    return possible[rand];
  } else if (result==="lose"){
    return "Game over, bitch!";
  } else {
    alert("error:  message isn't working right");
  }
  
};

var identify = function(cardNum){
  var suit;
  var number;
  if(cardNum<=13){ //determine suit
    suit = "hearts";
  } else if(cardNum<=26){
    suit = "diams";
  } else if(cardNum<=39){
    suit = "clubs";
  } else {
    suit = "spades";
  }
  switch(cardNum%13){ //determine numbers/faces of cards
    case 1: number = "A"; break;
    case 11: number = "J"; break;
    case 12: number = "Q"; break;
    case 0: number = "K"; break;
    default: number = cardNum%13;
  }
  cardDescription = number+" of "+suit;
  //console.log(cardDescription);
  return [number, suit];
};

var checkWager = function(){
  wager = $("#wager").val();
  //console.log("wager value: "+wager);
  if(wager==="?"){
    alert("You must enter a valid wager amount.");
    $("#wager").addClass("required");
    return false;
  } else if (wager>wallet) {
    alert("You don't have enough money!");
    $("#wager").addClass("required");
    $("#wallet").addClass("required");
    return false;
  } else {
    $("#wager").prop("readonly",true);
    $("#wager").removeClass("required");
    return true;
  }
};

var shuffleDeck = function(){
  var newDeck = [];
  var newCard = 0;
  var unique;
  var match;
  
  for(i=1;i<=52;i++){ //pick random card for each place in deck
    //console.log("---picking card #"+i+"---");
    unique = false; 
    while(unique===false){ //get random #'s until you find one not already used
      newCard = Math.floor((Math.random()*52)+1); //get random #
      //console.log("random proposed card is "+newCard);
      //console.log("current deck: "+newDeck);
      match = 0;
      for(j=0;j<newDeck.length;j++){
        if(newCard===newDeck[j]){match++;} //check # against other #'s in deck
      }
      if(match===0){unique=true;} //if no match, card is unique
      //console.log("Unique? "+unique);
    } 
    
    newDeck.push(newCard); //add unique card to deck
    //console.log("unique card is added");
    //console.log("deck is now "+newDeck);
    
  }  
  //console.log("Here is the new deck:");
  //console.log(newDeck);
  return newDeck;
};

var deck = shuffleDeck(); 

var start = function() { 
  inPlay = true;
  player1 = new Player("player1");
  console.log(player1);
  dealer = new Player("dealer");
  console.log(dealer);
  handCount++;
  $("#handCount").val(handCount);
  deal(player1);
  deal(dealer);
  deal(player1);
  deal(dealer);
  $("#hit").show(200); 
  $("#stay").show(200);
  $("#newgame").hide(0);
  $("#message").hide(0);
  $("#gameover").hide(0);
  $("#wager").prop("readonly",false);
  $("#wager").val(wager);
};

