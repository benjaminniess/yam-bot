class YamResolver {
  Whatsnext(diceValues, throwCount, history) {
    return new Promise((resolve, reject) => {
      if (throwCount == 3) {
        resolve('aces')
      } else {
        resolve([1, 1, 3])
      }
    })
  }
}
module.exports = YamResolver
