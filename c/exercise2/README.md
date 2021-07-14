# Backend connected to a database
Now we have enough knowledge to start using Mongo in our application.

Let's get a quick start by copy pasting the Mongoose definitions to the index.js file:
```
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  'mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
Let's change the handler for fetching all notes to the following form:

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```
We can verify in the browser that the backend works for displaying all of the documents:

**fullstack content(image)**
The application works almost perfectly. The frontend assumes that every object has a unique id in the id field. We also don't want to return the mongo versioning field __v to the frontend.

One way to format the objects returned by Mongoose is to modify the toJSON method of the schema, which is used on all instances of the models produced with that schema. Modifying the method works like this:
```
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```
Even though the _id property of Mongoose objects looks like a string, it is in fact an object. The toJSON method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm for us in the future once we start writing tests.

Let's respond to the HTTP request with a list of objects formatted with the toJSON method:
```
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```
Now the notes variable is assigned to an array of objects returned by Mongo. When the response is sent in the JSON format, the toJSON method of each object in the array is called automatically by the JSON.stringify method.

## Database configuration into its own module
Before we refactor the rest of the backend to use the database, let's extract the Mongoose specific code into its own module.

Let's create a new directory for the module called models, and add a file called note.js:
```
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```
Defining Node modules differs slightly from the way of defining ES6 modules in part 2.

The public interface of the module is defined by setting a value to the module.exports variable. We will set the value to be the Note model. The other things defined inside of the module, like the variables mongoose and url will not be accessible or visible to users of the module.

Importing the module happens by adding the following line to index.js:
```
const Note = require('./models/note')
```
This way the Note variable will be assigned to the same object that the module defines.

The way that the connection is made has changed slightly:
```
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```
It's not a good idea to hardcode the address of the database into the code, so instead the address of the database is passed to the application via the MONGODB_URI environment variable.

The method for establishing the connection is now given functions for dealing with a successful and unsuccessful connection attempt. Both functions just log a message to the console about the success status:

## fullstack content(image)
There are many ways to define the value of an environment variable. One way would be to define it when the application is started:
```
MONGODB_URI=address_here npm run dev
```
A more sophisticated way is to use the dotenv library. You can install the library with the command:
```
npm install dotenv
```
To use the library, we create a .env file at the root of the project. The environment variables are defined inside of the file, and it can look like this:
```
MONGODB_URI='mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
PORT=3001
```
We also added the hardcoded port of the server into the PORT environment variable.

The .env file should be gitignored right away, since we do not want to publish any confidential information publicly online!

**fullstack content(image)** 
The environment variables defined in the .env file can be taken into use with the expression require('dotenv').config() and you can reference them in your code just like you would reference normal environment variables, with the familiar process.env.MONGODB_URI syntax.

Let's change the index.js file in the following way:
```
require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

// ..

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```
It's important that dotenv gets imported before the note model is imported. This ensures that the environment variables from the .env file are available globally before the code from the other modules is imported.

## Using database in route handlers
Next, let's change the rest of the backend functionality to use the database.

Creating a new note is accomplished like this:
```
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```
The note objects are created with the Note constructor function. The response is sent inside of the callback function for the save operation. This ensures that the response is sent only if the operation succeeded. We will discuss error handling a little bit later.

The savedNote parameter in the callback function is the saved and newly created note. The data sent back in the response is the formatted version created with the toJSON method:
```
response.json(savedNote)
```
Using Mongoose's findById method, fetching an individual note gets changed into the following:
```
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```
## Verifying frontend and backend integration

When the backend gets expanded, it's a good idea to test the backend first with the browser, Postman or the VS Code REST client. Next, let's try creating a new note after taking the database into use:

**fullstack content(image)**
Only once everything has been verified to work in the backend, is it a good idea to test that the frontend works with the backend. It is highly inefficient to test things exclusively through the frontend.

It's probably a good idea to integrate the frontend and backend one functionality at a time. First, we could implement fetching all of the notes from the database and test it through the backend endpoint in the browser. After this, we could verify that the frontend works with the new backend. Once everything seems to work, we would move onto the next feature.

Once we introduce a database into the mix, it is useful to inspect the state persisted in the database, e.g. from the control panel in MongoDB Atlas. Quite often little Node helper programs like the mongo.js program we wrote earlier can be very helpful during development.

You can find the code for our current application in its entirety in the part3-4 branch of this Github repository.