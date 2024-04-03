const express = require('express')
const app = express()

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
    const personId = parseInt(request.params.id)
    const findPerson = persons.find(person => person.id === personId)

    if(findPerson) {
        response.json(findPerson)
    }
    response.status(404).send({ message: 'person not found'})
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})