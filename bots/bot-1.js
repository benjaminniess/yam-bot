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
  async Whatsnext(diceValues, throwCount, availableOptions) {
    if (
      helpers.countIdenticalFaces(diceValues) == 5 &&
      availableOptions.indexOf('yahtzee') !== -1
    ) {
      return 'yahtzee'
    }

    let firstOption

    availableOptions.map((option) => {
      if (firstOption == null) {
        firstOption = option
      }
    })

    return firstOption
  }
}
module.exports = new Bot1()
