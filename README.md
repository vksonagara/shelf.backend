# Shelf Backend Application Server
This project contains the backend application logic for the Shelf app. Shelf is a web application with suite of productivity apps such as Notes, Todo, Calendar etc.

## Installation
### Requirements
To install and run the backend server for the Shelf, you need to install these programs and tools:

- Node.js
- NPM
- Docker
- MongoDB: You can use this custom build MongoDB image from this [repo](https://github.com/vksonagara/pa.mongo.git) with installation instructions

### Instructions
- Clone the repo
- Run `npm install`
- Create `config` folder on root of the project
- Create `config.development.json` file to `config` folder on root of the project
- You can copy and paste the content from `/src/server/config/defaults.json`, and change the configurations
- Create `content` folder on root of the project
- Create `logs` folder inside the `content` folder
- Run `npm start`
