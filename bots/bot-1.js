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
  Whatsnext(diceValues, throwCount, availableOptions) {
    return new Promise((resolve, reject) => {
      if (
        helpers.countIdenticalFaces(diceValues) == 5 &&
        availableOptions.indexOf('yahtzee') !== -1
      ) {
        resolve('yahtzee')
      }

      availableOptions.map((option) => {
        resolve(option)
      })
    })
  }
}
module.exports = new Bot1()
