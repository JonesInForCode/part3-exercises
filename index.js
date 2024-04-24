const express = require('express')
const app = express()
require('dotenv').config()

const Contact = require('./models/person')

let contacts = []

app.use(express.static('dist'))

const options = {
    limit: '1kb',
    stream: process.stdout
}

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/contacts', (request, response) => {
    Person.find({}).then(contacts => {
        response.json(contacts)
    })
})

app.post('/api/contacts', (request, response) => {
    const body = request.body

    if(body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const contact = new Contact({
        name: body.content,
        number: body.content
    })

    contact.save().then(savedContact => {
        response.json(savedContact)
    })
})

app.get('/api/contacts/:id', (request, response) => {
    Contact.findById(request.params.id).then(contact => {
        response.json(contact)
    })
})

app.delete('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})