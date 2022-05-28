'use strict'

function safeClick() {
  if (gGame.safeClick > 0) {
    var i = getRandomIntInclusive(0, gLevel.SIZE - 1)
    var j = getRandomIntInclusive(0, gLevel.SIZE - 1)
    while (gBoard[i][j].isMine || gBoard[i][j].isShown) {
      i = getRandomIntInclusive(0, gLevel.SIZE - 1)
      j = getRandomIntInclusive(0, gLevel.SIZE - 1)
    }
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    var elSpanCell = elCell.firstElementChild
    if (elSpanCell.style.display === '' || elSpanCell.style.display === 'none') elSpanCell.style.display = 'block'
    setTimeout(function () {
      elSpanCell.style.display = 'none'
      if (gBoard[i][j].isShown) {
        elSpanCell.style.display = 'block'
      }
    }, 3000)

    gGame.safeClick--
  }
}
