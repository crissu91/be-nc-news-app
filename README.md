# Northcoders News API

## About

A RESTful API for Northcoders News, a news aggregation site based on Reddit. 

Built with Node.js, Express.js, PostgreSQL and SQL.

Testing was carried out using Jest,Nodemon and Supertest.

API has been deployed to Render [here](https://northcoders-news-y3ly.onrender.com).

## Set Up

- To check if ```Node.js``` is installed on your machine open a terminal window and enter:
  ```
  $ node -v
  ```
  If you do not already have Node.js installed follow the instructions on [this guide](https://nodejs.org/en/download/package-manager/).

- To check if ```npm``` is installed on your machine enter this command in you terminal window: 
  ```
  $ npm -v
  ```
  If you do not have npm already installed follow [this guide](https://www.npmjs.com/get-npm) to set it up.

- To check if ```git``` is installed on your machine enter the following in your terminal window: 
  ```
  $ git --version
  ```
  If you do not already have git installed on your machine follow [this guide](https://git-scm.com/).


## Installation

To run this project you will need to clone this repository onto your local machine.
  ```
  $ git clone https://github.com/crissu91/be-nc-news-app.git
  ```
Navigate inside the folder and install all dependencies by entering the following commands on your terminal window:
  ```
  $ cd Northcoders-News-BE
  $ npm install

  ```
You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).
  ```
In your first terminal window enter the following command to populate the database: 
  ```
  $ npm run seed
  ```
Finally to run the server enter the following command in your terminal window: 
  ```
  $ npm run start
  ```
This will run the server on port 9090. All endpoints can be found locally on ```http://localhost:9090```.

## Testing

To test the API navigate to the project directory and enter the following command:
  ```
  $ npm test
  ```

## API Routes
```
GET /api/topics
```
Returns all the topics

```
GET /api/articles
```
Returns all the articles

```
GET /api/articles/:article_id/comments
```
Returns all the comments for an individual article

```
POST /api/articles/:article_id/comments
```
Adds a new comment to an article. Requires body with a body key and value pair, e.g: {"body": "This is my new comment"}

```
GET /api/articles/:article_id
```
Returns an article for specified id

```
PUT /api/articles/:article_id
```
Increment the votes of an article by one

```
PUT /api/comments/:comment_id
```
Increment or Decrement the votes of a comment by one. Requires a vote query of 'up' or 'down', e.g: /api/comments/:comment_id?vote=down

```
DELETE /api/comments/:comment_id
```
Deletes a comment

## Authors

- Cristina Stefan

## License

This project is licensed and owned by NorthCoders.

## Acknowledgments

Thanks to all the tutors for all the NChelp during this project.

