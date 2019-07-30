const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());
//app.use(morgan('tiny'))
morgan.token('postbody', function (req, res) { 
    if (req.method == 'POST') {
        return JSON.stringify(req.body);
    }
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postbody'));

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/info', (req, res) => {
    const moment = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p>${moment}`)
})

app.get('/api/persons/:id', (req, res) => {
    debugger;
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person)
    } else {
        console.log('404');
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    const randomId = Math.floor(Math.random() * Math.floor(1000));
    const person = req.body;
    if (!person.name) {
        return res.status(400).json({
            error: 'Name missing'
        })
    }
    if (!person.number) {
        return res.status(400).json({
            error: 'Number missing'
        })
    }
    const nameFound = persons.find(p => p.name === person.name);
    if (nameFound) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }

    person.id = randomId;
    persons = persons.concat(person);
    res.json(person);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});