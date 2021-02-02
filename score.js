const helpers = require('./helpers')

class Score {
  constructor() {
    this.options = {
      aces: {
        played: false,
        label: 'Aces',
        score: 0,
      },
      twos: {
        played: false,
        label: 'Twos',
        score: 0,
      },
      threes: {
        played: false,
        label: 'Threes',
        score: 0,
      },
      fours: {
        played: false,
        label: 'Fours',
        score: 0,
      },
      fives: {
        played: false,
        label: 'Fives',
        score: 0,
      },
      sixes: {
        played: false,
        label: 'Sixes',
        score: 0,
      },
      '3-same': {
        played: false,
        label: '3 of a kind',
        score: 0,
      },
      '4-same': {
        played: false,
        label: '4 of a kind',
        score: 0,
      },
      full: {
        played: false,
        label: 'Full house',
        score: 0,
      },
      'sm-straight': {
        played: false,
        label: 'Small straight (1,2,3,4,5)',
        score: 0,
      },
      'lg-straight': {
        played: false,
        label: 'Large straight (2,3,4,5,6)',
        score: 0,
      },
      yahtzee: {
        played: false,
        label: 'YAHTZEE',
        score: 0,
      },
    }
  }

  isPlayed(option) {
    return this.getOption(option).played
  }

  getLabel(option) {
    return this.getOption(option).label
  }

  getScore(option) {
    return this.getOption(option).score
  }

  getOption(option) {
    return this.options[option]
  }

  setScore(option, score) {
    this.options[option].score = score
    this._setPlayed(option)
  }

  _setPlayed(option) {
    this.options[option].played = true
  }

  calculateScore(option, values) {
    let identicalFaces = helpers.countIdenticalFaces(values)

    switch (option) {
      case 'aces':
        return this._calcul_classic_score(1, values)
      case 'twos':
        return this._calcul_classic_score(2, values)
      case 'threes':
        return this._calcul_classic_score(3, values)
      case 'fours':
        return this._calcul_classic_score(4, values)
      case 'fives':
        return this._calcul_classic_score(5, values)
      case 'sixes':
        return this._calcul_classic_score(6, values)
      case '3-same':
        let maxOccurences = helpers.countIdenticalFaces(values)
        if (maxOccurences < 3) {
          return 0
        }

        let score = 0

        values.map((diceValue) => {
          score += diceValue
        })

        return score
      case 'sm-straight':
        return helpers.countOccurencesOf(1, values) == 1 &&
          helpers.countOccurencesOf(2, values) == 1 &&
          helpers.countOccurencesOf(3, values) == 1 &&
          helpers.countOccurencesOf(4, values) == 1 &&
          helpers.countOccurencesOf(5, values) == 1
          ? 25
          : 0
      case 'lg-straight':
        return helpers.countOccurencesOf(2, values) == 1 &&
          helpers.countOccurencesOf(3, values) == 1 &&
          helpers.countOccurencesOf(4, values) == 1 &&
          helpers.countOccurencesOf(5, values) == 1 &&
          helpers.countOccurencesOf(6, values) == 1
          ? 25
          : 0
      case 'full':
        let groupedValues = helpers.groupResultByValues(values)
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

  _calcul_classic_score(optionInteger, values) {
    return helpers.countOccurencesOf(optionInteger, values) * optionInteger
  }

  getAvailableOptions() {
    let availableOptions = []
    for (const [key, option] of Object.entries(this.options)) {
      if (option.played == false) {
        availableOptions.push(key)
      }
    }

    return availableOptions
  }

  getTotal() {
    let total = 0
    for (const [key, option] of Object.entries(this.options)) {
      total += option.score
    }

    if (
      this.getScore('aces') +
        this.getScore('twos') +
        this.getScore('threes') +
        this.getScore('fours') +
        this.getScore('fives') +
        this.getScore('sixes') >
      63
    ) {
      total += 37
    }
    return total
  }
}
module.exports = new Score()
