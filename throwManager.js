const readline = require('readline')
const chalk = require('chalk')

class ThrowManager {
  constructor() {
    this.reset()
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  reset() {
    this.throwNumber = 1
    this.result = []
    this.stashedDices = []
    this.throableDices = 5
  }

  canThrow() {
    return this.throwNumber < 4
  }

  countThroableDices() {
    return this.throableDices
  }

  setThroableDices(diceCount) {
    this.throableDices = diceCount
  }

  inscreaseThrowCount() {
    this.throwNumber++
  }

  saveThrowResults(result) {
    this.result = result
  }

  saveStashedDices(dices) {
    this.setThroableDices(5 - dices.length)

    this.stashedDices = dices
  }

  getStashedDices() {
    return this.stashedDices
  }

  getCurrentThrowNumber() {
    return this.throwNumber
  }

  getAllDices() {
    return this.result
  }

  async verifyWhatsNext(botDecision, availableOptions) {
    // Throw again
    if (botDecision instanceof Array) {
      let allDices = JSON.parse(JSON.stringify(this.getAllDices()))
      let arrayKey
      botDecision.map((number) => {
        arrayKey = this._arraySearch(allDices, number)
        if (arrayKey === false) {
          console.log(
            chalk.red(botDecision + ' does not fit with ' + this.getAllDices()),
          )
          throw 'Your bot is cheating. Go the hell!'
        } else {
          allDices.splice(arrayKey, 1)
        }
      })

      if (this.getCurrentThrowNumber() >= 3) {
        throw "Can't throw again"
      } else {
        return true
      }
    } else {
      // Final decision
      if (!botDecision instanceof String) {
        throw 'Waiting for a string'
      }

      if (availableOptions.indexOf(botDecision) == -1) {
        throw 'Option not available'
      }

      return true
    }
  }

  waitForThrow() {
    return new Promise((resolve, reject) => {
      this.rl.question(
        'Please throw ' +
          chalk.blue(this.countThroableDices()) +
          ' dices and enter the values separated with spaces (ex: 1 4 5 1 1) ',
        (answer) => {
          try {
            resolve(this.formatDicesValues(answer))
          } catch (error) {
            reject('Wrong format. Please try again')
          }
        },
      )
    })
  }

  formatDicesValues(values) {
    let numbers = values.split(' ')
    if (numbers.length !== this.countThroableDices()) {
      throw new Error('wrong-length')
    }

    let isOk = true
    numbers.map((x) => {
      if (x < 1 || x > 6) {
        isOk = false
      }
    })

    if (!isOk) {
      throw new Error('wrong-format')
    }

    return numbers.map((x) => +x)
  }

  _arraySearch(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (parseInt(arr[i]) === parseInt(val)) {
        return i
      }
    }
    return false
  }
}
module.exports = new ThrowManager()
