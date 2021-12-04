//todo:
//select level
// undo button
// be able to change selection color
// responsive
// cheating buttons : is winnable, how many winnable moves

const levels = [
{
a:"vacant",
b:"king",
c:"vacant",
d:"pawn",
e:"pawn",
f:"vacant",
g:"pawn",
h:"vacant",
i:"vacant",
j:"vacant",
k:"vacant",
l:"vacant",
m:"vacant"
},
{
a:"vacant",
b:"pawn",
c:"vacant",
d:"pawn",
e:"pawn",
f:"vacant",
g:"pawn",
h:"vacant",
i:"vacant",
j:"vacant",
k:"vacant",
l:"vacant",
m:"king"
}
]

xy_dict = {a:[0,0],b:[2,0],c:[4,0],
           d:[1,1],e:[3,1],
           f:[0,2],g:[2,2],h:[4,2],
           i:[1,3],j:[3,3],
           k:[0,4],l:[2,4],m:[4,4]}

grid = {};
for(key in xy_dict){grid[xy_dict[key]]="";}

grid_size = 5
var pixels = 200
color_dict = {king:"gray",pawn:"teal",vacant:"brown",clicked:"red"}


canvas=document.getElementById('canvas');
ctx=canvas.getContext('2d');
output=document.getElementById('output');

function isEqual(pointA,pointB) {
  return pointA[0]===pointB[0] && pointA[1]===pointB[1]
}

function isGridPoint(point) {
  return point in grid;
}

function pixelToGrid(x,y) {
  x = Math.floor((x/pixels)*grid_size)
  y = Math.floor((y/pixels)*grid_size)
  return [x,y]
}

function middle(pointA,pointB) {
  xMid=(pointA[0]+pointB[0])/2
  yMid=(pointA[1]+pointB[1])/2
  return [xMid,yMid]
}

function isFullDiagonal(pointA,pointB) {
  return 8 === Math.abs(pointB[0]-pointA[0]) + Math.abs(pointB[1]-pointA[1])
}

function isValidBoardJump(start,end) {
  if( !isGridPoint(start) || !isGridPoint(end) || isEqual(start,end) || isFullDiagonal(start,end) ) {return false}
  return isGridPoint(middle(start,end))
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

function drawSquare(point,color) {
  ctx.fillStyle=color
  ctx.fillRect(pixels*point[0]/grid_size,pixels*point[1]/grid_size,pixels/grid_size,pixels/grid_size)
}

function markSquare(point) {
  ctx.fillStyle=color_dict['clicked']
  len = pixels/(2*grid_size)
  ctx.fillRect((pixels*point[0])/grid_size+len/2,(pixels*point[1])/grid_size+len/2,len,len)
}

function getColor(piece) {
  return color_dict[piece]
}

function getNumPawns(starting_board) {
  ret=0
  for(var key in starting_board) {
    if(starting_board[key]==="pawn") {
      ret=ret+1
    }
  }
  return ret
}

//game class
function Game(starting_board){
   this.board = starting_board;
   this.selected = "none" //either none, or point
   this.numPawns = getNumPawns(starting_board)
}

Game.prototype.draw = function() {
  for(var key in this.board) {
      drawSquare(xy_dict[key],getColor(this.board[key]))
  }
  if(!(this.selected==="none")) {
    markSquare(this.selected)
  }
}

Game.prototype.getPiece = function(point) {
  for(var key in xy_dict) {
    if(isEqual(xy_dict[key],point)) {
      return this.board[key]
    }
  }
}

Game.prototype.setPiece = function(point,piece) {
  for(var key in xy_dict) {
    if(isEqual(xy_dict[key],point)) {
      this.board[key] = piece
    }
  }
}

Game.prototype.validSelection = function(point) {
  return (this.getPiece(point)==="king" || this.getPiece(point)==="pawn")
}

Game.prototype.isValidJump = function(start,end) {
  return isValidBoardJump(start,end) && !(this.getPiece(start)==="vacant") && this.getPiece(end)==="vacant" && this.getPiece(middle(start,end))==="pawn"
}

//jump assumed valid
Game.prototype.makeJump = function(start,end) {
  this.numPawns = this.numPawns - 1
  this.setPiece(end, this.getPiece(start))
  this.setPiece(start,"vacant")
  this.setPiece(middle(start,end),"vacant")
}

Game.prototype.checkWon = function() {
  //we don't allow eating the king anyway
  return this.numPawns===0
}

Game.prototype.numMoves = function() {
  ret=0
  for(var key1 in xy_dict) {
    for(var key2 in xy_dict) {
      if(this.isValidJump(xy_dict[key1],xy_dict[key2])) {
        ret = ret + 1
      }
    }
  }
  return ret
}

Game.prototype.checkLost = function() {
  return this.numMoves()===0 && !this.checkWon()
}

Game.prototype.click = function(point) {
  if(this.selected==="none") {
    if(this.validSelection(point)) {
      this.selected=point
    }
  }
  else {
    start = this.selected
    end = point
    this.selected="none"
    if(this.isValidJump(start,end)) {
      this.makeJump(start,end)
    }
  }

  this.draw()
  if(this.checkWon()) {
    setTimeout(() => {output.value = "you won!"},250)
  }
  if(this.checkLost()) {
    setTimeout(() => {output.value = "no possible moves :("},500)
  }
}

var level=1
var game = new Game(levels[level]);
game.draw();

canvas.addEventListener('click', function(evt) {
  var mousePos = getMousePos(canvas, evt);
  game.click(pixelToGrid(mousePos.x,mousePos.y))
});

function changeColor(x) {
    val=document.getElementById(x).value;
    color_dict[x]=val
    game.draw()
}
