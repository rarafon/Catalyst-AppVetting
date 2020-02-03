const dotenv = require('dotenv');
dotenv.config();

var mongoose = require('mongoose');     // Import the mongoose module

// var local_url = 'mongodb://127.0.0.1:27017/test';   // Local URL, connects EC2 instance to local mongod
// var remote_url = config.ec2.public_ip;  // public_ip: '127.0.0.1',             Connects to the public IP of the server hosting the database

// var options = {
//     username:   process.env.DB_USERNAME,      // Username and password of a user that has read and write permissions
//     password:   process.env.DB_PASSWORD
// };

// Example: mongodb://username:password@127.0.0.1:27017/database-to-use?authSource=admin
var uri = 'mongodb://'
    + process.env.DB_USERNAME
    + ':'
    + encodeURIComponent(process.env.DB_PASSWORD)
    + '@'
    + process.env.DB_HOST || 'localhost'
    + ':'
    + process.env.DB_PORT || '27017'
    + '/'
    + process.env.DB_NAME || 'catalyst'
    + '?authSource='
    + process.env.DB_AUTHSOURCE || 'admin';



// Connect to the URL
console.log(`Connecting to MongoDB uri: ${uri}`);
// mongoose.connect(uri, options);
mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true } );
mongoose.connection.on('error', console.error.bind(console, '[ DATABASE ] Connection :: Connection response: '));
mongoose.connection.once('open', function () {
    console.log('[ DATABASE ] Connection :: Successfully connected to the database: ' + process.env.DB_NAME);
});

// Nothing needs to be exported, simply use:   require('<path>/mongoose')
module.exports = mongoose;
