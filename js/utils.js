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
      strHTML += `\t<td class="cell ${cellClass}"  onclick="cellClicked(this,${i},${j})" oncontextmenu="rightClick(event,this,${i},${j})">\n`
      currCell.isMine ? (strHTML += `<span>${MINE}</span>`) : (strHTML += `<span>${board[i][j].minesAroundCount}</span>`)
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

function loopAroundSelectedCellLocation(i, j) {
  for (let t = i - 1; t <= i + 1; t++) {
    for (let l = j - 1; l <= j + 1; l++) {
      if (t === -1 || l === -1) continue
      if (t === gLevel.SIZE || l === gLevel.SIZE) continue
      if (gBoard[t][l] === gBoard[i][j]) continue

      if (!gBoard[t][l].isMine) gBoard[t][l].minesAroundCount++
    }
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
    console.log(gGame.secsPassed)
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

function displayOn(elCell, i, j) {
  gBoard[i][j].isShown = true
  var elCellSpan = elCell.firstElementChild
  elCellSpan.style.display = 'block'
}
