const express = require('express');
const path = require('path'); 
const {v4: uuid} = require('uuid');

const router = express.Router();
const fileMulter = require('../middleware/multerUpload');

class Book {
    constructor(id = uuid(), title = "", description = "", author = "", favorite = "", fileCover = "", fileName = "", fileBook = "") {
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
}

const stor = {
    books: []
};

router.get('/', (req, res) => {
    const { books } = stor;
    console.log(books);
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

router.post('/create', fileMulter.single("fileBook"), (req, res) => {
    const { books } = stor;
    const { title, description, author, favorite, fileCover, fileName } = req.body;

    const fileBook = req.file;

    const newBook = new Book(undefined, title, description, author, favorite, fileCover, fileName, fileBook);
    books.push(newBook);

    if(fileBook) {
        res.redirect('/api/books');
    } else {
        res.redirect('errors/404');
    }
})

router.post('/api/user/login', (req, res) => {
    res.status(201).json({ id: 1, mail: "test@mail.ru" });
})

router.get('/update/:id', (req, res) => {
    const { id } = req.params;
    const { books } = stor;
    const book = books.find(elem => elem.id == id);
    res.render('library/update', {
        title: 'Редактирование книги',
        book
    })
})

router.post('/update/:id', fileMulter.single("fileBook"), (req, res) => {
    const { books } = stor;
    const { title, description, author, favorite, fileCover, fileName } = req.body;
    const fileBook = req.file;
    const { id } = req.params;
    const bookId = books.findIndex(elem => elem.id === id);

    if(bookId !== -1) {
        const newBook = new Book(undefined, title, description, author, favorite, fileCover, fileName, fileBook);
        Object.assign(books[bookId], newBook);
        res.redirect('/api/books');
    } else {
        res.redirect('errors/404');
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { books } = stor;
    const book = books.find(elem => elem.id == id);

    if (!book) {
        return res.redirect('/errors/404');
    }
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
        res.render('library/view', {
            title: 'Книга',
            book,
            counter: 'Ошибка получения просмотров'
        });
    }
});

router.post('/delete/:id', (req, res) => {
    const { books } = stor;
    const { id } = req.params;
    const bookIndex = books.findIndex(elem => elem.id == id);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        res.redirect('/api/books');
    } else {
        res.redirect('errors/404');
    }
})

router.get('/:id/download', (req, res) => {
    const { id } = req.params;
    const { books } = stor;

    const book = books.find(elem => elem.id == id);

    if(!book) {
        return res.status(404).json({message: 'Книга не найдена'});
    }

    const pathFile = path.join(__dirname, '..', 'uploads', book.fileBook.filename);
    res.download(pathFile, (err) => {
        if(err) {           
            res.redirect('errors/404');
        }
    })
})

module.exports = router;