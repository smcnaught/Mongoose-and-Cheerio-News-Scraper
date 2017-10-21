// Dependencies
var cheerio = require('cheerio');
var request = require('request');

var express = require("express");
var mongoose = require('mongoose');
var mongojs = require("mongojs");

// var model = require('./public/model.js'); 

// Initialize Express
var app = express();

var artTitles = [];
var artSummaries = [];

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
"Grabbing every title and summary\n" +
"from NY Times Site:" +
"\n***********************************\n");

// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
request("https://www.nytimes.com/", function(error, response, html) {

// Load the HTML into cheerio and save it to a variable
// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
var $ = cheerio.load(html);

// An empty array to save the data that we'll scrape
var results = [];

// With cheerio, find each p-tag with the "title" class
// (i: iterator. element: the current element)
// $(".story-heading").each(function(i, element) {
    $(".collection").each(function(i, element) {
// Save the text of the element in a "title" variable
// var title = $(element).children('a').text();
// var summary = $(element).children('.summary').text();

var title = $(element).children('article').children('h2').children('a').text();
var summary = $(element).children('article').children('.summary').text();

// Save these results in an object that we'll push into the results array we defined earlier
results.push({
title: title,
summary: summary
});
});

// Log the results once you've looped through each of the elements found with cheerio
// console.log(results);

for(let i = 0; i < results.length; i++){
    if(results[i].title !== ''){
        artTitles.push(results[i].title);
    }
    if(results[i].summary !== ''){
        artSummaries.push(results[i].summary);
    }
}
console.log('THESE ARE THE ARTICLE TITLES', artTitles);
console.log('THESE ARE THE ARTICLE SUMMARIES', artSummaries);

});

//// TESTING AGAIN
// ==============================================
var databaseUrl = "news";
var collections = ["articles"];

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/news");
var db = mongoose.connection;

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function (error) {
    console.log("MongoDB Connection Error. Make sure MongoDB is running.", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
    console.log("Mongoose connection successful.");
});

var NewsSchema = new mongoose.Schema({
    title: String,
    summary: String
});

db.collections.insert({title: 'randommmmm', summary: "more random"});
//// TESTING AGAIN
// ==============================================




// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================



// Database configuration
// var databaseUrl = "news";
// var collections = ["articles"];

/*
// Database configuration with mongoose
mongoose.connect("mongodb://localhost/news");
var db = mongoose.connection;

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function (error) {
    console.log("MongoDB Connection Error. Make sure MongoDB is running.", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
    console.log("Mongoose connection successful.");
});
*/

// Routes
// 1. At the root path, send a simple hello world message to the browser
app.use(express.static(__dirname + '/public'));
app.get("/", function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

/*
// 2. At the "/all" path, display every entry in the articles collection
app.get("/all", function (req, res) {
    // Query: In our database, go to the articles collection, then "find" everything
    db.articles.find({}, function (error, found) {
        // Log any errors if the server encounters one
        if (error) {
            console.log(error);
        }
        // Otherwise, send the result of this query to the browser
        else {
            res.json(found);
        }
    });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
    // Make a request for the news section of ycombinator
    request("https://www.nytimes.com/", function (error, response, html) {
        // Load the html body from request into cheerio
        var $ = cheerio.load(html);
        // For each element with a "title" class
        $(".story-heading").each(function (i, element) {
            // Save the title and summary of each article enclosed in the current element
            var title = $(element).children('a').text();
            var summary = $(element).children('.summary').text();

            // If this found element had both a title and a summary
            if (title && summary) {
                // Insert the data in the articles db
                db.articles.insert({
                    title: title,
                    summary: summary
                },
                    function (err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        }
                        else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                        }
                    });
            }
        });
    });

    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});

*/

// Set the app to listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});
