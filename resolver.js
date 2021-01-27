class YamResolver {
  Whatsnext(diceValues, throwCount, availableOptions) {
    return new Promise((resolve, reject) => {
      if (throwCount == 3) {
        availableOptions.map((option) => {
          resolve(option)
        })
      } else {
        resolve([1, 1, 3])
      }
    })
  }
}
module.exports = YamResolver
