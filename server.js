'use strict';


const express = require('express');
const PORT = process.env.PORT || 4000;
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const pg = require('pg');



const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static('./public'));

app.get("/datamuse/api/*", getDatamuse);

app.get("/twit/*", getTwit);

app.get("/inst/*", getInst);

app.get("/git/*", getGit);

//calls requestProxy used in app.get
 function getDatamuse (req, res){
    console.log( 'Routing request for', req.params[0] );
    request.get({url:`https://api.datamuse.com/words?${req.params[0]}`}, function(err,response){
      res.send(response)
    })
}

function getTwit (req, res){
  request.get({url:`https://twitter.com/users/username_available?username=${req.params[0]}`},function(err,response){
    res.send(response)
  })
}

function getInst (req, res){
  request.get({url:`https://www.instagram.com/${req.params[0]}`}, function(err,response){
    res.send(response)
  })
}

function getGit (req, res){
  request.get({
    url:`https://api.github.com/users/${req.params[0]}`,
    headers:{
  'User-Agent' : 'Martsyalis'
    } 
  }
, function(err,response){
    res.send(response)
  })
}

// checks if user already exists, creates one if not and returns id
app.get('/login/', function (request, response) {
  client.query(
    `Select * FROM users WHERE user_name = $1`,
    [request.query.user_name]
  )
    .then(result => {
      if (result.rows.length === 0) {
        client.query(
          'INSERT INTO users(user_name) VALUES ($1)',
          [request.query.user_name]
        ) 
          .then (function () {
            client.query(
              'SELECT user_id FROM users WHERE user_name = $1',
              [request.query.user_name]
            ).then(function (res) {
              sendResults(response, {userid: res.rows[0].user_id})
            })
          })
          
          .catch(function(e){
            console.log (e)
          })
      } else {
        sendResults(response, {userid: result.rows[0].user_id})
      }

    })
    .catch(function(e){
      console.log (e)
    })
})

app.post('/addFav', function (request, response) {
  client.query(
    'INSERT INTO handles( users_id, handle_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [parseInt(request.body.user_id), request.body.user_name]
  )
  .then(function (res) {
    sendResults(response,{messege:'done'})
  })
})



app.get('/Faves', function (request, response) {
  client.query(
    `SELECT * FROM handles 
    INNER JOIN users
      ON users.user_id=handles.users_id
      WHERE users.user_id = $1`,
    [parseInt(request.query.user_id)]
  )
  .then(function (res) {
    sendResults(response,res.rows)
  })
})

function sendResults (response,result){
  response.send(result)

}


loadDBTables()

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));





///           DATABASE          ////

function loadDBTables (){

  client.query(`
    CREATE TABLE IF NOT EXISTS
      users(
        user_id SERIAL PRIMARY KEY,
        user_name VARCHAR(50) NOT NULL);
  `)

  client.query(`
    CREATE TABLE IF NOT EXISTS
      handles (
        handle_id SERIAL PRIMARY KEY,
        handle_name VARCHAR(200) NOT NULL,
        users_id INTEGER NOT NULL REFERENCES users(user_id) );
  `)
} 