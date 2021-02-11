const Promise = require('bluebird')

const history = require('./history')
const score = require('./score')
const throwManager = require('./throwManager')
const chalk = require('chalk')
const simulator = require('./simulator')

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const deepGreen = require('./bots/deepGreen')
const argv = yargs(hideBin(process.argv)).argv

let runMode = 'manual'
if (argv.simulate) {
  runMode = 'simulate'
}

if (argv.rounds && argv.rounds > 0) {
  simulator.setSimulationsCount(argv.rounds)
}

const botDir = argv.bot ? argv.bot : './bots/deepGreen'
const bot = require(botDir)

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
        simulator.showEndScreen()
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
      throwResults = throwManager
        .getStashedDices()
        .concat(
          simulator.getRandomResults(5 - throwManager.getStashedDices().length),
        )
      console.log('Thrown result: ' + throwResults)
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

    console.log('Bot decision: "' + botDecision + '"')
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
