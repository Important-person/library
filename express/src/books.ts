const Book = require('./models/library');

interface Book {
    title: string;
    description: string;
    authors: string[];
    favorite: string;
    fileCover: string;
    fileName: string;
}

interface IBook {
    createBook(book: Book): Promise<void>;
    getBook(id: number): Promise<Book | null>;
    getBooks(): Promise<Book[]>;
    updateBook(id: number, updatedBook: Book): Promise<void>;
    deleteBook(id: number): Promise<void>;
}

abstract class BooksRepository implements IBook {
    constructor() {}
    
    async createBook(book: Book) {
        try {
            const newBook = new Book({ ...book });
            await newBook.save();
        } catch(err) {
            console.error(err);
        }
    }

    async getBook(id: number): Promise<Book | null> {
        try {
            const book = await Book.findById(id);
            return book;
        } catch(err) {
            console.error(err);
            return null;
        }
    }

    async getBooks(): Promise<Book[]> {
        try {
            const books = await Book.find({});
            return books;
        } catch(err) {
            console.error(err);
        }
    }

    async updateBook(id: number, updatedBook: Book) {
        try {
            await Book.findByIdAndUpdate({_id: id}, { $set: updatedBook }, {new: true});
        } catch(err) {
            console.error(err);
        }
    }

    async deleteBook(id: number) {
        try {
            await Book.findByIdAndDelete(id);
        } catch(err) {
            console.error(err);
        }
    }
}

