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

  async verifyWhatsNext(result, values, throwNumber, availableOptions) {
    return true
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
