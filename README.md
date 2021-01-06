# Witverse Backend
> Server side code for a social media platform called witverse that lets users write quotes.

# Motivation

This project is a result of a simple idea of allowing users write quotes on a bigger platform and a larger audience. Many people have a knack for writing short quotes inspired from day to day incidents. Witverse is a social media platform that lets users write quotes. This repository contains the server side (REST API) for the web app.

# TechStack / Frameworks used

#### Built with

* [Node JS](https://nodejs.org/en/) (Javascript runtime environment)
* [Express](https://expressjs.com/) (Backend framework for Node Js)
* [MongoDB](https://www.mongodb.com/) (Database)

# Features

1. Create, Read, Update, Delete User accounts.
2. Create, Read, Update, Delete Quotes.
3. JWToken based authentication.
4. Role based authorization.
5. Support for like, comment and save quotes.
6. Support for following and unfollowing users.
7. Infinite Scroll feature.
8. Pre-defined response structures with status codes.
9. Included [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (cross origin resource sharing).
10. Email responses ready to use.

# Requirements

* Node JS (version 10.x and above)
* NPM (version 6.x and above)
* GIT (version 2.x and above)

# Code Style

There is no specific code styl for the project. However contributors are advised to be consistent with the naming conventions and comments in the code.

# Getting Started

## Clone Repository

Clone the Witverse Backend repository to your computer.


```
git clone https://github.com/ajaypanthagani/witverse-backend.git
```

## Installation

1. cd to the project directory.
2. run 'npm install' to install dependencies.

```
npm install
```

## Setup Environment Variables

Create .env file in the root folder (witverse-express) of the project. Add the below environment variables to the file.


* APPLICATION_NAME

Example:
```
    APPLICATION_NAME = Witverse //determines the application name
```

* BASE_URL

Example:
```
    BASE_URL = http://xyz.com //determines the base url of application
```

* MONGO_URL

Setup a MongoDB database in [atlas](https://www.mongodb.com/cloud/atlas) or any other mongodb cloud service and copy the connection string.

Example:
```
    MONGO_URL = mongodb.url.connection.string //used for connecting to mongodb
```

* SECRET_KEY

Example:
```
    SECRET_KEY = 1234-4563-546345-234 //some random number, used for signing jwt tokens
```
* MAIL_HOST

Example
```
    MAIL_HOST = smtp.dummy.com //mail host for smtp server
```

* MAIL_PORT

Example
```
    MAIL_PORT = 5000 //mail port for smpt server
```

* MAIL_ID

Example
```
    MAIL_ID = abc@xyz.com //email id
```

* MAIL_USERNAME

Example
```
    MAIL_USERNAME = username //mail username for mail server
```

* MAIL_PASSWORD

Example
```
    MAIL_PASSWORD = password //mail password for mail server
```

* WHITE_LIST_IP

Example
```
    WHITE_LIST = http://xyz.com https://xyz.com //white listed IPs for cross origing resource sharing
```

# Project Structure

```
witverse-express
├─ .gitignore
├─ .vscode
│  └─ settings.json
├─ app.js
├─ authenticate.js
├─ bin
│  └─ www
├─ config.js
├─ mail-config.js
├─ models
│  ├─ quotes.js
│  └─ users.js
├─ package-lock.json
├─ package.json
├─ public
│  └─ images
│     ├─ .gitignore
│     └─ profile
│        ├─ .gitkeep
├─ README.md
├─ response.js
├─ routes
│  ├─ actions.js
│  ├─ auth.js
│  ├─ comments.js
│  ├─ connections.js
│  ├─ cors.js
│  ├─ guest.js
│  ├─ infinite.js
│  ├─ quotes.js
│  ├─ search.js
│  ├─ upload.js
│  └─ users.js
└─ web.config

```