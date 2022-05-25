# About

[**The Wall App**](https://wall-app-web.vercel.app/) is an application where users can see awesome messages posted by the community members. The users can also register to the platform and start sharing their own thoughts on **The Wall**.

# Tools

**The Wall** backend was built using [NodeJS](https://nodejs.org/), a Javascript runtime engine that allows running Javascript outside the browser environment. It also uses the following tools:
- [Express](https://expressjs.com/), a framework to easily create Rest API's;
- [NodeMailer](https://nodemailer.com/), library to send e-mails;
- [Prisma](https://www.prisma.io/), Object-Relational Mapper(ORM) to modeling and managing the database entities; 
- [Jest](https://jestjs.io/), a really powerful and easy to use testing framework;
- [Husky](https://typicode.github.io/husky/#/), tool that enables, for instance, to setup the tests scripts to run every time new code is pushed to the remote repository. 


# Getting started
Following the instructions down below you'll get a copy of the project, so you can run it from your local machine.

## Requirements

To run this project you must have:
-  [NodeJS](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed on your machine. You can get these tools at https://nodejs.org and https://yarnpkg.com.

- [PostgreSQL](https://www.postgresql.org/) installed on your computer.

## Installing

1. Using the terminal, clone the repository to your local machine: `$ git clone https://github.com/FelipeTomazEC/wall-app-backend.git`

2. Enter the directory of the project: `$ cd wall-app-backend`

3. Install the dependencies: `$ yarn install` or `$ yarn`

4. Configure a PostgreSQL database for the application. You can use a tool like [DBeaver](https://dbeaver.io/) for this.

5. Make a copy of the **example.env** file, and name it as **.env**: `$ cp example.env .env`

6. Open the `.env` in an editor of your preference and edit the variables values.

7. Run the db migrations using Prisma. This command will recreate the database schema for you: `$ npx prisma migrate dev`

8. Build the project: `$ yarn build`

9. That's all. Now you can run it with the command: `$ yarn start`

## Running tests
Testing is a really important thing to be considered in software development. **The Wall** backend was build with this in mind, so it has tons of tests to make sure that the domain logic is working as expected. In order to run those tests, you can run `$ yarn test` on the command line. 

## Running with Docker
It's also possible to run the application on your local machine using Docker. In order to do that, you'll need [Docker](https://www.docker.com/get-started/) and [Docker Compose](https://docs.docker.com/compose/install/) installed. After installing these tools, do the following:

1. Make a copy of the **example.env** file, and name it as **.env**: `$ cp example.env .env`

2. Open the `.env` in an editor of your preference and edit the variables values.

3. Run Docker Compose command on the command line: `$ docker-compose up -d`

4. That's it. The Wall API should be available on http://localhost:3000/. 

> *P.S.: The 3000 is the PORT variable defined in .env file.*