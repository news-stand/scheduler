# Shiftly
> Automated shift scheduling for small businesses.

## Contributors

2.0 Team:
  - Ayush Kumar
  - Danny Welstad
  - Katherine Manning
  - Patrick Miner

Original Team:
  - Toby Hoshman
  - Vanessa Yip
  - Sofie Graham
  - Caleb Choi

## Final Product

Manager Dashboard:
![screenshot](./images/shiftly_manager_dashboard.png)

Manager Dashboard:
![screenshot](./images/shiftly_employee_dashboard.png)

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Roadmap](#roadmap)

## Usage
### Dependencies
To open the app in a dev environment, first install dependencies by running this command in your terminal:
```
npm install
```

### Database
Then install postgres db:
```
brew install postgres
```
If you are prompted, run this to start pg: `brew services start postgresql`
Run pg in your command line:
```
psql postgres
```
Check out https://gist.github.com/apolloclark/ea5466d5929e63043dcf for commands.
Manually create a database on your local machine using the terminal:
```
CREATE DATABASE <your database name> WITH OWNER <your owner name>
```
The default password is "null"
### Create local env variables
Creat a .env file in the root folder with the following variables:
- DB_HOST=localhost
- DB_USER={your username for postgres}
- DB_NAME=shiftly
- PORT=9000
### Run locally
Once your db is set up, run the app by running each of these command in a seperate terminal window:
```
npm run react-dev
npm run server-dev
npm run db:setup (one time to seed the database with example data)
```

### Roadmap

View the project roadmap [here](LINK_TO_DOC)
