// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var request = require('request');
var cheerio = require('cheerio');

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "news";
var collections = ["articles"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function (error) {
    console.log("Database Error:", error);
});

// Routes
// 1. At the root path, send a simple hello world message to the browser
app.use(express.static(__dirname + '/public'));
app.get("/", function (req, res) {
    // res.send("Hello world");
    res.sendfile(__dirname + '/public/index.html');
});

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


// Set the app to listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});
