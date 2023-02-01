const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/reel-eval'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname +
    '/dist/reel-eval/index.html'));
});
app.listen(process.env.PORT || 80);
