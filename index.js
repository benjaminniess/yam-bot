const Promise = require('bluebird')
const bot = require('./bots/bot-1')
const helpers = require('./helpers')
const history = require('./history')
const score = require('./score')
const throwManager = require('./throwManager')

console.log('Yam bot at your service!')

startRound()

function startRound() {
  if (history.getCurrentRound() >= 12) {
    console.log('GAME OVER')
    console.log('Your score is ' + score.getTotal())
    return
  }

  throwManager.reset()
  history.increaseRoundNumber()
  history.newRound()

  startThrow().then((value) => {
    if (value instanceof Array) {
      throwManager.inscreaseThrowCount()
      throwManager.saveStashedDices(value)
      startThrow().then((value) => {
        if (value instanceof Array) {
          throwManager.inscreaseThrowCount()
          throwManager.saveStashedDices(value)
          startThrow().then((value) => {
            saveChoice(value)
            startRound()
          })
        } else {
          saveChoice(value)
          startRound()
        }
      })
    } else {
      saveChoice(value)
      startRound()
    }
  })
}

function startThrow() {
  return new Promise((resolve, reject) => {
    console.log(
      'Round ' +
        history.getCurrentRound() +
        ' - throw ' +
        throwManager.getCurrentThrowNumber() +
        '/3',
    )
    throwManager
      .waitForThrow()
      .then((values) => {
        throwManager.saveThrowResults(values)
        history.setThrowResults(throwManager.getCurrentThrowNumber(), values)
        bot
          .Whatsnext(
            throwManager.getAllDices(),
            throwManager.getCurrentThrowNumber(),
            score.getAvailableOptions(),
          )
          .then((result) => {
            helpers
              .verifyWhatsNext(
                result,
                throwManager.getAllDices(),
                throwManager.getCurrentThrowNumber(),
                score.getAvailableOptions(),
              )
              .then(() => {
                resolve(result)
              })
              .catch(() => {
                reject('Wrong answer')
              })
          })
      })
      .catch((errorMessage) => {
        console.log()
        console.error(errorMessage)
        console.log()
        startThrow()
      })
  })
}

function saveChoice(choice) {
  let roundScore = score.calculateScore(choice, throwManager.getAllDices())
  console.log(roundScore, throwManager.getAllDices())
  history.closeRound(choice, score)

  score.setPlayed(choice)
  score.setScore(choice, roundScore)

  console.log(history.getHistory())

  return true
}
