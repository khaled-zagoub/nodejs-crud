var mysql = require('mysql');
var express = require('express');
const bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
const { json } = require('body-parser');

var con = mysql.createConnection({
    host: "sql11.freemysqlhosting.net",
    user: "sql11394422",
    password: "eSkkUZFxsd",
    database: 'sql11394422'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("you are Connected!");
});
con.query("SELECT * FROM appareil", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/tempsup19',function(req,res){
    con.query("SELECT * FROM appareil where temperature>=19", function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/',function(req,res){
    con.query("SELECT * FROM appareil", function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/average',function(req,res){
    con.query("SELECT avg(humidity) as average_humidity FROM appareil where temperature>=19", function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result[0]));
    });
});

app.get('/c_hygrothermique',function(req,res){
    con.query("SELECT * FROM appareil where temperature>=18 and temperature <=20 and humidity>=40 and humidity<=60", function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/c_hygrothermique',function(req,res){
    con.query("delete from appareil where not(temperature>=18 and temperature <=20 and humidity>=40 and humidity<=60)", function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post("/ajouter", function(req, res) {
    console.log(req.body);
    console.log("ajout");
    let temperature = req.body.temperature;
    let humidity = req.body.humidity;
    let _name = req.body.name;
    con.query(
      "insert into appareil (temperature,humidity,device_name) values (" +
        temperature +
        "," +
        humidity +
        ",'" +
        _name +
        "')",
      function(err, result) {
        if (err) throw err;
        console.log(result);
      }
    );
    res.body = "success";
    return res.body;
    return null;
  });
  

app.get('/changer_pair',function(req,res){
    con.query("UPDATE appareil set temperature=20 where MOD(id_appareil,2)=0", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
})

app.get('/changer_20',function(req,res){
    con.query("UPDATE appareil set temperature=19 where temperature=20", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
})

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
