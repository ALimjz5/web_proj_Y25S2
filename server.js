const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes.js');

app.use('/',routes);
app.use(express.static('views'));
app.listen(port, function () {
    console.log('Server started on port ' + port);
});
