const YamResolver = require('../../resolver')
const helpers = require('../../helpers')

class deepGreen extends YamResolver {
  constructor() {
    super()
    this.combinations = {
      aces: {
        family: '1-to-6',
        number: 1,
        potential: 5,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: false,
        toKeepIfNoMatch: [],
      },
      twos: {
        family: '1-to-6',
        number: 2,
        potential: 10,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: false,
        toKeepIfNoMatch: [],
      },
      threes: {
        family: '1-to-6',
        number: 3,
        potential: 15,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: false,
        toKeepIfNoMatch: [],
      },
      fours: {
        family: '1-to-6',
        number: 4,
        potential: 20,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: false,
        toKeepIfNoMatch: [],
      },
      fives: {
        family: '1-to-6',
        number: 5,
        potential: 25,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: false,
        toKeepIfNoMatch: [],
      },
      sixes: {
        family: '1-to-6',
        number: 6,
        potential: 30,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: false,
        toKeepIfNoMatch: [],
      },
      '3-same': {
        family: null,
        potential: 30,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: true,
        toKeepIfNoMatch: [],
      },
      'sm-straight': {
        family: null,
        potential: 25,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: true,
        toKeepIfNoMatch: [],
      },
      'lg-straight': {
        family: null,
        potential: 25,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: true,
        toKeepIfNoMatch: [],
      },
      full: {
        family: null,
        potential: 30,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: true,
        toKeepIfNoMatch: [],
      },
      '4-same': {
        family: null,
        potential: 40,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: true,
        toKeepIfNoMatch: [],
      },
      yahtzee: {
        family: null,
        potential: 50,
        probability: 0,
        weight: 0,
        match: false,
        requiresExactMatch: true,
        toKeepIfNoMatch: [],
      },
    }
  }

  async decideWhatsnext() {
    if (this.getCurrentRoundNumber() == 1 && this.getThrowCount() == 1) {
      this.reset()
    }
    if (this.getThrowCount() < 3) {
      let availableOptions = this.getAvailableOptions()
      let identicalFaces = helpers.countIdenticalFaces(this.getDiceValues())
      let groupedResults = helpers.groupResultByValues(this.getDiceValues())

      let combinations = JSON.parse(JSON.stringify(this.combinations))

      let bestWeight
      let bestOption
      let missingCount
      let toStash

      for (const [key, option] of Object.entries(combinations)) {
        if (availableOptions.indexOf(key) === -1) {
          continue
        }

        bestWeight = 0
        bestOption = null

        if (option.family == '1-to-6') {
          let occurences = helpers.countOccurencesOf(
            option.number,
            this.getDiceValues(),
          )

          combinations[key].probability = this.getProbability(5 - occurences)
          combinations[key].toKeepIfNoMatch = this.keepOnly(
            option.number,
            this.getDiceValues(),
          )
        } else {
          switch (key) {
            case 'yahtzee':
              combinations[key].probability = this.getProbability(
                5 - identicalFaces,
              )

              combinations[key].toKeepIfNoMatch = this.keepOnlyBestSimilar(
                this.getDiceValues(),
              )
              break
            case '4-same':
              combinations[key].probability = this.getProbability(
                4 - identicalFaces,
              )

              combinations[key].toKeepIfNoMatch = this.keepOnlyBestSimilar(
                this.getDiceValues(),
              )
              break
            case 'sm-straight':
              missingCount = 0
              for (let i = 1; i <= 5; i++) {
                if (helpers.countOccurencesOf(i, this.getDiceValues()) < 1) {
                  missingCount++
                }
              }

              combinations[key].probability = this.getProbability(missingCount)
              combinations[key].toKeepIfNoMatch = this.keepOnly(
                [1, 2, 3, 4, 5],
                this.getDiceValues(),
                true,
              )
              break
            case 'lg-straight':
              missingCount = 0
              for (let i = 2; i <= 6; i++) {
                if (helpers.countOccurencesOf(i, this.getDiceValues()) < 1) {
                  missingCount++
                }
              }

              combinations[key].probability = this.getProbability(missingCount)
              combinations[key].toKeepIfNoMatch = this.keepOnly(
                [2, 3, 4, 5, 6],
                this.getDiceValues(),
                true,
              )
              break
            case '3-same':
              toStash = []

              for (const [diceValue, occurences] of Object.entries(
                groupedResults,
              )) {
                if (parseInt(diceValue) === 5 || parseInt(diceValue) == 6) {
                  for (let i = 1; i <= occurences; i++) {
                    toStash.push(diceValue)
                  }
                }
              }

              combinations[key].probability = this.getProbability(
                5 - toStash.length,
              )

              combinations[key].toKeepIfNoMatch = toStash
              break
            case 'full':
              toStash = []

              for (let [diceValue, occurences] of Object.entries(
                groupedResults,
              )) {
                // Don't keep more than 3 identical dices
                if (occurences > 3) {
                  occurences = 3
                }

                if (occurences > 1) {
                  for (let i = 1; i <= occurences; i++) {
                    toStash.push(diceValue)
                  }
                }
              }

              combinations[key].probability = this.getProbability(
                5 - toStash.length,
              )

              combinations[key].toKeepIfNoMatch = toStash
              break
          }
        }

        if (combinations[key].probability === 1) {
          combinations[key].match = true
        }

        combinations[key].weight =
          (1 / combinations[key].probability) * combinations[key].potential

        if (combinations[key].weight > bestWeight) {
          bestWeight = combinations[key].weight
          bestOption = key
        }
      }

      let bestMatchedOption = null
      let bestMatchedScore = 0
      let bestNoMatchedOption
      let bestNoMatchedScore = 0
      for (const [key, option] of Object.entries(combinations)) {
        if (availableOptions.indexOf(key) === -1) {
          continue
        }

        if (option.match === true) {
          if (bestMatchedScore < option.potential) {
            bestMatchedScore = combinations[key].potential
            bestMatchedOption = key
          }
        } else {
          if (
            option.weight > bestNoMatchedScore ||
            bestNoMatchedOption === null
          ) {
            bestNoMatchedScore = option.weight
            bestNoMatchedOption = key
          }
        }
      }

      if (bestMatchedOption !== null) {
        return bestMatchedOption
      } else {
        return combinations[bestNoMatchedOption].toKeepIfNoMatch
      }
    } else {
      return this.getBestOption(this.getDiceValues())
    }
  }

  reset() {}
  getProbability(missingDicesCount) {
    if (missingDicesCount <= 0) {
      return 1
    }
    return Math.pow(6, missingDicesCount)
  }

  keepOnly(numbers, result, single = false) {
    let newResult = []
    let occurences
    if (!(numbers instanceof Array)) {
      numbers = [numbers]
    }

    numbers.forEach((number) => {
      occurences = helpers.countOccurencesOf(number, result)
      if (occurences <= 0) {
        return
      }

      for (let i = 0; i < occurences; i++) {
        if (single === false || newResult.indexOf(number) === -1) {
          newResult.push(number)
        }
      }
    })

    return newResult
  }

  keepOnlyBestSimilar(result) {
    let groupedValues = helpers.groupResultByValues(result)
    if (!groupedValues) {
      return
    }

    let maxOccurences = 0
    let bestNumber = null

    for (const [diceValue, occurencesCount] of Object.entries(groupedValues)) {
      if (occurencesCount > maxOccurences) {
        maxOccurences = occurencesCount
        bestNumber = diceValue
      }
    }

    let toStash = []
    for (let i = 0; i < maxOccurences; i++) {
      toStash.push(parseInt(bestNumber))
    }

    return toStash
  }

  getBestOption() {
    let bestOption
    let bestScore = null

    let currentScore = null
    this.getAvailableOptions().map((option) => {
      currentScore = helpers.calculateScore(option, this.getDiceValues())
      if (currentScore > bestScore || bestScore === null) {
        bestScore = currentScore
        bestOption = option
      }
    })

    return bestOption
  }
}
module.exports = new deepGreen()
