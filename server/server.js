const express = require ('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const hpp = require('hpp');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./router');

require('dotenv').config();

const app = express();

//use cors
app.use(cors());

// Allow headers manually
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control_ALlow_Methods', 'GET, POST, PATCH, DELETE')
  next();
});

// Public Folder
app.use(express.static('public'));



// use express body parser
app.use(bodyParser.json());

// use cookies
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));



// Set security headers
app.use(helmet());


// Prevent http param pollution
app.use(hpp());


app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use('/', router);



const server = http.createServer(app);


const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
} );


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  // Close server & exit process
  server.close(() => process.exit(1));
});
