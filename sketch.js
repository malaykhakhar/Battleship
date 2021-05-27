//0 black
//1 ship placed
//2 fire (miss)
//3 fire (hit)
//4 fire (Destroyed)
var playerBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var computerBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

availableMoves = {   //has available moves => choose random moves from here to avoid conflicts
  0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  6: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  7: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  8: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  9: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
};


//************* Boat data
var boats = ["patrolboat", "battleship", "submarine", "aircraft carrier", "Motherboat"];
var boatsPlaced = [false, false, false, false, false];
var playerBoatsPositions = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
var computerBoatsPositions = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];    //i,j,(0 for vertical,1 for horizontal)
const boatLenghts = [2, 3, 3, 4, 5];
var playerBoatsAlive = [true, true, true, true, true];
var computerBoatsAlive = [true, true, true, true, true];
var computerBoatsPoints = [[], [], [], [], []];
var computerBoatsFlags = [0, 0, 0, 0, 0];
var playerBoatsFlags = [0, 0, 0, 0, 0];
var playerBoatsPoints = [[], [], [], [], []]
var flag = [0, 0, 0, 0, 0];
var probableMoves = []  //will have position + direction   => eg. if i,j is a hit , then mark (i-1,j,"up")  to indicate to hit only in the up direction next
var bufferMoves = []  //to store only the possibleMoves of a particular position and its adjacent (if any one of the moves in bufferMoves is a hit then add to possibleMoves)
let winstatus = 0;
//*************
let boatDirection = 0;
let rotateButtonActivated = false;
let resetButtonActivated = false;
let startButtonActivated = false;
var boatSelected = -1;//[false,false,false,false,false];
let w; // = width / 3;
let h; // = height / 3;
let boardWidth;
let boardHeight;
let ai = 'X';
let human = 'O';
let currentPlayer = human;
let gameStarted = false;

function setup() {
  createCanvas(1000, 800);
  boardWidth = width * 0.45;
  boardHeight = height * 0.567;
  w = boardWidth / 10;
  h = boardHeight / 10;
  placeComputerBoats();
}
function getButtonClickedOn(x, y) {
  if (x >= 398 && x <= 600) {
    if (y > 525 && y < 545) {
      if (x > 398 && x < 440) {
        return 1;  //1 for rotate
      }
      else if (x > 478 && x < 520) {
        return 2;  //2 for Reset
      }
      else if (x > 548 && x < 590) {
        return 3;  //3 for Start
      }
    }
  }
  return -1;
}
function handleButtons(a) {
  if (a == 1 && rotateButtonActivated) {
    boatDirection = boatDirection == 0 ? 1 : 0;
  }
  else if (a == 2 && resetButtonActivated) {
    playerBoatsPoints = [[], [], [], [], []];
    boatsPlaced = [false, false, false, false, false];
    boatSelected = -1;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        playerBoard[i][j] = 0;
      }
    }
  }
  else if (a == 3 && startButtonActivated) {
    gameStarted = true;
  }
}
function getBoatClickedOn(x, y) {
  if (x > 90 && x < 190) {
    for (let i = 0; i < 5; i++) {
      let boatTextHeight = 570 + (i * 25);
      if ((y > boatTextHeight - 15) && (y < boatTextHeight + 5)) {
        return i;
      }
    }
  }
  return -1;
}
function mousePressed() {
  var j = floor((mouseX - 10) / w);
  var i = floor((mouseY - 10) / h);
  if (winstatus == 0) {
    if (i < 10 && i >= 0) {
      if (gameStarted) {
        if (j >= 0 && j < 10) {
          alert("Why would you try to fire on your own ships :(");
          //fire(i, j, 'c');
        }
        if (j >= 11 && j < 21) {
          if(computerBoard[i][j-11]==0 || computerBoard[i][j-11]==1)
          {
          fire(i, j - 11, 'h');
          winstatus = checkWin();
          if (winstatus == 0)
            computerTurn();
          winstatus = checkWin()
        }
        else
          alert("Invalid shot");
      }
      }
      else {
        if (j >= 0 && j < 10) {
          if (boatSelected != -1) {
            if (boatDirection == 0) {
              if (i <= 10 - boatLenghts[boatSelected]) {
                let f = 0;
                for (let k = 0; k < boatLenghts[boatSelected]; k++) {
                  if (playerBoard[i + k][j] == 1) {
                    f = 1;
                  }
                }
                if (f == 1)
                  alert("Boat overlap");
                else {
                  for (let k = 0; k < boatLenghts[boatSelected]; k++) {
                    playerBoard[i + k][j] = 1;
                    playerBoatsPoints[boatSelected].push([i + k, j]);
                  }
                  playerBoatsPositions[boatSelected] = [i, j, boatDirection];
                  boatsPlaced[boatSelected] = true;
                  boatSelected = -1;
                }
              }
              else {
                alert("Invalid placement");
              }
            }
            else {
              if (j <= 10 - boatLenghts[boatSelected]) {
                let f = 0;
                for (let k = 0; k < boatLenghts[boatSelected]; k++) {
                  if (playerBoard[i][j + k] == 1) {
                    f = 1;
                  }
                }
                if (f == 1)
                  alert("Boat overlap");
                else {
                  for (let k = 0; k < boatLenghts[boatSelected]; k++) {
                    playerBoard[i][j + k] = 1;
                    playerBoatsPoints[boatSelected].push([i, j + k]);
                  }
                  playerBoatsPositions[boatSelected] = [i, j, boatDirection];
                  boatsPlaced[boatSelected] = true;
                  boatSelected = -1;
                }
              }
              else {
                alert("Invalid placement");
              }
            }
          }
        }
      }
    }
  else if (getBoatClickedOn(mouseX, mouseY) != -1) {
    let a = getBoatClickedOn(mouseX, mouseY);
    if (a != -1) {
      if (boatsPlaced[a] == false)
        boatSelected = a;
    }
  }
  else {
    let a = getButtonClickedOn(mouseX, mouseY);
    if (a != -1) {
      handleButtons(a);
    }
  }
}
}
function draw() {
  let tH = 10;
  let tW = 10;
  background(0);
  stroke(255);
  strokeWeight(4);
  //************************************************Drawing boards and labels
  for (let i = 0; i <= 10; i++) {
    line(w * i + tW, 0 + tH, w * i + tW, boardHeight + tH);
    line(0 + tW, h * i + tH, boardWidth + tW, h * i + tH);
  }
  tH = 10;
  tW = 502;
  stroke(100);
  for (let i = 0; i <= 10; i++) {
    line(w * i + tW, 0 + tH, w * i + tW, boardHeight + tH);
    line(0 + tW, h * i + tH, boardWidth + tW, h * i + tH);
  }
  strokeWeight(1);
  fill(255);
  text('Player board', 160, 500);
  text('Computer board', 700, 500);
  textSize(15);
  for (let i = 0; i < 5; i++) {
    if (boatsPlaced[i] == false) {
      if (boatSelected == i) {
        fill(25);
        text(boats[i], 100, 570 + (i * 25));
        fill(255);
        continue;
      }
      let boatTextHeight = 570 + (i * 25);
      text(boats[i], 100, boatTextHeight);
    }
  }
  textSize(12);
  //************************************************* Drawing 3 Buttons
  if (boatSelected != -1) {
    rotateButtonActivated = true;
    fill(230, 230, 0);
    text('Rotate', 400, 540);
  }
  else
    rotateButtonActivated = false;
  let boatsPlacedCount = 0;
  for (let i = 0; i < 5; i++) {
    if (boatsPlaced[i] == true)
      boatsPlacedCount++;
  }

  if (boatsPlacedCount > 0 && !gameStarted) {
    resetButtonActivated = true;
    fill(255, 51, 51);
    text('Reset', 480, 540);
  }
  else
    resetButtonActivated = false

  if (boatsPlacedCount == 5 && !gameStarted) {
    startButtonActivated = true;
    fill(102, 255, 102);
    text('Start', 550, 540);
  }
  else
    startButtonActivated = false;
    fill(255);
  //***************************************************Drawing selected boxes if any
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (playerBoard[i][j] == 1) {
        fill(color(204, 102, 0));
        rect((j * w) + 13, (i * h) + 13, 40, 40);
      } else if (playerBoard[i][j] == 2) {
        fill(color(255));
        rect((j * w) + 13, (i * h) + 13, 40, 40);
      } else if (playerBoard[i][j] == 3) {
        fill(color(0, 128, 0));
        rect((j * w) + 13, (i * h) + 13, 40, 40);
      } else if (playerBoard[i][j] == 4) {
        fill(color(255, 0, 0));
        rect((j * w) + 13, (i * h) + 13, 40, 40);
      }
    }
  }
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      /*if (computerBoard[i][j] == 1) {
        fill(color(50, 101, 201));
        rect((j * w) + 505, (i * h) + 13, 40, 40);
      } */if (computerBoard[i][j] == 2) {
        fill(color(255));
        rect((j * w) + 505, (i * h) + 13, 40, 40);
      } else if (computerBoard[i][j] == 3) {
        fill(color(0, 128, 0));
        rect((j * w) + 505, (i * h) + 13, 40, 40);
      } else if (computerBoard[i][j] == 4) {
        fill(color(255, 0, 0));
        rect((j * w) + 505, (i * h) + 13, 40, 40);
      }
    }
  }

  //*********************************** Drawing selected ship on board for placement
  if (boatSelected != -1) {
    fill(color(204, 102, 0));
    var j = floor((mouseX - 10) / w);
    var i = floor((mouseY - 10) / h);
    if (i < 10 && i >= 0) {
      if (j >= 0 && j < 10) {
        if (boatDirection == 0) {
          for (let k = 0; k < boatLenghts[boatSelected]; k++) {
            rect((j * w) + 13, ((i + k) * h) + 13, 40, 40);
          }
        }
        else if (boatDirection == 1) {
          for (let k = 0; k < boatLenghts[boatSelected]; k++) {
            rect(((j + k) * w) + 13, ((i) * h) + 13, 40, 40);
          }
        }
      }
    }
  }
  //***************************************************** Instructions
  fill(255);
  textSize(20);
  if (winstatus == 0) {
    textSize(20);
    text("Instructions", 370, 600);
    if (gameStarted) {
      text("1)Fire a shot(Click on computer board)", 355, 630);
      text("2)Check hit/no hit: Green means hit,Red means ship destroyed", 355, 660);
      text("3)See where computer decided to hit", 355, 690);
      text("4)Repeat until either player has all ships destroyed", 355, 720)
    }
    else {
      text("1)Select a ship", 355, 630);
      text("2)Place on board(with/without rotate)", 355, 660);
      text("3)Place all ships", 355, 690);
      text("4)Click on start and play!", 355, 720);
    }
    textSize(12);
  }
  else {
    textSize(30);
    if(winstatus==1)
    {
      fill(0,255,0);
      text("Player wins", 400, 650);
    }
    else
    {
      fill(255,0,0);
      text("Computer wins", 400, 650);
    }
      textSize(12);
  fill(255);
  text("Refresh page to restart", 400, 700);
  }
}

function fire(i,j,player)      // 0<= I and J <=9    (Function scans computerBoard and makes the following changes )
{
  var k;
  var l;
  var board,boatsPoints,boatsFlags,pointcheck,found=false;
  //console.log(playerBoatsPoints);
    // After firing, if miss, make computerboard[i][j]=2, if hit but not destroyed, make =3 and if hit and destroyed, make all positions of that boat as =4, as well as change status in computerBoatsAlive
    // You can use computerBoard to find positions of ships, and to find if all positions on ship destoyed you can use computerBoatsPositions [i,j,direction]
    if(player == 'h')
    {
      board=computerBoard;
      boatsPoints=computerBoatsPoints;
      boatsAlive=computerBoatsAlive;
      boatsPositions=computerBoatsPositions;
      boatsFlags=computerBoatsFlags;
    }
    else
    {
      board=playerBoard;
      boatsPoints=playerBoatsPoints;
      boatsAlive=playerBoatsAlive;
      boatsPositions=playerBoatsPositions;
      boatsFlags=playerBoatsFlags;
    }
    if(board[i][j] == 0)
    {
      board[i][j] = 2;
    }
    else if(board[i][j] == 1)
    {
      for(let boatindex=0;boatindex<5;boatindex++)
      {
        if(boatsAlive[boatindex]){
          for(pointcheck=0;pointcheck<boatsPoints[boatindex].length;pointcheck++)
        {
          //console.log("Checkpoint0");
          if (boatsPoints[boatindex][pointcheck][0]==i && boatsPoints[boatindex][pointcheck][1]==j)
            {
             // console.log("Checkpoint1");
              board[i][j]=3;
              found=true;
              boatsFlags[boatindex]++;
              if(boatsFlags[boatindex]==boatLenghts[boatindex])
              {
                let row=boatsPositions[boatindex][0];
                let column=boatsPositions[boatindex][1];
                let directon=boatsPositions[boatindex][2];
                if (directon==0)
                  for(let temp=0;temp<boatLenghts[boatindex];temp++)
                    board[row+temp][column]=4;
                else
                  for(let temp=0;temp<boatLenghts[boatindex];temp++)
                      board[row][column+temp]=4;
                boatsAlive[boatindex]=false;
                console.log(board);
              }
              break;
            }
        }
      }
      if(found)
        break;
      }
    }

    if(player == 'h')
    {
      computerBoard=board;
      computerBoatsPoints=boatsPoints;
      computerBoatsAlive=boatsAlive;
      computerBoatsPositions=boatsPositions;
      computerBoatsFlags=boatsFlags;
    }
    else
    {
      playerBoard=board;
      playerBoatsPoints=boatsPoints;
      playerBoatsAlive=boatsAlive;
      playerBoatsPositions=boatsPositions;
      playerBoatsFlags=boatsFlags;
    }
}


function findAdjacent(row, column) {
  var l = []
  if (row > 0)
    l.push([row - 1, column])
  if (row < 9)
    l.push([row + 1, column])
  if (column > 0)
    l.push([row, column - 1])
  if (column < 9)
    l.push([row, column + 1])

  return (l)
}


function isBlocked(row, column) {
  //check if the randomly chosen block is blocked or not
  adjacent = findAdjacent(row, column);
  for (i = 0; i < adjacent.length; i++) {
    adjrow = adjacent[i][0]
    adjcolumn = adjacent[i][1];

    if (playerBoard[adjrow][adjcolumn] == 0 || playerBoard[adjrow][adjcolumn] == 1 || playerBoard[adjrow][adjcolumn] == 3) {
      //console.log("Not blocking the postion ",adjrow,adjcolumn);
      return (0);
    }
  }
  console.log("Blocking ", row, column);
  return (1);

}

function isAvailable(row, column) {
  //return 1 if available else 0

  var colIndex = availableMoves[row].indexOf(column);
  if (colIndex != -1)
    return (1);//still not been hit
  else
    return (0); //no entry in available moves

}

function oppositee(direction) {
  if (direction == "up")
    return ("down");
  else if (direction == "down")
    return ("up");
  else if (direction == "right")
    return ("left");
  else if (direction == "left")
    return ("right");
}

function rem(row, column) {
  var colIndex;
  colIndex = availableMoves[row].indexOf(column);
  if (colIndex != -1)
    availableMoves[row].splice(colIndex, 1);
  else
    console.log("Some error Occured for " + row, colIndex);

}

function computerTurn() {
  let tuple, row, column, direction;
  /*
  Function returns [i,j] to indicate where to hit
  Decided based on
  1)adjacent squares of already hit tiles(hit tiles do not count if ship destroyed)
  2)Random generated intelligent [i,j] such that it neglects  impossible places(single tiles)
  */
  //console.log(bufferMoves);


  if (bufferMoves.length > 0) //play move in bufferMoves ;  check if hit/miss ; if hit => add (move+direction) & (oppositeMove+direction) to probableMoves ; clear buffer
  {
    //loop of the move is already played
    do {
      tuple = bufferMoves.shift();
      row = tuple[0];
      column = tuple[1];
      direction = tuple[2]; //string "up","down","right","left"

      //console.log("bufferMoves while checking ",bufferMoves);

      if (isAvailable(row, column))
        break;
      else if (bufferMoves.length == 0) {
        computerTurn();//call itself to execute another type of approach and after that return to playerMove
        return;
      }
    } while (1);

    //fire current block
    fire(row, column, "c");
    console.log("computer =>", row, column);

    //rem the current entry from availableMoves
    rem(row, column);

    if (playerBoard[row][column] == 3) // Fire hit
    {
      //add opposite side if possible
      opposite = oppositee(direction)
      for (i = 0; i < bufferMoves.length; i++) {
        if (bufferMoves[i][2] == opposite)
          probableMoves.push(bufferMoves[i]);
      }
      // To add Maananiya blocks
      if (direction == "up")
        if (row > 0)
          probableMoves.push([row - 1, column, "up"]);
      //left
      if (direction == "left")
        if (column > 0)
          probableMoves.push([row, column - 1, "left"]);
      //down
      if (direction == "down")
        if (row < 9)
          probableMoves.push([row + 1, column, "down"]);
      //right
      if (direction == "right")
        if (column < 9)
          probableMoves.push([row, column + 1, "right"]);

      //clear Buffer
      bufferMoves = [];

    }
  }

  else if (probableMoves.length > 0)  //play move from probableMoves ; check hit/miss ; if hit => add move + direction to probableMoves
  {
    do {
      tuple = probableMoves.shift();
      row = tuple[0];
      column = tuple[1];
      direction = tuple[2];

      if (isAvailable(row, column))
        break;
      else if (probableMoves.length == 0) {
        computerTurn();
        return;
      }
    } while (1);


    //fire current block
    fire(row, column, "c");
    console.log("computer =>", row, column);

    //rem the current entry from availableMoves
    rem(row, column);


    if (playerBoard[row][column] == 3) // Fire hit
    {

      //add the next block of the same direction
      if (direction == "up")
        if (row > 0)
          probableMoves.push([row - 1, column, "up"]);
      //left
      if (direction == "left")
        if (column > 0)
          probableMoves.push([row, column - 1, "left"]);
      //down
      if (direction == "down")
        if (row < 9)
          probableMoves.push([row + 1, column, "down"]);
      //right
      if (direction == "right")
        if (column < 9)
          probableMoves.push([row, column + 1, "right"]);

    }

  }

  else //play random move => check for hit/miss ; if hit=> add moves to buffer with direction
  {
    var columnIndex = -1, rowIndex;
    do {
      rowIndex = Math.floor(Math.random() * 10);
      if (availableMoves[rowIndex].length > 0) {
        columnIndex = Math.floor(Math.random() * availableMoves[rowIndex].length);  //only choose a column number
        row = rowIndex;
        column = availableMoves[row][columnIndex];

        //check if the randomly selected block is blocked from all sides
        if (isBlocked(row, column)) {
          //if yes then restart he process
          columnIndex = -1;
        }
      }

    } while (columnIndex == -1);


    //console.log("CHECKPOINT");
    //fire current block
    fire(row, column, "c");
    console.log("computer =>", row, column, columnIndex);
    //console.log(availableMoves);

    //rem the current entry from availableMoves
    rem(row, column);

    //console.log("CHECKPOINT2");
    if (playerBoard[row][column] == 3) // Fire hit
    {
      //add the adjacent blocks in bufferMoves
      //up
      if (row > 0)
        bufferMoves.push([row - 1, column, "up"]);
      //left
      if (column > 0)
        bufferMoves.push([row, column - 1, "left"]);
      //down
      if (row < 9)
        bufferMoves.push([row + 1, column, "down"]);
      //right
      if (column < 9)
        bufferMoves.push([row, column + 1, "right"]);

      //console.log("Inserting ",bufferMoves);

    }
  }
}

function checkWin() {
  let playerWin = true;
  let computerWin = true;
  for (let i = 0; i < 5; i++) {
    if (playerBoatsAlive[i] == true) {
      computerWin = false;
      break;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (computerBoatsAlive[i] == true) {
      playerWin = false;
      break;
    }
  }
  if (playerWin)
    return 1
  if (computerWin)
    return 2
  return 0;
  /*
  return 0 if Non conclusive
  return 1 if player win                  // use playerboatsalive and computerboats alive
  return 2 if computer win
  */
}

function placeBoatVertical(direction, length, i) {
  let flag = 0
  let cordinateI;
  let cordinateJ;
  do {
    flag = 0
    cordinateI = Math.floor(Math.random() * 10);
    cordinateJ = Math.floor(Math.random() * 10);

    if (cordinateI + length < 10) {
      for (j = 0; j < length; j++) {
        if (computerBoard[cordinateI + j][cordinateJ] != 0) {
          flag = 1;
          continue;
        }
      }
    }
    else
      flag = 1;
  } while (flag != 0);

  for (j = 0; j < length; j++) {
    computerBoard[cordinateI + j][cordinateJ] = 1;
    computerBoatsPoints[i].push([cordinateI + j, cordinateJ])
  }
  computerBoatsPositions[i] = [cordinateI, cordinateJ, direction];
}

function placeBoatHorizontal(direction, length, i) {
  let flag = 0
  let cordinateI;
  let cordinateJ;
  do {
    flag = 0
    cordinateI = Math.floor(Math.random() * 10);
    cordinateJ = Math.floor(Math.random() * 10);

    if (cordinateJ + length < 10) {
      for (j = 0; j < length; j++) {
        if (computerBoard[cordinateI][cordinateJ + j] != 0) {
          flag = 1;
          continue;
        }
      }
    }
    else
      flag = 1;
  } while (flag != 0);

  for (j = 0; j < length; j++) {
    computerBoard[cordinateI][cordinateJ + j] = 1;
    computerBoatsPoints[i].push([cordinateI, cordinateJ + j])
  }
  computerBoatsPositions[i] = [cordinateI, cordinateJ, direction];
}

function placeBoat(direction, length, i) {
  if (direction == 0)
    placeBoatVertical(direction, length, i);
  else
    placeBoatHorizontal(direction, length, i);
}

function placeComputerBoats() {
  /*
  Select a boat
  Place it on the Computer board(Random position,random direction,Overlap condition,Overflow condition)
  //Make changes in computerBoard, make changes in computerBoatsPositions
  */
  var length;
  var direction;
  var i;
  for (i = 0; i < 5; i++) {
    length = boatLenghts[i];

    direction = Math.floor(Math.random() * 2);
    //create a function to place the boat in a specific direction and let it loop
    //call a func to place the boats
    placeBoat(direction, length, i);
  }
}
