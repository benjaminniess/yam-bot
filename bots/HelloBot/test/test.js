const assert = require('chai').assert
const score = require('../../../score')
const bot = require('../index')

describe('Bots test', function () {
  it('[1, 1, 1, 6, 4] should keep [1,1,1]', async () => {
    botDecision = await bot.Whatsnext(
      [1, 1, 1, 6, 4],
      1,
      score.getAvailableOptions(),
    )
    assert.equal(botDecision, '3-same')
  })
})
