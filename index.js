require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const crypto = require('crypto');
const app = express()
const mongoose = require('mongoose')

const baseUrl = process.env.BASE_URL
const mongoPwd = process.env.MONGO_PWD
const mongoUrl = `mongodb+srv://sinisterthought:${mongoPwd}@cluster0.wd7qv5o.mongodb.net/contactsApp?retryWrites=true&w=majority`

app.use(express.static('dist'))

const options = {
    limit: '1kb',
    stream: process.stdout
}

mongoose.connect(mongoUrl)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

let persons = [
        {
           "id": generateUniqueID(),
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": generateUniqueID(),      
            "name": "Ada Lovelace",       
            "number": "39-44-5323523"    
        },    
        {       
            "id": generateUniqueID(),      
            "name": "Dan Abramov",      
            "number": "12-43-234345"    
        },    
        {     
            "id": generateUniqueID(),
            "name": "Bilbo Baggins",
            "number": "12-34-56789"
        }
    ]

function generateUniqueID() {
  return crypto.randomUUID();
}

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
app.use(cors())
app.use(express.json())
app.use(requestBodyLog)
app.use(morgan(':method :url :status :response-time ms'))

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "unknown endpoint"})
}

const path = require('path')

app.get('/', (request, response) => {
    response.send(`${baseUrl}/api/persons`)
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
    const personId = JSON.stringify(request.params.id)
    const findPerson = persons.find(person => person.id === personId)

    if(!findPerson) {
        response.status(404).send({ message: 'person not found'})
    }
    response.json(findPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const personIndex = persons.findIndex(person => person.id === id);
  
    if (personIndex !== -1) {
      persons.splice(personIndex, 1); // Remove element at specified index
      response.json({ message: 'Person deleted successfully' }); // Optional success message
    } else {
      response.status(404).send({ message: 'Person not found' }); // Error handling for non-existent ID
    }
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

app.put('/api/persons/:id', (request, response) => {
    const body = request.body;

    const updatePerson = {
        ...body,
        name: body.name,
        number: body.number
    }


})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})