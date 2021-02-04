const helpers = require('./helpers')
const Table = require('cli-table3')
const chalk = require('chalk')

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

  reset() {
    for (const [key, option] of Object.entries(this.options)) {
      this.options[key].played = false
      this.options[key].score = 0
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
    this.options[option].score = parseInt(score)
    this._setPlayed(option)
  }

  _setPlayed(option) {
    this.options[option].played = true
  }

  calculateScore(option, values) {
    return helpers.calculateScore(option, values)
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
      total += parseInt(option.score)
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

  getScoreTable(highlight = false) {
    let table = new Table({
      head: ['Options', 'Score'],
      colWidths: [50, 50],
    })

    for (const [key, option] of Object.entries(this.options)) {
      if (highlight == key) {
        table.push([chalk.green(option.label), chalk.green(this.getScore(key))])
      } else {
        table.push([
          option.label,
          option.played ? this.getScore(key) : 'Not played yet',
        ])
      }
    }

    table.push(['BONUS (+37 if 63 or more with Aces to Sixes )', '0'])
    table.push([chalk.green('TOTAL'), chalk.green(this.getTotal())])

    return table.toString()
  }
}
module.exports = new Score()
