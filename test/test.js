const assert = require('chai').assert
const helpers = require('../helpers')
const throwManager = require('../throwManager')
const score = require('../score')

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
