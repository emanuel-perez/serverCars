const express = require("express")
const http = require.resolve('http')
const util = require('util');
const { MongoClient } = require('mongodb');
const res = require("express/lib/response");
const { stringify,parse } = require('querystring');
var cors = require('cors')

// The Start
const uri = "mongodb+srv://root:BurgerKing@cluster0.7vumd.mongodb.net/fitness?retryWrites=true&w=majority";

var app = express()
const client = new MongoClient(uri);

app.use(cors());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.header(
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('presflightContinue',true);
    next();
})


app.get("/", function(req, res){
    res.send("Home!")
})

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const port = process.env.PORT || 10000;

app.listen(port, function () {
    console.log("Started application on port %d", port)
});