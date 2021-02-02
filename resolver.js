class YamResolver {
  Whatsnext(diceValues, throwCount, availableOptions) {
    return new Promise((resolve, reject) => {
      availableOptions.map((option) => {
        resolve(option)
      })
    })
  }
}
module.exports = YamResolver
