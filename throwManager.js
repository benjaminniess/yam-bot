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
  }

  canThrow() {
    return this.throwCount < 4
  }

  inscreaseThrowCount() {
    this.throwNumber++
  }

  saveThrowResults(result) {
    this.result = result.concat(this.stashedDices)
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

  waitForThrow(diceCount = 5) {
    return new Promise((resolve, reject) => {
      this.rl.question(
        'Please enter ' + diceCount + ' space separated numbers ',
        (answer) => {
          this.formatDicesValues(answer, diceCount)
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

  formatDicesValues(values, diceCount = 5) {
    return new Promise((resolve, reject) => {
      let numbers = values.split(' ')
      if (numbers.length !== diceCount) {
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
