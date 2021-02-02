const assert = require('chai').assert
const throwManager = require('../throwManager')
const score = require('../score')
const history = require('../history')
const helpers = require('../helpers')

describe('Throw manager tests', function () {
  describe('Get/Set', function () {
    it('Should get and set throable count', function () {
      assert.equal(throwManager.countThroableDices(), 5)
      throwManager.setThroableDices(3)
      assert.equal(throwManager.countThroableDices(), 3)
      throwManager.setThroableDices(5)
      assert.equal(throwManager.countThroableDices(), 5)
    })

    it('Should inscrease thrown counts', function () {
      assert.equal(throwManager.canThrow(), true)
      throwManager.inscreaseThrowCount()
      assert.equal(throwManager.canThrow(), true)
      throwManager.inscreaseThrowCount()
      assert.equal(throwManager.canThrow(), true)
      throwManager.inscreaseThrowCount()
      assert.equal(throwManager.canThrow(), false)
    })
  })
  describe('formatDicesValues', function () {
    it('should convert a space separated list of dice value into an array of dice values', function () {
      assert.deepEqual(throwManager.formatDicesValues('1 2 3 4 5'), [
        1,
        2,
        3,
        4,
        5,
      ])
    })
    it('should throw an error a space separated list of dice value into an array of dice values', function () {
      throwManager.setThroableDices(3)
      assert.deepEqual(throwManager.formatDicesValues('1 2 3'), [1, 2, 3])
    })
    it('should refuse to convert a space separated list of wrong dice value', function () {
      assert.throws(() => {
        throwManager.formatDicesValues('1 2 10')
      }, Error)
    })
    it('should not refuse to convert a space separated list of wrong dice value', function () {
      assert.throws(() => {
        throwManager.formatDicesValues('1 2 1 1')
      }, Error)
    })
  })
})

describe('Score tests', function () {
  describe('Calculate score', function () {
    it('Should calculate score from dice results', function () {
      assert.equal(score.calculateScore('aces', [1, 1, 1, 2, 5]), 3)
      assert.equal(score.calculateScore('aces', [6, 1, 3, 1, 5]), 2)
      assert.equal(score.calculateScore('aces', [2, 6, 3, 4, 5]), 0)
      assert.equal(score.calculateScore('twos', [2, 2, 1, 2, 2]), 8)
      assert.equal(score.calculateScore('twos', [6, 1, 3, 1, 2]), 2)
      assert.equal(score.calculateScore('twos', [2, 2, 2, 2, 2]), 10)
      assert.equal(score.calculateScore('threes', [2, 2, 3, 2, 2]), 3)
      assert.equal(score.calculateScore('fours', [2, 2, 2, 2, 2]), 0)
      assert.equal(score.calculateScore('fives', [2, 5, 5, 5, 2]), 15)
      assert.equal(score.calculateScore('sixes', [2, 6, 2, 2, 2]), 6)
      assert.equal(score.calculateScore('3-same', [2, 3, 1, 4, 5]), 0)
      assert.equal(score.calculateScore('3-same', [2, 2, 2, 2, 4]), 12)
      assert.equal(score.calculateScore('3-same', [3, 1, 3, 4, 3]), 14)
      assert.equal(score.calculateScore('sm-straight', [2, 3, 1, 4, 5]), 25)
      assert.equal(score.calculateScore('sm-straight', [2, 3, 1, 4, 4]), 0)
      assert.equal(score.calculateScore('lg-straight', [2, 3, 1, 4, 5]), 0)
      assert.equal(score.calculateScore('lg-straight', [2, 3, 6, 4, 5]), 25)
      assert.equal(score.calculateScore('full', [2, 3, 1, 4, 5]), 0)
      assert.equal(score.calculateScore('full', [2, 2, 2, 2, 4]), 0)
      assert.equal(score.calculateScore('full', [2, 3, 2, 2, 3]), 30)
      assert.equal(score.calculateScore('full', [1, 1, 2, 2, 2]), 30)
      assert.equal(score.calculateScore('4-same', [2, 3, 1, 4, 5]), 0)
      assert.equal(score.calculateScore('4-same', [2, 2, 2, 2, 4]), 40)
      assert.equal(score.calculateScore('4-same', [2, 2, 2, 2, 2]), 40)
      assert.equal(score.calculateScore('yahtzee', [2, 3, 1, 4, 5]), 0)
      assert.equal(score.calculateScore('yahtzee', [2, 2, 2, 2, 2]), 50)
    })
  })

  describe('Get / Set scores', function () {
    it('should get score from empty options', function () {
      assert.equal(score.getScore('aces'), 0)
    })
    it('should set score for aces', function () {
      score.setScore('aces', 3)
      assert.equal(score.getScore('aces'), 3)
    })
  })

  describe('Scores helpers', function () {
    it('should should count occurences', function () {
      assert.equal(helpers.countIdenticalFaces([1, 3, 1, 1, 6]), 3)
      assert.equal(helpers.countIdenticalFaces([1, 1, 1, 1, 1]), 5)
      assert.equal(helpers.countIdenticalFaces([1, 2, 3, 4, 5]), 1)
    })

    it('should should group results by values', function () {
      assert.equal(
        Object.keys(helpers.groupResultByValues([1, 3, 1, 1, 6])).length,
        3,
      )
      assert.equal(
        Object.keys(helpers.groupResultByValues([1, 1, 1, 1, 1])).length,
        1,
      )
      assert.equal(
        Object.keys(helpers.groupResultByValues([1, 2, 3, 4, 5])).length,
        5,
      )
    })

    it('should should count grouped values', function () {
      assert.equal(helpers.groupResultByValues([1, 3, 1, 1, 6])[1], 3)
      assert.equal(helpers.groupResultByValues([1, 6, 5, 2, 2])[2], 2)
      assert.equal(helpers.groupResultByValues([1, 1, 1, 1, 1])[1], 5)
      assert.equal(helpers.groupResultByValues([1, 1, 1, 1, 1])[5], undefined)
    })

    it('should should count occurences of values', function () {
      assert.equal(helpers.countOccurencesOf(1, [1, 3, 1, 1, 6]), 3)
      assert.equal(helpers.countOccurencesOf(3, [1, 6, 5, 2, 2]), 0)
      assert.equal(helpers.countOccurencesOf(1, [1, 1, 1, 1, 1]), 5)
      assert.equal(helpers.countOccurencesOf(5, [1, 2, 5, 6, 3]), 1)
    })
  })

  describe('Is played?', function () {
    it('should check if option is played', function () {
      assert.equal(score.isPlayed('aces'), true)
      assert.equal(score.isPlayed('twos'), false)
    })
  })

  describe('Get labels', function () {
    it('Retrieve options labels', function () {
      assert.equal(score.getLabel('aces'), 'Aces')
      assert.equal(score.getLabel('lg-straight'), 'Large straight (2,3,4,5,6)')
    })
  })

  describe('Get total score', function () {
    it('should retrive total score', function () {
      assert.equal(score.getTotal(), 3)
      score.setScore('sixes', 12)
      assert.equal(score.getTotal(), 15)
    })
  })
})

describe('History tests', function () {
  describe('Rouds count', function () {
    it('Should calculate score from dice results', function () {
      assert.equal(history.getCurrentRound(), 0)
      history.newRound()
      assert.equal(history.getCurrentRound(), 1)
    })
  })

  describe('Results log', function () {
    it('Should log throw results', function () {
      history.setThrowResults(1, [1, 1, 5, 6, 2])
      history.setThrowResults(2, [1, 1, 1, 5, 4])
      history.setThrowResults(3, [1, 1, 1, 5, 5])

      assert.deepEqual(history.getHistory(), [])

      history.closeRound('full', 30)
      assert.equal(history.getHistory().length, 1)
      assert.equal(history.getHistory()[0].score, 30)
    })
  })
})
