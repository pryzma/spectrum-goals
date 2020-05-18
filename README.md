<p align="center"><img src="https://spectrumgoals.nl/img/logo_lg.png"></p>

# About SpectrumGoals

App for managing learning targets for team members and medients(students). Team members can add learning subjects, targets, levels & sublevels  and assign targets to medients. Medients can send progress requests when completing levels of targets. Medients will recieve badges when completing assigned targets. Team members will be notified of important tasks and issues related to medients.

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- `npm run dev` to start the local server


# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [Sequelize](https://github.com/sequelize/sequelize) - An easy-to-use multi SQL dialect ORM for Node.js
- [Passport](http://www.passportjs.org/) - Simple, unobtrusive authentication for Node.js

## Application Structure

- `bin/www` - The entry point to our application. 
- `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
- `app/index.js` - Requires application files as defined in config/app.json.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.
