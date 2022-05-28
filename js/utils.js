'use strict'
var [gMilliseconds, gSeconds, gMinutes] = [0, 0, 0]
var gSetIntervalId

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j]
      var cellClass = getClassName({ i, j })

      currCell.isMine ? (cellClass += ' mine') : (cellClass += ' number')
      strHTML += `\t<td class="cell ${cellClass}"  onclick="cellClicked(this,${i},${j})" oncontextmenu="rightClicked(event,this,${i},${j})">\n`
      currCell.isMine ? (strHTML += `<span class="mines">${MINE}</span>`) : (strHTML += `<span>${board[i][j].minesAroundCount}</span>`)
      strHTML += '\t</td>\n'
    }
    strHTML += '</tr>\n'
  }

  console.log('strHTML is:')
  console.log(strHTML)
  var elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function randomMinePicker() {
  var randomNumber = getRandomIntInclusive(1, 4)
  if (randomNumber === 1 && gNumberOfPlacedMine !== gLevel.MINES) {
    gNumberOfPlacedMine++
    return true
  }
  return false
}

function loopAroundSelectedCell(i, j, callFunction) {
  for (let t = i - 1; t <= i + 1; t++) {
    for (let l = j - 1; l <= j + 1; l++) {
      if (t === -1 || l === -1) continue
      if (t === gLevel.SIZE || l === gLevel.SIZE) continue
      if (gBoard[t][l] === gBoard[i][j]) continue
      callFunction(t, l)
    }
  }
}

function loopAroundSelectedCell2(i, j, callFunction) {
  var zero = {
    z: i,
    x: j,
  }
  var zeros = []
  for (let t = i - 1; t <= i + 1; t++) {
    for (let l = j - 1; l <= j + 1; l++) {
      if (t === -1 || l === -1) continue
      if (t === gLevel.SIZE || l === gLevel.SIZE) continue
      if (gBoard[t][l] === gBoard[i][j]) continue
      if (!gBoard[t][l].isShown) {
        if (gBoard[t][l].minesAroundCount === 0) {
          if (zeros.length === 0) {
            console.log(`1 - ${zeros.length} - ${zero.z} `, zero.z)
            zero.z = t
            zero.x = l
            console.log(`2- s${zeros.length} - ${zero.z} `, zero.z)
            zeros.push({
              zero,
            })
          }
        }
        callFunction(t, l)
      }
    }
  }

  if (zeros.length === 0) return
  loopAroundSelectedCell2(zeros[0].zero.z, zeros[0].zero.x, callFunction)
}

function countMines(t, l) {
  if (!gBoard[t][l].isMine) gBoard[t][l].minesAroundCount++
}

function displayOnAround(t, l) {
  if (!gBoard[t][l].isShown) {
    var elCell = document.querySelector(`.cell-${t}-${l}`)
    removeCellFlagClass(elCell)
    gGame.shownCount++
    displayOn(elCell, t, l)
  }
}
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getClassName(location) {
  var cellClass = `cell-${location.i}-${location.j}`
  return cellClass
}

function clock() {
  var int = setInterval(displayTimer, 10)
  function displayTimer() {
    gMilliseconds += 10
    if (gMilliseconds == 1000) {
      gMilliseconds = 0
      gSeconds++
      if (gSeconds == 60) {
        gSeconds = 0
        gMinutes++
        if (gMinutes == 60) {
          gMinutes = 0
        }
      }
    }
    let m = gMinutes < 10 ? '0' + gMinutes : gMinutes
    let s = gSeconds < 10 ? '0' + gSeconds : gSeconds
    let ms = gMilliseconds < 10 ? '00' + gMilliseconds : gMilliseconds < 100 ? '0' + gMilliseconds : gMilliseconds

    gTimerRef.innerText = `${m} : ${s} : ${ms}`
    gGame.secsPassed = gSeconds
    gSetIntervalId = int
  }
}

function gameStart() {
  gGame.isOn = true
  clock()
}

function revealCell(elCell, i, j) {
  if (!gBoard[i][j].isMine) {
    if (elCell.firstElementChild.innerText === '0') loopAroundSelectedCell2(i, j, displayOnAround)
    if (!gBoard[i][j].isShown) {
      displayOn(elCell, i, j)
      gGame.shownCount++
      checkGameOver()
    }
  } else clickedMine(elCell)
}

function displayOn(elCell, i, j) {
  if (!gBoard[i][j].isShown) {
    gBoard[i][j].isShown = true
    var elCellSpan = elCell.firstElementChild
    elCellSpan.style.display = 'block'
    console.log(gGame.shownCount)
  }
}

function checkGameOver() {
  if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gNumberOfPlacedMine) {
    if (gGame.markedCount === gNumberOfPlacedMine) gameWin()
  }
}

function gameWin() {
  gElSpanEmojy.innerHTML = WIN
  gameStop()
  storeBesTime(gTimerRef)
}

function gameStop() {
  gGame.isOn = false
  clearInterval(gSetIntervalId)
}

function clickedMine(elCell) {
  gGame.lives--
  elCell.style.background = 'red'
  if (gGame.lives > 0) {
    gElSpanEmojy.innerHTML = SAD
    setTimeout(function () {
      elCell.style.background = 'white'
      gElSpanEmojy.innerHTML = NORMAL
    }, 2000)
  }

  setLives()
  if (gGame.lives === 0) {
    gameOver(elCell)
  }
}

function gameOver(elCell) {
  gGame.shownCount++
  elCell.style.background = 'lightcoral'
  gElSpanEmojy.innerHTML = DEAD
  iterateAllCellsDom()
  gameStop()
}

function iterateAllCellsDom() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard.length; j++) {
      var elCell = document.querySelector(`.cell-${i}-${j}`)
      revealCellIfIsMine(elCell, i, j)
    }
  }
}

function revealCellIfIsMine(elCell, i, j) {
  if (elCell.classList[2] === 'mine') {
    removeCellFlagClass(elCell)
    displayOn(elCell, i, j)
  }
}

function removeCellFlagClass(elCell) {
  var CellClassLastIndex = elCell.classList.length - 1
  if (elCell.classList[CellClassLastIndex] === 'flag') {
    gGame.markedCount--
    elCell.classList.remove('flag')
  }
}

function difficulty(elInput) {
  gLevel.SIZE = Math.sqrt(+elInput.previousElementSibling.innerText)
  if (gLevel.SIZE === 4) gLevel.MINES = 2
  if (gLevel.SIZE === 8) gLevel.MINES = 12
  if (gLevel.SIZE === 12) gLevel.MINES = 30
  initGame()
}

function replaceMine(i, j) {
  while (gBoard[i][j].isMine) {
    initGame()
  }
  var elCell2 = document.querySelector(`.cell-${i}-${j}`)
  gameStart()
  revealCell(elCell2, i, j)
}

function setLives() {
  var gElDivLives = document.querySelector('.lives')
  if (gGame.lives === 3) gElDivLives.innerText = `${LIVE3}`
  if (gGame.lives === 2) gElDivLives.innerText = `${LIVE2}`
  if (gGame.lives === 1) gElDivLives.innerText = `${LIVE1}`
  if (gGame.lives === 0) gElDivLives.innerText = `GAME OVER`
}
