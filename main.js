"use strict";


$(document).ready(init);

function init(){
  $('.tile').click(playerMove);
  //$('#reset').click(reset);
}

var gameRef = new Firebase('https://tictactoefirebase.firebaseio.com/');
var symbolsRef = gameRef.child("playerSybmols");
var currentPlayerRef = gameRef.child('currentPlayer');

var boardRef = gameRef.child("board");

var userid = Math.floor(Math.random() * 10000000);

//var amOnline = new Firebase('https://tictactoefirebase.firebaseio.com/.info/connected');
var userRef = new Firebase('https://tictactoefirebase.firebaseio.com/presence/' + userid);
var playerSymbol;


symbolsRef.once('value', function(snapshot){
  if (snapshot.numChildren() === 0){
      assignPlayerSymbol(1);
    } else if (snapshot.numChildren() === 1) {
      assignPlayerSymbol(2);
    }
})

updateBoard();

function assignPlayerSymbol(numPlayers){
  if (numPlayers === 1){
    playerSymbol = "X";
    checkPlayer();
    symbolsRef.set({"X": userid})
  } else if (numPlayers === 2){
    playerSymbol = "O";
    checkPlayer();
    symbolsRef.update({"O": userid})
  } else {
    //dontAllowPlayer();
  }
}

function initializeBoard(){
  gameRef.once("value", function(snapshot){
    var hasBoard = snapshot.hasChild("board");
    if (!hasBoard){
      currentPlayerRef.set("X");
      boardRef.set({0: " ", 1: " ", 2: " ", 3: " ", 4: " ", 5: " ", 6: " ", 7:" ", 8: " "});
    }
  })
}

initializeBoard();

// function checkPlayer(){
//   if(players[currentPlayer] === timestamp.toString()){
//     $theButton.prop('disabled', false);
//   } else {
//     $theButton.prop('disabled', true);
//   }
// }


function checkPlayer(){
  currentPlayerRef.on("value", function(snapshot){
    var currentPlayer = snapshot.val();

    if (currentPlayer !== playerSymbol){

      $('.tile').off("click");
    } else {

      $('.tile').click(playerMove);
    }
  })
}



function playerMove(){
  console.log("CLICKED");
  var $tile = $(this);
  var tileNum = $tile.data("tile");

  //$('h3').text("Player" + playerSymbol + "'s move:");
  var boardPosition = {};
  boardPosition[tileNum] = playerSymbol;
  boardRef.update(boardPosition);

  currentPlayerRef.once("value", function(snapshot){
    var currentPlayer = snapshot.val();
    console.log("current player", currentPlayer);
    var nextPlayer = currentPlayer === "X" ? "O" : "X";
    currentPlayerRef.set(nextPlayer);

  if (checkForWin()) {
    console.log(playerSymbol + " wins!!!")
  } else if (checkForStaleMate()) {
    console.log("it's a tie!!!")
  }
  updateBoard();

  })



//   if (checkForWin(gameApp.playerOtiles)){
//     $(".tile").addClass("unselectable");
//     gameWon("O");
// } else {
//   checkForStaleMate();
//   }
}

function updateBoard(){
boardRef.on('value', function(snapshot){

  $('.tile').empty();
  // snapshot.val().forEach(function(elem, i){
  //   var $playerMarker = $('<div>').text(elem);
  //   var tile = $('.tile').data('tile', key);
  //   $tile.append($playerMarker);
  //
  // })
  for (var key in snapshot.val()){
    var $playerMarker = $('<div>' + snapshot.val()[key] + '</div>');
    var $tile = $('[data-tile="' + key +'"]');
    // $(`.tile[data-tile = ${key}]`)
    $tile.append($playerMarker);

    if (snapshot.val()[key] === "X" || snapshot.val()[key] === "O" ){
      $tile.addClass("unselectable");
    }
  }
});
}



function checkForStaleMate(){
  boardRef.once("value", function(snapshot){
    var board = snapshot.val();
    for (var prop in board){
      if (board[prop] !== "X" && board[prop] !== "O"){
        return false;
      }
    }
    return true;
  })
}


function checkForWin(){
  boardRef.once('value', function(snapshot){
    var playerHand = [];
    for (var key in snapshot.val()){
      if (snapshot.val()[key] === playerSymbol){
        playerHand.push(parseInt(key));
      }
    }
    console.log("playerhand", playerHand);
    var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7],
    [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (var i = 0; i < winningCombos.length; i++){
      var playerCount = 0;
      for (var j = 0; j < winningCombos[i].length; j++){
        if (playerHand.indexOf(winningCombos[i][j]) > -1){
          playerCount += 1;
        }
        if (playerCount === 3){
          console.log("TRUE")
          return true;
        }
      }
    } console.log("FALSE");
    return false;
  });
}



// function gameWon(playerSymbol){
//   $('h3').text('Player ' + playerSymbol + ' wins!!');
//   $('.tile').addClass("animated rubberBand");
//   $('h3').css({color: "DarkSalmon", fontWeight: "bolder" }).addClass("animated jello");
// }
//
// function reset(){
//   gameApp = {
//    playerXtiles : [],
//    playerOtiles : [],
//    currentPlayer : "X"
//   }
//   $('.tile').removeClass('unselectable');
//   $('.tile').empty();
//   $('h3').text("Player X begins the game:");
//   $('h3').removeClass().css({color: "black", fontWeight: "normal" });
// }
