class ThrowManager {
  constructor() {
    this.reset()
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
}
module.exports = new ThrowManager()
