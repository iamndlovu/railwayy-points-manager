// Import packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Allow cross origin resource fetching
app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database URI
const uri =
  'mongodb://0.0.0.0:27017/railroad_monitor_local?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
try {
  mongoose.connect(uri);

  // Connect database
  const connection = mongoose.connection;
  connection.once('open', () =>
    console.log('MongoDB database connection established successfully\n')
  );
} catch (error) {
  console.error(error);
}

// Import and use routes
app.use('/users', require('./routes/api/users'));
// app.use('/files', require('./routes/api/files'));
// app.use('/commits', require('./routes/api/commits'));
// app.use('/push', require('./routes/api/push'));
// app.use('/activities', require('./routes/api/activity'));
// app.use('/categories', require('./routes/api/category'));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`\nServer started on port ${PORT}`));
