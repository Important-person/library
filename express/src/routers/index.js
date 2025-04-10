const express = require('express');
const path = require('path'); 
const Book = require('../models/library');
const Comment = require('../models/message');
const container = require('../container');
const BooksRepository = require('../books');

const router = express.Router();
const fileMulter = require('../middleware/multerUpload');

router.get('/', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/api/user/login');
        } else {
            const books = await container.get(BooksRepository).getBooks();
            return res.render('index', {
                title: 'Главная страница',
                books
            });
        }
    } catch(err) {
        console.error(err);
    }
})

router.get('/create', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/api/user/login');
    }

    res.render('library/create', {
        title: 'Новая книга'
    })
})

router.post('/create', fileMulter.single("fileBook"), async (req, res) => {
    const { title, description, author, favorite, fileCover, fileName } = req.body;
    const newBook = new Book({
        title,
        description,
        author, 
        favorite,
        fileCover,
        fileName
    });

    try {
        await container.get(BooksRepository).createBook(newBook);
        res.redirect('/api/books');
    } catch(err) {
        console.error(err);
        res.redirect('errors/404');
    }
})

router.get('/update/:id', async (req, res) => {
    if(!req.isAuthenticated()) {
        return res.redirect('/api/user/login');
    }

    const { id } = req.params;
    try {
        const book = await container.get(BooksRepository).getBook(id);
        res.render('library/update', {
            title: 'Редактирование книги',
            book
        })
    } catch(err) {
        console.error(err);
    }
})

router.post('/update/:id', fileMulter.single("fileBook"), async (req, res) => {
    const { title, description, author, favorite, fileCover, fileName } = req.body;
    const { id } = req.params;

    const updateBook = {
        title,
        description, 
        author, 
        favorite,
        fileCover,
        fileName
    }

    try {
        await container.get(BooksRepository).updateBook(id, updateBook);
        res.redirect('/api/books');
    } catch(err) {
        console.error(err);
        res.redirect('errors/404');
    }
})

router.get('/:id', async (req, res) => {
    if(!req.isAuthenticated()) {
        return res.redirect('/api/user/login');
    }

    const { id } = req.params;
    const book = await container.get(BooksRepository).getBook(id);
    if (!book) return res.redirect('/errors/404');

    const comments = await Comment.find({ bookId: id });

    try {
        const response = await fetch(`http://counter:3001/counter/${id}/incr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        const counter = data.count;

        res.render('library/view', {
            title: 'Книга',
            book,
            counter,
            user: req.user,
            comments
        });
    } catch (err) {
        console.error(err);
        res.redirect('library/view', {
            title: 'Книга',
            book,
            counter: "Ошибка получения данных счетчика",
            user: req.user,
            comments
        });
    }
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        await container.get(BooksRepository).deleteBook(id);
        res.redirect('/api/books');
    } catch(err) {
        res.redirect('errors/404');
    }
})

router.get('/:id/download', async (req, res) => {
    if(!req.isAuthenticated()) {
        return res.redirect('/api/user/login');
    }

    const { id } = req.params;
    try {
        const book = await container.get(BooksRepository).getBook(id);
        if (!book?.fileName) return res.status(404).json({message: 'Файл не найден'});

        const pathFile = path.join(__dirname, '..', 'uploads', book.fileName);
        console.log(pathFile);
        res.download(pathFile, (err) => {
            if(err) {           
                res.redirect('errors/404');
            }
        })
    } catch(err) {
        console.error(err);
        res.status(404).json({message: 'Книга не найдена'});
    }
})

module.exports = router;