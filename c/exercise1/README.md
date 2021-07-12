# c): Saving data to MongoDB

Before we move into the main topic of persisting data in a database, we will take a look at a few different ways of debugging Node applications.

## Debugging Node applications

Debugging Node applications is slightly more difficult than debugging JavaScript running in your browser. Printing to the console is a tried and true method, and it's always worth doing. There are people who think that more sophisticated methods should be used instead, but I disagree. Even the world's elite open source developers use this method.

### Visual Studio Code

The Visual Studio Code debugger can be useful in some situations. You can launch the application in debugging mode like this:

**fullstack content(image)**

Note that the application shouldn't be running in another console, otherwise the port will already be in use.

NB A newer version of Visual Studio Code may have Run instead of Debug. Furthermore, you may have to configure your launch.json file to start debugging. This can be done by choosing Add Configuration... on the drop-down menu, which is located next to the green play button and above VARIABLES menu, and select Run "npm start" in a debug terminal. For more detailed setup instructions, visit Visual Studio Code's Debugging documentation.

Below you can see a screenshot where the code execution has been paused in the middle of saving a new note:

**fullstack content(image)**

The execution has stopped at the breakpoint in line 63. In the console you can see the value of the note variable. In the top left window you can see other things related to the state of the application.

The arrows at the top can be used for controlling the flow of the debugger.

For some reason, I don't use the Visual Studio Code debugger a whole lot.

### Chrome dev tools

Debugging is also possible with the Chrome developer console by starting your application with the command:
```
node --inspect index.js
```
You can access the debugger by clicking the green icon - the node logo - that appears in the Chrome developer console:

**fullstack content(image)**

The debugging view works the same way as it did with React applications. The Sources tab can be used for setting breakpoints where the execution of the code will be paused.

**fullstack content(image)**

All of the application's console.log messages will appear in the Console tab of the debugger. You can also inspect values of variables and execute your own JavaScript code.

**fullstack content(image)**

### Question everything

Debugging Full Stack applications may seem tricky at first. Soon our application will also have a database in addition to the frontend and backend, and there will be many potential areas for bugs in the application.

When the application "does not work", we have to first figure out where the problem actually occurs. It's very common for the problem to exist in a place where you didn't expect it to, and it can take minutes, hours, or even days before you find the source of the problem.

The key is to be systematic. Since the problem can exist anywhere, you must question everything, and eliminate all possibilities one by one. Logging to the console, Postman, debuggers, and experience will help.

When bugs occur, the worst of all possible strategies is to continue writing code. It will guarantee that your code will soon have even more bugs, and debugging them will be even more difficult. The stop and fix principle from Toyota Production Systems is very effective in this situation as well.

## MongoDB

In order to store our saved notes indefinitely, we need a database. Most of the courses taught at the University of Helsinki use relational databases. In this course we will use MongoDB which is a so-called document database.

Document databases differ from relational databases in how they organize data as well as the query languages they support. Document databases are usually categorized under the NoSQL umbrella term.

You can read more about document databases and NoSQL from the course material for week 7 of the Introduction to Databases course. Unfortunately the material is currently only available in Finnish.

Read now the chapters on collections and documents from the MongoDB manual to get a basic idea on how a document database stores data.

Naturally, you can install and run MongoDB on your own computer. However, the internet is also full of Mongo database services that you can use. Our preferred MongoDB provider in this course will be MongoDB Atlas.

Once you've created and logged into your account, Atlas will recommend creating a cluster:

**fullstack content(image)**

Let's choose AWS as the provider and Frankfurt as the region, and create a cluster.

**fullstack content(image)**

Let's wait for the cluster to be ready for use. This can take approximately 10 minutes.

NB do not continue before the cluster is ready.

Let's use the database access tab for creating user credentials for the database. Please note that these are not the same credentials you use for logging into MongoDB Atlas. These will be used for your application to connect to the database.

**fullstack content(image)**

Let's grant the user with permissions to read and write to the databases.

**fullstack content(image)**

NB: Some people reported the new user credentials not working immediately after creation. In some cases it has taken minutes before the credentials started working.

Next we have to define the IP addresses that are allowed access to the database.

**fullstack content(image)**

For the sake of simplicity we will allow access from all IP addresses:

**fullstack content(image)**

Finally we are ready to connect to our database. Start by clicking connect:

**fullstack content(image)**

and choose Connect your application:

**fullstack content(image)**

The view displays the MongoDB URI, which is the address of the database that we will supply to the MongoDB client library we will add to our application.

The address looks like this:
```
mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/test?retryWrites=true
```
We are now ready to use the database.

We could use the database directly from our JavaScript code with the official MongoDb Node.js driver library, but it is quite cumbersome to use. We will instead use the Mongoose library that offers a higher level API.

Mongoose could be described as an object document mapper (ODM), and saving JavaScript objects as Mongo documents is straightforward with this library.

Let's install Mongoose:
```
npm install mongoose
```
Let's not add any code dealing with Mongo to our backend just yet. Instead, let's make a practice application by creating a new file, mongo.js:

```
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```
NB: Depending on which region you selected when building your cluster, the MongoDB URI may be different from the example provided above. You should verify and use the correct URI that was generated from MongoDB Atlas.

The code also assumes that it will be passed the password from the credentials we created in MongoDB Atlas, as a command line parameter. We can access the command line parameter like this:
```
const password = process.argv[2]
```
When the code is run with the command node mongo.js password, Mongo will add a new document to the database.

NB: Please note the password is the password created for the database user, not your MongoDB Atlas password. Also, if you created password with special characters, then you'll need to URL encode that password.

We can view the current state of the database from the MongoDB Atlas from Collections, in the Overview tab.

**fullstack content(image)**

As the view states, the document matching the note has been added to the notes collection in the test database.

**fullstack content(image)**

We should give a better name to the database. Like the documentation says, we can change the name of the database from the URI:

**fullstack content(image)**

Let's destroy the test database. Let's now change the name of database referenced in our connection string to note-app instead, by modifying the URI:
```
mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```
Let's run our code again.

**fullstack content(image)**

The data is now stored in the right database. The view also offers the create database functionality, that can be used to create new databases from the website. Creating the database like this is not necessary, since MongoDB Atlas automatically creates a new database when an application tries to connect to a database that does not exist yet.

## Schema

After establishing the connection to the database, we define the schema for a note and the matching model:
```
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```
First we define the schema of a note that is stored in the noteSchema variable. The schema tells Mongoose how the note objects are to be stored in the database.

In the Note model definition, the first "Note" parameter is the singular name of the model. The name of the collection will be the lowercased plural notes, because the Mongoose convention is to automatically name collections as the plural (e.g. notes) when the schema refers to them in the singular (e.g. Note).

Document databases like Mongo are schemaless, meaning that the database itself does not care about the structure of the data that is stored in the database. It is possible to store documents with completely different fields in the same collection.

The idea behind Mongoose is that the data stored in the database is given a schema at the level of the application that defines the shape of the documents stored in any given collection.

## Creating and saving objects

Next, the application creates a new note object with the help of the Note model:
```
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: false,
})
```
Models are so-called constructor functions that create new JavaScript objects based on the provided parameters. Since the objects are created with the model's constructor function, they have all the properties of the model, which include methods for saving the object to the database.

Saving the object to the database happens with the appropriately named save method, that can be provided with an event handler with the then method:

```
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

When the object is saved to the database, the event handler provided to then gets called. The event handler closes the database connection with the command mongoose.connection.close(). If the connection is not closed, the program will never finish its execution.

The result of the save operation is in the result parameter of the event handler. The result is not that interesting when we're storing one object to the database. You can print the object to the console if you want to take a closer look at it while implementing your application or during debugging.

Let's also save a few more notes by modifying the data in the code and by executing the program again.

NB: Unfortunately the Mongoose documentation is not very consistent, with parts of it using callbacks in its examples and other parts, other styles, so it is not recommended to copy paste code directly from there. Mixing promises with old-school callbacks in the same code is not recommended.

## Fetching objects from the database

Let's comment out the code for generating new notes and replace it with the following:

```
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```
When the code is executed, the program prints all the notes stored in the database:

**fullstack content(image)**

The objects are retrieved from the database with the find method of the Note model. The parameter of the method is an object expressing search conditions. Since the parameter is an empty object{}, we get all of the notes stored in the notes collection.

The search conditions adhere to the Mongo search query syntax.

We could restrict our search to only include important notes like this:
```
Note.find({ important: true }).then(result => {
  // ...
})
```