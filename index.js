var Express = require('express');
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");


var app=Express();
//Make use of the CORS module
app.use(cors());

//Indicate the connection string from mongodb
var CONNECTION_STRING = "mongodb+srv://stpamintuan2:dbUserPassword@mydb.5ri89bj.mongodb.net/?retryWrites=true&w=majority&appName=MyDB";

//Indicate the name of the database
var DATABASENAME = "MyDB";

//instantiate the mongodbclient
var database;

//create a listener
app.listen(5038, ()=>{
    Mongoclient.connect(CONNECTION_STRING,(error,client)=>{
        database=client.db(DATABASENAME);
        console.log(`Yay! Now connected to Cluster`);
    })
})


//ROUTES TO ALL ACTIONS

//get all dbase data
app.get('/api/books/GetBooks',(req, res) => {
    database.collection("books").find({}).toArray((error,result)=>{
        res.send(result);
    })
})


app.post('/api/books/AddBook', multer().none(), async (req, res) => {
    try {
        const numOfDocs = await database.collection("books").countDocuments();
        await database.collection("books").insertOne({
            id: (numOfDocs + 1).toString(),
            title: req.body.title
        });
        res.json("Added Successfully");
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ error: "Failed to add book" });
    }
});


// app.delete('/api/books/DeleteBook', (req, res)=>{
//     database.collection("books").deleteOne({
//         id:req.query.id
//     });
//     res.json("Deleted successfully!");
// })
app.delete('/api/books/DeleteBook', async (req, res) => {
    try {
        const result = await database.collection("books").deleteOne({
            id: req.query.id
        });
        if (result.deletedCount === 1) {
            console.log("Deleted successfully:", req.query.id);
            res.status(200).json({ message: "Deleted successfully!" });
        } else {
            console.log("Book not found:", req.query.id);
            res.status(404).json({ error: "Book not found" });
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ error: "Failed to delete book" });
    }
});