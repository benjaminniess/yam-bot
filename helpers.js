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

function countOccurencesOf(value, result) {
  let groupedResults = groupResultByValues(result)
  if (groupedResults[value]) {
    return groupedResults[value]
  }

  return 0
}

function groupResultByValues(result) {
  if (undefined == result) {
    return
  }

  return result.reduce(
    (a, c) => ((a[c] = (a[c] || 0) + 1), a),
    Object.create(null),
  )
}

function calculateScore(option, values) {
  let identicalFaces = countIdenticalFaces(values)

  switch (option) {
    case 'aces':
      return _calcul_classic_score(1, values)
    case 'twos':
      return _calcul_classic_score(2, values)
    case 'threes':
      return _calcul_classic_score(3, values)
    case 'fours':
      return _calcul_classic_score(4, values)
    case 'fives':
      return _calcul_classic_score(5, values)
    case 'sixes':
      return _calcul_classic_score(6, values)
    case '3-same':
      let maxOccurences = countIdenticalFaces(values)
      if (maxOccurences < 3) {
        return 0
      }

      let score = 0

      values.map((diceValue) => {
        score += parseInt(diceValue)
      })

      return score
    case 'sm-straight':
      return countOccurencesOf(1, values) == 1 &&
        countOccurencesOf(2, values) == 1 &&
        countOccurencesOf(3, values) == 1 &&
        countOccurencesOf(4, values) == 1 &&
        countOccurencesOf(5, values) == 1
        ? 25
        : 0
    case 'lg-straight':
      return countOccurencesOf(2, values) == 1 &&
        countOccurencesOf(3, values) == 1 &&
        countOccurencesOf(4, values) == 1 &&
        countOccurencesOf(5, values) == 1 &&
        countOccurencesOf(6, values) == 1
        ? 25
        : 0
    case 'full':
      let groupedValues = groupResultByValues(values)
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
