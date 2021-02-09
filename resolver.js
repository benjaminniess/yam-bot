class YamResolver {
  async Whatsnext(diceValues, throwCount, availableOptions) {
    this.diceValues = diceValues
    this.throwCount = throwCount
    this.availableOptions = availableOptions

    return this.decideWhatsnext()
  }

  async decideWhatsnext() {
    let firstOption

    this.getAvailableOptions().map((option) => {
      if (firstOption == null) {
        firstOption = option
      }
    })

    return firstOption
  }

  getDiceValues() {
    return this.diceValues
  }

  getThrowCount() {
    return this.throwCount
  }

  getAvailableOptions() {
    return this.availableOptions
  }

  getCurrentRoundNumber() {
    return 13 - this.getAvailableOptions().length
  }
}
module.exports = YamResolver
