# d) Validation and ESLint

There are usually constraints that we want to apply to the data that is stored in our application's database. Our application shouldn't accept notes that have a missing or empty content property. The validity of the note is checked in the route handler:
```
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  // ...
})
```
If the note does not have the content property, we respond to the request with the status code 400 bad request.

One smarter way of validating the format of the data before it is stored in the database, is to use the validation functionality available in Mongoose.

We can define specific validation rules for each field in the schema:
```
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  date: { 
    type: Date,
    required: true
  },
  important: Boolean
})
```
The content field is now required to be at least five characters long. The date field is set as required, meaning that it can not be missing. The same constraint is also applied to the content field, since the minimum length constraint allows the field to be missing. We have not added any constraints to the important field, so its definition in the schema has not changed.

The minLength and required validators are built-in and provided by Mongoose. The Mongoose custom validator functionality allows us to create new validators, if none of the built-in ones cover our needs.

If we try to store an object in the database that breaks one of the constraints, the operation will throw an exception. Let's change our handler for creating a new note so that it passes any potential exceptions to the error handler middleware:
```
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error))
})
```
Let's expand the error handler to deal with these validation errors:
```
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
```
When validating an object fails, we return the following default error message from Mongoose:

**fullstack content(image)**

## Promise chaining

Many of the route handlers changed the response data into the right format by implicitly calling the toJSON method from response.json. For the sake of an example, we can also perform this operation explicitly by calling the toJSON method on the object passed as a parameter to then:
```
app.post('/api/notes', (request, response, next) => {
  // ...

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error)) 
})
```
We can accomplish the same functionality in a much cleaner way with promise chaining:
```
app.post('/api/notes', (request, response, next) => {
  // ...

  note
    .save()
    .then(savedNote => {
      return savedNote.toJSON()
    })
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    .catch(error => next(error)) 
})
```
In the first then we receive savedNote object returned by Mongoose and format it. The result of the operation is returned. Then as we discussed earlier, the then method of a promise also returns a promise and we can access the formatted note by registering a new callback function with the then method.

We can clean up our code even more by using the more compact syntax for arrow functions:
```
app.post('/api/notes', (request, response, next) => {
  // ...

  note
    .save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    .catch(error => next(error)) 
})
```
In this example, Promise chaining does not provide much of a benefit. The situation would change if there were many asynchronous operations that had to be done in sequence. We will not dive further into the topic. In the next part of the course we will learn about the async/await syntax in JavaScript, that will make writing subsequent asynchronous operations a lot easier.

## Deploying the database backend to production
The application should work almost as-is in Heroku. We do have to generate a new production build of the frontend due to the changes that we have made to our frontend.

The environment variables defined in dotenv will only be used when the backend is not in production mode, i.e. Heroku.

We defined the environment variables for development in file .env, but the environment variable that defines the database URL in production should be set to Heroku with the heroku config:set command.
```
$ heroku config:set MONGODB_URI=mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```
NB: if the command causes an error, give the value of MONGODB_URI in apostrophes:
```
$ heroku config:set MONGODB_URI='mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
```
The application should now work. Sometimes things don't go according to plan. If there are problems, heroku logs will be there to help. My own application did not work after making the changes. The logs showed the following:

**fullstack content(image)**

For some reason the URL of the database was undefined. The heroku config command revealed that I had accidentally defined the URL to the MONGO_URL environment variable, when the code expected it to be in MONGODB_URI.

You can find the code for our current application in its entirety in the part3-5 branch of this github repository.