const readline = require('readline')

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
    this.result = result.concat(this.stashedDices)
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

  verifyWhatsNext(botDecision, availableOptions) {
    // Throw again
    if (botDecision instanceof Array) {
      if (this.getCurrentThrowNumber() >= 3) {
        throw "Can't throw again"
      } else {
        return true
      }
    }

    // Final decision
    if (!botDecision instanceof String) {
      throw 'Waiting for a string'
    }

    if (availableOptions.indexOf(botDecision) == -1) {
      throw 'Option not available'
    }

    return true
  }

  getRandomResults() {
    let dicesResult = []
    for (let i = 0; i < 5; i++) {
      dicesResult.push(this._getRandomDiceValue())
    }
    console.log(dicesResult)
    return dicesResult
  }

  _getRandomDiceValue() {
    let min = Math.ceil(1)
    let max = Math.floor(6)
    return Math.floor(Math.random() * (max - min)) + min
  }

  waitForThrow() {
    return new Promise((resolve, reject) => {
      this.rl.question(
        'Please enter ' +
          this.countThroableDices() +
          ' space separated numbers ',
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
}
module.exports = new ThrowManager()
