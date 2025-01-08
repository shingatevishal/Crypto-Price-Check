import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';

const port = 3000;
const app = express();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home', { price: null });
});

app.post('/submit', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                x_cg_demo_api_key: 'CG-EjRqSzUSpmPvCLqrLWJzu7nE', // Include your API key here
                ids: req.body.crypto,
                vs_currencies: req.body.currency
            }
        });
        const price = response.data[req.body.crypto][req.body.currency.toLowerCase()];
        res.render('home.ejs', { price: `The price of ${req.body.crypto} in ${req.body.currency} is ${price}` });
        
    } catch (error) {
        console.error(error);
        res.status(404).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});