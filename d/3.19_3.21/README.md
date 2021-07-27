# Exercises 3.19.-3.21.
## 3.19: Phonebook database, step7

Add validation to your phonebook application, that will make sure that a newly added person has a unique name. Our current frontend won't allow users to try and create duplicates, but we can attempt to create them directly with Postman or the VS Code REST client.

Mongoose does not offer a built-in validator for this purpose. Install the mongoose-unique-validator package with npm and use it instead.

If an HTTP POST request tries to add a name that is already in the phonebook, the server must respond with an appropriate status code and error message.

## 3.20*: Phonebook database, step8
Expand the validation so that the name stored in the database has to be at least three characters long, and the phone number must have at least 8 digits.

Expand the frontend so that it displays some form of error message when a validation error occurs. Error handling can be implemented by adding a catch block as shown below:
```
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // this is the way to access the error message
      console.log(error.response.data)
    })

```
You can display the default error message returned by Mongoose, even though they are not as readable as they could be:

**fullstack content(image)**
NB: On update operations, mongoose validators are off by default. Read the documentation to determine how to enable them.

## 3.21 Deploying the database backend to production
Generate a new "full stack" version of the application by creating a new production build of the frontend, and copy it to the backend repository. Verify that everything works locally by using the entire application from the address http://localhost:3001/.

Push the latest version to Heroku and verify that everything works there as well.