var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit')
require('dotenv').config()

var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products')
var variantRouter = require('./routes/variants');
const { expressLogger } = require('../winston');

const port = process.env.PORT || 3000

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(expressLogger)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after some time.',
  max: 2
})

app.use(limiter)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/products', productsRouter)
app.use('/api/variants', variantRouter)

app.post('/api/token', (req, res) => {
  const { userId, username } = req.body
  try {
    if (!(userId && username)) {
      res.status(404)
    }

    const payload = { userId, username };
    const secretKey = 'testsecret12345';

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
