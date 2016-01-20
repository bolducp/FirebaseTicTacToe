"use strict";


//$(document).ready(init);

var gameRef = new Firebase('https://tictactoefirebase.firebaseio.com/');
var symbolsRef = gameRef.child("playerSybmols");

var userid = Math.floor(Math.random() * 10000000);

var amOnline = new Firebase('https://tictactoefirebase.firebaseio.com/.info/connected');
var userRef = new Firebase('https://tictactoefirebase.firebaseio.com/presence/' + userid);

var moveCount = 0;

amOnline.on('value', function(snapshot){
  if (snapshot.val()){
    userRef.onDisconnect().remove();
    userRef.set(true);

    gameRef.once("value", function(snap){
      var numPlayers = snap.child("presence").numChildren();
      assignPlayerSymbol(numPlayers);
    })
    console.log("running");
  }
})


function assignPlayerSymbol(numPlayers){
  if (numPlayers === 1){
    symbolsRef.set({"X": userid})
  } else if (numPlayers === 2){
    symbolsRef.update({"O": userid})
  }
}





//
// var gameApp = {};
// gameApp.playerXtiles = [];
// gameApp.playerOtiles = [];
// gameApp.currentPlayer = "X";
//
// function init(){
//   clickHandler();
// }
//
// function clickHandler(){
//   $('.tile').click(tileClicked);
//   $('#reset').click(reset);
// }
//
// function tileClicked(event){
//   if (gameApp.currentPlayer === "X"){
//     playerXMove($(this));
//   } else {
//     playerOMove($(this));
//   }
// }
//
// function playerXMove($tile){
//   $('h3').text("Player O's move:");
//   $tile.append($('<div>X</div>'));
//   $tile.addClass('unselectable');
//   gameApp.playerXtiles.push($tile.data("tile"));
//   gameApp.currentPlayer = "O";
//
//   if (checkForWin(gameApp.playerXtiles)){
//     $(".tile").addClass("unselectable");
//     gameWon("X");
//   } else {
//   checkForStaleMate();
//   }
// }
//
// function playerOMove($tile){
//   $('h3').text("Player X's move:");
//   $tile.append($('<div>O</div>'));
//   $tile.addClass('unselectable');
//   gameApp.playerOtiles.push($tile.data("tile"));
//   gameApp.currentPlayer = "X";
//
//   if (checkForWin(gameApp.playerOtiles)){
//     $(".tile").addClass("unselectable");
//     gameWon("O");
// } else {
//   checkForStaleMate();
//   }
// }
//
// function checkForStaleMate(){
//   if(gameApp.playerXtiles.concat(gameApp.playerOtiles).length === 9) {
//     $('h3').text("It's a stalemate!");
//   }
// }
//
// function checkForWin(playerTiles){
//   var playerTilesArray = playerTiles.concat();
//   var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7],
//         [2, 5, 8], [0, 4, 8], [2, 4, 6]];
//
//   for (var i = 0; i < winningCombos.length; i++){
//       var playerCount = 0;
//       for (var j = 0; j < winningCombos[i].length; j++){
//         if (playerTilesArray.indexOf(winningCombos[i][j]) > -1){
//           playerCount += 1;
//         }
//       if (playerCount === 3){
//         return true;
//       }
//     }
//   } return false;
// }
//
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
