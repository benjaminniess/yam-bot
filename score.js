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
        label: 'LArge straight (2,3,4,5,6)',
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
  }

  setPlayed(option) {
    this.options[option].played = true
  }

  calculateScore(option, values) {
    return 10
  }

  getTotal() {
    let total = 0
    for (const [key, option] of Object.entries(object1)) {
      total += option
    }

    return total
  }
}
module.exports = new Score()