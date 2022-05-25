'use strict'
const MINE = '💣'
const FLAG = '🚩'

var gBoard
var gLevel = { SIZE: 4, MINES: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gNumberOfPlacedMine = 0
var gCountFlagUp = 0

var gTimerRef = document.querySelector('.timerDisplay')

function initGame() {
  restart()
  gBoard = buildBoard(gLevel)
  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
  console.table(gBoard)
}

function buildBoard(level) {
  var board = []

  for (var i = 0; i < level.SIZE; i++) {
    board.push([])
    for (var j = 0; j < level.SIZE; j++) {
      board[i][j] = createCell()
    }
  }
  return board
}

function createCell() {
  var cell = {
    minesAroundCount: 0,
    isShown: false,
    isMine: randomMinePicker(),
    isMarked: true,
  }
  return cell
}

function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j].isMine) {
        loopAroundSelectedCellLocation(i, j)
      }
    }
  }
}

function cellClicked(elCell, i, j) {
  console.log(elCell)
  var elCellClassLastIndex = elCell.classList.length - 1
  if (elCell.classList[elCellClassLastIndex] === 'flag') return
  if (!gGame.isOn && gGame.shownCount > 0) return
  if (gBoard[i][j].isShown) return

  if (!gGame.isOn && !gBoard[i][j].isMine) {
    gameStart()
  }

  revealCell(elCell, i, j)
}

function revealCell(elCell, i, j) {
  displayOn(elCell, i, j)

  if (!gBoard[i][j].isMine) {
    gGame.shownCount++
    // checkGameOver(elCell, i, j)
  } else gameOver(elCell)
}

function gameWin(elCell) {
  gameStop()
}

function gameOver(elCell) {
  gGame.shownCount++
  elCell.style.background = 'lightcoral'
  gameStop()
}

function gameStart() {
  gGame.isOn = true
  clock()
}

function gameStop() {
  gGame.isOn = false
  clearInterval(gSetIntervalId)
}

function isAllFlagsUpOnMines(elCell, i, j) {
  var elCellClassLastIndex = elCell.classList.length - 1
  if (elCell.classList[elCellClassLastIndex] === 'flag' && gBoard[i][j].isMine === true) {
    gCountFlagUp++
  } else gCountFlagUp--

  if (gCountFlagUp === gNumberOfPlacedMine) {
    return true
  } else return false
}

function checkGameOver(elCell, i, j) {
  if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gNumberOfPlacedMine) {
    if (isAllFlagsUpOnMines(elCell, i, j)) gameWin(elCell)
  }
}

function rightClick(event, elCell, i, j) {
  event.preventDefault()
  console.log(elCell)
  var elCellSpan = elCell.firstElementChild

  if (!gGame.isOn && !gSetIntervalId) {
    gameStart()
  }

  if (elCellSpan.style.display === 'block') return
  elCell.classList.toggle('flag')
  checkGameOver(elCell, i, j)
}

function restart() {
  clearInterval(gSetIntervalId)
  gSetIntervalId = undefined
  gNumberOfPlacedMine = 0
  gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
  ;[gMilliseconds, gSeconds, gMinutes] = [0, 0, 0]
  gTimerRef.innerText = '00 : 00 : 000'
}
