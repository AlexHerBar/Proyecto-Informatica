// Initialize Firebase
var config = {
  apiKey: "AIzaSyASt9v_WihFeaxRewMGDs4YCp0HO9xLHps",
  authDomain: "proj-informatica.firebaseapp.com",
  databaseURL: "https://proj-informatica.firebaseio.com",
  storageBucket: "proj-informatica.appspot.com",
  messagingSenderId: "13375478751"
};
firebase.initializeApp(config);

var messages = firebase.database().ref("messages");

messages.on("child_added", function(data) {
    $("#chat").append("<li id='"+data.key+"'>" + data.val().body + "</li>");
});

$("form").on("submit", function(e){
	e.preventDefault();
	messages.push().set({body: $("#mtext").val()});
	$("#mtext").val("");
})

var canvas = document.getElementById("drawingCanvas");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.70;

$(canvas).mousedown(function(e){
  var mouseX = e.pageX;
  var mouseY = e.pageY;
		
  paint = true;
  addClick(mouseX, mouseY);
  redraw();
});

$(canvas).mousemove(function(e){
  var mouseX = e.pageX ;
  var mouseY = e.pageY ;
  if(paint){
    addClick(mouseX, mouseY, true);
    redraw();
  }
});

$(canvas).mouseup(function(e){
  paint = false;
});

$(canvas).mouseleave(function(e){
  paint = false;
});

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  
  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 2;
			
  for(var i=0; i < clickX.length; i++) {		
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
}