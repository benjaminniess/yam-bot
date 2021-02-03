class YamResolver {
  async Whatsnext(diceValues, throwCount, availableOptions) {
    let firstOption

    availableOptions.map((option) => {
      if (firstOption == null) {
        firstOption = option
      }
    })

    return firstOption
  }
}
module.exports = YamResolver
