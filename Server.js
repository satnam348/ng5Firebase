const express = require('express');
const app = express();
var router = express.Router();

app.use(express.static(__dirname + '/dist'));
app.get('*', function (req, res) {
  res.sendfile('./dist/index.html'); });

//port = process.env.PORT || 3000;

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// app.listen(port);
// console.log('todo list RESTful API server started on: ' + port);
