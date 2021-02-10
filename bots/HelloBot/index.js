const YamResolver = require('../../resolver')
const helpers = require('../../helpers')

class HelloBot extends YamResolver {
  async decideWhatsnext() {
    let bestOption
    let bestScore = null

    let currentScore = null
    this.getAvailableOptions().map((option) => {
      currentScore = helpers.calculateScore(option, this.getDiceValues())
      if (currentScore > bestScore || bestScore === null) {
        bestScore = currentScore
        bestOption = option
      }
    })

    return bestOption
  }
}
module.exports = new HelloBot()
