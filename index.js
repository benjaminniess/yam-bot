const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const options = {
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

console.log('Yam bot at your service!')

startListening()
  .then((values) => {
    console.log(values)
    return startListening()
  })
  .catch(() => {
    console.log('Please enter 5 space separated numbers')
    return startListening()
  })

function startListening() {
  return new Promise((resolve, reject) => {
    rl.question('Please tell me what you got? ', (answer) => {
      formatDicesValues(answer)
        .then((values) => {
          resolve(values)
        })
        .catch(() => {
          reject()
        })
    })
  })
}

/**
 * Checks if the stdin dice values is correct (5 numbers from 1 to 6 separated with spaces)
 *
 * @param {*} values
 */
function formatDicesValues(values) {
  return new Promise((resolve, reject) => {
    let numbers = values.split(' ')
    if (numbers.length !== 5) {
      reject()
    }

    let isOk = true
    numbers.map((x) => {
      if (x < 1 || x > 6) {
        isOk = false
      }
    })

    if (!isOk) {
      reject()
    }

    resolve(numbers)
  })
}
