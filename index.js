const readline = require('readline')
const Promise = require('bluebird')
const bot = require('./bots/bot-1')
const helpers = require('./helpers')
const history = require('./history')
const score = require('./score')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let roundHistory
let stashedDices = []
let roundNumber = 1
let throwNumber = 1

console.log('Yam bot at your service!')

startRound()

function startRound() {
  if (roundNumber >= 12) {
    console.log('GAME OVER')
    return
  }

  throwNumber = 1
  roundHistory = {
    throws: {
      1: {
        results: {},
      },
      2: {
        results: {},
      },
      3: {
        results: {},
      },
    },
    score: 0,
    choice: null,
  }

  startThrow(5).then((value) => {
    if (value instanceof Array) {
      throwNumber = 2
      startThrow(value.length).then((value) => {
        if (value instanceof Array) {
          throwNumber = 3
          startThrow(value.length).then((value) => {
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

function startThrow(diceCount) {
  return new Promise((resolve, reject) => {
    console.log('Round ' + roundNumber + ' - throw ' + throwNumber + '/3')
    waitForThrow(diceCount)
      .then((values) => {
        roundHistory['throws'][throwNumber]['results'] = values
        bot
          .Whatsnext(values, throwNumber, stashedDices, history)
          .then((result) => {
            helpers
              .verifyWhatsNext(
                result,
                values,
                throwNumber,
                stashedDices,
                history,
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
        startThrow(diceCount)
      })
  })
}

function saveChoice(choice) {
  let values = [1, 2, 2, 3, 4]
  let roundScore = score.calculateScore(choice, values)

  roundHistory.choice = choice
  roundHistory.score = roundScore
  history.addRound(roundHistory)

  score.setPlayed(choice)
  score.setScore(choice, roundScore)

  roundHistory = {}

  console.log(history.getHistory())

  return true
}
function waitForThrow(diceCount = 5) {
  return new Promise((resolve, reject) => {
    rl.question(
      'Please enter ' + diceCount + ' space separated numbers ',
      (answer) => {
        helpers
          .formatDicesValues(answer, diceCount)
          .then((values) => {
            resolve(values)
          })
          .catch(() => {
            reject('Wrong format. Please try again')
          })
      },
    )
  })
}
