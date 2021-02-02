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

exports.countIdenticalFaces = countIdenticalFaces
exports.countOccurencesOf = countOccurencesOf
exports.groupResultByValues = groupResultByValues
