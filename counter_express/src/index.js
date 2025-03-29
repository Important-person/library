const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/counter/:bookId/incr', async (req, res) => {
    const { bookId } = req.params;
    const pathFile = path.join(__dirname, 'data', `${bookId}.txt`);

    try {
        let count = 0;
        
        try {
            const data = await fs.readFile(pathFile, 'utf-8');
            count = parseInt(data) || 0;
        } catch (err) {
            if (err) {
                console.log('файла нет начинаем с нуля');
            }
        }
        count++;
        await fs.writeFile(pathFile, count.toString());

        res.json({ count });
    } catch (err) {
        console.error({ message: err.message });
        res.status(500).json({ details: err.message });
    }
});

app.get('/counter/:bookId', async (req, res) => {
    const { bookId } = req.params;
    const pathFile = path.join(__dirname, 'data', `${bookId}.txt`);

    try {
        const data = await fs.readFile(pathFile, 'utf-8');
        const count = parseInt(data);
        res.json({ count });
    } catch (err) {
        res.status(200).json({ count: 0 });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0');