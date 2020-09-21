const express = require('express')

// Create express instance
const app = express()

// Require API routes
const users = require('./routes/users')
const test = require('./routes/test')
const news = require('./routes/news')
const crypto = require('./routes/crypto')

// Import API Routes
app.use(users)
app.use(test)
app.use(news)
app.use(crypto)

require('./middleware/parseData')

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3030
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
