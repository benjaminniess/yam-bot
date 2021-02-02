const Promise = require('bluebird')
const bot = require('./bots/bot-1')
const history = require('./history')
const score = require('./score')
const throwManager = require('./throwManager')
const chalk = require('chalk')

console.log(chalk.blue('Yam bot at your service! \n'))

const args = process.argv.slice(2)

let runMode = 'manual'
args.map((arg) => {
  if (args == '--simulate') {
    runMode = 'simulate'
  }
})
startRound()

function startRound() {
  if (history.getCurrentRound() >= 12) {
    console.log('GAME OVER')
    console.log('Your score is ' + score.getTotal())
    process.exit(1)
  }

  throwManager.reset()
  history.newRound()

  startThrow()
    .then((value) => {
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
    .catch((e) => {
      console.log(e)
    })
}

async function startThrow() {
  console.log(
    'Round ' +
      history.getCurrentRound() +
      ' - throw ' +
      throwManager.getCurrentThrowNumber() +
      '/3',
  )

  let throwResults, botDecision, securityVerification
  try {
    if (runMode == 'simulate') {
      throwResults = throwManager.getRandomResults()
    } else {
      throwResults = await throwManager.waitForThrow()
    }
  } catch (e) {
    console.log(e)
    return startThrow()
  }

  throwManager.saveThrowResults(throwResults)
  history.setThrowResults(throwManager.getCurrentThrowNumber(), throwResults)

  try {
    botDecision = await bot.Whatsnext(
      throwManager.getAllDices(),
      throwManager.getCurrentThrowNumber(),
      score.getAvailableOptions(),
    )
  } catch (e) {
    console.log(e)
    return startThrow()
  }

  try {
    securityVerification = throwManager.verifyWhatsNext(
      botDecision,
      score.getAvailableOptions(),
    )
  } catch (e) {
    console.log(e)
    return startThrow()
  }

  return botDecision
}

function saveChoice(choice) {
  let roundScore = score.calculateScore(choice, throwManager.getAllDices())
  history.closeRound(choice, score)

  score.setScore(choice, roundScore)

  console.log(
    chalk.green(
      'Choose ' +
        score.getOption(choice).label +
        ' and get ' +
        roundScore +
        ' points',
    ),
  )

  console.log(chalk.blue('Your score so far:'))
  console.log(score.getScoreTable(choice))

  return true
}
