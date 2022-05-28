'use strict'

const HINT1 = '💡'
var gElSpanHint

function setHints() {
  var elSpanHints = document.querySelector('.hints').children

  for (let i = 0; i < elSpanHints.length; i++) {
    elSpanHints[i].innerText = ''
  }

  for (let i = 0; i < gGame.hint; i++) {
    elSpanHints[i].innerText = `${HINT1}`
  }
}

function turnOnHint(elSpanHint) {
  if (gGame.isHintOn) return
  elSpanHint.style.background = 'red'
  gGame.isHintOn = true
  gElSpanHint = elSpanHint
}

function turnOffHint() {
  gGame.isHintOn = false
  gGame.hint--
  gElSpanHint.style.background = 'black'
  setHints()
}

function useHint(i, j) {
  var spans = []
  for (let t = i - 1; t <= i + 1; t++) {
    for (let l = j - 1; l <= j + 1; l++) {
      if (t === -1 || l === -1) continue
      if (t === gLevel.SIZE || l === gLevel.SIZE) continue

      var elCell = document.querySelector(`.cell-${t}-${l}`)
      var elSpanCell = elCell.firstElementChild
      if (elSpanCell.style.display === '' || elSpanCell.style.display === 'none') {
        elSpanCell.style.display = 'block'
        spans.push(elSpanCell)
      }
    }
  }
  for (let i = 0; i < spans.length; i++) {
    setTimeout(function () {
      spans[i].style.display = 'none'
    }, 1000)
  }
  turnOffHint()
}
