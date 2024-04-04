const express = require('express')
const morgan = require('morgan')
const app = express()

const options = {
    limit: '1kb',
    stream: process.stdout
}

let persons = [
        {
           "id": 1,
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": 2,      
            "name": "Ada Lovelace",       
            "number": "39-44-5323523"    
        },    
        {       
            "id": 3,      
            "name": "Dan Abramov",      
            "number": "12-43-234345"    
        },    
        {     
            "id": 3,
            "name": "Bilbo Baggins",
            "number": "12-34-56789"
        }
    ]

const links = [
    'http://localhost:3001',
]

const requestBodyLog = (request, response, next) => {
    console.log('Request Body:', request.body)
    next()
}

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}

app.use(express.json())
app.use(requestBodyLog)
app.use(morgan(':method :url :status :response-time ms'))

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "unknown endpoint"})
}

const crypto = require('crypto');
const path = require('path')

function generateUniqueID() {
  return crypto.randomUUID();
}

app.get('/', (request, response) => {
    response.send(`<a href='http://localhost:3001/api/persons'>Go to persons database</a>`)
}
    )


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    const dbCount = persons && persons.length
    response.json({ "Date": date, "Items": dbCount })
})

app.get('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id)
    const findPerson = persons.find(person => person.id === personId)

    if(!findPerson) {
        response.status(404).send({ message: 'person not found'})
    }
    response.json(findPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons.filter(person => person.id !== id)

    response.json(persons)
  });
  

app.post('/api/persons', (request, response) => {
    const body = request.body;

    const newPerson = {
        id: generateUniqueID(),
        name: body.name,
        number: body.number
    }

    if (persons.find(person => body.name === person.name) || persons.find(person => body.number === person.number)) {
        response.status(400).send({ message: 'Duplicate entry'})
    } else if (!body || !body.name || !body.number) {
        response.status(400).send({ message: "empty value found in posted data"})
    } else {
        persons = persons.concat(newPerson)
  
        console.log(newPerson);
        response.json(persons);
    }
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})