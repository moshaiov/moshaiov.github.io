level_1_starting_pieces = {
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
};

xy_dict = {a:[0,0],b:[2,0],c:[4,0],
           d:[1,1],e:[3,1],
           f:[0,2],g:[2,2],h:[4,2],
           i:[1,3],j:[3,3],
           k:[0,4],l:[2,4],m:[4,4]}

grid_size = 5
var pixels = 200
var king_color = "orange"
var pawn_color = "teal"
var vacant_color = "brown"
var clicked_color = "red"

canvas=document.getElementById('canvas');
ctx=canvas.getContext('2d');

function isGridPoint(point) {
  grid = {};
  for(key in xy_dict){grid[xy_dict[key]]="";} /* Transform the array in a dict */
  return point in grid;
}

function pixelToGrid(x,y) {
  x = Math.floor((x/pixels)*grid_size)
  y = Math.floor((y/pixels)*grid_size)
  return [x,y]
}

function middle(start,end) {
  xMid=(start[0]+end[0])/2
  yMid=(start[1]+end[1])/2
  return [xMid,yMid]
}

//start,end points given as [x,y].
function isValidBoardJump(start,end) {
  if(!(isGridPoint(start) && isGridPoint(end))) {return false}
  //checking for same point or full diagonal. otherwise check if midpoint in grid.
  if(start[0]===end[0] && start[1]===end[1]) {return false}
  if(Math.abs(end[0]-start[0])+Math.abs(end[1]-start[1])===8) {return false}

  return isGridPoint(middle(start,end))
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

function draw_square(point,color) {
  ctx.fillStyle=color
  ctx.fillRect(pixels*point[0]/grid_size,pixels*point[1]/grid_size,pixels/grid_size,pixels/grid_size)
}

function markSquare(point) {
  ctx.fillStyle=clicked_color
  len = pixels/(2*grid_size)
  ctx.fillRect(pixels*point[0]/grid_size+len/2,pixels*point[1]/grid_size+len/2,len,len)
}

function get_color_by_piece(piece) {
  if(piece=="king")
    return king_color
  if(piece=="pawn")
    return pawn_color
  if(piece=="vacant")
    return vacant_color
}


function getNumPawns(starting_pieces) {
  ret=0
  for(var key in starting_pieces) {
    if(starting_pieces[key]==="pawn") {
      ret=ret+1
    }
  }
  return ret
}

// Define a class like this
function Game(starting_pieces){
   // Add object properties like this
   this.pieces = starting_pieces;
   this.selected = "none"
   this.numPawns = getNumPawns(starting_pieces)
}

// Add methods like this.  All Person objects will be able to invoke this
Game.prototype.draw = function(){
  console.log("drawing game");
  for (var key in this.pieces) {
      draw_square(xy_dict[key],get_color_by_piece(this.pieces[key]))
  }
  if(!(this.selected==="none")) {
    markSquare(this.selected)
  }
};

Game.prototype.getPoint = function(point) {
  for(var key in xy_dict) {
    if(xy_dict[key][0]===point[0] && xy_dict[key][1]===point[1]) {
      return this.pieces[key]
    }
  }
}

Game.prototype.setPoint = function(point,piece) {
  for(var key in xy_dict) {
    if(xy_dict[key][0]===point[0] && xy_dict[key][1]===point[1]) {
      this.pieces[key] = piece
    }
  }
}


Game.prototype.validSelection = function(point) {
  return (this.getPoint(point)==="king" || this.getPoint(point)==="pawn")
}

//start and end given as [x,y].
Game.prototype.isValidJump = function(start,end) {
  if(!isValidBoardJump(start,end)) {return false}
  return (!(this.getPoint(start)==="vacant")) && this.getPoint(end)==="vacant" && this.getPoint(middle(start,end))==="pawn"
}

//jump assumed valid
Game.prototype.makeJump = function(start,end) {
  this.numPawns = this.numPawns - 1
  this.setPoint(end, this.getPoint(start))
  this.setPoint(start,"vacant")
  this.setPoint(middle(start,end),"vacant")
}

Game.prototype.click = function(point){
  console.log("click")
  console.log(point)

  //case A: no piece was selected
  if(this.selected==="none") {
    if(this.validSelection(point)) {
      this.selected=point
      this.draw()
    }
  }

  //case B: a piece was selected
  else {
    start = this.selected
    end = point
    this.selected="none"
    if(this.isValidJump(start,end)) {
      this.makeJump(start,end)
    }
    this.draw()
  }

}

// Instantiate new objects with 'new'
var game = new Game(level_1_starting_pieces);

// Invoke methods like this
game.draw();

canvas.addEventListener('click', function(evt) {
  var mousePos = getMousePos(canvas, evt);
  game.click(pixelToGrid(mousePos.x,mousePos.y))
  //console.log(pixelToGrid(mousePos.x,mousePos.y))
});
