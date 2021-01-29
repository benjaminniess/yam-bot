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
      return throwManager.formatDicesValues('1 2 3 4 5').then((value) => {
        assert.deepEqual(value, ['1', '2', '3', '4', '5'])
      })
    })
    it('should convert a space separated list of dice value into an array of dice values', function () {
      return throwManager.formatDicesValues('1 2 3 4 5', 5).then((value) => {
        assert.deepEqual(value, ['1', '2', '3', '4', '5'])
      })
    })
    it('should convert a space separated list of dice value into an array of dice values', function () {
      throwManager.setThroableDices(3)
      return throwManager.formatDicesValues('1 1 3').then((value) => {
        assert.deepEqual(value, ['1', '1', '3'])
      })
    })
    it('should not refuse to convert a space separated list of wrong dice value', function () {
      return throwManager
        .formatDicesValues('1 1 10')
        .then((value) => {
          assert.equal(true, false)
        })
        .catch((errorM) => {
          assert.equal(errorM, 'wrong-format')
        })
    })
    it('should not refuse to convert a space separated list of wrong dice value', function () {
      return throwManager
        .formatDicesValues('1 1 1 1')
        .then((value) => {
          assert.equal(true, false)
        })
        .catch((errorM) => {
          assert.equal(errorM, 'wrong-length')
        })
    })
  })
})
