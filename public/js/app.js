// Initialize Firebase
var config = {
  apiKey: "AIzaSyASt9v_WihFeaxRewMGDs4YCp0HO9xLHps",
  authDomain: "proj-informatica.firebaseapp.com",
  databaseURL: "https://proj-informatica.firebaseio.com",
  storageBucket: "proj-informatica.appspot.com",
  messagingSenderId: "13375478751"
};
firebase.initializeApp(config);

var socket  = io.connect();
var messages = firebase.database().ref("messages");
var players = firebase.database().ref("players");
var words = firebase.database().ref("Objs");
var turn = firebase.database().ref("turn");
var numberOfGames = firebase.database().ref("NOG");
var round = 0;
var nextturn = 0;
var counter = 0;
var gamesArr = [];
var wordsArr = [];
var playersArr = [];
var chosenWord = "";
$("#info-draw").hide();
$("#dibujo").hide();
var player = prompt("Escriba el nombre del jugador");
if (player != null) {
	players.child(player).set({name : player});
	$("#pnamediv").append("<span id='pname'>" + player + "</span>");

}
$("#waiting-screen h1").html("¡BIENVENIDO/A " + player + "!");
words.on('value', function(data) {
    data.forEach(function(data) {
        wordsArr.push(data.val());
    });
    turn.on("value", function(rounds){
    	chosenWord = wordsArr[rounds.val().round];
    	$(".info").html("<p id='dibujo'>Dibujar: <span id='info-draw'>" + chosenWord + "</span></p>");
    });
});

players.on("value", function(data){	
	if(Object.keys(data.val()).length === 4){
    $("#waiting-screen").remove();
    $("#game-wrapper").removeClass("hiddenc");
		data.forEach(function(data){
			playersArr.push(data.val().name);
			playersArr.sort();
      $("#players").append("<li>" + data.val().name + "</li>");
		});
		
		turn.on("value", function(turns){
			var chosenPlayer = playersArr[turns.val().turn];
			if(chosenPlayer === $("#pname").text()){
        $("#info-draw").show();
        $("#dibujo").show();
        $("#player-info").hide();
			}else{
        $(".info").append("<span id='player-info'>Es turno de: " + chosenPlayer + "</div>");
        $("#info-draw").hide();
        $("#dibujo").hide();
      }
		});

	}

});

messages.on("child_added", function(msg) {
    $("#chat").append("<li class='"+msg.val().sentBy+"'>" +  msg.val().sentBy + ": " + msg.val().body +"</li>"); 	
	if($("#info-draw").text() === msg.val().body){
		counter += 1;
		numberOfGames.child(counter).set({winner: msg.val().sentBy});
	}
});

numberOfGames.on("value", function(data){
	if(Object.keys(data.val()).length === 10){
		data.forEach(function(each){
			gamesArr.push(each.val().winner);
			gamesArr.sort();
		});
		var mf = 1;  
		var m = 0;  
		var item;  
		for (var i=0; i<gamesArr.length; i++)  
		{  
		        for (var j=i; j<gamesArr.length; j++)  
		        {  
		                if (gamesArr[i] == gamesArr[j])  
		                 m++;  
		                if (mf<m)  
		                {  
		                  mf=m;   
		                  item = gamesArr[i];  
		                }  
		        }  
		        m=0;  
		}
    $("#game-wrapper").addClass("hiddenc");
    $("#winner-screen h1").html("EL GANADOR ES " + item + ", ¡FELICITACIONES!");
    $("#winner-screen").removeClass("hiddenc");

	}
});

messages.on("child_removed", function(data){
	$("#chat #" + data.key).remove();
});

messages.on("child_added", function(msg){
  if($("#info-draw").text() === msg.val().body){
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
});

$("form").on("submit", function(e){
	e.preventDefault();
	messages.push().set({body: $("#mtext").val(), sentBy: $("#pname").text()});
	if($("#info-draw").text() === $("#mtext").val()){
		nextturn = rand(3);
		round = rand(10);
		turn.update({round: round, turn: nextturn});
	}
  $("#mtext").val("");

});


   var mouse = { 
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('drawingCanvas');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth;
   var height  = window.innerHeight;
   

   // set canvas to full browser width/height
canvas.height = window.innerHeight * 0.85;
canvas.width = window.innerWidth * 0.70;

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.move = true;
   };

   // draw line received from server
	socket.on('draw_line', function (data) {
      var line = data.line;
      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
      context.stroke();
   });
   
   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   mainLoop();


function rand(limit){
	return Math.floor((Math.random() * limit) + 1);
}

window.onbeforeunload = function() {
  return "¿Seguro que quieres salir del juego?";
}