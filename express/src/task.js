const express = require('express');

const app = express();
const indexRouter = require('./routers/index');
const error = require('./middleware/error404');
const path = require('path');
const mongoose = require('mongoose');

async function start(PORT, URLDB) {
    try {
        await mongoose.connect(URLDB);
        app.listen(PORT);
    } catch(err) {
        console.error(err);
    }
}

app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api/books', indexRouter);

app.use(error);


const URLDB = process.env.URLDB;
const PORT = process.env.PORT || 3000;
start(PORT, URLDB);