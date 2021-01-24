const assert = require('chai').assert
const helpers = require('../helpers')

describe('Helpers tests', function () {
  describe('formatDicesValues', function () {
    it('should convert a space separated list of dice value into an array of dice values', function () {
      return helpers.formatDicesValues('1 2 3 4 5').then((value) => {
        assert.deepEqual(value, ['1', '2', '3', '4', '5'])
      })
    })
    it('should convert a space separated list of dice value into an array of dice values', function () {
      return helpers.formatDicesValues('1 2 3 4 5', 5).then((value) => {
        assert.deepEqual(value, ['1', '2', '3', '4', '5'])
      })
    })
    it('should convert a space separated list of dice value into an array of dice values', function () {
      return helpers.formatDicesValues('1 1 3', 3).then((value) => {
        assert.deepEqual(value, ['1', '1', '3'])
      })
    })
    it('should not refuse to convert a space separated list of wrong dice value', function () {
      return helpers
        .formatDicesValues('1 1 10', 3)
        .then((value) => {
          assert.equal(true, false)
        })
        .catch((errorM) => {
          assert.equal(errorM, 'wrong-format')
        })
    })
    it('should not refuse to convert a space separated list of wrong dice value', function () {
      return helpers
        .formatDicesValues('1 1 1 1', 3)
        .then((value) => {
          assert.equal(true, false)
        })
        .catch((errorM) => {
          assert.equal(errorM, 'wrong-length')
        })
    })
  })
})
