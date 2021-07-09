
## The application can be found here: https://fso2021-3-9-3-11.herokuapp.com/


# Exercises 3.9.-3.11.

The following exercises don't require many lines of code. They can however be challenging, because you must understand exactly what is happening and where, and the configurations must be just right.

## 3.9 phonebook backend step9

Make the backend work with the frontend from the previous part. Do not implement the functionality for making changes to the phone numbers yet, that will be implemented in exercise 3.17.

You will probably have to do some small changes to the frontend, at least to the URLs for the backend. Remember to keep the developer console open in your browser. If some HTTP requests fail, you should check from the Network-tab what is going on. Keep an eye on the backend's console as well. If you did not do the previous exercise, it is worth it to print the request data or request.body to the console in the event handler responsible for POST requests.

# 3.10 phonebook backend step10

Deploy the backend to the internet, for example to Heroku.

NB the command heroku works on the department's computers and the freshman laptops. If for some reason you cannot install Heroku to your computer, you can use the command npx heroku-cli.

Test the deployed backend with a browser and Postman or VS Code REST client to ensure it works.

PRO TIP: When you deploy your application to Heroku, it is worth it to at least in the beginning keep an eye on the logs of the heroku application AT ALL TIMES with the command heroku logs -t.

The following is a log about one typical problem. Heroku cannot find application dependency express:

**fullstack content(image)**

The reason is that the express package has not been installed with the npm install express command, so information about the dependency was not saved to the file package.json.

Another typical problem is that the application is not configured to use the port set to environment variable PORT:

**fullstack content(image)**

Create a README.md at the root of your repository, and add a link to your online application to it.

## 3.11 phonebook full stack

Generate a production build of your frontend, and add it to the internet application using the method introduced in this part.

NB Make sure the directory build is not gitignored

Also make sure that the frontend still works locally.
