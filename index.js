const express = require("express")
const http = require.resolve('http')
const util = require('util');
const { MongoClient } = require('mongodb');
const res = require("express/lib/response");
const { stringify,parse } = require('querystring');
var cors = require('cors')

/*
What To Do Left:
- Add post for new entries
- Retrieve and Delete items for Cart Functionality
- Change/Update/Delete Account Settings
- Any Other Misc Functionality

*/

// The Start
const uri = "mongodb+srv://root:KingBurger@cluster0.7vumd.mongodb.net/Cars?retryWrites=true&w=majority";

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

// Get car makes
app.get("/catalog/makes", function(req,res){ // Returns all the unique Makes
    console.log("Get Makes Called...")
    getAllMakes().then(r => res.json(r))
})

app.get("/catalog/make/:make", function(req,res){
    console.log("Getting all cars for one make");
    getCarsOneMake(req.params.make).then(r => res.json(r))
})
app.get("/vin/:id", function(req, res){
    console.log("getting info on", req.params.id);
    getVINInfo(req.params.id).then(r => res.json(r));
})
app.get("/price/:p", function(req, res){
    console.log("getting info on price:", req.params.id);
    getAllPrice(req.params.id).then(r => res.json(r));
})

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Login Functions
app.get("/login/:loginInfo",function(request,response){ // Login checking
    //response.send("Hello World!!")
    console.log('just called...')
    find(request.params.loginInfo).then(r => response.json(r))
})

// The Post Functions
//

// Sign up functions
app.post("/newUser", function(req,res){ // Sign Up
    console.log("New user being created and posted...");
    console.log(req.body)
    signUp(req.body).then(r => res.json(r))
    
});

// Posting New Entry

app.post("/newEntry", function(req,res){
    console.log("New Car Entry Being Created...");
    postNewEntry(req.body).then(r=> res.json(r)); //
})

const port = process.env.PORT || 10000;

app.listen(port, function () {
    console.log("Started application on port %d", port)
});


// MDB driver functions
async function getAllMakes(){
    try {
        await client.connect();
        const carSalesCollection = client.db('Cars').collection('carSales');
        return await carSalesCollection.distinct("Make");
    }
    catch(e){
        console.error(e);
    }
    finally{
        await client.close()
    }
}

async function getAllPrice(){
    try{
        await client.connect();

    }
    catch{

    }
    finally{
        await client.close();
    }
}

// Post New Entry

async function postNewEntry(entry){
    try{
        await client.connect();
        const carSalesCollection = client.db('Cars').collection('carSales');
        const query = {VIN:entry.VIN};
        const doc = await carSalesCollection.find(query).toArray();
        console.log(doc);
        if(!doc.length) // Check if the vehicle entry exists already
        {
            console.log("empty, good!");
            await carSalesCollection.insertOne(entry); // insert the new entry to the db
            return true;
        }
        else
            return false

    }
    catch {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

// Retrieve all vehicles from one make
async function getCarsOneMake(make){
    try {
        await client.connect();
        const carSalesCollection = client.db('Cars').collection('carSales');
        const query = {Make:make};
        return await carSalesCollection.find(query).toArray();
    }
    catch(e) {
        console.error(e);
    }
    finally{
        await client.close();
    }
}


// Find Info Of One Specific Vehicle
async function getVINInfo(id){
    try{
        await client.connect();
        const carSalesCollection = client.db('Cars').collection('carSales');
        const query ={VIN:id};
        return await carSalesCollection.find(query).toArray();
    }
    catch(e){
        console.error(e);
    }
    finally{
        await client.close();
    }
}

// Check if the user and pass are in the DB
async function find(loginInfo){
    try{
        await client.connect();
        const usernameCollection = await client.db('Cars').collection('userBase');
        const loginInfoObj = parse(loginInfo);
        console.log('The Find Input: ',loginInfoObj.username);
        const query = {username:loginInfoObj.username};
        const doc =  await usernameCollection.find(query).toArray();
        console.log(doc[0].username)
        if(doc[0].username == loginInfoObj.username){
            if(doc[0].password == loginInfoObj.password)
                return true;
        }
        return false;
    }
    catch (e){
        console.error(e);
    }
    finally{
        await client.close();
    }
}

// Sign up the new user
async function signUp(loginInfo){
    try{
        await client.connect();
        const usernameCollection = await client.db('Cars').collection('userBase');
        const query = {username:loginInfo.username};
        console.log(query)
        const doc = await usernameCollection.find(query).toArray();
        console.log(doc);
        if(!doc.length) // Check if the user exists already
        {
            console.log("empty, good!");
            await usernameCollection.insertOne(loginInfo);
            return true;
        }
        else
            return false
    }
    catch(e){
        console.error(e);
    }
    finally{
        await client.close();
    }
}