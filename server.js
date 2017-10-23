// Dependencies
var cheerio = require('cheerio');
var request = require('request');

var express = require("express");
var mongoose = require('mongoose');
var mongojs = require("mongojs");

// Require models.
var Article = require('./models/Article.js');
var Favorite = require('./models/Favorite.js');

// Initialize Express
var app = express();

var databaseUrl = "news";
var collections = ["articles"];

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/news");
var db = mongoose.connection;

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function (error) {
    console.log("Mongoose Error. Make sure MongoDB is running.", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
    console.log("Mongoose connection successful.");
});

// Routes
// 1. At the root path, send a simple hello world message to the browser
app.use(express.static(__dirname + '/public'));
app.get("/", function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

// 2. At the "/all" path, display every entry in the articles collection
app.get("/all", function (req, res) {
    // Query: In our database, go to the articles collection, then "find" everything
    Article.find({}, function (error, found) {
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
        $(".collection").each(function (i, element) {
            // Save the title and summary of each article enclosed in the current element
            var title = $(element).children('article').children('h2').children('a').text();
            var summary = $(element).children('article').children('.summary').text();

            var result = {
                title: title,
                summary: summary
            }
            // If this found element had both a title and a summary
            if (title && summary) {
                // Insert the data in the articles db
                var scrapedArticle = new Article(result);
                scrapedArticle.save(function (error, doc) {
                    if (error) {
                        console.log("error", error);
                    } else {
                        console.log("new article scraped:", doc);
                    }
                })
            }
        });
    });

    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});

app.get("/favorite", function (req, res){
    res.send("Added to Favorites");
})


// Set the app to listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});
