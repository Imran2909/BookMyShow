const mongodb = require('mongodb');
let mongoose = require('mongoose');
const { bookMovieSchema } = require('./schema')
require('dotenv').config();


const mongoURI = process.env.MONGO_URI; 


 const connection= mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("connection established with mongodb server online"); })
    .catch(err => {
        console.log("error while connection", err)
    });
let collection_connection = mongoose.model('bookmovietickets', bookMovieSchema)

module.exports={
    connection, collection_connection
}
