//file : kingEatsPawns.js
//brief : the back end of an implementation of a simple video game
//author : Tom M, 21/02/22
//naming convention : variables with camelCase, functions with CamelCase

//game rules :
//1. each game starts with one king and several pawns
//2. the goal of the game is to eliminate the pawns one by one so eventually only the king will remain
//3. the kings and pawns live on the 13 cells a 5x5 grid, those colored "black" on a "chessboard coloring"
//4. a move consists of making one piece (a pawn or the king) jump over a pawn and eating the pawn. [just as in checkers except horizontal and vertical jumps are also allowed]

// ------------------------ THE GRID & ITS CELLS  ------------------------

gridSize = 5
numCells = 13

//there are 13 cells in the game.
//a cell is represented by the array of its x & y coordinates (e.g. [2,4])
//a cell is also represented by a number 0-12
NumberToCell = {0:[0,0],1:[2,0],2:[4,0],
                3:[1,1],4:[3,1],
                5:[0,2],6:[2,2],7:[4,2],
                8:[1,3],9:[3,3],
                10:[0,4],11:[2,4],12:[4,4]}

function X(cell) {
  return cell[0]
}

function Y(cell) {
  return cell[1]
}

function CellToNumber(cell) {
  return (X(cell) + gridSize * Y(cell))/2
}

function IsInt(cell) {
  return Number.isInteger(X(cell)) && Number.isInteger(Y(cell))
}

//the two final checks are redundant given the current implementation and are left for clarity and completeness
function IsValidCell(cell) {
  x = X(cell)
  y = Y(cell)
  return IsInt(cell) && (x+y)%2 === 0 && 0 <= Math.min(x,y) && Math.max(x,y) <= 4
}

function AreCellsDifferent(cell1, cell2) {
  return X(cell1) !== X(cell2) || Y(cell1) !== Y(cell2)
}


function MidPoint(cell1,cell2) {
  x = X(cell1) + X(cell2)
  y = Y(cell1) + Y(cell2)
  return [x/2,y/2]
}

//checks if the two cells don't form a maximal diagonal in the grid (bottomleft to topright corners or bottomright to topleft corners)
function IsNotFullDiagonal(cell1,cell2) {
  dx = Math.abs(X(cell1)-X(cell2))
  dy = Math.abs(Y(cell1)-Y(cell2))
  return dx + dy < 8
}

//important! checks if moving piece from cell1 to cell2 is legal in terms of board geometry (and not the board pieces)
//the latter function is called Game.prototype.IsValidMove(cell1,cell2)
function IsValidGridJump(cell1,cell2) {
  return IsValidCell(MidPoint(cell1,cell2)) && IsValidCell(cell1) && IsValidCell(cell2) && IsNotFullDiagonal(cell1,cell2) && AreCellsDifferent(cell1,cell2)
}

// ------------------------ CANVAS & DRAWING ------------------------

pixels = 350

colorDict = {king:"#6b8764",pawn:"#056b9e",vacant:"gray",clicked:"#ffd500"}

function GetColor(piece) {
  return colorDict[piece]
}

canvas=document.getElementById('kingEatsPawnsCanvas')
ctx=canvas.getContext('2d')
output=document.getElementById('output');

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect()
  return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

//input : two coordinates of mouse click on canvas.
//output : cell clicked
function PixelCoordinatesToCellCoordinates(x,y) {
  x = Math.floor((x/pixels)*gridSize)
  y = Math.floor((y/pixels)*gridSize)
  return [x,y]
}

allowClick = true

canvas.addEventListener('click', function(evt) {
  mousePos = getMousePos(canvas, evt);
  cell = PixelCoordinatesToCellCoordinates(mousePos.x,mousePos.y)
  if(IsValidCell(cell) && allowClick) { game.Click(cell) }
});

function DrawSquare(cell,color) {
  ctx.fillStyle=color
  x = (X(cell) * pixels) / gridSize
  y = (Y(cell) * pixels) / gridSize
  width = pixels/gridSize
  ctx.fillRect(x,y,width,width)
}

function MarkSquare(cell) {
  ctx.fillStyle=colorDict['clicked']
  len = pixels/(2*gridSize)
  x = (X(cell) * pixels) / gridSize + len/2
  y = (Y(cell) * pixels) / gridSize + len/2
  ctx.fillRect(x,y,len,len)
}

// ------------------------ LEVELS ------------------------


//the game board is represented by an array of size 13
//whose indices correspond to grid cells via the function CellToNumber and the dictionary NumberToCell
//and whose values are either "king" "pawn" or "vacant"
randomLevel = ["vacant","pawn","vacant","pawn","pawn","vacant","pawn","vacant","vacant","vacant","vacant","vacant","king"]

levels =
[
['vacant', 'vacant', 'vacant', 'vacant', 'vacant', 'vacant', 'pawn', 'vacant', 'king', 'pawn', 'vacant', 'vacant', 'pawn'],
['vacant', 'vacant', 'vacant', 'vacant', 'vacant', 'king', 'vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn'],
['vacant', 'vacant', 'vacant', 'pawn', 'vacant', 'pawn', 'pawn', 'king', 'vacant', 'vacant', 'pawn', 'vacant', 'vacant'],
['vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'king', 'pawn', 'vacant', 'vacant', 'vacant', 'vacant', 'vacant'],
['king', 'vacant', 'vacant', 'vacant', 'pawn', 'vacant', 'pawn', 'pawn', 'vacant', 'vacant', 'vacant', 'pawn', 'vacant'],
['pawn', 'pawn', 'vacant', 'pawn', 'pawn', 'vacant', 'king', 'vacant', 'vacant', 'vacant', 'vacant', 'pawn', 'vacant'],
['vacant', 'vacant', 'vacant', 'pawn', 'pawn', 'vacant', 'king', 'vacant', 'vacant', 'pawn', 'vacant', 'pawn', 'pawn'],
['king', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn', 'vacant', 'pawn', 'vacant', 'vacant', 'vacant', 'vacant', 'vacant'],
['vacant', 'pawn', 'vacant', 'pawn', 'pawn', 'vacant', 'king', 'vacant', 'pawn', 'pawn', 'vacant', 'pawn', 'vacant'],
['vacant', 'pawn', 'vacant', 'pawn', 'king', 'vacant', 'vacant', 'vacant', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn'],
['pawn', 'pawn', 'vacant', 'pawn', 'pawn', 'king', 'pawn', 'vacant', 'vacant', 'vacant', 'vacant', 'vacant', 'pawn'],
['vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'vacant', 'vacant', 'king', 'pawn', 'vacant', 'pawn', 'vacant'],
['vacant', 'king', 'vacant', 'pawn', 'vacant', 'pawn', 'vacant', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant'],
['vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'vacant', 'king', 'pawn', 'vacant', 'pawn', 'vacant'],
['vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'king', 'pawn', 'vacant'],
['vacant', 'vacant', 'vacant', 'vacant', 'vacant', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'king', 'pawn'],
['pawn', 'pawn', 'vacant', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn', 'vacant', 'pawn', 'king'],
['vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'king', 'pawn', 'vacant', 'pawn', 'vacant'],
['vacant', 'vacant', 'vacant', 'pawn', 'vacant', 'vacant', 'vacant', 'pawn', 'vacant', 'pawn', 'king', 'pawn', 'pawn'],
['vacant', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'king', 'vacant', 'pawn', 'vacant'],
['vacant', 'vacant', 'vacant', 'pawn', 'pawn', 'vacant', 'vacant', 'pawn', 'king', 'pawn', 'vacant', 'pawn', 'pawn'],
['vacant', 'vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn', 'king', 'vacant', 'pawn', 'pawn'],
['king', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'vacant', 'vacant'],
['pawn', 'vacant', 'vacant', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn', 'king', 'pawn', 'vacant', 'pawn', 'pawn'],
['pawn', 'pawn', 'vacant', 'vacant', 'pawn', 'king', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn'],
['vacant', 'vacant', 'vacant', 'pawn', 'king', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn', 'vacant'],
['pawn', 'pawn', 'vacant', 'pawn', 'king', 'vacant', 'pawn', 'pawn', 'vacant', 'pawn', 'vacant', 'vacant', 'pawn'],
['pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'king', 'pawn'],
['vacant', 'pawn', 'vacant', 'king', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn'],
['vacant', 'vacant', 'vacant', 'pawn', 'king', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'vacant'],
['king', 'pawn', 'vacant', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'vacant'],
['pawn', 'pawn', 'king', 'pawn', 'pawn', 'vacant', 'vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
['vacant', 'king', 'pawn', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn', 'vacant', 'pawn', 'vacant', 'vacant', 'pawn'],
['vacant', 'vacant', 'vacant', 'pawn', 'pawn', 'vacant', 'king', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
['king', 'pawn', 'vacant', 'pawn', 'pawn', 'vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
['pawn', 'vacant', 'vacant', 'pawn', 'king', 'pawn', 'vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
['king', 'pawn', 'vacant', 'pawn', 'vacant', 'vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'vacant', 'pawn'],
['pawn', 'pawn', 'pawn', 'vacant', 'pawn', 'king', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'vacant'],
['pawn', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'king', 'pawn', 'vacant'],
['pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'king', 'pawn', 'vacant', 'pawn', 'vacant', 'pawn', 'vacant'],
['pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'king', 'pawn', 'pawn', 'pawn', 'vacant', 'vacant', 'pawn'],
['vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'king', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn', 'vacant'],
['pawn', 'pawn', 'vacant', 'vacant', 'pawn', 'pawn', 'king', 'vacant', 'pawn', 'pawn', 'vacant', 'pawn', 'pawn'],
['vacant', 'vacant', 'pawn', 'pawn', 'pawn', 'vacant', 'king', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
['pawn', 'vacant', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'vacant', 'king', 'pawn', 'vacant'],
['pawn', 'pawn', 'king', 'pawn', 'vacant', 'pawn', 'vacant', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn']
]

console.log(levels.length)

function GetNumPawns(board) {
  ret=0
  for(i=0; i<numCells; i++) {if(board[i]==="pawn") {ret=ret+1}}
  return ret
}

// ------------------------ THE GAME CLASS ------------------------
function Game(levelId){
  this.id = levelId
  this.board = levels[levelId].slice()
  this.numPawns = GetNumPawns(this.board)
  //represent the current clicked cell. if no cell is selected it gets the value "none"
  this.selected = "none"
  //stack of the moves the players made. a move is represented as an array of two cells.
  this.movesMade = []
}

Game.prototype.Draw = function() {
  for(i=0; i<numCells; i++) {
      cell = NumberToCell[i]
      color = GetColor(this.board[i])
      DrawSquare(cell,color)
  }
  if(!(this.selected==="none")) {
    MarkSquare(this.selected)
  }
}

Game.prototype.GetPiece = function(cell) {
  return this.board[CellToNumber(cell)]
}

//piece is either "king", "pawn" or "vacant"
Game.prototype.SetPiece = function(cell,piece) {
  this.board[CellToNumber(cell)] = piece
}

Game.prototype.IsVacant = function(cell) {
  return this.GetPiece(cell)==="vacant"
}

Game.prototype.IsPawn = function(cell) {
  return this.GetPiece(cell)==="pawn"
}

Game.prototype.IsValidMove = function(cell1,cell2) {
  return IsValidGridJump(cell1,cell2) && !(this.IsVacant(cell1)) && this.IsVacant(cell2) && this.IsPawn(MidPoint(cell1,cell2))
}

//this function is redundant given the redundant given the current implementation and is left for clarity and completeness
Game.prototype.IsValidReverseMove = function(cell1,cell2) {
  return IsValidGridJump(cell1,cell2) && this.IsVacant(cell1) && !(this.IsVacant(cell2)) && this.IsVacant(MidPoint(cell1,cell2))
}

Game.prototype.MakeMove = function(cell1,cell2) {
  if(this.IsValidMove(cell1,cell2)) {
    this.movesMade.push([cell1,cell2])
    this.SetPiece(MidPoint(cell1,cell2),"vacant")
    this.numPawns = this.numPawns - 1
    this.SetPiece(cell2, this.GetPiece(cell1))
    this.SetPiece(cell1,"vacant")
    this.HandleEndGameIfNecessary()
  }
}

Game.prototype.ReverseLastMove = function() {
  if(this.movesMade.length > 0) {
    this.UnSelect()
    output.innerHTML = ""
    cells = this.movesMade.pop()
    cell1 = cells[0]
    cell2 = cells[1]
    this.SetPiece(MidPoint(cell1,cell2),"pawn")
    this.numPawns = this.numPawns + 1
    this.SetPiece(cell1, this.GetPiece(cell2))
    this.SetPiece(cell2,"vacant")
  }
}

Game.prototype.HasWon = function() {
  return this.numPawns===0
}

Game.prototype.CannotMakeMove = function() {
  for(i=0; i<numCells; i++) {
    cell1 = NumberToCell[i]
    for(j=0; j<numCells; j++) {
      cell2 = NumberToCell[j]
      if(this.IsValidMove(cell1,cell2)) {
        return false}
    }
  }
  return true
}

Game.prototype.HasLost = function() {
  return this.CannotMakeMove() && !this.HasWon()
}

Game.prototype.HandleEndGameIfNecessary = function() {
  if(this.HasLost()) {output.innerHTML = "no possible moves"}
  else if (this.HasWon()) {output.innerHTML = "You won!"}
}

Game.prototype.NoPieceSelected = function() {
  return this.selected==="none"
}

Game.prototype.SelectPiece = function(cell) {
  if(!this.IsVacant(cell)) {this.selected = cell}
}

Game.prototype.UnSelect = function () {
    this.selected = "none"
}

Game.prototype.Click = function(cell) {
  if(this.NoPieceSelected()) {this.SelectPiece(cell)}
  else {
    this.MakeMove(this.selected,cell)
    this.UnSelect()
  }
  this.Draw()
}

showMovesOn = false

async function ShowMoves() {
  timeFrame = 1000
  output.innerHTML = ""
  moves = game.movesMade
  len = moves.length
  Restart()
  allowClick = false
  setTimeout(() => {allowClick = true},timeFrame*len)

  for(i=0; i<len; i++) {
    setTimeout(() => {
      move = moves.shift()
      game.SelectPiece(move[0])
      game.Draw()
    },  timeFrame*(i+0.5))

    setTimeout(() => {
      game.UnSelect()
      game.MakeMove(move[0],move[1])
      game.Draw()
    },  timeFrame*(i+1))
  }
}

function ReverseLastMove() {
  game.ReverseLastMove()
  game.Draw()
}

function Start(id) {
  game = new Game(id);
  game.Draw()
}

function Restart() {
  output.innerHTML = ""
  Start(game.id)
}

function ChangeLevel() {
  level = document.getElementById('KEP level').value - 1
  if(0 <= level && level < levels.length) {
    Start(level)
    output.innerHTML = ""
  }
}

function changeColor(key) {
    val=document.getElementById(key).value;
    colorDict[key]=val
    game.Draw()
}

Start(0)
