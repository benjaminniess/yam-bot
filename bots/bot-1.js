const YamResolver = require('../resolver')
class Bot1 extends YamResolver {
  test() {
    console.log('ok')
  }
}
module.exports = new Bot1()
