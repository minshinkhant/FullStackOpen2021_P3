# Exercises 3.15.-3.18.
## 3.15: Phonebook database, step3

Change the backend so that deleting phonebook entries is reflected in the database.

Verify that the frontend still works after making the changes.

## 3.16: Phonebook database, step4
Move the error handling of the application to a new error handler middleware.

## 3.17*: Phonebook database, step5
If the user tries to create a new phonebook entry for a person whose name is already in the phonebook, the frontend will try to update the phone number of the existing entry by making an HTTP PUT request to the entry's unique URL.

Modify the backend to support this request.

Verify that the frontend works after making your changes.

## 3.18*: Phonebook database step6
Also update the handling of the api/persons/:id and info routes to use the database, and verify that they work directly with the browser, Postman, or VS Code REST client.

Inspecting an individual phonebook entry from the browser should look like this:
**fullstack content(image)**