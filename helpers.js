/**
 * Checks if the stdin dice values is correct (5 numbers from 1 to 6 separated with spaces)
 *
 * @param {*} values
 */
function formatDicesValues(values, diceCount = 5) {
  return new Promise((resolve, reject) => {
    let numbers = values.split(' ')
    if (numbers.length !== 5) {
      reject()
    }

    let isOk = true
    numbers.map((x) => {
      if (x < 1 || x > 6) {
        isOk = false
      }
    })

    if (!isOk) {
      reject()
    }

    resolve(numbers)
  })
}

function verifyWhatsNext(result, values, throwNumber, stashed, history) {
  return new Promise((resolve, reject) => {
    // TODO: analyse
    resolve()
  })
}

exports.formatDicesValues = formatDicesValues
exports.verifyWhatsNext = verifyWhatsNext
