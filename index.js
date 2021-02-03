const Promise = require('bluebird')
const bot = require('./bots/bot-1')
const history = require('./history')
const score = require('./score')
const throwManager = require('./throwManager')
const chalk = require('chalk')
const simulator = require('./simulator')

const args = process.argv.slice(2)

let runMode = 'manual'

args.map((arg) => {
  console.log(arg)
  if (args == '--simulate') {
    runMode = 'simulate'
  }
})

if (isSimulation()) {
  console.log(
    chalk.blue(
      'Starting simulation of ' + simulator.getTotalSimulations() + ' games \n',
    ),
  )
} else {
  console.log(chalk.blue('Yam bot at your service! \n'))
}

startRound()
function startRound() {
  if (history.getCurrentRound() >= 12) {
    if (isSimulation()) {
      simulator.saveScore(score.getTotal())

      console.log(
        chalk.green(
          'END OF GAME : ' +
            simulator.getCurrentGameNumber() +
            ' with a score of ' +
            score.getTotal() +
            '\n\n',
        ),
      )
      if (simulator.countRemainingSimulations() <= 0) {
        console.log('GAME OVER')
        console.log(
          chalk.green('Yam bot best score is: ' + simulator.getBestScore()),
        )
        console.log(
          chalk.red('Yam bot worst score is: ' + simulator.getWorstScore()),
        )
        console.log(
          'Your bot average score is : ' + simulator.getAverageScore(),
        )
        console.log(simulator.getAllScores())
        process.exit(1)
      }

      score.reset()
      throwManager.reset()
      history.reset()
      startRound()
      return
    } else {
      console.log('GAME OVER')
      console.log('Your score is ' + score.getTotal())
      process.exit(1)
    }
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

  let throwResults, botDecision
  try {
    if (isSimulation()) {
      throwResults = simulator.getRandomResults()
      console.log('Dice result: ' + throwResults)
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
    await throwManager.verifyWhatsNext(botDecision, score.getAvailableOptions())
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

  console.log(chalk.blue('Your score so far: ' + score.getTotal()))
  console.log(score.getScoreTable(choice))

  return true
}

function isSimulation() {
  return runMode == 'simulate'
}
