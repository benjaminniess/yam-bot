const assert = require('chai').assert
const helpers = require('../helpers')
const throwManager = require('../throwManager')

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
