"use strict";

const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    manager = require('./server/manager');

app.set('port', (process.env.PORT || 9000));
app.use(express.static(__dirname + '/build'));

server.listen(app.get('port'), () => {
    console.log('server is running: ', app.get('port'));
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/build/index.html`);
});

manager.init(app, server);