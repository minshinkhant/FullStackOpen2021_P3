/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

//get all the contacts
app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

//get info of the page
app.get('/info', (request,response) => {
  const info = `<p> Phonebook has info for ${contacts.length} people </p>`
  response.send(info + new Date())
})

//get a specific contact
app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => { next(error)})
})

//delete the contact
app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // contacts = contacts.filter(contact => contact.id !== id)
  // response.json(contacts)
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(202).send({ 'message':'deleted contact' })
    })
    .catch(error => next(error))
})

//post new contact
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save()
    .then(savedContact => savedContact.toJSON())
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })
    .catch(error => next(error))
})

//update old contact
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name : body.name,
    number : body.number
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))

  //console.log(Contact.findOne(request.params.id));
  // Contact.findOneAndUpdate(
  //     request.params.id,
  //     contact,
  //     {runValidators: true, context: 'query'},
  // )
  // .then(updatedContact => {
  //     response.json(updatedContact)
  // })
  // .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

//this has to be the last loaded middleware
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})