'use strict';
var DOORCLOSE = "powderblue;";
var DOOROPEN = "green;";
var NOCAR = ";";
var BUTTONON = "orange;";
var BUTTONOFF = ";";

var KEYBUTTON = 1;
var UPBUTTON = 2;
var DOWNBUTTON =3;

var floors;
var currentFloor=1;
var currentDirection="SLEEP"; //SLEEP, UP, DOWN
var commandOfFloors = []; //{keyButton:false, upButton:false, downButton:false, door:false}
var hInterval;

function getFloors(){
  var s = window.location.href;
  var i = s.indexOf("?Floors=");
  if(i === -1) return 10;
  return Number(s.substr(i+"?floors=".length));
}

window.onload = function (){
  var i;
  var table = document.getElementById('elevatorTable');
  var oneFloor = document.getElementsByClassName('Floor')[0];
  var newFloor; 
  var newRow;

  floors = getFloors();
  console.log("Floors:"+floors);

  for(i=floors;i>2;i--){
    newFloor = oneFloor.cloneNode(true);
    newRow = newFloor.getElementsByTagName("td");
    newRow[0].innerText=i;
    newRow[1].innerText=i;
    table.insertBefore(newFloor, oneFloor);
  }
  for(i=0;i<floors;i++){
    commandOfFloors[i]={keyButton:false, upButton:false, downButton:false, door:false};
  }
}

function onButtonUp(t){
  var r = t.parentElement.getElementsByTagName("td");
  var f = parseInt(r[0].innerText);
  commandOfFloors[f-1].upButton = true;
  turnButtonOn(f, UPBUTTON);
  if(currentDirection != "SLEEP") return;
  if(currentFloor < f){
    currentDirection = "UP";
  }else{
    currentDirection = "DOWN";
  }
  start();
}

function onButtonDown(t){
  var r = t.parentElement.getElementsByTagName("td");
  var f = parseInt(r[0].innerText);
  commandOfFloors[f-1].downButton = true;
  turnButtonOn(f, DOWNBUTTON);
  if(currentDirection != "SLEEP") return;
  if(currentFloor < f){
    currentDirection = "UP";
  }else{
    currentDirection = "DOWN";
  }
  start();
}

function onKeyboard(t){
  console.log("Floor to go:"+t.innerText);
  var target = parseInt(t.innerText);
  commandOfFloors[target-1].keyButton = true;
  turnButtonOn(target, KEYBUTTON);
  if(currentDirection != "SLEEP") return;
  if(currentFloor < target){
    currentDirection = "UP";
  }else{
    currentDirection = "DOWN";
  }
  start();
  //console.log(t.cellIndex);
}
function start(){
  hInterval = setInterval(()=>{move();}, 1000);
}
function stop(){
  clearInterval(hInterval);
}

function setCarStatus(floor, status){
  var theFloor = document.getElementsByClassName('Floor')[floors-floor];
  var cell0 = theFloor.getElementsByTagName("td")[0];
  cell0.style="background-color:"+status;
}
function turnButtonOn(floor, button){
  if(button<KEYBUTTON || button>DOWNBUTTON) return;
  var theFloor = document.getElementsByClassName('Floor')[floors-floor];
  var cell0 = theFloor.getElementsByTagName("td")[button];
  cell0.style="background-color:"+BUTTONON;

}
function turnButtonOff(floor, button){
  if(button<KEYBUTTON || button>DOWNBUTTON) return;
  var theFloor = document.getElementsByClassName('Floor')[floors-floor];
  var cell0 = theFloor.getElementsByTagName("td")[button];
  cell0.style="background-color:"+BUTTONOFF;
}
function hasButtonOn(fromFloor, toFloor){
  var i;
  for(i=fromFloor-1;i<=toFloor-1;i++){
    if(commandOfFloors[i].upButton===true || 
      commandOfFloors[i].keyButton===true || 
      commandOfFloors[i].downButton===true)
      return true;
  }
  return false;
}
function move(){
  var statusFloor=commandOfFloors[currentFloor-1];

  if(currentDirection==="UP"){
    if(currentFloor >= floors){
      currentDirection = "SLEEP";
      if(hasButtonOn(1, floors)) currentDirection = "DOWN";
      return;
    } 
    
    if(statusFloor.door===true){//door is open
      setCarStatus(currentFloor, DOORCLOSE);
      statusFloor.door = false;
      statusFloor.keyButton = false;
      statusFloor.upButton = false;
      turnButtonOff(currentFloor, KEYBUTTON);
      turnButtonOff(currentFloor, UPBUTTON);
      return;
    }
    //door is close
    if(statusFloor.keyButton===true || statusFloor.upButton===true){
      statusFloor.door = true;
      setCarStatus(currentFloor, DOOROPEN);
    }else if(hasButtonOn(currentFloor+1, floors)) {
      setCarStatus(currentFloor, NOCAR);
      currentFloor++;
      setCarStatus(currentFloor, DOORCLOSE);
    }else if(hasButtonOn(1, currentFloor)){
      currentDirection = "DOWN";
    }else{
      currentDirection = "SLEEP";
      stop();
    }
  }else if (currentDirection==="DOWN"){
    if(currentFloor === 1){
      currentDirection = "SLEEP";
      if(hasButtonOn(1, floors)) currentDirection = "UP";
      return;
    }
    if(statusFloor.door===true){//door is open
      setCarStatus(currentFloor,DOORCLOSE);
      statusFloor.door = false;
      statusFloor.keyButton = false;
      statusFloor.downButton = false;
      turnButtonOff(currentFloor, KEYBUTTON);
      turnButtonOff(currentFloor, DOWNBUTTON);
      return;
    }
    //door is close
    if(statusFloor.keyButton===true || statusFloor.downButton===true){
      statusFloor.door = true;
      setCarStatus(currentFloor, DOOROPEN);
    }else if(hasButtonOn(1, currentFloor-1)===true){
      setCarStatus(currentFloor, NOCAR);
      currentFloor--;
      setCarStatus(currentFloor, DOORCLOSE);
    }else if(hasButtonOn(currentFloor, floors)===true){
      currentDirection = "UP";
    }
    else{
      currentDirection = "SLEEP";
      stop();
    }
  }else{
    console.log("current direction is "+currentDirection);
    stop();
  }
}
function moveUpAFloor(){
  var allFloors = document.getElementsByClassName('Floor');
  var i;
  var oneFloor;
  var cell0;
  for (i = allFloors.length-1; i>=0; i--) {
    oneFloor = allFloors[i];
    cell0 = oneFloor.getElementsByTagName("td")[0];
    if(cell0.innerText===currentFloor){
      if(i===0) return;
      setTimeout(() => {alert("Hello");}, 15000);
      cell0.style="";
      oneFloor=allFloors[i-1];
      cell0 = oneFloor.getElementsByTagName("td")[0];
      cell0.style="background-color:powderblue;"
      currentFloor = cell0.innerText;
      console.log(cell0.innerText);
      return;    
    }
  } 

}
//floors = getFloors();
//console.log("Floors:"+floors);
//var t = document.getElementById("elevatorTable");
//console.log(t);
//init();
