const express = require('express');

const app = express();
const indexRouter = require('./routers/index');
const error = require('./middleware/error404');
const path = require('path');

app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api/books', indexRouter);

app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT);