'use strict'
const MINE = '💣'
const FLAG = '🚩'
const NORMAL = '😃'
const SAD = '😱'
const DEAD = '🤯'
const WIN = '😎'
const LIVE1 = '❤️'
const LIVE2 = '❤️❤️'
const LIVE3 = '❤️❤️❤️'

var gBoard
var gLevel = { SIZE: 4, MINES: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 3, hint: 3, isHintOn: false, safeClick: 3 }
var gNumberOfPlacedMine = 0

var gTimerRef = document.querySelector('.timerDisplay')
var gElSpanEmojy = document.querySelector('.emojy')

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
        loopAroundSelectedCell(i, j, countMines)
      }
    }
  }
}

function cellClicked(elCell, i, j) {
  if (gBoard[i][j].isMine && gGame.shownCount === 0) {
    replaceMine(i, j)
    return
  }
  if (gGame.isHintOn) {
    if (gGame.secsPassed === 0) gameStart()
    useHint(i, j)
    return
  }
  console.log('mores')
  var CellClassLastIndex = elCell.classList.length - 1
  if (elCell.classList[CellClassLastIndex] === 'flag') return
  if (!gGame.isOn && gGame.shownCount > 0) return
  if (gBoard[i][j].isShown) return
  if (!gGame.isOn && !gBoard[i][j].isMine) {
    gameStart()
  }
  revealCell(elCell, i, j)
}

function rightClicked(event, elCell, i, j) {
  event.preventDefault()
  if (!gGame.isOn && gGame.shownCount > 0) return
  if (!gGame.isOn && !gSetIntervalId) {
    gameStart()
  }
  if (gBoard[i][j].isShown) return
  elCell.classList.toggle('flag')
  var CellClassLastIndex = elCell.classList.length - 1
  elCell.classList[CellClassLastIndex] === 'flag' ? gGame.markedCount++ : gGame.markedCount--
  checkGameOver()
}

function restart() {
  gElSpanEmojy.innerHTML = NORMAL
  clearInterval(gSetIntervalId)
  gSetIntervalId = undefined
  gNumberOfPlacedMine = 0
  gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 3, hint: 3, isHintOn: false, safeClick: 3 }
  ;[gMilliseconds, gSeconds, gMinutes] = [0, 0, 0]
  gTimerRef.innerText = '00 : 00 : 000'
  setLives()
  setHints()
  displayBestScores()
}
