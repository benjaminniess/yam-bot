const { throableDices } = require('./throwManager')

class History {
  constructor() {
    this.reset()
  }

  reset() {
    this.roundNumber = 0
    this.history = []
  }

  newRound() {
    this.roundHistory = {
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

    this._increaseRoundNumber()
  }

  setThrowResults(throwNumber, result) {
    this.roundHistory.throws[throwNumber].results = result
  }

  closeRound(choice, score) {
    this.roundHistory.score = score
    this.roundHistory.choice = choice
    this.history.push(this.roundHistory)
  }

  _increaseRoundNumber() {
    this.roundNumber++
  }

  getCurrentRound() {
    return this.roundNumber
  }
  getHistory() {
    return this.history
  }
}
module.exports = new History()
