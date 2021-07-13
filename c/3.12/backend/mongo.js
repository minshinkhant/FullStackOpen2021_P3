const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password> or <name> or <number>")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phonebook3_12:${password}@cluster0.c1l89.mongodb.net/phonebookDatabase?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model("Contact", contactSchema)


if (process.argv[3]) {
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })
    contact.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()

    })
}

else{
        Contact.find({}).then(result => {
            console.log("phonebook:")
            result.forEach(contact => {
                console.log(`${contact.name} ${contact.number}`)
            mongoose.connection.close()

            })
        })
    }
