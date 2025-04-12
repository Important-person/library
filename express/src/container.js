const { Container } = require('inversify');
const BooksRepository = require('./books');

const container = new Container();

container.bind(BooksRepository).toSelf();

module.exports = container;
