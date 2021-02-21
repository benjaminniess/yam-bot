const assert = require('chai').assert
const throwManager = require('../../../throwManager')
const score = require('../../../score')
const history = require('../../../history')
const helpers = require('../../../helpers')
const simulator = new(require('../../../simulator'))
const bot = require('../index')

describe('Bots test', function () {
  it('[1, 1, 1, 6, 4] should keep [1,1,1]', async () => {
    botDecision = await bot.Whatsnext(
      [1, 1, 1, 6, 4],
      1,
      score.getAvailableOptions(),
    )
    assert.deepEqual(botDecision, [1, 1, 1])
  })
})
