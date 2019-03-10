var config = {
  PORT: 3000 || process.env.PORT,
  secret: 'the quick brown fox jumps over the lazy dog'
}

config.calculateHours = (numberOfHours) => {
   return 1000 * 60 * 60 * numberOfHours
}

module.exports = config


