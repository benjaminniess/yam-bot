const chalk = require('chalk')

class Simulator {
  constructor() {
    this.totalSimulationsCount = 3
    this.currentSimulationNumber = 0
    this.finalScores = []
    this.botTotalScore = 0
    this.botBestScore = 0
    this.botWorstScore = null
  }

  setSimulationsCount(count) {
    this.totalSimulationsCount = count
  }

  saveScore(score) {
    if (this.currentSimulationNumber >= this.totalSimulationsCount) {
      throw new Error('Too many simulations')
    }
    this.finalScores.push(score)

    this.botTotalScore += score
    if (score > this.botBestScore) {
      this.botBestScore = score
    }
    if (this.botWorstScore === null || score < this.botWorstScore) {
      this.botWorstScore = score
    }

    this.currentSimulationNumber++
  }

  getAllScores() {
    return this.finalScores
  }

  getAverageScore() {
    return (
      Math.round((this.botTotalScore / this.totalSimulationsCount) * 100) / 100
    )
  }

  getBestScore() {
    return this.botBestScore
  }

  getWorstScore() {
    return this.botWorstScore
  }

  getTotalSimulations() {
    return this.totalSimulationsCount
  }

  getCurrentGameNumber() {
    return this.currentSimulationNumber
  }

  countRemainingSimulations() {
    return this.totalSimulationsCount - this.currentSimulationNumber
  }
}
module.exports = new Simulator()
