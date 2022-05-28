'use strict'
const maxBestScorePlaceToShow = 3
function storeBesTime(divCurrScore) {
  var currScore = divCurrScore.innerText

  if (localStorage.getItem(`bestScore${gLevel.SIZE}`) === null) {
    localStorage.setItem(`bestScore${gLevel.SIZE}`, '[]')
    var bestScores = JSON.parse(localStorage.getItem(`bestScore${gLevel.SIZE}`))
    bestScores.push(currScore)
    localStorage.setItem(`bestScore${gLevel.SIZE}`, JSON.stringify(bestScores))
    return
  }

  var bestScores = JSON.parse(localStorage.getItem(`bestScore${gLevel.SIZE}`))
  for (let i = 0; i < bestScores.length; i++) {
    var isNewBestScore = isCurrScoreBestScore(currScore, bestScores[i])
    if (isNewBestScore) {
      bestScores.splice(i, 0, currScore)
      localStorage.setItem(`bestScore${gLevel.SIZE}`, JSON.stringify(bestScores))
      return
    }
  }

  bestScores.push(currScore)
  localStorage.setItem(`bestScore${gLevel.SIZE}`, JSON.stringify(bestScores))
}

function isCurrScoreBestScore(currScore, currBestScore) {
  currScore = scoreToNumber(currScore)
  currBestScore = scoreToNumber(currBestScore)
  if (currScore < currBestScore) {
    return true
  }
  return false
}

function scoreToNumber(score) {
  for (let i = 0; i < score.length; i++) {
    if (score.charAt(i) === ' ') {
      score = score.slice(0, i) + score.slice(i + 3)
      i--
    }
  }
  return +score
}

function displayBestScores() {
  if (localStorage.getItem(`bestScore${gLevel.SIZE}`) === null) {
    var eldivScores = document.querySelector('.scores')
    eldivScores.innerHTML = 'No scores for this level.'
    return
  }
  var bestScores = JSON.parse(localStorage.getItem(`bestScore${gLevel.SIZE}`))
  var eldivScores = document.querySelector('.scores')
  eldivScores.innerHTML = 'Best Scores:'
  if (bestScores.length <= maxBestScorePlaceToShow) {
    for (let i = 0; i < bestScores.length; i++) {
      eldivScores.innerHTML += `<span class="score${i + 1}">${i + 1}. ${bestScores[i]} </span>`
    }
  } else {
    for (let i = 0; i < maxBestScorePlaceToShow; i++) {
      eldivScores.innerHTML += `<span class="score${i + 1}">${i + 1}. ${bestScores[i]} </span>`
    }
  }
}
