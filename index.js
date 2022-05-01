var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;


app.get('/', function (req, res) {
  return res.json({
    message: 'Hello World!'
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;