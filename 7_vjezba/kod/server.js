// ovdje samo pokrecemo server
const app = require('./app')

const PORT = 3001

app.listen(PORT, err => {
  if (err) {
    console.error(err)
    return
  }
  console.log('Working on', PORT)
})