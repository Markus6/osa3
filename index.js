require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

app.use(express.static('build'));

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
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()));
    });
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
    const person = persons.find(person => person.id === id);

    persons = persons.filter(p => p.id !== id);

    if (!person)
        res.status(404).end();

    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    
    const body = req.body;
    if (!body.name) {
        return res.status(400).json({
            error: 'Name missing'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'Number missing'
        })
    }
    // const nameFound = persons.find(p => p.name === person.name);
    // if (nameFound) {
    //     return res.status(400).json({
    //         error: 'Name must be unique'
    //     })
    // }

    const person = new Person({
        name : body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON());
    });
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});