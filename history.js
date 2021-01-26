class History {
  constructor() {
    this.history = []
    this.roundNumber = 1
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
  }

  setThrowResults(throwNumber, result) {
    this.roundHistory.throws[throwNumber].results = result
  }

  closeRound(choice, score) {
    this.roundHistory.score = score
    this.roundHistory.choice = choice
    this.history.push(this.roundHistory)
  }

  getCurrentRound() {
    return this.roundNumber
  }
  getHistory() {
    return this.history
  }
}
module.exports = new History()
