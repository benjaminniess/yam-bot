const readline = require('readline')
const Promise = require('bluebird')
const bot = require('./bots/bot-1')
const helpers = require('./helpers')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let options = {
  aces: {
    played: false,
    label: 'Aces',
    score: 0,
  },
  twos: {
    played: false,
    label: 'Twos',
    score: 0,
  },
  threes: {
    played: false,
    label: 'Threes',
    score: 0,
  },
  fours: {
    played: false,
    label: 'Fours',
    score: 0,
  },
  fives: {
    played: false,
    label: 'Fives',
    score: 0,
  },
  sixes: {
    played: false,
    label: 'Sixes',
    score: 0,
  },
  '3-same': {
    played: false,
    label: '3 of a kind',
    score: 0,
  },
  '4-same': {
    played: false,
    label: '4 of a kind',
    score: 0,
  },
  full: {
    played: false,
    label: 'Full house',
    score: 0,
  },
  'sm-straight': {
    played: false,
    label: 'Small straight (1,2,3,4,5)',
    score: 0,
  },
  'lg-straight': {
    played: false,
    label: 'LArge straight (2,3,4,5,6)',
    score: 0,
  },
  yahtzee: {
    played: false,
    label: 'YAHTZEE',
    score: 0,
  },
}

let history = []
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
        console.log(roundHistory)
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
  console.log(choice)

  history[roundNumber] = roundHistory
  options[choice].played = true
  roundHistory = {}
  console.log(history)
  console.log(options)
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
