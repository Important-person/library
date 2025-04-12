const User = require('../models/users');
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('user/login', {
        title: 'Страница входа'
    });
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/user/me',
    failureRedirect: '/api/user/login'
}))

router.get('/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/api/user/login');
    }
    res.render('user/personal_cab', {
        title: 'Личный кабинет',
        user: req.user
    });
})

router.get('/signup', (req, res) => {
    res.render('user/signup', {
        title: 'Регистрация'
    });
})

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    try {
        const existsUser = await User.findOne({ username });
        if (existsUser) {
            console.log(`Пользователь ${existsUser.username} уже зарегистрирован`);
            return res.redirect('/api/user/login');
        }

        const newUser = new User({ username, password });
        await newUser.save();

        req.login(newUser, (err) => {
            if (err) return res.redirect('/api/user/login');
            return res.redirect('/api/user/me');
        })
    } catch (err) {
        console.error(err);
        res.redirect('/api/user/signup');
    }
})

module.exports = router;
