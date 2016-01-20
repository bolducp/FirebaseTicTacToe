"use strict";

$(document).ready(init);

function init(){
  $('.tile').click(playerMove);
  $('#reset').click(reset);
}

var gameRef = new Firebase('https://tictactoefirebase.firebaseio.com/');
var symbolsRef = gameRef.child("playerSybmols");
var currentPlayerRef = gameRef.child('currentPlayer');
var boardRef = gameRef.child("board");
var userid = Math.floor(Math.random() * 10000000);
var userRef = new Firebase('https://tictactoefirebase.firebaseio.com/presence/' + userid);
var playerSymbol;

assignPlayerSymbol();

function assignPlayerSymbol(){
  symbolsRef.once('value', function(snapshot){
    if (snapshot.numChildren() === 0){
        playerSymbol = "X";
        symbolsRef.set({"X": userid});
        $('h5').text("You are player X");
    } else if (snapshot.numChildren() === 1) {
        playerSymbol = "O";
        symbolsRef.update({"O": userid});
        $('h5').text("You are player O");
    } else {
        alert("Sorry, we already have two players! But you can watch the game.");
        $('#reset').off('click');
        }
    })
}

initializeBoard();

function initializeBoard(){
  gameRef.once("value", function(snapshot){
    var hasBoard = snapshot.hasChild("board");
    if (!hasBoard){
      currentPlayerRef.set("X");
      boardRef.set({0: " ", 1: " ", 2: " ", 3: " ", 4: " ", 5: " ", 6: " ", 7:" ", 8: " "});
    }
  })
}

currentPlayerRef.on("value", function(snapshot){
  var currentPlayer = snapshot.val();
  $('h4').text("It's player " + currentPlayer + "'s turn!");
  if (currentPlayer !== playerSymbol){
    $('.tile').off("click");
  } else {
    $('.tile').click(playerMove);
  }
})

function playerMove(){
  var $tile = $(this);
  var tileNum = $tile.data("tile");
  var boardPosition = {};
  boardPosition[tileNum] = playerSymbol;
  boardRef.update(boardPosition);
  currentPlayerRef.transaction(function(currentPlayer) {
    return currentPlayer === "X" ? "O" : "X";
  });
}

boardRef.on('value', function(snapshot){
  $('.tile').empty();
  var board = snapshot.val();
  for (var index in board){
    var $playerMarker = $('<div>').text(board[index]);
    var $tile = $('[data-tile="' + index +'"]');
    $tile.append($playerMarker);

    if (board[index] === "X" || board[index] === "O" ){
      $tile.addClass("unselectable");
    }
  }
  checkWin("X");
  checkWin("O");

  function checkWin(playerSymbol){
    var playerHand = [];
    for (var key in snapshot.val()){
      if (snapshot.val()[key] === playerSymbol){
        playerHand.push(parseInt(key));
      }
    }
    var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7],
    [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (var i = 0; i < winningCombos.length; i++){
      var playerCount = 0;
      for (var j = 0; j < winningCombos[i].length; j++){
        if (playerHand.indexOf(winningCombos[i][j]) > -1){
          playerCount += 1;
        }
        if (playerCount === 3){
          return gameWon(playerSymbol);
        }
      }
    }
    checkForStaleMate();
  }

  function checkForStaleMate(){
    var board = snapshot.val();
    for (var prop in board){
      if (board[prop] !== "X" && board[prop] !== "O"){
        return;
      }
    }
    //$('h4').remove();
    //$('h3').text("it's a stalemate! Game Over.").css({color: "DarkSalmon", fontWeight: "bolder" }).addClass("animated jello");
  }
});

function gameWon(playerSymbol){
  $('h3').text('Player ' + playerSymbol + ' wins!!');
  $('.tile').addClass("animated rubberBand");
  $('h3').css({color: "DarkSalmon", fontWeight: "bolder" }).addClass("animated jello");
  $('.tile').addClass("unselectable");
  $('h4').remove();
}

function reset(){
  currentPlayerRef.set("X");
  boardRef.set({0: " ", 1: " ", 2: " ", 3: " ", 4: " ", 5: " ", 6: " ", 7:" ", 8: " "});
  $('.tile').removeClass('unselectable');
  $('.tile').empty();
  $('h3').text("Player X begins the game:");
  $('h3').removeClass().css({color: "black", fontWeight: "normal" });
}
