// Requires
require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize variables
const app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// CORS Config
app.use(cors());

// Frontend app - Turn it on if you need to test the google auth
// app.use(express.static('public'));

// DB Connection
dbConnection();

// Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/login', require('./routes/login'));
app.use('/api/hospital', require('./routes/hospital'));
app.use('/api/medic', require('./routes/medic'));
app.use('/api/search', require('./routes/search'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/image', require('./routes/images'));

app.use('/api', require('./routes/app'));

// Listen requests
app.listen(process.env.PORT, () => {
  console.log(`Express server on port: ${process.env.PORT} \x1b[32m%s\x1b[0m`, 'online');
});
