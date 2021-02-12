# YAM BOT

### Installation

`npm install`

### How to use?

#### Play for real?

`node index.js`

It will ask you to enter what dices you got from your throw. Just write it down and hit enter.
The bot will tell you what to do next

#### Simulate as many games as you like?

`node index.js --rounds=10`

### Build your own YAM BOT

If you want to build your own YAM BOT you just need to copy the `bots/HelloBot` dir wherever you want, and tweak the `decideWhatsnext` function. This function needs to return either an array with the dices you want to save for the next throws (ex. `[ 3, 3 ]` or the key of the option you want to save (ex. `lg-straight`) )

In your extented class, yYou'll always have access to :

`this.getAvailableOptions()` : The options you haven't used yet

`this.getDiceValues()` : The dice values in an array such as `[ 1, 5, 2, 1, 6]`

`this.getThrowCount()`: The number of throws for the current round (`1`, `2` or `3`)

`this.getCurrentRoundNumber()` : The current round (`1` to `12`)

You'll aslo have acces to a bunch of helpers in the `helpers.js` file functions such as `countIdenticalFaces()`, `countOccurencesOf()`, `calculateScore` etc.

Run you bot like so:

`node index.js --rounds=10 --bot=path/to/you/bot`
