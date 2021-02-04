const YamResolver = require('../resolver')
const helpers = require('../helpers')

const priorityOrder = [
  'yahtzee',
  '4-same',
  'full',
  'sm-straight',
  'lg-straight',
  '3-same',
  'sixes',
  'fives',
  'fours',
  'threes',
  'twos',
  'aces',
]

class Bot1 extends YamResolver {
  async decideWhatsnext() {
    if (
      helpers.countIdenticalFaces(this.getDiceValues()) == 5 &&
      this.getAvailableOptions().indexOf('yahtzee') !== -1
    ) {
      return 'yahtzee'
    }

    if (this.getThrowCount() < 3) {
      let identicalFaces = helpers.countIdenticalFaces(this.getDiceValues())

      if (identicalFaces > 1) {
        let groupedValues = helpers.groupResultByValues(this.getDiceValues())
        let maxOccurences = 0
        let toStash = []
        for (const [diceValue, occurencesCount] of Object.entries(
          groupedValues,
        )) {
          if (occurencesCount > maxOccurences) {
            maxOccurences = occurencesCount
            toStash = []
            for (let i = 0; i < maxOccurences; i++) {
              toStash.push(diceValue)
            }
          }
        }

        return toStash
      }
    }

    return this.getBestOption()
  }

  getBestOption() {
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
module.exports = new Bot1()
