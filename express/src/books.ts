const Book = require('./models/library');
const { injectable } = require('inversify');

interface BookData {
    title: string;
    description: string;
    author: string;
    favorite: string;
    fileCover: string;
    fileName: string;
}

interface IBook {
    createBook(book: BookData): Promise<void>;
    getBook(id: number): Promise<BookData | null>;
    getBooks(): Promise<BookData[]>;
    updateBook(id: number, updatedBook: BookData): Promise<void>;
    deleteBook(id: number): Promise<void>;
}

@injectable()
abstract class BooksRepository implements IBook {
    constructor() {}
    
    async createBook(book: BookData) {
        try {
            const newBook = new Book(book);
            await newBook.save();
        } catch(err) {
            console.error(err);
        }
    }

    async getBook(id: number): Promise<BookData | null> {
        try {
            const book = await Book.findById(id);
            return book;
        } catch(err) {
            console.error(err);
            return null;
        }
    }

    async getBooks(): Promise<BookData[]> {
        try {
            const books = await Book.find({});
            return books || [];
        } catch(err) {
            console.error(err);
            return [];
        }
    }

    async updateBook(id: number, updatedBook: BookData) {
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

module.exports = BooksRepository;
