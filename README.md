- Устанавливаем нужную базу данных в качетве текущей
    `use library`

- Создаем коллекцию books и добавляем в неё книги
    `db.books.insertMany([{
        "title": "Золотая рыбка",
        "description": "сказка",
        "authors": "Пушкин А. С."
    },
    {
        "title": "Евгений Онегин",
        "description": "роман в стихах",
        "authors": "Пушкин А. С."
    }, 
    {
        "title": "Руслан и Людмила",
        "description": "поэма",
        "authors": "Пушкин А. С."
    }])`

- Запрос поиска книги по полю title
    `db.books.find({"title": "Евгений Онегин"})`

- Запрос на редактирование данных книги по _id
    `db.books.updateOne({
        _id: ObjectId('id книги которую меняем') 
    },
    {
        $set: {description: "слова", authors: "данные"}
    })`