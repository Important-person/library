require("reflect-metadata");
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const indexRouter = require('./routers/index');
const userRouter = require('./routers/user');
const error = require('./middleware/error404');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/users');
const cors = require('cors');
const bycrypt = require('bcrypt');
const socketIO = require('socket.io');
const io = socketIO(http);
const Comment = require('./models/message');

async function start(PORT, URLDB) {
    try {
        await mongoose.connect(URLDB);
        http.listen(PORT);
    } catch(err) {
        console.error(err);
    }
}

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('join_book', (bookId) => {
        socket.join(bookId);
    });

    socket.on('new_comment', async ({ bookId, username, message }) => {
        io.to(bookId).emit('new_comment', { username, message });

        try {
            const newMessage = new Comment({ bookId, username, message });
            await newMessage.save();
        } catch (err) {
            console.error(err);
        }
    });
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'My secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new localStrategy({
        usernameField: 'username'
    }, async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if(!user) {
                return done(null, false, {message: 'Пользователь не найден'})
            } 
            
            const isMatch = await bycrypt.compare(password, user.password);
            if(!isMatch) {
                return done(null, false, {message: 'Неверный пароль'})
            }
    
            return done(null, user)
        } catch(err) {
            return done(err, false, {message: 'Непредвиденная ошибка'})
        }
    })
)

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (user, done) => {
    const foundUser = await User.findById(user._id);
    done(null, foundUser || false);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api/books', indexRouter);
app.use('/api/user', userRouter);

app.use(error);


const URLDB = process.env.URLDB;
const PORT = process.env.PORT || 3002;
start(PORT, URLDB);