const mongoose = require('mongoose')

const Schema = mongoose.Schema
const connection = mongoose.connection
const model = mongoose.model


if (process.argv.length < 3) {
    console.log('Usage: node mongo.js <password> <name> <number>');
    process.exit(1);
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://sinisterthought:${password}@cluster0.wd7qv5o.mongodb.net/contactsApp?retryWrites=true&w=majority`

if (process.argv.length === 3) {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB')

        const contactSchema = new Schema({
            name: String,
            number: String,
        })

        const Contact = model('Contact', contactSchema)

        Contact.find({})
        .then(contacts => {
            console.log(contacts)
            return connection.close()
        })
        .catch(error => console.error('Error', error))
    })
    .catch(error => console.error('Error', error))
} else {mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true } )
.then(() => {
    console.log('Connected to MongoDB')


    const contactSchema = new Schema({
        name: String,
        number: String,
    })


    const Contact = model('Contact', contactSchema)

    const contact = new Contact({
        name: name,
        number: number
    })

    return contact.save()
})
.then(() => {
    console.log('Contact saved successfully')
    return connection.close()
})
.catch(error => console.error('Error', error))}

//pEaxZhE2vjKjEEo8