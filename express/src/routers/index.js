const express = require('express');
const path = require('path'); 
const Book = require('../models/library');

const router = express.Router();
const fileMulter = require('../middleware/multerUpload');

router.get('/', async (req, res) => {
    const books = await Book.find({});
    res.render('index', {
        title: 'Список книг',
        books
    })
})

router.get('/create', (req, res) => {
    res.render('library/create', {
        title: 'Новая книга'
    })
})

router.post('/create', fileMulter.single("fileBook"), async (req, res) => {
    const { title, description, author, favorite, fileCover, fileName } = req.body;

    const fileBook = req.file;

    const newBook = new Book({
        title,
        description,
        author, 
        favorite,
        fileCover,
        fileName
    });

    try {
        await newBook.save();
        res.redirect('/api/books');
    } catch(err) {
        console.error(err);
        res.redirect('errors/404');
    }
})

router.post('/api/user/login', (req, res) => {
    res.status(201).json({ id: 1, mail: "test@mail.ru" });
})

router.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);
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
    const fileBook = req.file;
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
        await Book.findByIdAndUpdate({_id: id}, { $set: updateBook }, {new: true});
        res.redirect('/api/books');
    } catch(err) {
        console.error(err);
        res.redirect('errors/404');
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) return res.redirect('/errors/404');

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
            counter
        });
    } catch (err) {
        console.error(err);
        res.redirect('library/view', {
            title: 'Книга',
            book,
            counter: "Ошибка получения данных счетчика"
        });
    }
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        await Book.findByIdAndDelete(id);
        res.redirect('/api/books');
    } catch(err) {
        res.redirect('errors/404');
    }
})

router.get('/:id/download', async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await Book.findById(id);
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