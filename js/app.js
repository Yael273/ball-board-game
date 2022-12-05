'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'
const PASSAGE = 'PASSAGE'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'

// Model:
var gBoard
var gGamerPos
var ballCount
var mySound
var gNeighborsCount
var gInterval


function onInitGame() {
    // var res = countBallAround(gBoard, 1, 9)
    // console.log('Found', res, ' Ball around me')
    mySound = new Audio('sound/8-bit-powerup-6768.mp3')
    ballCount = 0
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
    countBallAround(gBoard, 5, 5)
    gInterval = setInterval(getEmptyCell, 2000);
}

function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === 9 || j === 0 || j === 11) {
                board[i][j].type = WALL
            }
            // board[i][j] = (Math.random() > 0.5) ? BALL : ''
        }
    }

    board[0][5].type = FLOOR
    board[9][5].type = FLOOR
    board[5][0].type = FLOOR
    board[5][11].type = FLOOR

    // DONE: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL
    ballCount = 2




    // if (board[gGamerPos.i][gGamerPos.j].gameElement === null) {
    //     setInterval(getEmptyCell(), 2000);
    // }


    console.log(board)
    return board
}

// Render the board to an HTML table
function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            // console.log('cellClass:', cellClass)

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    elBoard.innerHTML = strHTML
    countBallAround(gBoard, 5, 5)
    // setInterval(getEmptyCell(gBoard), 2000);
}

// Move the player to a specific location
function moveTo(i, j) {

    // Calculate distance to make sure we are moving to a neighbor cell
    const iAbsDiff = Math.abs(i - gGamerPos.i)
    const jAbsDiff = Math.abs(j - gGamerPos.j)


    if (i === gBoard.length) i = 0
    else if (i === -1) i = gBoard.length - 1
    else if (j === gBoard[0].length) j = 0
    else if (j === -1) j = gBoard[0].length - 1

    console.log('moveTo:', i, j)
    const targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

        if (targetCell.gameElement === BALL) {

            mySound.play()
            console.log('Collecting!')
            ballCount++
            console.log('ballCount:', ballCount)
            var elHeader2 = document.querySelector('h2 span')
            elHeader2.innerText = ballCount
            // if (ballCount === 4) gameOver()
        }



        // DONE: Move the gamer
        // REMOVING FROM
        // update Model
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        // update DOM
        renderCell(gGamerPos, '')

        // ADD TO
        // update Model
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }
        // update DOM
        renderCell(gGamerPos, GAMER_IMG)

    }


}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}

// Move the player by keyboard arrows
function onHandleKey(event) {
    const i = gGamerPos.i
    const j = gGamerPos.j
    console.log('event.key:', event.key)

    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break
        case 'ArrowRight':
            moveTo(i, j + 1)
            break
        case 'ArrowUp':
            moveTo(i - 1, j)
            break
        case 'ArrowDown':
            moveTo(i + 1, j)
            break
    }
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

// ballPos()

// function ballPos() {
//     var i = getRandomInt(1, 11)
//     var j = getRandomInt(1, 11)

//     var pos = {
//         i,
//         j
//     }

//     console.log('pos:', pos)
//     // var targetCell = gBoard[pos.i][pos.j]
//     // renderCell(targetCell, BALL)
//     // var elBall = document.querySelector()
//     // console.log('targetCell:', targetCell)
// }

function getRandomInt(min, max) {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function gameOver() {

    var strHTML = `<h2>Game Over</h2>
    <button onclick="onInitGame()">Restart</button>`

    var elBallCount = document.querySelector('h2 span')
    elBallCount.innerText = '0'

    const elGameOver = document.querySelector('.board')
    elGameOver.innerHTML = strHTML

}



function getEmptyCell(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            if (board.gameElement === null && board.type !== WALL) {
                emptyCells.push({ i, j })
            }
        }
    }

    // if (emptyCells.length === 0) gameOver()

    var randCell = emptyCells[getRandomInt(0, emptyCells.length)]

    //UPDATE MODEL & DOM
    //current cell
    ballCount++
    gBoard[randCell.i][randCell.j].gameElement = BALL
    renderCell(randCell, BALL_IMG)
    //next cell


}


function countBallAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell === BALL) count++
        }
    }
    gNeighborsCount = count
}

