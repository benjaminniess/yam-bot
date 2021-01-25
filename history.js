class History {
  constructor() {
    this.history = []
  }

  getHistory() {
    return this.history
  }

  addRound(data) {
    this.history.push(data)
  }
}
module.exports = new History()
