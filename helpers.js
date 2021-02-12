/**
 * Get the max number of identical faces in a 5 dices results (ex. [1,3,3,1,1] will return 3)
 *
 * @param {array} result: An array of dices values
 * @return {number} the maximum identical occurences
 */
function countIdenticalFaces(result) {
  let groupedValues = groupResultByValues(result)
  if (!groupedValues) {
    return
  }

  let maxOccurences = 0

  for (const [diceValue, occurencesCount] of Object.entries(groupedValues)) {
    if (occurencesCount > maxOccurences) {
      maxOccurences = occurencesCount
    }
  }

  return maxOccurences
}

/**
 * Get the number of occurences of a dice number for a given throw result
 *
 * @param {number} value: a dice value from 1 to 6
 * @param {array} result: An array of dices values
 * @return {number} the number of occurences of the value in the givent result array
 */
function countOccurencesOf(value, result) {
  let groupedResults = groupResultByValues(result)
  if (groupedResults[value]) {
    return groupedResults[value]
  }

  return 0
}

/**
 * Convert an array of result into an object with dice number as properties and occurences as values
 *
 * @param {array} result: An array of dices values
 * @return {object} the result converted object
 */
function groupResultByValues(result) {
  if (undefined == result) {
    return
  }

  return result.reduce(
    (a, c) => ((a[c] = (a[c] || 0) + 1), a),
    Object.create(null),
  )
}

/**
 *
 * @param {string} option: the key of an option ("4-same", "full" etc.)
 * @param {array} result: An array of dices values
 * @return {nuber} The potential score for the given option/result
 */
function calculateScore(option, result) {
  let identicalFaces = countIdenticalFaces(result)

  switch (option) {
    case 'aces':
      return _calcul_classic_score(1, result)
    case 'twos':
      return _calcul_classic_score(2, result)
    case 'threes':
      return _calcul_classic_score(3, result)
    case 'fours':
      return _calcul_classic_score(4, result)
    case 'fives':
      return _calcul_classic_score(5, result)
    case 'sixes':
      return _calcul_classic_score(6, result)
    case '3-same':
      let maxOccurences = countIdenticalFaces(result)
      if (maxOccurences < 3) {
        return 0
      }

      let score = 0

      result.map((diceValue) => {
        score += parseInt(diceValue)
      })

      return score
    case 'sm-straight':
      return countOccurencesOf(1, result) == 1 &&
        countOccurencesOf(2, result) == 1 &&
        countOccurencesOf(3, result) == 1 &&
        countOccurencesOf(4, result) == 1 &&
        countOccurencesOf(5, result) == 1
        ? 25
        : 0
    case 'lg-straight':
      return countOccurencesOf(2, result) == 1 &&
        countOccurencesOf(3, result) == 1 &&
        countOccurencesOf(4, result) == 1 &&
        countOccurencesOf(5, result) == 1 &&
        countOccurencesOf(6, result) == 1
        ? 25
        : 0
    case 'full':
      let groupedValues = groupResultByValues(result)
      if (Object.keys(groupedValues).length != 2) {
        return 0
      }

      if (
        groupedValues[Object.keys(groupedValues)[0]] != 3 &&
        groupedValues[Object.keys(groupedValues)[0]] != 2
      ) {
        return 0
      }

      return 30
    case '4-same':
      if (identicalFaces >= 4) {
        return 40
      }

      return 0
    case 'yahtzee':
      if (identicalFaces == 5) {
        return 50
      }

      return 0
    default:
      return 0
  }
}

function _calcul_classic_score(optionInteger, values) {
  return countOccurencesOf(optionInteger, values) * optionInteger
}

exports.countIdenticalFaces = countIdenticalFaces
exports.countOccurencesOf = countOccurencesOf
exports.groupResultByValues = groupResultByValues
exports.calculateScore = calculateScore
