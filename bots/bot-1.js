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

    return this.getBestOption()
  }

  getBestOption() {
    let firstOption

    this.getAvailableOptions().map((option) => {
      if (firstOption == null) {
        firstOption = option
      }
    })

    return firstOption
  }
}
module.exports = new Bot1()
