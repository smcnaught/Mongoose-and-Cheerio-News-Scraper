// Dependencies
var cheerio = require('cheerio');
var request = require('request');
var express = require("express");
var handlebars = require('express-handlebars');
var mongoose = require('mongoose');
var http = require('http');
var mongojs = require("mongojs");
var bodyParser = require('body-parser');

// mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

// Initialize Express
var app = express();

// Require models.
var Article = require('./models/Article.js');

// BodyParser makes it possible for our server to interpret data sent to it.
// The code below is pretty standard.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

var databaseUrl = "news";
var collections = ["articles", "saved"];

// Database configuration with mongoose
if(process.env.NODE_ENV == 'production'){
    mongoose.connect('MONGOLAB_URI: mongodb://heroku_d2zc0vzv: 9j6kh7l49jnvtsirmam2rttkl8@ds243335.mlab.com: 43335 / heroku_d2zc0vzv');
}
else{
	mongoose.connect("mongodb://localhost/news");
}

var db = mongoose.connection;

// f 
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

app.get('/saved', function (req, res) {
    res.sendFile(__dirname + '/public/saved.html');
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

// At the "/getSavedArticles" path, display all the saved articles.
app.get("/getSavedArticles", function (req, res) {
    // Query: In our database, go to the saved collection, then "find" everything
    Article.find({saved: true}, function (error, found) {
        // Log any errors if the server encounters one
        console.log(found);
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
            var url = $(element).children('article').children('.story-heading').children('a').attr('href');

            var result = {
                title: title,
                summary: summary,
                url: url
            }
            console.log('THIS IS THE URL, title, and summary =========', result.url, result.title, result,summary);
            // If this found element had both a title and a summary
            if (title && summary && url) {
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

app.put('/save', function (req, res){
    console.log(req.body);  
    Article.update(
        {_id: req.body.id},
        {        
            saved: true
        
    },function(err, res){
        console.log(err, res);
    }
    )
});

app.put('/delete', function (req, res){
    console.log(req.body);  
    Article.update(
        {_id: req.body.id},
        {        
            saved: false
        
    },function(err, res){
        console.log(err, res);
    }
    )
});

app.put('/addNote', function (req, res){
    console.log('req.body.id: ', req.body.id);  
    Article.update(
        {_id: req.body.id},
        {        
            note: req.body.note
        
    },function(err, res){
        console.log(err, res);
    }
    )
});



// Set the app to listen on port 3000
app.listen(process.env.PORT || 3000, function () {
    console.log("App running");
});
