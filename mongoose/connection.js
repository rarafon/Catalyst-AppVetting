var config = require('../config');      // Load config file to get URL, username, password, etc

var mongoose = require('mongoose');     // Import the mongoose module

/* PULL IN SENSITIVE INFORMATION FROM config.js */
var local_url = 'mongodb://127.0.0.1:27017/test';   // Local URL, connects EC2 instance to local mongod
var remote_url = config.ec2.public_ip;              // Connects to the public IP of the server hosting the database

// var options = {
//     username:   config.mongo.username,      // Username and password of a user that has read and write permissions
//     password:   config.mongo.password
// };

// Example: mongodb://username:password@127.0.0.1:27017/database-to-use?authSource=admin
var uri = 'mongodb://'
    + config.mongo.username
    + ':'
    + encodeURIComponent(config.mongo.password)
    + '@'
    + config.mongo.host
    + ':'
    + config.mongo.port
    + '/'
    + config.mongo.db
    + '?authSource='
    + config.mongo.authSource;



// Connect to the URL
// mongoose.connect(uri, options);
mongoose.connect(uri, {useMongoClient: true});
mongoose.connection.on('error', console.error.bind(console, '[ DATABASE ] Connection :: Connection response: '));
mongoose.connection.once('open', function () {
    console.log('[ DATABASE ] Connection :: Successfully connected to the database: ' + config.mongo.db);
});

// Nothing needs to be exported, simply use:   require('<path>/mongoose')
module.exports = mongoose;
