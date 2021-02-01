function countIdenticalFaces(result) {
  let groupedValues = groupResultByValues(result)
  return groupedValues[Object.keys(groupedValues)[0]]
}

function groupResultByValues(result) {
  return result.reduce(
    (a, c) => ((a[c] = (a[c] || 0) + 1), a),
    Object.create(null),
  )
}

exports.countIdenticalFaces = countIdenticalFaces
exports.groupResultByValues = groupResultByValues
