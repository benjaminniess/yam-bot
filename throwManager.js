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
    return this.throwCount < 4
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

  waitForThrow() {
    return new Promise((resolve, reject) => {
      this.rl.question(
        'Please enter ' +
          this.countThroableDices() +
          ' space separated numbers ',
        (answer) => {
          this.formatDicesValues(answer)
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

  formatDicesValues(values) {
    return new Promise((resolve, reject) => {
      let numbers = values.split(' ')
      if (numbers.length !== this.countThroableDices()) {
        reject('wrong-length')
      }

      let isOk = true
      numbers.map((x) => {
        if (x < 1 || x > 6) {
          isOk = false
        }
      })

      if (!isOk) {
        reject('wrong-format')
      }

      resolve(numbers)
    })
  }
}
module.exports = new ThrowManager()
