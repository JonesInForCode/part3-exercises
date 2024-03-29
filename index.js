const express = require('express')
const app = express()

let contacts = [

]

const links = [
    'http://localhost:3001',
]

app.get('/', (request, response) => {
    response.send(links.map(link => `<a href='${link}'>${link}</a>`)
    )
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})